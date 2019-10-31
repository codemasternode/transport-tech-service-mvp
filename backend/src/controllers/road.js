import Vehicle from "../models/vehicle";
import Palette from "../models/palletes";
import axios from "axios";
import googleMaps from "@google/maps";
import "dotenv/config";

import {
  createDistanceGoogleMapsRequest,
  getCountryFromAddress,
  getCountryNameByReverseGeocoding
} from "../services/geoservices";

const googleMapsClient = googleMaps.createClient({
  key: process.env.GOOGLE_API,
  Promise: Promise
});

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

    const road = await googleMapsClient
      .directions(createDistanceGoogleMapsRequest(points))
      .asPromise();
    
    const waypoints = road.json.routes[0].legs;
    let distance = 0;
    let time = 0;
    const listOfCountries = [];
    for (let i = 0; i < waypoints.length; i++) {
      distance += waypoints[i].distance.value;
      time += waypoints[i].duration.value;
      if(!listOfCountries.includes(getCountryFromAddress(waypoints[i].start_address))) {
        listOfCountries.push(getCountryFromAddress(waypoints[i].start_address));
      }
      if(!listOfCountries.includes(getCountryFromAddress(waypoints[i].end_address))) {
        listOfCountries.push(getCountryFromAddress(waypoints[i].end_address));
      }
    }
    distance = distance / 1000;
    time = Math.round(time / 60 / 60);
    const vehicles = await getVehicles()
    res.send({ vehicles });
    async function getVehicles() {
      const vehicles = await Vehicle.aggregate([
        {
          $match: {
            "dimensions.height": {
              $gt: height + palette.height
            },
            "range.maxRange": {
              $gte: distanceToDrive
            },
            countries: {
              $all: listOfCountries
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
      return vehicles
    }
  }
}
