import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import CountryModel from "../models/country";
import CompanyModel from "../models/company";

export default URI => {
  mongoose.connect(URI, { useNewUrlParser: true }, err => {
    if (err) {
      throw new Error(`Error while trying to connect MongoDB ${err}`);
    }
    console.log(`Connected to MongoDB on port ${URI}`);
    CountryModel.deleteMany({}).then(() => {
      CompanyModel.deleteMany({}).then(() => {
        fs.readFile(
          path.join(__dirname, "../data/countries.json"),
          (err, data) => {
            if (err) {
              console.log("Problem with load data from countries.json");
            }
            CountryModel.insertMany(JSON.parse(data)).then(() => {
              fs.readFile(
                path.join(__dirname, "../data/companies.json"),
                (err, data) => {
                  if (err) {
                    console.log("Problem with load data from companies.json");
                  }
                  CountryModel.findOne({ name: "PL" }).then(poland => {
                    data = JSON.parse(data);
                    for (let i = 0; i < data.length; i++) {
                      data[i].country = poland._id;
                    }
                    CompanyModel.insertMany(data);
                  });
                }
              );
            });
          }
        );
      });
    });
  });
};
