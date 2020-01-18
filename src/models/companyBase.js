import mongoose, { Schema } from "mongoose";
import frequencyTypes from "../enums/frequencyType";

const CompanyBaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  street: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: "String",
    required: true
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
  vehicles: {
    type: Array,
    required: true,
    default: []
  }
});

export default mongoose.model("companyBase", CompanyBaseSchema);
