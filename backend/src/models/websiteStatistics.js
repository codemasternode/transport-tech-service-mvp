import mongoose, { Schema } from "mongoose";

const WebsiteStatsSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  visits: [
    {
      type: Date,
      required: true
    }
  ]
});

export default mongoose.model("websiteStats", WebsiteStatsSchema);
