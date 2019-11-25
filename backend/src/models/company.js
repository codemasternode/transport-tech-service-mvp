import mongoose, { Schema } from "mongoose";
import planTypes from "../enums/planTypes";
import StaticCostSchema from "./staticCost";
import CompanyBaseSchema from "./companyBase";
import WorkerSchema from "./worker";
import CountryModel from "./country";

const CompanySchema = new mongoose.Schema(
  {
    companyLogo: {
      type: String
    },
    nameOfCompany: {
      type: Schema.Types.String,
      required: [true, "the company name can not be empty"]
    },
    name: {
      type: Schema.Types.String,
      required: [true, "name can not be empty"],
      minlength: 2,
      maxlength: 50
    },
    surname: {
      type: Schema.Types.String,
      required: [true, "surname can not be empty"],
      minlength: 2,
      maxlength: 50
    },
    taxNumber: {
      type: Schema.Types.String,
      required: [true, "unique tax number can not be empty"],
      minlength: 6,
      maxlength: 20,
      trim: true
    },
    isSuspended: {
      type: Schema.Types.Boolean,
      required: [true, "suspended can not be empty"],
      default: false
    },
    email: {
      type: Schema.Types.String,
      required: [true, "email can not be empty"],
      validate: {
        validator: function(value) {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        },
        message: props => `${props.value} is not a valid email`
      },
      maxlength: 50,
      unique: true
    },
    endDateSubscription: {
      type: Date
    },
    isPaid: {
      type: Schema.Types.Boolean,
      default: false,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    country: {
      type: Schema.Types.ObjectId,
      ref: "country",
      required: true
    },
    countries: [
      {
        type: String
      }
    ],
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "user"
      }
    ],
    staticCosts: [StaticCostSchema],
    workers: [WorkerSchema],
    companyBases: {
      type: Array,
      default: []
    },
    isConfirmed: {
      type: Boolean,
      default: false,
      required: true
    },
    plan: {
      type: Object
    },
    sumKmPerMonth: {
      type: Number,
      default: 0
    },
    sumCostsPerMonth: {
      type: Number,
      default: 0
    },
    statistics: [Date]
  },
  { strict: false }
);

export default mongoose.model("company", CompanySchema);
