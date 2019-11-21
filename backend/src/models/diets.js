import mongoose from "mongoose";

const dietSchema = new mongoose.Schema({
  dietValue: {
    type: Number,
    required: true
  },
  nightLimitValue: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "EUR",
    required: true
  },
  countryName: {
    type: String,
    required: true
  },
  dietValueInPLN: {
    type: Number,
    required: true
  },
  nightLimitValueInPLN: {
    type: Number,
    required: true
  }
});

export default mongoose.model("diets", dietSchema);
