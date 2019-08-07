import mongoose, { Schema } from "mongoose";

const TemporaryDataSchema = new Schema({
  data: {
    type: Object
  },
  destroyDate: {
    type: Date,
    required: true
  }
});

TemporaryDataSchema.pre("init", function(doc) {
  if (!doc.destroyDate && doc.destroyDate < new Date()) {
    let date = new Date();
    date.setDate(date.getDate() + 1);
    doc.destroyDate = date;
  }
});

export default mongoose.model("temporaryData", TemporaryDataSchema);
