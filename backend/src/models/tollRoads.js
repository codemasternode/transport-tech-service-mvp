import mongoose from "mongoose";

const TollRoadSchema = new mongoose.Schema(
  {
    nameOfRoads: {
      required: true,
      type: Array
    },
    route: {
      type: Array,
      required: true
    }
  },
  { strict: false }
);

export default mongoose.model("tollRoad", TollRoadSchema);
