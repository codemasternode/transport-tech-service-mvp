import mongoose, { Schema } from "mongoose";

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
<<<<<<< HEAD
    ref: "fuel"
=======
    ref: "fuel",
    required: true
>>>>>>> 2254e59d472b618a201ca487775dbb412e6fcd17
  },
  valueOfTruck: {
    type: Number,
    required: true
  },
  blankJourneys: {
    type: Number,
    required: true
  }
});

export default VehicleSchema;
