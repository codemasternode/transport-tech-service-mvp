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
    type: Number,
    required: true,
    min: 1
  },
  dimensionsOfTheHold: {
    type: String,
    required: true
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
  }
});

export default mongoose.model("vehicle", VehicleSchema);
