import mongoose, { Schema, mongo } from "mongoose";

const VehicleSchema = new mongoose.Schema({
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
    type: Number
  },
  volume: {
    type: Number
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
  fuel: {
    type: Schema.Types.ObjectId,
    ref: "fuel",
    required: true
  },
  valueOfTruck: {
    type: Number,
    required: true
  },
  blankJourneys: {
    type: Number,
    required: true,
    default: 10
  },
  type: {
    type: String,
    required: true
  }
});

export default mongoose.model("vehicle", VehicleSchema);
