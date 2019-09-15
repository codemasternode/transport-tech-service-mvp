const PI = Math.PI;
const start = new Date();
start.setHours(0, 0, 0, 0);

const end = new Date(start.getTime());
end.setHours(23, 59, 59, 999);

db.vehicles.aggregate([
  {
    $match: {
      type: "Chłodnia",
      "dimensions.length": {
        $gte: 10
      },
      "dimensions.width": {
        $gte: 3
      },
      "dimensions.height": {
        $gte: 2.5
      },
      capacity: {
        $gte: 6
      }
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
                  lat1: 50.059515,
                  lng1: 19.92246
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
                  $and: [{ $gte: ["$date", start] }, { $lt: ["$date", end] }]
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
        $sum: [950, "$companyBases.distance"]
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
