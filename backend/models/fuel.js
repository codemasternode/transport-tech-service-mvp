import mongoose from "mongoose";

const FuelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
<<<<<<< HEAD
      type: Number,
      required: true
=======
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true,
    default: "l/100km"
>>>>>>> 2254e59d472b618a201ca487775dbb412e6fcd17
  }
});

export default mongoose.model("fuel", FuelSchema);
