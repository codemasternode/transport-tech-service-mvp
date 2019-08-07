import mongoose from "mongoose";
<<<<<<< HEAD
import typesofReturn from "../enums/typeOfReturn";
=======
>>>>>>> 2254e59d472b618a201ca487775dbb412e6fcd17

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
<<<<<<< HEAD
  returnValue: {
    type: Number,
    required: true
  },
  typeOfReturn: {
    type: String,
    enum: typesofReturn
  },
=======
>>>>>>> 2254e59d472b618a201ca487775dbb412e6fcd17
  returnedValue: {
    type: Number,
    required: true,
    default: 0
  }
});

export default WorkerSchema;
