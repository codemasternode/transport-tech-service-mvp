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
    $addFields: {
      depreciation: {
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
                $divide: [950, 100]
              }
            ]
          },
          "$fuel.price"
        ]
      }
    }
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
    $project: {
      "company.companyBases": 0
    }
  },
  {
    $sort: {
      capacity: 1,
      "dimensions.length": 1,
      "dimensions.width": 1,
      "dimensions.height": 1
    }
  }
]);
