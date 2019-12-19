import mongoose from "mongoose";

const PalleteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
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
  },
  totalWeight: {
    type: Number,
    required: true
  }
});

export default mongoose.model("pallete", PalleteSchema);
