import mongoose from "mongoose";

const FuelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true,
    default: "l/100km"
  },
  date: {
    type: Date,
    required: true,
    default: new Date()
  }
});

export default mongoose.model("fuel", FuelSchema);
