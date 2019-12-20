import mongoose from "mongoose";

const TollRoadSchema = new mongoose.Schema(
  {
    nameOfRoad: {
      required: true,
      type: String
    },
    route: {
      type: Array,
      required: true
    }
  },
  { strict: false }
);

export default mongoose.model("tollRoad", TollRoadSchema);
