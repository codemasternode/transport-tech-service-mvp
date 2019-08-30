import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { loadData } from "../services/loadData";
import Company from "../models/company";
import CompanyBase from "../models/companyBase";
import Fuel from "../models/fuel";
import Country from "../models/country";
import Vehicle from "../models/vehicle";

export default async URI => {
  mongoose.connect(URI, { useNewUrlParser: true, replicaSet: "rs0" }, err => {
    if (err) {
      throw new Error(`Error while trying to connect MongoDB ${err}`);
    }
    console.log(`Connected to MongoDB on port ${URI}`);
  });

  // const data = await loadData([
  //   "mockData/companies.json", //0
  //   "mockData/vehicles.json", // 1
  //   "mockData/companyBases.json", //2
  //   "default/countries.json", //3
  //   "default/fuels.json" // 4
  // ]);

  // await Promise.all([
  //   Country.deleteMany({}),
  //   Fuel.deleteMany({}),
  //   Vehicle.deleteMany({}),
  //   Company.deleteMany({}),
  //   CompanyBase.deleteMany({})
  // ]);

  // const [savedCountries, savedFuels] = await Promise.all([
  //   Country.insertMany(data[3]),
  //   Fuel.insertMany(data[4])
  // ]);

  // const vehicles = data[1];
  // for (let i = 0; i < vehicles.length; i++) {
  //   vehicles[i].fuel = savedFuels[2];
  // }
  // const savedVehicles = await Vehicle.insertMany(vehicles);

  // const companyBases = data[2];
  // for (let i = 0; i < companyBases.length; i++) {
  //   companyBases[i].country = savedCountries[0]._id;
  // }
  // companyBases[0].vehicles = savedVehicles;
  // companyBases[1].vehicles = [savedVehicles[0]]
  // const savedCompanyBases = await CompanyBase.insertMany(companyBases);
  // const companies = data[0];

  // for (let i = 0; i < companies.length; i++) {
  //   companies[i].country = savedCountries[0]._id;
  //   companies[i].countries = [savedCountries[0]._id, savedCountries[1]._id];
  // }
  // companies[0].companyBases = [savedCompanyBases[0],savedCompanyBases[3],savedCompanyBases[4]];
  // companies[1].companyBases = [savedCompanyBases[2], savedCompanyBases[1]]
  // await Company.insertMany(companies);
};
