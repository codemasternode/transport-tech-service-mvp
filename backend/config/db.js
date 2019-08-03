import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import CountryModel from "../models/country";
import CompanyModel from "../models/company";
import FuelModel from "../models/fuel";

export default URI => {
  mongoose.connect(URI, { useNewUrlParser: true }, err => {
    if (err) {
      throw new Error(`Error while trying to connect MongoDB ${err}`);
    }
    console.log(`Connected to MongoDB on port ${URI}`);
    // FuelModel.deleteMany({}).then(() => {
    //   CountryModel.deleteMany({}).then(() => {
    //     CompanyModel.deleteMany({}).then(() => {
    //       fs.readFile(
    //         path.join(__dirname, "../data/countries.json"),
    //         (err, countriesData) => {
    //           if (err) {
    //             console.log("Problem with load data from countries.json");
    //           }
    //           fs.readFile(
    //             path.join(__dirname, "../data/fuels.json"),
    //             (err, fuelsData) => {
    //               if (err) {
    //                 console.log("Problem with load data from fuels.json");
    //               }
    //               FuelModel.insertMany(JSON.parse(fuelsData)).then(fuels => {
    //                 CountryModel.insertMany(JSON.parse(countriesData)).then(
    //                   countries => {
    //                     fs.readFile(
    //                       path.join(__dirname, "../data/companies.json"),
    //                       (err, data) => {
    //                         if (err) {
    //                           console.log(
    //                             "Problem with load data from companies.json"
    //                           );
    //                         }
    //                         CountryModel.findOne({ name: "PL" }).then(
    //                           poland => {
    //                             data = JSON.parse(data);
    //                             for (let i = 0; i < data.length; i++) {
    //                               data[i].country = poland._id;
    //                               if (
    //                                 data[i].vehicles &&
    //                                 data[i].vehicles.length !== 0
    //                               ) {
    //                                 for (
    //                                   let k = 0;
    //                                   k < data[i].vehicles.length;
    //                                   k++
    //                                 ) {
    //                                   data[i].vehicles[k].fuel = fuels[2]._id;
    //                                 }
    //                               }
    //                             }
    //                             CompanyModel.insertMany(data);
    //                           }
    //                         );
    //                       }
    //                     );
    //                   }
    //                 );
    //               });
    //             }
    //           );
    //         }
    //       );
    //     });
    //   });
    // });
  });
};
