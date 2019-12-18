"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _accountTypes = _interopRequireDefault(require("../enums/accountTypes"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var UserSchema = new _mongoose["default"].Schema({
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
      validator: function validator(value) {
        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,12})?$/;
        return emailRegex.test(value);
      },
      message: function message(props) {
        return "".concat(props.value, " is not a valid email");
      }
    },
    maxlength: 50
  },
  accountType: {
    type: String,
    "enum": _accountTypes["default"],
    "default": "user",
    required: true
  },
  createdAt: {
    type: Date,
    "default": Date.now()
  }
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  _bcryptjs["default"].compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) return next();

  _bcryptjs["default"].genSalt(10, function (err, salt) {
    if (err) return next(err);

    _bcryptjs["default"].hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

var _default = _mongoose["default"].model("user", UserSchema);

exports["default"] = _default;
//# sourceMappingURL=user.js.map