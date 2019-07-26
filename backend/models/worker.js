import mongoose from "mongoose";
import typesofReturn from "../enums/typeOfReturn";

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
  returnValue: {
    type: Number,
    required: true
  },
  typeOfReturn: {
    type: String,
    enum: typesofReturn
  },
  returnedValue: {
    type: Number,
    required: true,
    default: 0
  }
});

export default WorkerSchema;
