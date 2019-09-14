import Vehicle from "../models/vehicle";
import {getDistanceFromLatLonInKm} from '../services/geoservices'

export async function getRoadOffers(req, res) {
  const criteria = req.body.criteria;
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start.getTime());
  end.setHours(23, 59, 59, 999);
  if (req.body.operation === "single") {
    const { length, width, height, capacity, type, waitingTime } = criteria;
    const offers = await Vehicle.aggregate([
      {
        $match: {
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
          },
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
      }
    ]);
    res.send({ offers });
  }
}
