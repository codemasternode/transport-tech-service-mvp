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
import Invite from '../models/invites'
import Axios from "axios";
import Fuel from "../models/fuel";

export default URI => {
  const dbOptions = {
    poolSize: 4,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    replicaSet: "rs0"
  };
  mongoose.promise = global.promise
  mongoose.connect(URI, dbOptions, async err => {
    if (err) {
      throw new Error(`Error while trying to connect MongoDB ${err}`);
    }
    console.log(`Connected to MongoDB`);
    const data = await loadData([
      "default/countries.json", //2
      "default/fuels.json", // 3
      "default/palettes.json", //5
      "default/tollRoads.json", //6
      "default/diets.json", //7
      "mockData/companies.json"
    ]);

    await Promise.all([
      Country.deleteMany({}),
      Vehicle.deleteMany({}),
      Company.deleteMany({}),
      CompanyBase.deleteMany({}),
      User.deleteMany({}),
      Palette.deleteMany({}),
      TollRoad.deleteMany({}),
      Diets.deleteMany({}),
      Invite.deleteMany({}),
      Fuel.deleteMany({})
    ]);

    const diets = data[4];
    const fuels = data[1]
    await Fuel.create(fuels)
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
    const [savedPalettes] = await Promise.all([Palette.create(data[2])]);
    const [savedCountries] = await Promise.all([Country.create(data[0])]);
    const [savedTollRoads] = await Promise.all([TollRoad.create(data[3])]);
    for (let h = 0; h < savedCountries.length; h++) {
      if (nearestCountry.includes(savedCountries[h].countryCode)) {
        nearestCountrySaved.push(savedCountries[h].countryCode);
      }
    }

    //const emissionsLevel = ["EURO 2", "EURO 3", "EURO 4", "EURO 5"];
    const companies = data[5]
    for (let i = 0; i < companies.length; i++) {
      const PL = await Country.findOne({ countryCode: "PL" });
      companies[i].country = PL;
      companies[i].confirmCode = "abc"
      companies[i].countries = nearestCountry;
      const distinctVehicles = []
      for (let k = 0; k < companies[i].companyBases.length; k++) {
        for (let m = 0; m < companies[i].companyBases[k].vehicles.length; m++) {
          let isInside = false
          for (let g = 0; g < distinctVehicles.length; g++) {
            if (distinctVehicles[g].name === companies[i].companyBases[k].vehicles[m].name) {
              isInside = true
            }
          }
          if (!isInside) {
            distinctVehicles.push(companies[i].companyBases[k].vehicles[m])
          }
        }
      }
      const savedVehicles = await Vehicle.create(distinctVehicles)
      for (let l = 0; l < savedVehicles.length; l++) {
        for (let k = 0; k < companies[i].companyBases.length; k++) {
          for (let m = 0; m < companies[i].companyBases[k].vehicles.length; m++) {
            if (savedVehicles[l].name === companies[i].companyBases[k].vehicles[m].name) {
              companies[i].companyBases[k].vehicles[m] = savedVehicles[l]
            }
          }
        }
      }
      const company = await Company.create(companies[i]);
      Invite.create({ code: "fff90210", from: company._id, to: "marcinwarzybok@outlook.com" })
      Invite.create({ code: "fff90211", from: company._id, to: "marcinwarzybok17@gmail.com" })
    }
  });

};
