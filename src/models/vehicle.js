import mongoose, { Schema } from "mongoose";

const VehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50
    },
    combustion: {
      type: Number,
      required: true,
      default: 20,
      min: 1
    },
    capacity: {
      type: Number,
      required: true
    },
    dimensions: {
      length: {
        type: Number,
        required: true
      },
      width: {
        type: Number,
        required: true
      },
      height: {
        type: Number,
        required: true
      }
    },
    deprecationPerYear: {
      type: Number,
      required: true
    },
    valueOfTruck: {
      type: Number,
      required: true
    },
    averageDistancePerMonth: {
      type: Number,
      required: true,
      min: 0
    },
    range: {
      maxRange: {
        type: Number
      },
      minRange: {
        type: Number,
        default: 0
      },
      operationRange: {
        type: Number,
        default: 600
      }
    },
    margin: {
      type: Number,
      required: true,
      min: 0
    },
    waitingTimeParams: {
      maxFreeTime: {
        type: Number,
        min: 0
      },
      pricePerHourWaiting: {
        type: Number,
        min: 0
      }
    },
    fuel: {
      name: {
        type: String,
        required: true,
        enum: ["Olej napędowy", "Olej napędowy +", "Benzyna Pb95", "Benzyna Pb98"]
      },
      price: {
        type: Number,
        required: true
      },
      unit: {
        type: String,
        required: true,
        default: "l/100km"
      },
      date: {
        type: Date,
        required: true,
        default: new Date()
      }
    },
    countries: [
      {
        type: String
      }
    ],
    sumKmPerMonth: {
      type: Number,
      default: 0
    },
    sumCostPerMonth: {
      type: Number,
      default: 0
    },
    monthCosts: {
      type: Number,
      default: 0
    },
    salary: {
      type: Number,
      default: 0
    },
    numberOfAxles: {
      type: Number,
      default: 4
    },
    emissionLevel: {
      type: String,
      default: "EURO 5",
      enum: ["EURO 6", "EURO 5", "EURO 4", "EURO 3", "EURO 2", "EURO"]
    },
    permissibleGrossWeight: {
      type: Number,
      required: true
    },
    companyBases: [
      {
        type: Object
      }
    ]
  },
  { strict: false }
);

export default mongoose.model("vehicle", VehicleSchema);
