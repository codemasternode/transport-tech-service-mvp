import mongoose from "mongoose";

const CountrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    default: "PL"
  }
});

export default mongoose.model("country", CountrySchema);
