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
    "mockData/companies.json", //0
    "mockData/companyBases.json", //1
    "default/countries.json", //2
    "default/fuels.json", // 3
    "mockData/users.json", //4
    "default/palettes.json" //5
  ]);

  // await Promise.all([
  //   Country.deleteMany({}),
  //   Vehicle.deleteMany({}),
  //   Company.deleteMany({}),
  //   CompanyBase.deleteMany({}),
  //   User.deleteMany({}),
  //   Palette.deleteMany({})
  // ]);

  // const nearestCountry = [
  //   "Poland",
  //   "Germany",
  //   "France",
  //   "UK",
  //   "Czechia",
  //   "Switzerland",
  //   "Slovenia",
  //   "Slovakia",
  //   "Latvia"
  // ];
  // const nearestCountrySaved = [];
  // const [savedPalettes] = await Promise.all([Palette.create(data[5])]);
  // const [savedCountries] = await Promise.all([Country.create(data[2])]);
  // for (let h = 0; h < savedCountries.length; h++) {
  //   if (nearestCountry.includes(savedCountries[h].countryCode)) {
  //     nearestCountrySaved.push(savedCountries[h].countryCode);
  //   }
  // }
  // const vehiclesTypes = [
  //   () => {
  //     return {
  //       type: "Mega",
  //       combustion: Math.floor(Math.random() * 6 + 30),
  //       capacity: Math.floor(Math.random() * 3 + 22),
  //       dimensions: {
  //         length: Math.floor(Math.random() * 2 + 12),
  //         width: Number((Math.random() * 0.2 + 2.2).toFixed(2)),
  //         height: Number((Math.random() * 0.2 + 2.9).toFixed(2))
  //       },
  //       deprecationPerYear:
  //         ((Math.random() * 0.1 + 0.1) * 100).toFixed(0) / 100,
  //       valueOfTruck: Math.floor(Math.random() * 150000 + 100000),
  //       range: {
  //         maxRange: Math.floor(Math.random() * 1000 + 2400),
  //         minRange: Math.floor(Math.random() * 25)
  //       },
  //       margin: Math.floor(Math.random() * 20 + 10),
  //       averageDistancePerMonth: Math.floor(Math.random() * 2500 + 9000),
  //       monthCosts: 15000,
  //       salary: Math.floor(Math.random() * 2000 + 5000),
  //       countries: nearestCountry
  //     };
  //   },
  //   () => {
  //     return {
  //       type: "Plandeka",
  //       countries: nearestCountry,
  //       combustion: Math.floor(Math.random() * 5 + 10),
  //       capacity: Math.floor(Math.random() * 7 + 3),
  //       dimensions: {
  //         length: Math.floor(Math.random() * 2 + 6),
  //         width: Number((Math.random() * 0.2 + 2).toFixed(2)),
  //         height: Number((Math.random() * 0.2 + 2).toFixed(2))
  //       },
  //       deprecationPerYear:
  //         ((Math.random() * 0.1 + 0.12) * 100).toFixed(0) / 100,
  //       valueOfTruck: Math.floor(Math.random() * 80000 + 30000),
  //       range: {
  //         maxRange: Math.floor(Math.random() * 1000 + 2400),
  //         minRange: Math.floor(Math.random() * 10)
  //       },
  //       margin: Math.floor(Math.random() * 25 + 10),
  //       averageDistancePerMonth: Math.floor(Math.random() * 2000 + 6000),
  //       monthCosts: 8000,
  //       salary: Math.floor(Math.random() * 1000 + 3500)
  //     };
  //   },
  //   () => {
  //     return {
  //       type: "Coilmulde",
  //       countries: nearestCountry,
  //       combustion: Math.floor(Math.random() * 6 + 30),
  //       capacity: Math.floor(Math.random() * 3 + 22),
  //       dimensions: {
  //         length: Math.floor(Math.random() * 2 + 12),
  //         width: Number((Math.random() * 0.2 + 2.2).toFixed(2)),
  //         height: Number((Math.random() * 0.2 + 2.9).toFixed(2))
  //       },
  //       deprecationPerYear:
  //         ((Math.random() * 0.1 + 0.1) * 100).toFixed(0) / 100,
  //       valueOfTruck: Math.floor(Math.random() * 150000 + 100000),
  //       range: {
  //         maxRange: Math.floor(Math.random() * 1000 + 2400),
  //         minRange: Math.floor(Math.random() * 25)
  //       },
  //       margin: Math.floor(Math.random() * 20 + 10),
  //       averageDistancePerMonth: Math.floor(Math.random() * 2500 + 9000),
  //       monthCosts: 17000,
  //       salary: Math.floor(Math.random() * 2000 + 5500)
  //     };
  //   }
  // ];
  // const companies = data[0];
  // const companyBases = data[1];

  // for (let i = 0; i < companies.length; i++) {
  //   companies[i].companyBases = [];
  //   let counter = 0;
  //   for (let g = 0; g < companyBases.length; g++) {
  //     if (companies[i].nameOfCompany === companyBases[g].nameOfCompany) {
  //       counter++;
  //     }
  //   }
  //   let sumKmPerMonth = 0;
  //   let sumCostPerMonth = 0;
  //   const vehiclesToCopy = [];
  //   const countCB = 0;
  //   const count = 0;

  //   for (let k = 0; k < companyBases.length; k++) {
  //     if (companies[i].nameOfCompany === companyBases[k].nameOfCompany) {
  //       companyBases[k].vehicles = [];
  //       for (
  //         let m = 0;
  //         m < Math.floor(companies[i].plan.vehicles / (counter + 1));
  //         m++
  //       ) {
  //         const d = Math.random();
  //         const prepareVehicle = {
  //           name: `Truck ${uuid()}`,
  //           ...vehiclesTypes[d < 0.5 ? 1 : d < 0.9 ? 0 : 2](),
  //           fuel: {
  //             ...data[3][Math.floor(Math.random() * 4)],
  //             date: new Date()
  //           }
  //         };
  //         sumKmPerMonth += prepareVehicle.averageDistancePerMonth;
  //         sumCostPerMonth += prepareVehicle.monthCosts;
  //         const vehicle = await Vehicle.create(prepareVehicle);
  //         companyBases[k].vehicles.push(vehicle);
  //         if (m === 0 || (m === 1 && countCB <= 1)) {
  //           vehiclesToCopy.push(vehicle);
  //           countCB += 1;
  //         }
  //       }
  //       if (!companyBases[k].vehicles) {
  //         companyBases[k].vehicles = [];
  //       }

  //       if (count > 0) {
  //         companyBases[k].vehicles.push.apply(companyBases[k].vehicles, [
  //           ...vehiclesToCopy
  //         ]);
  //       }
  //       const companyBase = await CompanyBase.create(companyBases[k]);
  //       companies[i].companyBases.push(companyBase);
  //       count++;
  //     }
  //   }

  //   const PL = await Country.findOne({ countryCode: "PL" });
  //   companies[i].country = PL;
  //   companies[i].countries = nearestCountry;
  //   companies[i].sumKmPerMonth = sumKmPerMonth;
  //   companies[i].sumCostPerMonth = sumCostPerMonth;
  //   const distinctVehicles = [];

  //   for (let m = 0; m < companies[i].companyBases.length; m++) {
  //     for (let k = 0; k < companies[i].companyBases[m].vehicles.length; k++) {
  //       let isInside = false;
  //       for (let g = 0; g < distinctVehicles.length; g++) {
  //         if (
  //           distinctVehicles[g].toString() ==
  //           companies[i].companyBases[m].vehicles[k]._id.toString()
  //         ) {
  //           isInside = true;
  //         }
  //       }
  //       if (!isInside) {
  //         distinctVehicles.push(companies[i].companyBases[m].vehicles[k]._id);
  //       }
  //     }
  //   }
  //   await Vehicle.update(
  //     {
  //       _id: {
  //         $in: distinctVehicles
  //       }
  //     },
  //     {
  //       $set: {
  //         sumKmPerMonth,
  //         sumCostPerMonth
  //       }
  //     },
  //     { multi: true }
  //   );
  //   await Company.create(companies[i]);
  // }
};
