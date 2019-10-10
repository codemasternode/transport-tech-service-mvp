import Vehicle from "../models/vehicle";
import Company from "../models/company";
import { Types } from "mongoose";
import { search } from "../services/subsetsum";

export async function getRoadOffers(req, res) {
  const requireKeysCapacity = [
    "capacity",
    "type",
    "waitingTime"
  ];

  const requireKeysCapacityWithDim = [
    "length",
    "width",
    "height",
    "capacity",
    "type",
    "waitingTime"
  ];

  const requireKeysVolume = [
    "volume",
    "type",
    "waitingTime"
  ];

  const vehiclesWithVolume = [
    "Cysterna chemiczna",
    "Cysterna gazowa",
    "Cysterna paliwowa",
    "Silos"
  ];
  console.log(req.body)
  const {
    length,
    width,
    height,
    capacity,
    type,
    waitingTime,
    volume
  } = req.body.criteria;
  const { points, distanceToDrive } = req.body;
  if (!points || points.length !== 2) {
    return res.status(400).send({
      err: "There is no points"
    });
  }
  const PI = Math.PI;
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start.getTime());
  end.setHours(23, 59, 59, 999);
  if (req.body.operation === "single") {
    let $match = {};
    if (vehiclesWithVolume.includes(type)) {
      for (let i = 0; i < requireKeysVolume.length; i++) {
        if (req.body.criteria[requireKeysVolume[i]] == undefined) {
          return res.status(400).send({
            err: `Missing ${requireKeysVolume[i]}`
          });
        }
      }
      $match = {
        type,
        volume: {
          $gte: volume
        }
      };
    } else {
      for (let i = 0; i < requireKeysCapacityWithDim.length; i++) {
        if (req.body.criteria[requireKeysCapacityWithDim[i]] == undefined) {
          return res.status(400).send({
            err: `Missing ${requireKeysCapacityWithDim[i]}`
          });
        }
      }
      $match = {
        type,
        "dimensions.length": {
          $gte: length
        },
        "dimensions.width": {
          $gte: width
        },
        "dimensions.height": {
          $gte: height
        },
        capacity: {
          $gte: capacity
        }
      };
    }
    const offers = await Vehicle.aggregate([
      {
        $match
      },
      {
        $lookup: {
          from: "companybases",
          let: {
            vehicleId: "$_id"
          },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$$vehicleId", "$vehicles._id"] }
              }
            },
            {
              $addFields: {
                distance: {
                  $let: {
                    vars: {
                      lat2: "$location.lat",
                      lng2: "$location.lng",
                      lat1: points[0].lat,
                      lng1: points[0].lng
                    },
                    in: {
                      $multiply: [
                        6371,
                        {
                          $multiply: [
                            2,
                            {
                              $atan2: [
                                {
                                  $sqrt: {
                                    $sum: [
                                      {
                                        $multiply: [
                                          {
                                            $sin: {
                                              $divide: [
                                                {
                                                  $divide: [
                                                    {
                                                      $multiply: [
                                                        {
                                                          $subtract: [
                                                            "$$lat2",
                                                            "$$lat1"
                                                          ] //[lat2, lat1]
                                                        },
                                                        PI
                                                      ]
                                                    },
                                                    180
                                                  ]
                                                },
                                                2
                                              ]
                                            }
                                          },
                                          {
                                            $sin: {
                                              $divide: [
                                                {
                                                  $divide: [
                                                    {
                                                      $multiply: [
                                                        {
                                                          $subtract: [
                                                            "$$lat2",
                                                            "$$lat1"
                                                          ] //[lat2, lat1]
                                                        },
                                                        PI
                                                      ]
                                                    },
                                                    180
                                                  ]
                                                },
                                                2
                                              ]
                                            }
                                          }
                                        ]
                                      },
                                      {
                                        $multiply: [
                                          {
                                            $multiply: [
                                              {
                                                $sin: {
                                                  $divide: [
                                                    {
                                                      $divide: [
                                                        {
                                                          $multiply: [
                                                            {
                                                              $subtract: [
                                                                "$$lng2",
                                                                "$$lng1"
                                                              ] //[lon2, lon1]
                                                            },
                                                            PI
                                                          ]
                                                        },
                                                        180
                                                      ]
                                                    },
                                                    2
                                                  ]
                                                }
                                              },
                                              {
                                                $sin: {
                                                  $divide: [
                                                    {
                                                      $divide: [
                                                        {
                                                          $multiply: [
                                                            {
                                                              $subtract: [
                                                                "$$lng2",
                                                                "$$lng1"
                                                              ] //[lon2, lon1]
                                                            },
                                                            PI
                                                          ]
                                                        },
                                                        180
                                                      ]
                                                    },
                                                    2
                                                  ]
                                                }
                                              }
                                            ]
                                          },
                                          {
                                            $multiply: [
                                              {
                                                $cos: {
                                                  $divide: [
                                                    {
                                                      $multiply: [
                                                        "$$lat1", //lat1
                                                        PI
                                                      ]
                                                    },
                                                    180
                                                  ]
                                                }
                                              },
                                              {
                                                $cos: {
                                                  $divide: [
                                                    {
                                                      $multiply: [
                                                        "$$lat2", //lat2
                                                        PI
                                                      ]
                                                    },
                                                    180
                                                  ]
                                                }
                                              }
                                            ]
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                },
                                {
                                  $sqrt: {
                                    $subtract: [
                                      1,
                                      {
                                        $sum: [
                                          {
                                            $multiply: [
                                              {
                                                $sin: {
                                                  $divide: [
                                                    {
                                                      $divide: [
                                                        {
                                                          $multiply: [
                                                            {
                                                              $subtract: [
                                                                "$$lat2",
                                                                "$$lat1"
                                                              ] //[lat2, lat1]
                                                            },
                                                            PI
                                                          ]
                                                        },
                                                        180
                                                      ]
                                                    },
                                                    2
                                                  ]
                                                }
                                              },
                                              {
                                                $sin: {
                                                  $divide: [
                                                    {
                                                      $divide: [
                                                        {
                                                          $multiply: [
                                                            {
                                                              $subtract: [
                                                                "$$lat2",
                                                                "$$lat1"
                                                              ] //[lat2, lat1]
                                                            },
                                                            PI
                                                          ]
                                                        },
                                                        180
                                                      ]
                                                    },
                                                    2
                                                  ]
                                                }
                                              }
                                            ]
                                          },
                                          {
                                            $multiply: [
                                              {
                                                $multiply: [
                                                  {
                                                    $sin: {
                                                      $divide: [
                                                        {
                                                          $divide: [
                                                            {
                                                              $multiply: [
                                                                {
                                                                  $subtract: [
                                                                    "$$lng2",
                                                                    "$$lng1"
                                                                  ] //[lon2, lon1]
                                                                },
                                                                PI
                                                              ]
                                                            },
                                                            180
                                                          ]
                                                        },
                                                        2
                                                      ]
                                                    }
                                                  },
                                                  {
                                                    $sin: {
                                                      $divide: [
                                                        {
                                                          $divide: [
                                                            {
                                                              $multiply: [
                                                                {
                                                                  $subtract: [
                                                                    "$$lng2",
                                                                    "$$lng1"
                                                                  ] //[lon2, lon1]
                                                                },
                                                                PI
                                                              ]
                                                            },
                                                            180
                                                          ]
                                                        },
                                                        2
                                                      ]
                                                    }
                                                  }
                                                ]
                                              },
                                              {
                                                $multiply: [
                                                  {
                                                    $cos: {
                                                      $divide: [
                                                        {
                                                          $multiply: [
                                                            "$$lat1", //lat1
                                                            PI
                                                          ]
                                                        },
                                                        180
                                                      ]
                                                    }
                                                  },
                                                  {
                                                    $cos: {
                                                      $divide: [
                                                        {
                                                          $multiply: [
                                                            "$$lat2", //lat2
                                                            PI
                                                          ]
                                                        },
                                                        180
                                                      ]
                                                    }
                                                  }
                                                ]
                                              }
                                            ]
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  }
                }
              }
            }
          ],
          as: "companyBases"
        }
      },
      {
        $unwind: "$companyBases"
      },
      {
        $sort: {
          "companyBases.distance": 1
        }
      },
      {
        $lookup: {
          from: "fuels",
          let: {
            fuel: "$fuel"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$name", "$$fuel"] },
                    {
                      $and: [
                        { $gte: ["$date", start] },
                        { $lt: ["$date", end] }
                      ]
                    }
                  ]
                }
              }
            }
          ],
          as: "fuel"
        }
      },
      {
        $unwind: "$fuel"
      },
      {
        $lookup: {
          from: "companies",
          let: {
            vehicleId: "$_id"
          },
          pipeline: [
            {
              $unwind: "$companyBases"
            },
            {
              $match: {
                $expr: {
                  $in: ["$$vehicleId", "$companyBases.vehicles._id"]
                }
              }
            }
          ],
          as: "company"
        }
      },
      {
        $unwind: "$company"
      },
      {
        $project: {
          "company.companyBases": 0,
          "company.staticCosts": 0,
          "company.workers": 0,
          "companyBases.vehicles": 0
        }
      },
      {
        $addFields: {
          distance: {
            $sum: [distanceToDrive, "$companyBases.distance"]
          }
        }
      },
      {
        $match: {
          $expr: {
            $and: [
              {
                $or: [
                  {
                    $eq: ["$range.minRange", null]
                  },
                  {
                    $lte: ["$range.minRange", "$distance"]
                  }
                ]
              },
              {
                $or: [
                  {
                    $eq: ["$range.maxRange", null]
                  },
                  {
                    $gte: ["$range.maxRange", "$distance"]
                  }
                ]
              }
            ]
          }
        }
      },
      {
        $addFields: {
          fullCost: {
            $multiply: [
              {
                $divide: [
                  {
                    $sum: [100, "$company.margin"]
                  },
                  100
                ]
              },
              {
                $sum: [
                  {
                    $divide: [
                      {
                        $multiply: [
                          {
                            $multiply: [
                              {
                                $multiply: [
                                  "$distance",
                                  {
                                    $divide: [
                                      {
                                        $sum: [100, "$blankJourneys"]
                                      },
                                      100
                                    ]
                                  }
                                ]
                              },
                              "$fuel.price"
                            ]
                          },
                          "$combustion"
                        ]
                      },
                      100
                    ]
                  },

                  {
                    $sum: [
                      {
                        $multiply: [
                          {
                            $divide: [
                              {
                                $multiply: [
                                  "$valueOfTruck",
                                  {
                                    $divide: ["$deprecationPerYear", 100]
                                  }
                                ]
                              },
                              12
                            ]
                          },
                          {
                            $divide: ["$distance", "$averageDistancePerMonth"]
                          }
                        ]
                      },
                      {
                        $multiply: [
                          {
                            $divide: ["$distance", "$company.sumAvgKmPerMonth"]
                          },
                          "$company.sumCostsPerMonth"
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      },
      {
        $addFields: {
          waitingCost: {
            $multiply: [
              {
                $subtract: [waitingTime, "$waitingTimeParams.maxFreeTime"]
              },
              "$waitingTimeParams.pricePerHourWaiting"
            ]
          }
        }
      },
      {
        $addFields: {
          waitingCost: {
            $cond: [
              {
                $lt: ["$waitingCost", 0]
              },
              0,
              "$waitingCost"
            ]
          }
        }
      },
      {
        $match: {
          waitingCost: {
            $ne: null
          }
        }
      },
      {
        $addFields: {
          fullCost: {
            $sum: ["$fullCost", "$waitingCost"]
          }
        }
      },
      {
        $sort: {
          fullCost: 1
        }
      }
    ]);
    const distinctVehicles = [];
    for (let i = 0; i < offers.length; i++) {
      let isInside = false;
      for (let m = 0; m < distinctVehicles.length; m++) {
        if (
          distinctVehicles[m]._id.toString() == offers[i]._id.toString() &&
          distinctVehicles[m].companyBases._id.toString() ==
          offers[i].companyBases._id.toString()
        ) {
          isInside = true;
        }
      }
      if (!isInside) {
        distinctVehicles.push(offers[i]);
      }
    }
    res.send({ offers: distinctVehicles });
    const companyStatIDS = [];
    for (let i = 0; i < distinctVehicles.length; i++) {
      let isInside = false;
      for (let m = 0; m < companyStatIDS.length; m++) {
        if (
          companyStatIDS[m].toString() ===
          distinctVehicles[i].company._id.toString()
        ) {
          isInside = true;
        }
      }
      if (!isInside) {
        companyStatIDS.push(
          new Types.ObjectId(distinctVehicles[i].company._id)
        );
      }
    }
    await Company.update(
      {
        _id: {
          $in: companyStatIDS
        }
      },
      {
        $push: {
          statistics: new Date()
        }
      },
      {
        multi: true
      }
    );
  } else {
    if (vehiclesWithVolume.includes(type)) {
      for (let i = 0; i < requireKeysVolume.length; i++) {
        if (req.body.criteria[requireKeysVolume[i]] == undefined) {
          return res.status(400).send({
            err: `Missing ${requireKeysVolume[i]}`
          });
        }
      }
    } else {
      for (let i = 0; i < requireKeysCapacityWithDim.length; i++) {
        if (req.body.criteria[requireKeysCapacityWithDim[i]] == undefined) {
          return res.status(400).send({
            err: `Missing ${requireKeysCapacityWithDim[i]}`
          });
        }
      }
    }

    const PI = Math.PI;
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start.getTime());
    end.setHours(23, 59, 59, 999);

    let companies = await Vehicle.aggregate([
      {
        $match: {
          type
        }
      },
      {
        $lookup: {
          from: "companybases",
          let: {
            vehicleId: "$_id"
          },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$$vehicleId", "$vehicles._id"] }
              }
            },
            {
              $addFields: {
                distance: {
                  $let: {
                    vars: {
                      lat2: "$location.lat",
                      lng2: "$location.lng",
                      lat1: points[0].lat,
                      lng1: points[0].lng
                    },
                    in: {
                      $multiply: [
                        6371,
                        {
                          $multiply: [
                            2,
                            {
                              $atan2: [
                                {
                                  $sqrt: {
                                    $sum: [
                                      {
                                        $multiply: [
                                          {
                                            $sin: {
                                              $divide: [
                                                {
                                                  $divide: [
                                                    {
                                                      $multiply: [
                                                        {
                                                          $subtract: [
                                                            "$$lat2",
                                                            "$$lat1"
                                                          ] //[lat2, lat1]
                                                        },
                                                        PI
                                                      ]
                                                    },
                                                    180
                                                  ]
                                                },
                                                2
                                              ]
                                            }
                                          },
                                          {
                                            $sin: {
                                              $divide: [
                                                {
                                                  $divide: [
                                                    {
                                                      $multiply: [
                                                        {
                                                          $subtract: [
                                                            "$$lat2",
                                                            "$$lat1"
                                                          ] //[lat2, lat1]
                                                        },
                                                        PI
                                                      ]
                                                    },
                                                    180
                                                  ]
                                                },
                                                2
                                              ]
                                            }
                                          }
                                        ]
                                      },
                                      {
                                        $multiply: [
                                          {
                                            $multiply: [
                                              {
                                                $sin: {
                                                  $divide: [
                                                    {
                                                      $divide: [
                                                        {
                                                          $multiply: [
                                                            {
                                                              $subtract: [
                                                                "$$lng2",
                                                                "$$lng1"
                                                              ] //[lon2, lon1]
                                                            },
                                                            PI
                                                          ]
                                                        },
                                                        180
                                                      ]
                                                    },
                                                    2
                                                  ]
                                                }
                                              },
                                              {
                                                $sin: {
                                                  $divide: [
                                                    {
                                                      $divide: [
                                                        {
                                                          $multiply: [
                                                            {
                                                              $subtract: [
                                                                "$$lng2",
                                                                "$$lng1"
                                                              ] //[lon2, lon1]
                                                            },
                                                            PI
                                                          ]
                                                        },
                                                        180
                                                      ]
                                                    },
                                                    2
                                                  ]
                                                }
                                              }
                                            ]
                                          },
                                          {
                                            $multiply: [
                                              {
                                                $cos: {
                                                  $divide: [
                                                    {
                                                      $multiply: [
                                                        "$$lat1", //lat1
                                                        PI
                                                      ]
                                                    },
                                                    180
                                                  ]
                                                }
                                              },
                                              {
                                                $cos: {
                                                  $divide: [
                                                    {
                                                      $multiply: [
                                                        "$$lat2", //lat2
                                                        PI
                                                      ]
                                                    },
                                                    180
                                                  ]
                                                }
                                              }
                                            ]
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                },
                                {
                                  $sqrt: {
                                    $subtract: [
                                      1,
                                      {
                                        $sum: [
                                          {
                                            $multiply: [
                                              {
                                                $sin: {
                                                  $divide: [
                                                    {
                                                      $divide: [
                                                        {
                                                          $multiply: [
                                                            {
                                                              $subtract: [
                                                                "$$lat2",
                                                                "$$lat1"
                                                              ] //[lat2, lat1]
                                                            },
                                                            PI
                                                          ]
                                                        },
                                                        180
                                                      ]
                                                    },
                                                    2
                                                  ]
                                                }
                                              },
                                              {
                                                $sin: {
                                                  $divide: [
                                                    {
                                                      $divide: [
                                                        {
                                                          $multiply: [
                                                            {
                                                              $subtract: [
                                                                "$$lat2",
                                                                "$$lat1"
                                                              ] //[lat2, lat1]
                                                            },
                                                            PI
                                                          ]
                                                        },
                                                        180
                                                      ]
                                                    },
                                                    2
                                                  ]
                                                }
                                              }
                                            ]
                                          },
                                          {
                                            $multiply: [
                                              {
                                                $multiply: [
                                                  {
                                                    $sin: {
                                                      $divide: [
                                                        {
                                                          $divide: [
                                                            {
                                                              $multiply: [
                                                                {
                                                                  $subtract: [
                                                                    "$$lng2",
                                                                    "$$lng1"
                                                                  ] //[lon2, lon1]
                                                                },
                                                                PI
                                                              ]
                                                            },
                                                            180
                                                          ]
                                                        },
                                                        2
                                                      ]
                                                    }
                                                  },
                                                  {
                                                    $sin: {
                                                      $divide: [
                                                        {
                                                          $divide: [
                                                            {
                                                              $multiply: [
                                                                {
                                                                  $subtract: [
                                                                    "$$lng2",
                                                                    "$$lng1"
                                                                  ] //[lon2, lon1]
                                                                },
                                                                PI
                                                              ]
                                                            },
                                                            180
                                                          ]
                                                        },
                                                        2
                                                      ]
                                                    }
                                                  }
                                                ]
                                              },
                                              {
                                                $multiply: [
                                                  {
                                                    $cos: {
                                                      $divide: [
                                                        {
                                                          $multiply: [
                                                            "$$lat1", //lat1
                                                            PI
                                                          ]
                                                        },
                                                        180
                                                      ]
                                                    }
                                                  },
                                                  {
                                                    $cos: {
                                                      $divide: [
                                                        {
                                                          $multiply: [
                                                            "$$lat2", //lat2
                                                            PI
                                                          ]
                                                        },
                                                        180
                                                      ]
                                                    }
                                                  }
                                                ]
                                              }
                                            ]
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  }
                }
              }
            }
          ],
          as: "companyBases"
        }
      },
      {
        $unwind: "$companyBases"
      },
      {
        $sort: {
          "companyBases.distance": 1
        }
      },
      {
        $lookup: {
          from: "fuels",
          let: {
            fuel: "$fuel"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$name", "$$fuel"] },
                    {
                      $and: [
                        { $gte: ["$date", start] },
                        { $lt: ["$date", end] }
                      ]
                    }
                  ]
                }
              }
            }
          ],
          as: "fuel"
        }
      },
      {
        $unwind: "$fuel"
      },
      {
        $lookup: {
          from: "companies",
          let: {
            vehicleId: "$_id"
          },
          pipeline: [
            {
              $unwind: "$companyBases"
            },
            {
              $match: {
                $expr: {
                  $in: ["$$vehicleId", "$companyBases.vehicles._id"]
                }
              }
            }
          ],
          as: "company"
        }
      },
      {
        $unwind: "$company"
      },
      {
        $project: {
          "company.companyBases": 0,
          "company.staticCosts": 0,
          "company.workers": 0,
          "companyBases.vehicles": 0
        }
      },
      {
        $addFields: {
          distance: {
            $sum: [distanceToDrive, "$companyBases.distance"]
          }
        }
      },
      {
        $match: {
          $expr: {
            $and: [
              {
                $or: [
                  {
                    $eq: ["$range.minRange", null]
                  },
                  {
                    $lte: ["$range.minRange", "$distance"]
                  }
                ]
              },
              {
                $or: [
                  {
                    $eq: ["$range.maxRange", null]
                  },
                  {
                    $gte: ["$range.maxRange", "$distance"]
                  }
                ]
              }
            ]
          }
        }
      },
      {
        $addFields: {
          fullCost: {
            $multiply: [
              {
                $divide: [
                  {
                    $sum: [100, "$company.margin"]
                  },
                  100
                ]
              },
              {
                $sum: [
                  {
                    $divide: [
                      {
                        $multiply: [
                          {
                            $multiply: [
                              {
                                $multiply: [
                                  "$distance",
                                  {
                                    $divide: [
                                      {
                                        $sum: [100, "$blankJourneys"]
                                      },
                                      100
                                    ]
                                  }
                                ]
                              },
                              "$fuel.price"
                            ]
                          },
                          "$combustion"
                        ]
                      },
                      100
                    ]
                  },

                  {
                    $sum: [
                      {
                        $multiply: [
                          {
                            $divide: [
                              {
                                $multiply: [
                                  "$valueOfTruck",
                                  {
                                    $divide: ["$deprecationPerYear", 100]
                                  }
                                ]
                              },
                              12
                            ]
                          },
                          {
                            $divide: ["$distance", "$averageDistancePerMonth"]
                          }
                        ]
                      },
                      {
                        $multiply: [
                          {
                            $divide: ["$distance", "$company.sumAvgKmPerMonth"]
                          },
                          "$company.sumCostsPerMonth"
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      },
      {
        $addFields: {
          waitingCost: {
            $multiply: [
              {
                $subtract: [12, "$waitingTimeParams.maxFreeTime"]
              },
              "$waitingTimeParams.pricePerHourWaiting"
            ]
          }
        }
      },
      {
        $addFields: {
          waitingCost: {
            $cond: [
              {
                $lt: ["$waitingCost", 0]
              },
              0,
              "$waitingCost"
            ]
          }
        }
      },
      {
        $match: {
          waitingCost: {
            $ne: null
          }
        }
      },
      {
        $addFields: {
          fullCost: {
            $ceil: {
              $sum: ["$fullCost", "$waitingCost"]
            }
          }
        }
      },
      {
        $sort: {
          fullCost: 1
        }
      },
      {
        $group: {
          _id: "$company._id",
          vehicles: {
            $push: "$$ROOT"
          }
        }
      }
    ]);

    for (let i = 0; i < companies.length; i++) {
      const distinctVehicles = [];
      for (let m = 0; m < companies[i].vehicles.length; m++) {
        let isInside = false;
        for (let g = 0; g < distinctVehicles.length; g++) {
          if (
            distinctVehicles[g]._id.toString() ===
            companies[i].vehicles[m]._id.toString()
          ) {
            isInside = true;
            if (
              distinctVehicles[g].fullCost > companies[i].vehicles[m].fullCost
            ) {
              distinctVehicles.push(companies[i].vehicles[m]);
            }
          }
        }
        if (!isInside) {
          distinctVehicles.push(companies[i].vehicles[m]);
        }
      }
      companies[i].vehicles = distinctVehicles;
    }
    const toRemove = [];
    if (vehiclesWithVolume.includes(type)) {
      for (let i = 0; i < companies.length; i++) {
        const vehicles = search(
          companies[i].vehicles,
          undefined,
          volume,
          "volume"
        );

        if (!vehicles) {
          toRemove.push(companies[i]._id.toString());
        } else {
          companies[i].company = vehicles[0].company;
          companies[i].vehicles = vehicles || [];
        }
      }
    } else {
      for (let i = 0; i < companies.length; i++) {
        const vehicles = search(
          companies[i].vehicles,
          { length, width, height },
          capacity,
          "capacity"
        );
        if (!vehicles) {
          toRemove.push(companies[i]._id.toString());
        } else {
          companies[i].company = vehicles[0].company;
          companies[i].vehicles = vehicles || [];
        }
      }
    }

    companies = companies.filter(value => {
      return toRemove.includes(value._id.toString()) === false;
    });

    for (let i = 0; i < companies.length; i++) {
      let sum = 0;
      for (let m = 0; m < companies[i].vehicles.length; m++) {
        sum += companies[i].vehicles[m].volume;
      }
    }
    res.send({ offers: companies });
    const companyStatIDS = [];
    for (let i = 0; i < companies.length; i++) {
      let isInside = false;
      for (let m = 0; m < companyStatIDS.length; m++) {
        if (
          companyStatIDS[m].toString() === companies[i].company._id.toString()
        ) {
          isInside = true;
        }
      }
      if (!isInside) {
        companyStatIDS.push(new Types.ObjectId(companies[i].company._id));
      }
    }
    await Company.update(
      {
        _id: {
          $in: companyStatIDS
        }
      },
      {
        $push: {
          statistics: new Date()
        }
      },
      {
        multi: true
      }
    );
  }
}
