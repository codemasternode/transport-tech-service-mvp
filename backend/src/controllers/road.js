import Vehicle from "../models/vehicle";
import Palette from "../models/palletes";
import TollRoad from "../models/tollRoads";
import Diets from "../models/diets";
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
      listOfCountries.push(getCountryFromAddress(waypoints[i].start_address));
      listOfCountries.push(getCountryFromAddress(waypoints[i].end_address));
    }
    distance = distance / 1000;
    time = time / 60 / 60;
    const countingOperation = await Promise.all([
      //countTollPayments(),
      getVehicles(),
      countRoadDiets()
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

    // async function countTollPayments() {
    //   const roadToSearchInDB = [];
    //   const tollRoads = [];
    //   for (let i = 0; i < waypoints.length; i++) {
    //     for (let k = 0; k < waypoints[i].steps.length; k++) {
    //       const {
    //         distance: { value }
    //       } = waypoints[i].steps[k];
    //       const htmlInstruction = waypoints[i].steps[k].html_instructions;
    //       if (htmlInstruction.search("Toll road") != -1 && value > 700) {
    //         const extracted = extractHtmlInstruction(htmlInstruction);
    //         if (extracted && !roadToSearchInDB.includes(extracted[0])) {
    //           const { start_location, end_location } = waypoints[i].steps[k];
    //           const mainDirections = {
    //             latitudeDifference: Math.abs(
    //               end_location.lat - start_location.lat
    //             ),
    //             longitudeDifference: Math.abs(
    //               end_location.lng - start_location.lng
    //             ),
    //             latitudeDirection:
    //               start_location.lat > end_location.lat
    //                 ? "SOUTH"
    //                 : start_location.lat === end_location.lat
    //                 ? "NONE"
    //                 : "NORTH",
    //             longitudeDirection:
    //               start_location.lng > end_location.lng
    //                 ? "WEST"
    //                 : start_location.lng === end_location.lng
    //                 ? "NONE"
    //                 : "EAST"
    //           };
    //           const tollRoad = await TollRoad.findOne({
    //             nameOfRoad: extracted[0]
    //           });
    //           let mainDirection = null;
    //           if (tollRoad) {
    //             let tollRoadPrepare = {
    //               name: extracted[0],
    //               pricingPlans: []
    //             };
    //             for (let m = 0; m < tollRoad.route.length; m++) {
    //               if (
    //                 mainDirections.latitudeDirection ===
    //                   tollRoad.route[m].mainDirection ||
    //                 mainDirections.longitudeDirection ===
    //                   tollRoad.route[m].mainDirection
    //               ) {
    //                 mainDirection = tollRoad.route[m];
    //                 for (
    //                   let g = 0;
    //                   g < mainDirection.pricingPlans.length;
    //                   g++
    //                 ) {
    //                   if (mainDirection.pricingPlans[g].paymentPoints) {
    //                     const { paymentPoints } = mainDirection.pricingPlans[g];
    //                     let startPoint = null;
    //                     let endPoint = null;
    //                     let nearestDistance = {
    //                       number: 0,
    //                       value: getDistanceFromLatLonInKm(
    //                         paymentPoints[0].location,
    //                         end_location
    //                       )
    //                     };
    //                     for (let mg = 0; mg < paymentPoints.length; mg++) {
    //                       if (
    //                         getDistanceFromLatLonInKm(
    //                           paymentPoints[mg].location,
    //                           start_location
    //                         ) < nearestDistance.value
    //                       ) {
    //                         nearestDistance = {
    //                           number: mg,
    //                           value: getDistanceFromLatLonInKm(
    //                             paymentPoints[mg].location,
    //                             start_location
    //                           )
    //                         };
    //                       }
    //                     }
    //                     startPoint = nearestDistance.number;
    //                     nearestDistance = {
    //                       number: 0,
    //                       value: getDistanceFromLatLonInKm(
    //                         paymentPoints[0].location,
    //                         end_location
    //                       )
    //                     };
    //                     for (let mg = 0; mg < paymentPoints.length; mg++) {
    //                       if (
    //                         getDistanceFromLatLonInKm(
    //                           paymentPoints[mg].location,
    //                           end_location
    //                         ) < nearestDistance.value
    //                       ) {
    //                         nearestDistance = {
    //                           number: mg,
    //                           value: getDistanceFromLatLonInKm(
    //                             paymentPoints[mg].location,
    //                             end_location
    //                           )
    //                         };
    //                       }
    //                     }
    //                     endPoint = nearestDistance.number;
    //                     let costsForWholeDistance = 0;
    //                     for (let kl = startPoint; kl <= endPoint; kl++) {
    //                       costsForWholeDistance += paymentPoints[kl].cost;
    //                     }
    //                     tollRoadPrepare.pricingPlans.push({
    //                       basedOnProperty:
    //                         mainDirection.pricingPlans[g].basedOnProperty,
    //                       requirePropertyValue:
    //                         mainDirection.pricingPlans[g].basedOnProperty,
    //                       costsForWholeDistance
    //                     });
    //                   } else {
    //                     //policz kilometrowo cenę
    //                     tollRoadPrepare.pricingPlans.push({
    //                       basedOnProperty:
    //                         mainDirection.pricingPlans[g].basedOnProperty,
    //                       requirePropertyValue:
    //                         mainDirection.pricingPlans[g].basedOnProperty,
    //                       costsForWholeDistance:
    //                         (value * mainDirection.pricingPlans[g].costPerKm) /
    //                         1000
    //                     });
    //                   }
    //                 }
    //               }
    //             }
    //             tollRoads.push(tollRoadPrepare);
    //           }
    //         }
    //       }
    //     }
    //   }
    //   console.log(tollRoads)
    //   return tollRoads;
    // }

    async function countRoadDiets() {
      const scaleOfTime = 1;
      let sumDiets = 0;
      const dietsTo24Hours = [
        {
          from: 0,
          to: 0.33,
          value: 1 / 3
        },
        {
          from: 0.33,
          to: 0.5,
          value: 1 / 2
        },
        {
          from: 0.5,
          to: 1,
          value: 1
        }
      ];
      const dietsAbove24Hours = [
        {
          from: 0,
          to: 0.5,
          value: 1 / 2
        },
        {
          from: 0.5,
          to: 1,
          value: 1
        }
      ];
      const avaiableHoursPerDay = [10, 10, 9, 9, 9, 9];
      const dietsInCountries = await Diets.find({
        countryName: {
          $in: listOfCountries
        }
      });
      let fullTime = time * scaleOfTime; //czas na dojazd w jednym kierunku
      let fullNumberOfDays = 0;
      let timeNeededCounter = 0;
      let ck = 0;

      while (timeNeededCounter < fullTime) {
        if (avaiableHoursPerDay[ck % 6] > fullTime - timeNeededCounter) {
          fullNumberOfDays += (fullTime - timeNeededCounter) / 24;
        } else {
          fullNumberOfDays += 1;
        }
        timeNeededCounter += avaiableHoursPerDay[ck % 6];
        if (ck != 0 && ck % 6 == 0) {
          fullNumberOfDays += 2;
        }
        ck++;
      }
      for (let l = 0; l < waypoints.length; l++) {
        let timeNeeded = (waypoints[l].duration.value / 60 / 60) * scaleOfTime; //czas na dojazd w jednym kierunku
        let numberOfDays = 0;
        let timeNeededCounter = 0;
        let ck = 0;

        while (timeNeededCounter < timeNeeded) {
          if (avaiableHoursPerDay[ck % 6] > timeNeeded - timeNeededCounter) {
            numberOfDays += (timeNeeded - timeNeededCounter) / 24;
          } else {
            numberOfDays += 1;
          }
          timeNeededCounter += avaiableHoursPerDay[ck % 6];
          if (ck != 0 && ck % 6 == 0) {
            numberOfDays += 2;
          }
          ck++;
        }
        let country = listOfCountries[l * 2 + 1];
        for (let c = 0; c < dietsInCountries.length; c++) {
          if (country === dietsInCountries[c].countryName) {
            country = dietsInCountries[c];
          }
        }
        if (fullNumberOfDays < 1) {
          for (let i = 0; i < dietsTo24Hours.length; i++) {
            if (
              numberOfDays <= dietsTo24Hours[i].to &&
              numberOfDays > dietsTo24Hours[i].from
            ) {
              sumDiets += dietsTo24Hours[i].value * country.dietValueInPLN;
            }
          }
        } else {
          let counter = 0;
          while (numberOfDays > counter) {
            let isFull = false;
            for (let mk = 0; mk < dietsAbove24Hours.length; mk++) {
              if (
                !isFull &&
                dietsAbove24Hours[mk].to + counter >= numberOfDays
              ) {
                isFull = true;
                console.log(country,dietsAbove24Hours[mk].value )
                sumDiets +=
                  country.dietValueInPLN * dietsAbove24Hours[mk].value;
                counter += dietsAbove24Hours[mk].to;
              }
            }
            if (!isFull) {
              console.log(country,dietsAbove24Hours[dietsAbove24Hours.length - 1].value )
              sumDiets +=
                country.dietValueInPLN *
                dietsAbove24Hours[dietsAbove24Hours.length - 1].value;
              counter += dietsAbove24Hours[dietsAbove24Hours.length - 1].to;
            }
          }
          sumDiets += Math.floor(numberOfDays) * country.nightLimitValueInPLN
        }
        console.log(sumDiets, "Suma diet");
      }
    }
  }
}
