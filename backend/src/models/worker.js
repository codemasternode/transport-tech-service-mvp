import mongoose from "mongoose";

const WorkerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  lastname: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  salary: {
    type: Number,
    required: true
  },
  returnedValue: {
    type: Number,
    required: true,
    default: 0
  },
  jobName: {
    type: String,
    default: "driver",
    enum: ["driver", "service"]
  }
});

export default WorkerSchema;
