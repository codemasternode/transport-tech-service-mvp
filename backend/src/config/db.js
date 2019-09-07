import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { loadData } from "../services/loadData";
import Company from "../models/company";
import CompanyBase from "../models/companyBase";
import Fuel from "../models/fuel";
import Country from "../models/country";
import Vehicle from "../models/vehicle";
import User from "../models/user";

export default async URI => {
  const dbOptions = {
    poolSize: 4,
    useNewUrlParser: true
  };

  mongoose.connect(URI, dbOptions, err => {
    if (err) {
      throw new Error(`Error while trying to connect MongoDB ${err}`);
    }
    console.log(`Connected to MongoDB`);
  });

  const data = await loadData([
    "mockData/companies.json", //0
    "mockData/vehicles.json", // 1
    "mockData/companyBases.json", //2
    "default/countries.json", //3
    "default/fuels.json", // 4
    "mockData/users.json" //5
  ]);

  // await Promise.all([
  //   Country.deleteMany({}),
  //   Fuel.deleteMany({}),
  //   Vehicle.deleteMany({}),
  //   Company.deleteMany({}),
  //   CompanyBase.deleteMany({}),
  //   User.deleteMany({})
  // ]);

  // const [savedCountries, savedFuels, savedUsers] = await Promise.all([
  //   Country.create(data[3]),
  //   Fuel.create(data[4]),
  //   User.create(data[5])
  // ]);

  // const vehicles = data[1];
  // for (let i = 0; i < vehicles.length; i++) {
  //   vehicles[i].fuel = savedFuels[2];
  // }
  // const savedVehicles = await Vehicle.create(vehicles);

  // const companyBases = data[2];
  // for (let i = 0; i < companyBases.length; i++) {
  //   companyBases[i].country = savedCountries[0]._id;
  // }

  // companyBases[0].vehicles = [
  //   savedVehicles[1],
  //   savedVehicles[2],
  //   savedVehicles[3]
  // ];

  // companyBases[3].vehicles = [savedVehicles[1], savedVehicles[2]];
  // companyBases[1].vehicles = [savedVehicles[0]];
  // companyBases[2].vehicles = [savedVehicles[0]];
  // companyBases[5].vehicles = [savedVehicles[6]]

  // const savedCompanyBases = await CompanyBase.create(companyBases);
  // const companies = data[0];

  // for (let i = 0; i < companies.length; i++) {
  //   companies[i].country = savedCountries[0]._id;
  //   companies[i].countries = [savedCountries[0]._id, savedCountries[1]._id];
  // }
  // companies[0].companyBases = [
  //   savedCompanyBases[0],
  //   savedCompanyBases[3],
  //   savedCompanyBases[4]
  // ];
  // companies[1].companyBases = [savedCompanyBases[2], savedCompanyBases[1]];
  // companies[4].companyBases = [savedCompanyBases[5], savedCompanyBases[6]]

  // companies[0].users = [savedUsers[0], savedUsers[1], savedUsers[2]];
  // companies[1].users = [savedUsers[3]];

  
  // await Company.create(companies);
};
