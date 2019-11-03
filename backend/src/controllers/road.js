import Vehicle from "../models/vehicle";
import Palette from "../models/palletes";
import TollRoad from "../models/tollRoads";
import axios from "axios";
import googleMaps from "@google/maps";
import "dotenv/config";

import {
  createDistanceGoogleMapsRequest,
  getCountryFromAddress,
  getDistanceFromLatLonInKm,
  extractHtmlInstruction
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
      if (
        !listOfCountries.includes(
          getCountryFromAddress(waypoints[i].start_address)
        )
      ) {
        listOfCountries.push(getCountryFromAddress(waypoints[i].start_address));
      }
      if (
        !listOfCountries.includes(
          getCountryFromAddress(waypoints[i].end_address)
        )
      ) {
        listOfCountries.push(getCountryFromAddress(waypoints[i].end_address));
      }
    }
    distance = distance / 1000;
    time = Math.round(time / 60 / 60);

    const [countingOperation] = await Promise.all([
      countTollPayments(),
      getVehicles()
    ]);
    res.send({});
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
      return vehicles;
    }

    async function countTollPayments() {
      const roadToSearchInDB = [];
      const tollRoad = [];
      for (let i = 0; i < waypoints.length; i++) {
        for (let k = 0; k < waypoints[i].steps.length; k++) {
          const {
            distance: { value }
          } = waypoints[i].steps[k];
          const htmlInstruction = waypoints[i].steps[k].html_instructions;
          if (htmlInstruction.search("Toll road") != -1 && value > 700) {
            const extracted = extractHtmlInstruction(htmlInstruction);
            if (extracted && !roadToSearchInDB.includes(extracted[0])) {
              const { start_location, end_location } = waypoints[i].steps[k];
              const mainDirections = {
                latitudeDifference: Math.abs(
                  end_location.lat - start_location.lat
                ),
                longitudeDifference: Math.abs(
                  end_location.lng - start_location.lng
                ),
                latitudeDirection:
                  start_location.lat > end_location.lat
                    ? "SOUTH"
                    : start_location.lat === end_location.lat
                    ? "NONE"
                    : "NORTH",
                longitudeDirection:
                  start_location.lng > end_location.lng
                    ? "WEST"
                    : start_location.lng === end_location.lng
                    ? "NONE"
                    : "EAST"
              };
              const tollRoad = await TollRoad.findOne({
                nameOfRoad: extracted[0]
              });
              let mainDirection = null;
              if (tollRoad) {
                for (let m = 0; m < tollRoad.route.length; m++) {
                  //check if we are moving on north or south
                  if (
                    mainDirections.latitudeDirection ===
                    tollRoad.route[m].mainDirection
                  ) {
                    //get info about direction
                    mainDirection = tollRoad.route[m];
                    //do tego miejsca działa dobrze
                    //get info about start
                    for (
                      let g = 0;
                      g < mainDirection.pricingPlans.length;
                      g++
                    ) {
                      if (mainDirection.pricingPlans[g].paymentPoints) {
                        const { paymentPoints } = mainDirection.pricingPlans[g];
                        let startPoint = null;
                        let endPoint = null;
                        //przed pierwszym punktem poboru opłat
                        if (
                          paymentPoints[0].location.lat > start_location.lat &&
                          tollRoad.route[m].mainDirection === "NORTH" &&
                          end_location.lat > paymentPoints[0].location.lat
                        ) {
                          startPoint = 0;
                          let nearestDistance = {
                            number: 0,
                            value: getDistanceFromLatLonInKm(
                              paymentPoints[0].location,
                              end_location
                            )
                          };
                          for (let mgklk = 0; mgklk < paymentPoints.length; mgklk++) {
                            if (
                              getDistanceFromLatLonInKm(
                                paymentPoints[mgklk].location,
                                end_location
                              ) < nearestDistance.value
                            ) {
                              nearestDistance = {
                                number: mgklk,
                                value: getDistanceFromLatLonInKm(
                                  paymentPoints[mgklk].location,
                                  end_location
                                )
                              };
                            }
                          }
                          endPoint = nearestDistance.number
                        } else if (
                          paymentPoints[paymentPoints.length - 1].location.lat <
                            start_location.lat &&
                          tollRoad.route[m].mainDirection === "NORTH"
                        ) {
                          //za ostatnim punktem poboru opłat
                          startPoint = null;
                          endPoint = null;
                        } else if (
                          paymentPoints[0].location.lat < start_location.lat &&
                          tollRoad.route[m].mainDirection === "SOUTH" &&
                          end_location.lat < paymentPoints[0].location.lat
                        ) {
                          startPoint = 0;
                          let nearestDistance = {
                            number: 0,
                            value: getDistanceFromLatLonInKm(
                              paymentPoints[0].location,
                              end_location
                            )
                          };
                          for (let mg = 0; mg < paymentPoints.length; mg++) {
                            if (
                              getDistanceFromLatLonInKm(
                                paymentPoints[mg].location,
                                end_location
                              ) < nearestDistance.value
                            ) {
                              nearestDistance = {
                                number: mg,
                                value: getDistanceFromLatLonInKm(
                                  paymentPoints[mg].location,
                                  end_location
                                )
                              };
                            }
                          }
                          endPoint = nearestDistance.number;
                        } else if (
                          paymentPoints[paymentPoints.length - 1].location.lat >
                            start_location.lat &&
                          tollRoad.route[m].mainDirection === "SOUTH"
                        ) {
                          startPoint = null;
                          endPoint = null;
                        } else {
                          let nearestDistance = {
                            number: 0,
                            value: getDistanceFromLatLonInKm(
                              paymentPoints[0].location,
                              end_location
                            )
                          };
                          for (let mg = 0; mg < paymentPoints.length; mg++) {
                            if (
                              getDistanceFromLatLonInKm(
                                paymentPoints[mg].location,
                                start_location
                              ) < nearestDistance.value
                            ) {
                              nearestDistance = {
                                number: mg,
                                value: getDistanceFromLatLonInKm(
                                  paymentPoints[mg].location,
                                  start_location
                                )
                              };
                            }
                          }
                          startPoint = nearestDistance.number;
                          nearestDistance = {
                            number: 0,
                            value: getDistanceFromLatLonInKm(
                              paymentPoints[0].location,
                              end_location
                            )
                          };
                          for (let mg = 0; mg < paymentPoints.length; mg++) {
                            if (
                              getDistanceFromLatLonInKm(
                                paymentPoints[mg].location,
                                end_location
                              ) < nearestDistance.value
                            ) {
                              nearestDistance = {
                                number: mg,
                                value: getDistanceFromLatLonInKm(
                                  paymentPoints[mg].location,
                                  end_location
                                )
                              };
                            }
                          }
                          endPoint = nearestDistance.number;
                        }
                        console.log(
                          "Punkt początkowy trasy: ",
                          paymentPoints[startPoint]
                        );
                        console.log(
                          "Punkt końcowy trasy: ",
                          paymentPoints[endPoint]
                        );
                      } else {
                        //policz kilometrowo cenę
                      }
                    }
                  } //check if we are moving on west or east
                  else if (
                    mainDirections.longitudeDirection ===
                    tollRoad.route[m].mainDirection
                  ) {
                    //get info about direction
                    mainDirection = tollRoad.route[m];

                    //get information about start
                    for (
                      let g = 0;
                      g < mainDirection.pricingPlans.length;
                      g++
                    ) {
                      if (mainDirection.pricingPlans[g].paymentPoints) {
                        const { paymentPoints } = mainDirection.pricingPlans[g];
                        let startPoint = null;
                        let endPoint = null;
                        //przed pierwszym punktem poboru opłat
                        if (
                          paymentPoints[0].location.lng > start_location.lng &&
                          tollRoad.route[m].mainDirection === "EAST" &&
                          end_location.lng > paymentPoints[0].location.lng
                        ) {
                          startPoint = 0;
                          let nearestDistance = {
                            number: 0,
                            value: getDistanceFromLatLonInKm(
                              paymentPoints[0].location,
                              end_location
                            )
                          };
                          for (let mg = 0; mg < paymentPoints.length; mg++) {
                            if (
                              getDistanceFromLatLonInKm(
                                paymentPoints[mg].location,
                                end_location
                              ) < nearestDistance.value
                            ) {
                              nearestDistance = {
                                number: mg,
                                value: getDistanceFromLatLonInKm(
                                  paymentPoints[mg].location,
                                  end_location
                                )
                              };
                            }
                          }
                          endPoint = nearestDistance.number;
                        } else if (
                          paymentPoints[paymentPoints.length - 1].location.lng <
                            start_location.lng &&
                          tollRoad.route[m].mainDirection === "EAST"
                        ) {
                          //za ostatnim punktem poboru opłat
                          startPoint = null;
                          endPoint = null;
                        } else if (
                          paymentPoints[0].location.lng < start_location.lng &&
                          tollRoad.route[m].mainDirection === "WEST" &&
                          end_location.lng < paymentPoints[0].location.lng
                        ) {
                          startPoint = 0;
                          let nearestDistance = {
                            number: 0,
                            value: getDistanceFromLatLonInKm(
                              paymentPoints[0].location,
                              end_location
                            )
                          };
                          for (let mg = 0; mg < paymentPoints.length; mg++) {
                            if (
                              getDistanceFromLatLonInKm(
                                paymentPoints[mg].location,
                                end_location
                              ) < nearestDistance.value
                            ) {
                              nearestDistance = {
                                number: mg,
                                value: getDistanceFromLatLonInKm(
                                  paymentPoints[mg].location,
                                  end_location
                                )
                              };
                            }
                          }
                          endPoint = nearestDistance.number;
                        } else if (
                          paymentPoints[paymentPoints.length - 1].location.lng <
                            start_location.lng &&
                          tollRoad.route[m].mainDirection === "WEST"
                        ) {
                          startPoint = null;
                        } else {
                          let nearestDistance = {
                            number: 0,
                            value: getDistanceFromLatLonInKm(
                              paymentPoints[0].location,
                              end_location
                            )
                          };
                          for (let mg = 0; mg < paymentPoints.length; mg++) {
                            if (
                              getDistanceFromLatLonInKm(
                                paymentPoints[mg].location,
                                start_location
                              ) < nearestDistance.value
                            ) {
                              nearestDistance = {
                                number: mg,
                                value: getDistanceFromLatLonInKm(
                                  paymentPoints[mg].location,
                                  start_location
                                )
                              };
                            }
                          }
                          startPoint = nearestDistance.number;
                          nearestDistance = {
                            number: 0,
                            value: getDistanceFromLatLonInKm(
                              paymentPoints[0].location,
                              end_location
                            )
                          };
                          for (let mg = 0; mg < paymentPoints.length; mg++) {
                            if (
                              getDistanceFromLatLonInKm(
                                paymentPoints[mg].location,
                                end_location
                              ) < nearestDistance.value
                            ) {
                              nearestDistance = {
                                number: mg,
                                value: getDistanceFromLatLonInKm(
                                  paymentPoints[mg].location,
                                  end_location
                                )
                              };
                            }
                          }
                          endPoint = nearestDistance.number;
                        }
                        console.log(
                          "Punkt początkowy trasy: ",
                          paymentPoints[startPoint]
                        );
                        console.log(
                          "Punkt końcowy trasy: ",
                          paymentPoints[endPoint]
                        );
                      } else {
                        //policz kilometrowo cenę
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
