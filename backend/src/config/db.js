import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import uuid from "uuid/v1";
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
    "mockData/companyBases.json", //1
    "default/countries.json", //2
    "default/fuels.json", // 3
    "mockData/users.json" //4
  ]);

  await Promise.all([
    Country.deleteMany({}),
    Vehicle.deleteMany({}),
    Company.deleteMany({}),
    CompanyBase.deleteMany({}),
    User.deleteMany({})
  ]);

  const savedFuels = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start.getTime());
  end.setHours(23, 59, 59, 999);

  for (let i = 0; i < data[3].length; i++) {
    const fuel = await Fuel.findOne({
      name: data[3][i].name,
      date: {
        $gte: start,
        $lte: end
      }
    });
    if (!fuel) {
      const fuel = await Fuel.create(data[3][i]);
      savedFuels.push(fuel);
    } else {
      savedFuels.push(fuel);
    }
  }

  const [savedCountries, savedUsers] = await Promise.all([
    Country.create(data[2]),
    User.create(data[4])
  ]);

  const vehiclesTypes = [
    () => {
      return {
        type: "ciągnik z naczepą jumbo",
        dimensions: {
          length: Number((Math.random() * 4 + 13).toFixed(2)),
          width: Number((Math.random() * 2 + 2.3).toFixed(2)),
          height: Number((Math.random() * 1 + 2.5).toFixed(2))
        },
        deprecationPerYear: Math.floor(Math.random() * 5 + 10),
        valueOfTruck: Math.floor(Math.random() * 150000 + 80000),
        combustion: Math.floor(Math.random() * 4 + 30),
        capacity: Math.floor(Math.random() * 8 + 16),
        averageDistancePerMonth: Math.floor(Math.random() * 10000 + 14000),
        range: {
          minRange:
            Math.random() < 0.5 ? null : Math.floor(Math.random() * 15 + 5),
          maxRange:
            Math.random() < 0.3 ? null : Math.floor(Math.random() * 3000 + 6000)
        },
        margin: Math.floor(Math.random() * 5 + 6)
      };
    },
    () => {
      return {
        type: "ciągnik z naczepą duży tir",
        dimensions: {
          length: Number((Math.random() * 5 + 15).toFixed(2)),
          width: Number((Math.random() * 1 + 2.4).toFixed(2)),
          height: Number((Math.random() * 1 + 2.6).toFixed(2))
        },
        deprecationPerYear: Math.floor(Math.random() * 5 + 10),
        valueOfTruck: Math.floor(Math.random() * 150000 + 100000),
        combustion: Math.floor(Math.random() * 4 + 33),
        capacity: Math.floor(Math.random() * 6 + 20),
        averageDistancePerMonth: Math.floor(Math.random() * 10000 + 15000),
        range: {
          minRange:
            Math.random() < 0.5 ? null : Math.floor(Math.random() * 15 + 5),
          maxRange:
            Math.random() < 0.3 ? null : Math.floor(Math.random() * 3000 + 6000)
        },
        margin: Math.floor(Math.random() * 5 + 6)
      };
    },
    () => {
      return {
        type: "8 tonowa solówka",
        dimensions: {
          length: Number((Math.random() * 2 + 8).toFixed(2)),
          width: Number((Math.random() * 1 + 2.3).toFixed(2)),
          height: Number((Math.random() * 1 + 2.5).toFixed(2))
        },
        deprecationPerYear: Math.floor(Math.random() * 5 + 10),
        valueOfTruck: Math.floor(Math.random() * 35000 + 50000),
        combustion: Math.floor(Math.random() * 6 + 20),
        capacity: Math.floor(Math.random() * 1 + 7),
        averageDistancePerMonth: Math.floor(Math.random() * 4000 + 7000),
        range: {
          minRange:
            Math.random() < 0.8 ? null : Math.floor(Math.random() * 10 + 2),
          maxRange:
            Math.random() < 0.05 ? null : Math.floor(Math.random() * 1000 + 900)
        },
        margin: Math.floor(Math.random() * 7 + 8)
      };
    },
    () => {
      const volume = Math.floor(Math.random() * 5000 + 30000);
      return {
        type: `Cysterna ${Math.floor(volume / 100) * 100}`,
        dimensions: {
          length: Number((Math.random() * 2 + 8).toFixed(2)),
          width: Number((Math.random() * 1 + 2.3).toFixed(2)),
          height: Number((Math.random() * 1 + 2.5).toFixed(2))
        },
        deprecationPerYear: Math.floor(Math.random() * 5 + 10),
        valueOfTruck: Math.floor(Math.random() * 35000 + 50000),
        combustion: Math.floor(Math.random() * 6 + 20),
        volume,
        averageDistancePerMonth: Math.floor(Math.random() * 8000 + 7000),
        range: {
          minRange: Math.random() < 0.8 ? null : Math.floor(Math.random() * 4),
          maxRange:
            Math.random() < 0.05
              ? null
              : Math.floor(Math.random() * 3000 + 1000)
        },
        margin: Math.floor(Math.random() * 7 + 8)
      };
    }
  ];

  const companies = data[0];
  const companyBases = data[1];

  for (let i = 0; i < companies.length; i++) {
    companies[i].companyBases = [];
    let counter = 0;
    for (let g = 0; g < companyBases.length; g++) {
      if (companies[i].nameOfCompany === companyBases[g].nameOfCompany) {
        counter++;
      }
    }
    for (let k = 0; k < companyBases.length; k++) {
      if (companies[i].nameOfCompany === companyBases[k].nameOfCompany) {
        companyBases[k].vehicles = [];
        for (
          let m = 0;
          m < Math.floor(companies[i].plan.vehicles / (counter + 1));
          m++
        ) {
          const d = Math.random();
          const prepareVehicle = {
            name: `Truck ${uuid()}`,
            fuel: savedFuels[d < 0.4 ? 0 : d < 0.7 ? 1 : 2].name,
            ...vehiclesTypes[d < 0.5 ? 0 : d < 0.7 ? 1 : d < 0.8 ? 2 : 3]()
          };
          const vehicle = await Vehicle.create(prepareVehicle);
          companyBases[k].vehicles.push(vehicle);
        }
        const companyBase = await CompanyBase.create(companyBases[k]);
        companies[i].companyBases.push(companyBase);
      }
    }
    const PL = await Country.findOne({ name: "PL" });
    companies[i].country = PL;
    companies[i].countries = [PL];
    await Company.create(companies[i]);
  }
};
