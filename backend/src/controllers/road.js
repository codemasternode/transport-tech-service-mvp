import Vehicle from "../models/vehicle";
import Palette from "../models/palletes";
import TollRoad from "../models/tollRoads";
import Diets from "../models/diets";
import Companies from "../models/company";
import { vehicleFilterByPallet, vehicleFilterByVolume } from '../services/vehicleFilter'
import googleMaps from "@google/maps";
import { getRoadCode } from '../services/getRoadCode'
import "dotenv/config";

import {
  createDistanceGoogleMapsRequest,
  getCountryFromAddress,
  getDistanceFromLatLonInKm,
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
      "weight"
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
    const { points, numberOfPallets, typeOfPallet, height, weight } = req.body;
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
    const [tollPayment, companies, diets] = await Promise.all([
      countTollPayments(),
      getVehicles(),
      countRoadDiets()
    ]);
    for (let i = 0; i < companies.length; i++) {
      for (let k = 0; k < companies[i].vehicles.length; k++) {
        for (let m = 0; m < tollPayment.length; m++) {
          for (let l = 0; l < tollPayment[m].pricingPlans.length; l++) {
            const isIt = [];
            for (
              let o = 0;
              o < tollPayment[m].pricingPlans[l].requirePropertyValue.length;
              o++
            ) {
              const currentRequireProperty =
                tollPayment[m].pricingPlans[l].requirePropertyValue[o];
              if (
                currentRequireProperty.value != undefined &&
                companies[i].vehicles[k][currentRequireProperty.name] ===
                currentRequireProperty.value
              ) {
                isIt.push(true);
              } else if (
                currentRequireProperty.from != undefined &&
                currentRequireProperty.to != undefined &&
                companies[i].vehicles[k][currentRequireProperty.name] >=
                currentRequireProperty.from &&
                companies[i].vehicles[k][currentRequireProperty.name] <
                currentRequireProperty.to
              ) {
                isIt.push(true);
              }
            }
            if (
              isIt.length ===
              tollPayment[m].pricingPlans[l].requirePropertyValue.length &&
              isIt.includes(true) &&
              !isIt.includes(false)
            ) {
              companies[i].vehicles[k].fullCost +=
                tollPayment[m].pricingPlans[l].costsForWholeDistance;
              if (companies[i].vehicles[k].toll === undefined) {
                companies[i].vehicles[k].toll =
                  tollPayment[m].pricingPlans[l].costsForWholeDistance;
              } else {
                companies[i].vehicles[k].toll +=
                  tollPayment[m].pricingPlans[l].costsForWholeDistance;
              }
            }
          }
        }
        // setTimeout(() => {
        //   if(isNaN(companies[i].vehicles[k].fullCost)) {
        //     console.log(companies[i].vehicles[k], 129)
        //   }
        // },60)
        // if(isNaN(companies[i].vehicles[k].fullCost)) {
        //   console.log(companies[i].vehicles[k], 129)
        // }
        companies[i].vehicles[k].fullCost +=
          diets.sumDiets +
          (Math.floor(diets.fullNumberOfDays) *
            companies[i].vehicles[k].salary) /
          30 +
          (diets.fullNumberOfDays - Math.floor(diets.fullNumberOfDays) > 0.5
            ? companies[i].vehicles[k].salary / 30
            : companies[i].vehicles[k].salary / 60);
        companies[i].vehicles[k] = {
          _id: companies[i].vehicles[k]._id,
          name: companies[i].vehicles[k].name,
          fullCost:
            (companies[i].vehicles[k].fullCost *
              (100 + companies[i].vehicles[k].margin)) /
            100
        };
      }
    }
    res.send({ companies });

    async function getVehicles() {
      const [vehicles, formattedCompanies] = await Promise.all([
        Vehicle.aggregate([
          {
            $match: {
              "dimensions.height": {
                $gt: height + palette.height
              },
              "range.maxRange": {
                $gte: distance
              },
              countries: {
                $all: listOfCountries
              }
            }
          },
          {
            $addFields: {
              palettes: {
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
                            $multiply: [
                              "$dimensions.length",
                              "$dimensions.width"
                            ]
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
        ]),
        operateOnCompanies()
      ]);

      async function operateOnCompanies() {
        const companies = await Companies.find({});
        const distinctVehiclesInCompanies = [];
        for (let i = 0; i < companies.length; i++) {
          let com = {
            nameOfCompany: companies[i].nameOfCompany,
            _id: companies[i]._id,
            vehicles: []
          };
          for (let k = 0; k < companies[i].companyBases.length; k++) {
            const diffDistance =
              getDistanceFromLatLonInKm(
                companies[i].companyBases[k].location,
                points[0]
              ) * 1.2;
            const backDistance =
              getDistanceFromLatLonInKm(
                companies[i].companyBases[k].location,
                points[points.length - 1]
              ) * 1.2;
            for (
              let m = 0;
              m < companies[i].companyBases[k].vehicles.length;
              m++
            ) {
              let isInside = false;
              for (let g = 0; g < com.vehicles.length; g++) {
                if (
                  com.vehicles[g]._id.toString() ===
                  companies[i].companyBases[k].vehicles[m]._id.toString() &&
                  com.vehicles[g].diffDistance > diffDistance
                ) {
                  com.vehicles[g] = {
                    ...companies[i].companyBases[k].vehicles[m],
                    diffDistance,
                    backDistance,
                    fullCost: 0,
                    toll: 0
                  };
                  isInside = true;
                }
              }
              if (!isInside) {
                com.vehicles.push({
                  ...companies[i].companyBases[k].vehicles[m],
                  diffDistance,
                  backDistance
                });
              }
            }
          }
          distinctVehiclesInCompanies.push(com);
        }
        return distinctVehiclesInCompanies;
      }

      for (let i = 0; i < vehicles.length; i++) {
        for (let k = 0; k < formattedCompanies.length; k++) {
          loop1: for (
            let m = 0;
            m < formattedCompanies[k].vehicles.length;
            m++
          ) {
            if (
              vehicles[i]._id.toString() ===
              formattedCompanies[k].vehicles[m]._id.toString()
            ) {
              formattedCompanies[k].vehicles[m] = {
                ...formattedCompanies[k].vehicles[m],
                costPerKm: vehicles[i].costPerKm,
                palettes:
                  vehicles[i].palettes.oneRow + vehicles[i].palettes.secondRow,
                isInside: true
              };
              break loop1;
            }
          }
        }
      }
      for (let i = 0; i < formattedCompanies.length; i++) {
        formattedCompanies[i].vehicles = formattedCompanies[i].vehicles.filter((value) => {
          return value.isInside === true
        })
        const filtered = vehicleFilterByPallet(formattedCompanies[i].vehicles, numberOfPallets, weight)
        if (filtered) {
          formattedCompanies[i].vehicles = filtered.map((value, index) => {
            return value.truck
          })
          for (let k = 0; k < formattedCompanies[i].vehicles.length; k++) {
            formattedCompanies[i].vehicles[k] = {
              ...formattedCompanies[i].vehicles[k],
              fullCost:
                formattedCompanies[i].vehicles[k].diffDistance *
                formattedCompanies[i].vehicles[k].costPerKm +
                distance * formattedCompanies[i].vehicles[k].costPerKm
            };
          }
        }
      }
      return formattedCompanies;
    }

    async function countTollPayments() {
      const tollRoads = [];
      const tollCounts = []
      async function countOneTollRoad(i, k, ex, value, waypoints, extracted) {
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
          nameOfRoad: extracted[ex]
        });
        let mainDirection = null;
        if (tollRoad) {
          let tollRoadPrepare = {
            name: extracted[ex],
            pricingPlans: []
          };
          for (let m = 0; m < tollRoad.route.length; m++) {
            if (
              mainDirections.latitudeDirection ===
              tollRoad.route[m].mainDirection ||
              mainDirections.longitudeDirection ===
              tollRoad.route[m].mainDirection
            ) {
              mainDirection = tollRoad.route[m];
              for (
                let g = 0;
                g < mainDirection.pricingPlans.length;
                g++
              ) {
                if (mainDirection.pricingPlans[g].paymentPoints) {
                  const { paymentPoints } = mainDirection.pricingPlans[
                    g
                  ];
                  let startPoint = null;
                  let endPoint = null;
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
                  let costsForWholeDistance = 0;
                  for (let kl = startPoint; kl <= endPoint; kl++) {
                    costsForWholeDistance += paymentPoints[kl].cost;
                  }
                  tollRoadPrepare.pricingPlans.push({
                    requirePropertyValue:
                      mainDirection.pricingPlans[g]
                        .requirePropertyValue,
                    costsForWholeDistance
                  });
                } else {
                  //policz kilometrowo cenę
                  tollRoadPrepare.pricingPlans.push({
                    requirePropertyValue:
                      mainDirection.pricingPlans[g]
                        .requirePropertyValue,
                    costsForWholeDistance:
                      (value *
                        mainDirection.pricingPlans[g].costPerKm) /
                      1000
                  });
                }
              }
            }
          }
          tollRoads.push(tollRoadPrepare);
        }
      }
      for (let i = 0; i < waypoints.length; i++) {
        for (let k = 0; k < waypoints[i].steps.length; k++) {
          const {
            distance: { value }
          } = waypoints[i].steps[k];
          if (value > 1000) {
            const htmlInstruction = waypoints[i].steps[k].html_instructions;
            const extracted = getRoadCode(htmlInstruction);
            if (
              extracted
            ) {
              for (let ex = 0; ex < extracted.length; ex++) {
                tollCounts.push(countOneTollRoad(i, k, ex, value, waypoints, extracted))
              }
            }
          }
        }
      }
      await Promise.all(tollCounts)
      return tollRoads;
    }

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
                sumDiets +=
                  country.dietValueInPLN * dietsAbove24Hours[mk].value;
                counter += dietsAbove24Hours[mk].to;
              }
            }
            if (!isFull) {
              sumDiets +=
                country.dietValueInPLN *
                dietsAbove24Hours[dietsAbove24Hours.length - 1].value;
              counter += dietsAbove24Hours[dietsAbove24Hours.length - 1].to;
            }
          }
          sumDiets += Math.floor(numberOfDays) * country.dietValueInPLN * 1.5;
        }
      }
      return { sumDiets, fullNumberOfDays };
    }
  } else if (req.body.typeOfSearch === "Dimensions") {
    const requireKeys = ["volume", "points", "weight"];
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
    const { points, volume, weight } = req.body;
    if (!points || points.length < 2) {
      return res.status(400).send({
        err: "There is no points"
      });
    }
    let road
    try {
      road = await googleMapsClient
        .directions(createDistanceGoogleMapsRequest(points))
        .asPromise();
    } catch (err) {
      return res.status(500).send({})
    }


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
    const [tollPayment, companies, diets] = await Promise.all([
      countTollPayments(),
      getVehicles(),
      countRoadDiets()
    ]);

    for (let i = 0; i < companies.length; i++) {
      for (let k = 0; k < companies[i].vehicles.length; k++) {
        for (let m = 0; m < tollPayment.length; m++) {
          for (let l = 0; l < tollPayment[m].pricingPlans.length; l++) {
            const isIt = [];
            for (
              let o = 0;
              o < tollPayment[m].pricingPlans[l].requirePropertyValue.length;
              o++
            ) {
              const currentRequireProperty =
                tollPayment[m].pricingPlans[l].requirePropertyValue[o];

              if (
                currentRequireProperty.value != undefined &&
                companies[i].vehicles[k][currentRequireProperty.name] ===
                currentRequireProperty.value
              ) {
                isIt.push(true);
              } else if (
                currentRequireProperty.from != undefined &&
                currentRequireProperty.to != undefined &&
                companies[i].vehicles[k][currentRequireProperty.name] >=
                currentRequireProperty.from &&
                companies[i].vehicles[k][currentRequireProperty.name] <
                currentRequireProperty.to
              ) {
                isIt.push(true);
              }
            }

            if (
              isIt.length ===
              tollPayment[m].pricingPlans[l].requirePropertyValue.length &&
              isIt.includes(true) &&
              !isIt.includes(false)
            ) {
              // companies[i].vehicles[k].fullCost +=
              //   tollPayment[m].pricingPlans[l].costsForWholeDistance;
              if (companies[i].vehicles[k].toll === undefined) {
                companies[i].vehicles[k].toll =
                  tollPayment[m].pricingPlans[l].costsForWholeDistance;
              } else {
                companies[i].vehicles[k].toll +=
                  tollPayment[m].pricingPlans[l].costsForWholeDistance;
              }
            }
          }
        }

        companies[i].vehicles[k].fullCost +=
          diets.sumDiets +
          (Math.floor(diets.fullNumberOfDays) *
            companies[i].vehicles[k].salary) /
          30 +
          (diets.fullNumberOfDays - Math.floor(diets.fullNumberOfDays) > 0.5
            ? companies[i].vehicles[k].salary / 30
            : companies[i].vehicles[k].salary / 60);
        companies[i].vehicles[k] = {
          _id: companies[i].vehicles[k]._id,
          name: companies[i].vehicles[k].name,
          fullCost:
            (companies[i].vehicles[k].fullCost *
              (100 + companies[i].vehicles[k].margin)) /
            100
        };
      }
    }
    res.send({ companies });

    async function getVehicles() {
      const [vehicles, formattedCompanies] = await Promise.all([
        Vehicle.aggregate([
          {
            $match: {
              "range.maxRange": {
                $gte: distance
              },
              countries: {
                $all: listOfCountries
              }
            }
          },
          {
            $addFields: {
              volume: {
                $multiply: [
                  "$dimensions.height",
                  {
                    $multiply: ["$dimensions.width", "$dimensions.length"]
                  }
                ]
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
              },
              toll: 0
            }
          }
        ]),
        operateOnCompanies()
      ]);

      async function operateOnCompanies() {
        const companies = await Companies.find({});
        const distinctVehiclesInCompanies = [];
        for (let i = 0; i < companies.length; i++) {
          let com = {
            nameOfCompany: companies[i].nameOfCompany,
            _id: companies[i]._id,
            vehicles: []
          };
          for (let k = 0; k < companies[i].companyBases.length; k++) {
            const diffDistance =
              getDistanceFromLatLonInKm(
                companies[i].companyBases[k].location,
                points[0]
              ) * 1.2;
            const backDistance =
              getDistanceFromLatLonInKm(
                companies[i].companyBases[k].location,
                points[points.length - 1]
              ) * 1.2;
            for (
              let m = 0;
              m < companies[i].companyBases[k].vehicles.length;
              m++
            ) {
              let isInside = false;
              for (let g = 0; g < com.vehicles.length; g++) {
                if (
                  com.vehicles[g]._id.toString() ===
                  companies[i].companyBases[k].vehicles[m]._id.toString() &&
                  com.vehicles[g].diffDistance > diffDistance
                ) {
                  com.vehicles[g] = {
                    ...companies[i].companyBases[k].vehicles[m],
                    diffDistance,
                    backDistance,
                    fullCost: 0,
                    toll: 0
                  };
                  isInside = true;
                }
              }
              if (!isInside) {
                com.vehicles.push({
                  ...companies[i].companyBases[k].vehicles[m],
                  diffDistance,
                  backDistance
                });
              }
            }
          }
          distinctVehiclesInCompanies.push(com);
        }
        return distinctVehiclesInCompanies;
      }

      for (let i = 0; i < vehicles.length; i++) {
        for (let k = 0; k < formattedCompanies.length; k++) {
          loop1: for (
            let m = 0;
            m < formattedCompanies[k].vehicles.length;
            m++
          ) {
            if (
              vehicles[i]._id.toString() ===
              formattedCompanies[k].vehicles[m]._id.toString()
            ) {
              formattedCompanies[k].vehicles[m] = {
                ...formattedCompanies[k].vehicles[m],
                costPerKm: vehicles[i].costPerKm,
                volume: vehicles[i].volume,
                isInside: true
              };
              break loop1;
            }
          }
        }
      }
      for (let i = 0; i < formattedCompanies.length; i++) {
        formattedCompanies[i].vehicles = formattedCompanies[i].vehicles.filter((value) => {
          return value.isInside === true
        })
        const filtered = vehicleFilterByVolume(formattedCompanies[i].vehicles, volume, weight)
        if (filtered) {
          formattedCompanies[i].vehicles = filtered.map((value, index) => {
            return value.truck
          })
          for (let k = 0; k < formattedCompanies[i].vehicles.length; k++) {
            formattedCompanies[i].vehicles[k] = {
              ...formattedCompanies[i].vehicles[k],
              fullCost:
                formattedCompanies[i].vehicles[k].diffDistance *
                formattedCompanies[i].vehicles[k].costPerKm +
                distance * formattedCompanies[i].vehicles[k].costPerKm
            };
          }
        }
      }
      return formattedCompanies;
    }



    async function countTollPayments() {
      const tollRoads = [];
      const tollCounts = []
      async function countOneTollRoad(i, k, ex, value, waypoints, extracted) {
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
          nameOfRoad: extracted[ex]
        });
        let mainDirection = null;
        if (tollRoad) {
          let tollRoadPrepare = {
            name: extracted[ex],
            pricingPlans: []
          };
          for (let m = 0; m < tollRoad.route.length; m++) {
            if (
              mainDirections.latitudeDirection ===
              tollRoad.route[m].mainDirection ||
              mainDirections.longitudeDirection ===
              tollRoad.route[m].mainDirection
            ) {
              mainDirection = tollRoad.route[m];
              for (
                let g = 0;
                g < mainDirection.pricingPlans.length;
                g++
              ) {
                if (mainDirection.pricingPlans[g].paymentPoints) {
                  const { paymentPoints } = mainDirection.pricingPlans[
                    g
                  ];
                  let startPoint = null;
                  let endPoint = null;
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
                  let costsForWholeDistance = 0;
                  for (let kl = startPoint; kl <= endPoint; kl++) {
                    costsForWholeDistance += paymentPoints[kl].cost;
                  }
                  tollRoadPrepare.pricingPlans.push({
                    requirePropertyValue:
                      mainDirection.pricingPlans[g]
                        .requirePropertyValue,
                    costsForWholeDistance
                  });
                } else {
                  //policz kilometrowo cenę
                  tollRoadPrepare.pricingPlans.push({
                    requirePropertyValue:
                      mainDirection.pricingPlans[g]
                        .requirePropertyValue,
                    costsForWholeDistance:
                      (value *
                        mainDirection.pricingPlans[g].costPerKm) /
                      1000
                  });
                }
              }
            }
          }
          tollRoads.push(tollRoadPrepare);
        }
      }
      for (let i = 0; i < waypoints.length; i++) {
        for (let k = 0; k < waypoints[i].steps.length; k++) {
          const {
            distance: { value }
          } = waypoints[i].steps[k];
          if (value > 1000) {
            const htmlInstruction = waypoints[i].steps[k].html_instructions;
            const extracted = getRoadCode(htmlInstruction);
            if (
              extracted
            ) {
              for (let ex = 0; ex < extracted.length; ex++) {
                tollCounts.push(countOneTollRoad(i, k, ex, value, waypoints, extracted))
              }
            }
          }
        }
      }
      await Promise.all(tollCounts)
      return tollRoads;
    }

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
                sumDiets +=
                  country.dietValueInPLN * dietsAbove24Hours[mk].value;
                counter += dietsAbove24Hours[mk].to;
              }
            }
            if (!isFull) {
              sumDiets +=
                country.dietValueInPLN *
                dietsAbove24Hours[dietsAbove24Hours.length - 1].value;
              counter += dietsAbove24Hours[dietsAbove24Hours.length - 1].to;
            }
          }
          sumDiets += Math.floor(numberOfDays) * country.dietValueInPLN * 1.5;
        }
      }
      return { sumDiets, fullNumberOfDays };
    }
  }
}
