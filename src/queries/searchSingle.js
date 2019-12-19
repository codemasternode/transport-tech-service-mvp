const height = 1.45;
db.vehicles.aggregate([
  {
    $match: {
      "dimensions.height": {
        $gt: height //1.5metra łądunku + 144 mm grubości palety
      },
      "range.maxRange": {
        $gte: 650
      }
    }
  },
  {
    $addFields: {
      palletes: {
        oneRow: {
          $floor: {
            $divide: [
              {
                $multiply: ["$dimensions.length", "$dimensions.width"]
              },
              //rozmiary palety EUR-EPAL
              {
                $multiply: [1.2, 0.8]
              }
            ]
          }
        },
        secondRow: {
          $cond: {
            if: {
              $gt: [
                {
                  $subtract: [
                    //odjęcie wysokości pojazdu od tego co zajmuje pierwszy rząd = wysokość która pozostałą
                    "$dimensions.height",
                    height
                  ]
                },
                height
              ]
            },
            then: {
              $floor: {
                $divide: [
                  {
                    $multiply: ["$dimensions.length", "$dimensions.width"]
                  },
                  //rozmiary palety EUR-EPAL
                  {
                    $multiply: [1.2, 0.8]
                  }
                ]
              }
            },
            else: 0
          }
        }
      },
      costPerKm: {
        $sum: [
          {
            $multiply: [
              {
                $divide: [1, "$sumKmPerMonth"]
              },
              "$sumCostPerMonth"
            ]
          },
          {
            $divide: [
              {
                $divde: [
                  {
                    $multiply: ["$valueOfTruck", "$deprecationPerYear"]
                  },
                  12
                ]
              },
              "$averageDistancePerMonth"
            ]
          }
        ]
      }
    }
  }
]);
