const start = new Date();
start.setHours(0, 0, 0, 0);

const end = new Date(start.getTime());
end.setHours(23, 59, 59, 999);

const PI = Math.PI;

db.vehicles.aggregate([
  {
    $match: {
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
      },
      type: "Chłodnia"
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
        }
      ],
      as: "companyBases"
    }
  },
  {
    $unwind: "$companyBases"
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
  }
]);


const PI = Math.PI;
const point1 = {
  lat: 50.059515,
  lng: 19.92246
};

const point2 = {
  lat: 50.019825,
  lng: 20.004478
};

db.vehicles.aggregate([
  {
    $addFields: {
      distance: {
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
                                            $subtract: [point2.lat, point1.lat] //[lat2, lat1]
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
                                            $subtract: [point2.lat, point1.lat] //[lat2, lat1]
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
                                                  point2.lng,
                                                  point1.lng
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
                                                  point2.lng,
                                                  point1.lng
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
                                          point1.lat, //lat1
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
                                          point2.lat, //lat2
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
                                                  point2.lat,
                                                  point1.lat
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
                                                  point2.lat,
                                                  point1.lat
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
                                                      point2.lng,
                                                      point1.lng
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
                                                      point2.lng,
                                                      point1.lng
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
                                              point1.lat, //lat1
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
                                              point2.lat, //lat2
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
]);
