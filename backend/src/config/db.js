import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import uuid from "uuid/v1";
import { loadData } from "../services/loadData";
import Company from "../models/company";
import CompanyBase from "../models/companyBase";
import Country from "../models/country";
import Vehicle from "../models/vehicle";
import User from "../models/user";
import Palette from "../models/palletes";
import TollRoad from "../models/tollRoads";
import Diets from "../models/diets";
import Axios from "axios";

export default async URI => {
  const dbOptions = {
    poolSize: 4,
    useNewUrlParser: true,
    useUnifiedTopology: true
  };

  mongoose.connect(`mongodb://localhost:27017/tt111`, dbOptions, err => {
    if (err) {
      throw new Error(`Error while trying to connect MongoDB ${err}`);
    }
    console.log(`Connected to MongoDB`);
  });

  const data = await loadData([
    "default/countries.json", //2
    "default/fuels.json", // 3
    "default/palettes.json", //5
    "default/tollRoads.json", //6
    "default/diets.json" //7
  ]);

  await Promise.all([
    Country.deleteMany({}),
    Vehicle.deleteMany({}),
    Company.deleteMany({}),
    CompanyBase.deleteMany({}),
    User.deleteMany({}),
    Palette.deleteMany({}),
    TollRoad.deleteMany({}),
    Diets.deleteMany({})
  ]);

  const diets = data[7];
  const ratesCallback = [];
  for (let i = 0; i < diets.length; i++) {
    ratesCallback.push(
      Axios(
        `https://api.exchangeratesapi.io/latest?base=${diets[i].currency}&symbols=PLN`
      )
    );
  }
  try {
    const rates = await Promise.all(
      ratesCallback.map(call => call.catch(e => e))
    );
    for (let g = 0; g < diets.length; g++) {
      let isIniside = false;
      for (let i = 0; i < rates.length; i++) {
        if (
          rates[i].status === 200 &&
          rates[i].data.base === diets[g].currency
        ) {
          diets[g].dietValueInPLN = Math.ceil(
            rates[i].data.rates.PLN * diets[g].dietValue
          );
          diets[g].nightLimitValueInPLN = Math.ceil(
            rates[i].data.rates.PLN * diets[g].nightLimitValue
          );
          isIniside = true;
        }
      }
      if (!isIniside) {
        diets[g].dietValueInPLN = 0;
        diets[g].nightLimitValueInPLN = 0;
      }
    }
    Diets.create(diets);
  } catch (err) {
    console.log(err);
  }
  const nearestCountry = [
    "Poland",
    "Germany",
    "France",
    "UK",
    "Czechia",
    "Switzerland",
    "Slovenia",
    "Slovakia",
    "Latvia"
  ];
  const nearestCountrySaved = [];
  const [savedPalettes] = await Promise.all([Palette.create(data[5])]);
  const [savedCountries] = await Promise.all([Country.create(data[2])]);
  const [savedTollRoads] = await Promise.all([TollRoad.create(data[6])]);
  for (let h = 0; h < savedCountries.length; h++) {
    if (nearestCountry.includes(savedCountries[h].countryCode)) {
      nearestCountrySaved.push(savedCountries[h].countryCode);
    }
  }

  //const emissionsLevel = ["EURO 2", "EURO 3", "EURO 4", "EURO 5"];

  for (let i = 0; i < companies.length; i++) {
    const PL = await Country.findOne({ countryCode: "PL" });
    companies[i].country = PL;
    companies[i].countries = nearestCountry;
    await Company.create(companies[i]);
  }
};
