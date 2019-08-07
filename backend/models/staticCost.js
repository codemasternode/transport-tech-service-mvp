import mongoose from "mongoose";
import frequencyTypes from "../enums/frequencyType";
<<<<<<< HEAD
import typesofReturn from "../enums/typeOfReturn";
=======
>>>>>>> 2254e59d472b618a201ca487775dbb412e6fcd17

const StaticCostSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  value: {
    type: Number,
    required: true
  },
  frequency: {
    type: String,
    required: true,
    enum: frequencyTypes
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

export default StaticCostSchema
