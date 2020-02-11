import mongoose from "mongoose";

const CountrySchema = new mongoose.Schema({
  countryName: {
    type: String,
    required: true,
    default: "PL"
  },
  countryCode: {
    type: String,
    required: true,
    default: "Poland"
  }
});

export default mongoose.model("country", CountrySchema);
