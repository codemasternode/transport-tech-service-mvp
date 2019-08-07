import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import CountryModel from "../models/country";
import CompanyModel from "../models/company";
import VehicleModel from "../models/vehicle";
import FuelModel from "../models/fuel";
import CompanyBase from "../models/companyBase";

export default URI => {
  mongoose.connect(URI, { useNewUrlParser: true }, err => {
    if (err) {
      throw new Error(`Error while trying to connect MongoDB ${err}`);
    }
    console.log(`Connected to MongoDB on port ${URI}`);
    CompanyBase.deleteMany({}).then(() => {
      VehicleModel.deleteMany({}).then(() => {
        FuelModel.deleteMany({}).then(() => {
          CountryModel.deleteMany({}).then(() => {
            CompanyModel.deleteMany({}).then(() => {
              fs.readFile(
                path.join(__dirname, "../data/companyBases.json"),
                (err, basesData) => {
                  if (err) {
                    console.log(
                      "Problem with load data from companyBases.json"
                    );
                  }
                  fs.readFile(
                    path.join(__dirname, "../data/vehicles.json"),
                    (err, vehiclesData) => {
                      if (err) {
                        console.log(
                          "Problem with load data from vehicles.json"
                        );
                      }
                      fs.readFile(
                        path.join(__dirname, "../data/countries.json"),
                        (err, countriesData) => {
                          if (err) {
                            console.log(
                              "Problem with load data from countries.json"
                            );
                          }
                          fs.readFile(
                            path.join(__dirname, "../data/fuels.json"),
                            (err, fuelsData) => {
                              if (err) {
                                console.log(
                                  "Problem with load data from fuels.json"
                                );
                              }
                              FuelModel.insertMany(JSON.parse(fuelsData)).then(
                                fuels => {
                                  CountryModel.insertMany(
                                    JSON.parse(countriesData)
                                  ).then(countries => {
                                    fs.readFile(
                                      path.join(
                                        __dirname,
                                        "../data/companies.json"
                                      ),
                                      (err, data) => {
                                        if (err) {
                                          console.log(
                                            "Problem with load data from companies.json"
                                          );
                                        }
                                        let convertedVehicles = JSON.parse(
                                          vehiclesData
                                        );
                                        for (
                                          let k = 0;
                                          k < convertedVehicles.length;
                                          k++
                                        ) {
                                          convertedVehicles[k].fuel =
                                            fuels[0]._id;
                                        }
                                        VehicleModel.insertMany(
                                          convertedVehicles
                                        ).then(vehicles => {
                                          CountryModel.findOne({
                                            name: "PL"
                                          }).then(poland => {
                                            let companyBases = JSON.parse(
                                              basesData
                                            );

                                            for (
                                              let m = 0;
                                              m < companyBases.length;
                                              m++
                                            ) {
                                              companyBases[
                                                m
                                              ].vehicles = vehicles;
                                              companyBases[m].country =
                                                poland._id;
                                            }
                                            CompanyBase.insertMany(
                                              companyBases
                                            ).then(companyBases => {
                                              data = JSON.parse(data);
                                              data[0].vehicles = vehicles;
                                              data[0].companyBases = companyBases;
                                              for (
                                                let i = 0;
                                                i < data.length;
                                                i++
                                              ) {
                                                data[i].country = poland._id;
                                              }
                                              CompanyModel.insertMany(data);
                                            });
                                          });
                                        });
                                      }
                                    );
                                  });
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            });
          });
        });
      });
    });
  });
};
