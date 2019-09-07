import mongoose from "mongoose";
import accountTypes from "../enums/accountTypes";
import bcrypt from "bcryptjs";

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
    unique: true,
    validate: {
      validator: function(value) {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,12})?$/;
        return emailRegex.test(value);
      },
      message: props => `${props.value} is not a valid email`
    },
    maxlength: 50
  },
  accountType: {
    type: String,
    enum: accountTypes,
    default: "user",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};

UserSchema.pre("save", function(next) {
  const user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

export default mongoose.model("user", UserSchema);
