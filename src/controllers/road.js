import Vehicle from "../models/vehicle";
import Palette from "../models/palletes";
import Companies from "../models/company";
import { vehicleFilterByPallet, vehicleFilterByVolume } from '../services/vehicleFilter'
import googleMaps from "@google/maps";
import { getRoadCode } from '../services/getRoadCode'
import { countTollPayments } from '../services/tollPayments'
import { countRoadDiets } from '../services/countRoadDiets'
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
      countTollPayments(waypoints),
      getVehicles(),
      countRoadDiets(waypoints, time, listOfCountries)
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
        }
        companies[i].vehicles[k].fullCost = Math.floor(companies[i].vehicles[k].fullCost * 100) / 100
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
                            $multiply: ["$valueOfTruck", { $divide: ["$deprecationPerYear", 100] }]
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
            email: companies[i].email,
            logo: companies[i].logo,
            isVat: companies[i].isVat,
            place: companies[i].place,
            phone: companies[i].phone,
            taxNumber: companies[i].taxNumber,
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
        let isNo = false
        formattedCompanies[i].vehicles = formattedCompanies[i].vehicles.filter((value) => {
          return value.isInside === true
        })
        if (formattedCompanies[i].vehicles.length === 0) {
          formattedCompanies.splice(i, 1)
          i--
          isNo = true
        }
        if (!isNo) {
          const filtered = vehicleFilterByPallet(formattedCompanies[i].vehicles, numberOfPallets, weight)
          if (filtered) {
            formattedCompanies[i].vehicles = filtered.map((value, index) => {
              return value.truck
            })
            for (let k = 0; k < formattedCompanies[i].vehicles.length; k++) {
              if (formattedCompanies[i].vehicles[k].diffDistance + formattedCompanies[i].vehicles[k].backDistance > formattedCompanies[i].vehicles[k].range.operationRange) {
                formattedCompanies[i].vehicles[k] = {
                  ...formattedCompanies[i].vehicles[k],
                  fullCost:
                    formattedCompanies[i].vehicles[k].diffDistance *
                    formattedCompanies[i].vehicles[k].costPerKm +
                    distance * formattedCompanies[i].vehicles[k].costPerKm +
                    formattedCompanies[i].vehicles[k].backDistance * formattedCompanies[i].vehicles[k].costPerKm
                }
              } else {
                formattedCompanies[i].vehicles[k] = {
                  ...formattedCompanies[i].vehicles[k],
                  fullCost:
                    distance * formattedCompanies[i].vehicles[k].costPerKm
                };
              }

            }
          }
        }

      }
      return formattedCompanies;
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
      countTollPayments(waypoints),
      getVehicles(),
      countRoadDiets(waypoints, time, listOfCountries)
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
        companies[i].vehicles[k].fullCost = Math.floor(companies[i].vehicles[k].fullCost * 100) / 100
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
                            $multiply: ["$valueOfTruck", { $divide: ["$deprecationPerYear", 100] }]
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
            email: companies[i].email,
            logo: companies[i].logo,
            isVat: companies[i].isVat,
            place: companies[i].place,
            phone: companies[i].phone,
            taxNumber: companies[i].taxNumber,
            vehicles: [],
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
            if (formattedCompanies[i].vehicles[k].diffDistance + formattedCompanies[i].vehicles[k].backDistance > formattedCompanies[i].vehicles[k].range.operationRange) {
              formattedCompanies[i].vehicles[k] = {
                ...formattedCompanies[i].vehicles[k],
                fullCost:
                  formattedCompanies[i].vehicles[k].diffDistance *
                  formattedCompanies[i].vehicles[k].costPerKm +
                  distance * formattedCompanies[i].vehicles[k].costPerKm +
                  formattedCompanies[i].vehicles[k].backDistance * formattedCompanies[i].vehicles[k].costPerKm
              }
            } else {
              formattedCompanies[i].vehicles[k] = {
                ...formattedCompanies[i].vehicles[k],
                fullCost:
                  distance * formattedCompanies[i].vehicles[k].costPerKm
              };
            }
          }
        } else {
          formattedCompanies.splice(i, 1)
          i--
        }
      }
      return formattedCompanies;
    }
  }
}
