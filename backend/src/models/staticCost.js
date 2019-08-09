import mongoose from "mongoose";
import frequencyTypes from "../enums/frequencyType";

const StaticCostSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  value: {
    type: Number,
    required: true
  },
  frequency: {
    type: String,
    required: true,
    enum: frequencyTypes
  },
  returnedValue: {
    type: Number,
    required: true,
    default: 0
  }
});

export default StaticCostSchema
