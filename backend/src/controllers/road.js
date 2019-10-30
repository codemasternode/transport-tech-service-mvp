import Vehicle from "../models/vehicle";
import Palette from "../models/palletes";
import axios from "axios";
import {
  createDistanceGoogleMapsURL,
  getCountryFromAddress,
  getCountryNameByReverseGeocoding
} from "../services/geoservices";

export async function getRoadOffers(req, res) {
  if (req.body.typeOfSearch === "Palette") {
    const requireKeys = [
      "numberOfPallets",
      "typeOfPallet",
      "height",
      "points",
      "distanceToDrive"
    ];
    for (let i = 0; i < requireKeys.length; i++) {
      let isInside = false;
      for (let key in req.body) {
        if (requireKeys[i] === key) {
          isInside = true;
        }
      }
      if (!isInside) {
        return res.status(400).send({
          msg: `Missing Parameter ${requireKeys[i]}`
        });
      }
    }
    const {
      points,
      distanceToDrive,
      numberOfPallets,
      typeOfPallet,
      height
    } = req.body;
    if (!points || points.length < 2) {
      return res.status(400).send({
        err: "There is no points"
      });
    }

    const palette = await Palette.findOne({ name: typeOfPallet });
    if (!palette) {
      return res.status(400).send({
        msg: `Can not find pallete ${typeOfPallet}`
      });
    }

    async function getRoad() {
      const url = createDistanceGoogleMapsURL(points);
      try {
        const directionsResponse = await axios({
          url
        });
        return directionsResponse.data;
      } catch (err) {
        console.log(err);
        return res.status(500).send({
          msg: "Problem with connection to Google Maps Services"
        });
      }
    }

    const road = await getRoad();
    const waypoints = road.routes[0].legs;
    let distance = 0;
    let time = 0;
    const listOfCountries = [];
    const listOfCounriesToGeocode = []
    for (let i = 0; i < waypoints.length; i++) {
      distance += waypoints[i].distance.value;
      time += waypoints[i].duration.value;
      listOfCountries.push(getCountryFromAddress(waypoints[i].start_address));
      const mapPoints = waypoints[i].steps
      let prevCalculateKM = 0
      let customDistanceCounter = 0
      for(let k = 0; k < mapPoints.length; k++) {
        if(customDistanceCounter - 1000000 > prevCalculateKM) {
          listOfCounriesToGeocode.push(getCountryNameByReverseGeocoding())
          prevCalculateKM = customDistanceCounter
        }
        customDistanceCounter += mapPoints[k].distance.value
      } 
    }
    console.log(listOfCountries)
    distance = distance / 1000;
    time = Math.round(time / 60 / 60);
    res.send({ road });
    async function getVehicles() {
      const vehicles = await Vehicle.aggregate([
        {
          $match: {
            "dimensions.height": {
              $gt: height + palette.height
            },
            "range.maxRange": {
              $gte: distanceToDrive
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
                      $multiply: [palette.length, palette.width]
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
                          height + palette.height
                        ]
                      },
                      height + palette.height
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
                          $multiply: [palette.length, palette.width]
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
                      $divide: [1, "$averageDistancePerMonth"]
                    },
                    "$monthCosts"
                  ]
                },
                {
                  $divide: [
                    {
                      $divide: [
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
    }
  }
}
