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

a = {
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
                        $subtract: [50.019825, 50.059515] //[lat2, lat1]
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
                        $subtract: [50.019825, 50.059515] //[lat2, lat1]
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
                            $subtract: [20.004478, 19.92246] //[lon2, lon1]
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
                            $subtract: [20.004478, 19.92246] //[lon2, lon1]
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
                      50.059515, //lat1
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
                      50.019825, //lat2
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
};

dLat = {
  $divide: [
    {
      $multiply: [
        {
          $subtract: [50.019825, 50.059515] //[lat2, lat1]
        },
        PI
      ]
    },
    180
  ]
};

dLon = {
  $divide: [
    {
      $multiply: [
        {
          $subtract: [20.004478, 19.92246] //[lon2, lon1]
        },
        PI
      ]
    },
    180
  ]
};

const PI = Math.PI;

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
                                          $subtract: [50.019825, 50.059515] //[lat2, lat1]
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
                                          $subtract: [50.019825, 50.059515] //[lat2, lat1]
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
                                              $subtract: [20.004478, 19.92246] //[lon2, lon1]
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
                                              $subtract: [20.004478, 19.92246] //[lon2, lon1]
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
                                        50.059515, //lat1
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
                                        50.019825, //lat2
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
                  },
                  {
                    $sqrt: {
                      $subtract: [
                        1,
                        (a = {
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
                                                  50.019825,
                                                  50.059515
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
                                                  50.019825,
                                                  50.059515
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
                                                      20.004478,
                                                      19.92246
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
                                                      20.004478,
                                                      19.92246
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
                                              50.059515, //lat1
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
                                              50.019825, //lat2
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
                        })
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
