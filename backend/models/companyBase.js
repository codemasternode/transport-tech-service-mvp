import mongoose, { Schema } from "mongoose";
import frequencyTypes from "../enums/frequencyType";
import VehicleSchema from "./vehicle";

const CompanyBaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  street: {
    type: Number,
    required: true
  },
  postalCode: {
    type: String,
    required: true,
    enum: frequencyTypes
  },
  city: {
    type: Number,
    required: true
  },
  country: {
    type: Schema.Types.ObjectId,
    ref: "country"
  },
  location: {
    lng: {
      type: Number,
      min: -180,
      max: 180
    },
    lat: {
      type: Number,
      min: -90,
      max: 90
    }
  },
  vehicles: [VehicleSchema]
});

export default CompanyBaseSchema;
