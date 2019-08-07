import mongoose from "mongoose";

const FuelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
      type: Number,
      required: true
  }
});

export default mongoose.model("fuel", FuelSchema);
