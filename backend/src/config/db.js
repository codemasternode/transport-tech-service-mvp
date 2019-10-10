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

  const semiTrailers = [
    "Chłodnia",
    "Firanka",
    "Wywrotka",
    "Cysterna chemiczna",
    "Cysterna gazowa",
    "Cysterna paliwowa",
    "Silos",
    "Platforma",
    "Niskopodwoziowy",
    "Mega"
  ];

  const vehiclesTypes = [
    () => {
      let los = Math.random();
      let additional = {};
      if (Math.random() < 0.8) {
        additional.maxFreeTime = Math.floor(Math.random() * 12);
        additional.pricePerHourWaiting = Math.floor(Math.random() * 30 + 20);
      }

      return {
        type: los < 0.7 ? semiTrailers[1] : semiTrailers[0],
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
        margin: Math.floor(Math.random() * 5 + 6),
        waitingTimeParams: additional
      };
    },
    () => {
      let additional = {};
      if (Math.random() < 0.8) {
        additional.maxFreeTime = Math.floor(Math.random() * 12);
        additional.pricePerHourWaiting = Math.floor(Math.random() * 30 + 20);
      }
      return {
        type: semiTrailers[9],
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
        margin: Math.floor(Math.random() * 5 + 6),
        waitingTimeParams: additional
      };
    },
    () => {
      let los = Math.random();
      let additional = {};
      if (Math.random() < 0.8) {
        additional.maxFreeTime = Math.floor(Math.random() * 12);
        additional.pricePerHourWaiting = Math.floor(Math.random() * 30 + 20);
      }
      return {
        type:
          los < 0.2
            ? semiTrailers[0]
            : los < 0.5
              ? semiTrailers[1]
              : semiTrailers[2],
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
        margin: Math.floor(Math.random() * 7 + 8),
        waitingTimeParams: additional
      };
    },
    () => {
      let los = Math.random();
      let additional = {};
      if (Math.random() < 0.8) {
        additional.maxFreeTime = Math.floor(Math.random() * 12);
        additional.pricePerHourWaiting = Math.floor(Math.random() * 30 + 20);
      }
      const volume = Math.floor(Math.random() * 5000 + 30000);
      return {
        type:
          los < 0.1
            ? semiTrailers[3]
            : los < 0.2
              ? semiTrailers[4]
              : los < 0.7
                ? semiTrailers[5]
                : semiTrailers[6],
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
        margin: Math.floor(Math.random() * 7 + 8),
        waitingTimeParams: additional
      };
    },
    () => {
      let los = Math.random();
      let additional = {};
      if (Math.random() < 0.8) {
        additional.maxFreeTime = Math.floor(Math.random() * 12);
        additional.pricePerHourWaiting = Math.floor(Math.random() * 30 + 20);
      }
      return {
        type: los < 0.4 ? semiTrailers[7] : semiTrailers[8],
        dimensions: {
          length: Number((Math.random() * 5 + 15).toFixed(2)),
          width: Number((Math.random() * 1 + 3.2).toFixed(2)),
          height: Number((Math.random() * 3 + 2.6).toFixed(2))
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
        margin: Math.floor(Math.random() * 5 + 6),
        waitingTimeParams: additional
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
    let sumAvgKmPerMonth = 0;
    let sumCostsPerMonth = 0;
    const vehiclesToCopy = [];
    const countCB = 0;
    const count = 0;

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
            ...vehiclesTypes[
              d < 0.5 ? 0 : d < 0.7 ? 1 : d < 0.8 ? 2 : d < 0.9 ? 3 : 4
            ]()
          };
          sumAvgKmPerMonth += prepareVehicle.averageDistancePerMonth;
          const vehicle = await Vehicle.create(prepareVehicle);
          companyBases[k].vehicles.push(vehicle);
          if (m === 0 || (m === 1 && countCB <= 1)) {
            vehiclesToCopy.push(vehicle);
            countCB += 1;
          }
        }
        if (!companyBases[k].vehicles) {
          companyBases[k].vehicles = [];
        }

        if (count > 0) {
          companyBases[k].vehicles.push.apply(companyBases[k].vehicles, [
            ...vehiclesToCopy
          ]);
        }
        const companyBase = await CompanyBase.create(companyBases[k]);
        companies[i].companyBases.push(companyBase);
        count++;
      }
    }

    const costs = [];
    for (let m = 0; m < companies[i].plan.vehicles; m++) {
      const d = Math.random();
      const cost = {
        name: `Cost ${uuid()}`,
        value: Math.floor(Math.random() * 100 + 300),
        returnedValue: 0
      };
      sumCostsPerMonth += cost.value;
      costs.push(cost);
    }

    for (let m = 0; m < companies[i].plan.companyBases; m++) {
      const d = Math.floor(Math.random() * 3 + 6);
      for (let g = 0; g < d; g++) {
        const cost = {
          name: `Cost ${uuid()}`,
          value: Math.floor(Math.random() * 1000 + 100),
          returnedValue: 0
        };
        sumCostsPerMonth += cost.value;
        costs.push(cost);
      }
    }
    const workers = [];
    for (let m = 0; m < Math.floor((companies[i].plan.vehicles * 3) / 4); m++) {
      const worker = {
        name: `Name ${uuid()}`,
        lastname: `Lastname ${uuid()}`,
        salary: Math.floor(Math.random() * 2000 + 3000),
        jobName: `Job Name ${uuid()}`
      };
      workers.push(worker);
      sumCostsPerMonth += worker.salary;
    }

    for (let m = 0; m < companies[i].plan.companyBases; m++) {
      for (
        let j = 0;
        j <
        Math.floor(
          (companies[i].plan.vehicles * 3) /
          4 /
          Math.floor(Math.random() * 7 + 5)
        );
        j++
      ) {
        const worker = {
          name: `Name ${uuid()}`,
          lastname: `Lastname ${uuid()}`,
          salary: Math.floor(Math.random() * 1000 + 2500),
          jobName: `Job Name ${uuid()}`
        };
        workers.push(worker);
        sumCostsPerMonth += worker.salary;
      }
    }

    const PL = await Country.findOne({ name: "PL" });
    companies[i].country = PL;
    companies[i].countries = [PL];
    companies[i].staticCosts = costs;
    companies[i].sumAvgKmPerMonth = sumAvgKmPerMonth;
    companies[i].sumCostsPerMonth = sumCostsPerMonth;
    companies[i].workers = workers;
    await Company.create(companies[i]);
  }
};
