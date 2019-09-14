var start = new Date();
start.setHours(0, 0, 0, 0);

var end = new Date(start.getTime());
end.setHours(23, 59, 59, 999);

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
      $and: [
        {
          $or: [
            { "range.minRange": null },
            {
              "range.minRange": {
                $lte: 950
              }
            }
          ]
        },
        {
          $or: [
            { "range.maxRange": null },
            {
              "range.maxRange": {
                $gte: 950
              }
            }
          ]
        }
      ],
      type: "Chłodnia"
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
                { $and: [{ $gte: ["$date", start] }, { $lt: ["$date", end] }] }
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
      "company.workers": 0
    }
  },
  {
    $addFields: {
      depreciationCosts: {
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
            $divide: [950, "$averageDistancePerMonth"]
          }
        ]
      },
      fuelCosts: {
        $multiply: [
          {
            $multiply: [
              "$combustion",
              {
                $divide: [
                  {
                    $add: [
                      950,
                      {
                        $multiply: [
                          950,
                          {
                            $divide: ["$blankJourneys", 100]
                          }
                        ]
                      }
                    ]
                  },
                  100
                ]
              }
            ]
          },
          "$fuel.price"
        ]
      },
      staticAndWorkerCosts: {
        $multiply: [
          {
            $divide: [950, "$company.sumAvgKmPerMonth"]
          },
          "$company.sumCostsPerMonth"
        ]
      },
      waitingCost: {
        $multiply: [
          {
            $subtract: [2, "$waitingTimeParams.maxFreeTime"]
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
        $round: [
          {
            $multiply: [
              {
                $add: [
                  "$waitingCost",
                  {
                    $add: [
                      "$depreciationCosts",
                      {
                        $add: ["$fuelCosts", "$staticAndWorkerCosts"]
                      }
                    ]
                  }
                ]
              },
              {
                $divide: [
                  {
                    $add: [100, "$company.margin"]
                  },
                  100
                ]
              }
            ]
          },
          0
        ]
      }
    }
  },
  {
    $sort: {
      fullCost: 1
    }
  }
]);
