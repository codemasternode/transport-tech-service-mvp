import mongoose from "mongoose";
import accountTypes from "../enums/accountTypes";

const UserSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(value);
      },
      message: props => `${props.value} is not a valid email`
    },
    maxlength: 50
  },
  accountType: {
    type: String,
    enum: accountTypes
  }
});

export default mongoose.model("user", UserSchema);
