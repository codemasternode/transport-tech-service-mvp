"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _planTypes = _interopRequireDefault(require("../enums/planTypes"));

var _staticCost = _interopRequireDefault(require("./staticCost"));

var _companyBase = _interopRequireDefault(require("./companyBase"));

var _worker = _interopRequireDefault(require("./worker"));

var _country = _interopRequireDefault(require("./country"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var CompanySchema = new _mongoose["default"].Schema({
  logo: {
    type: String
  },
  nameOfCompany: {
    type: _mongoose.Schema.Types.String,
    required: [true, "the company name can not be empty"]
  },
  name: {
    type: _mongoose.Schema.Types.String,
    required: [true, "name can not be empty"],
    minlength: 2,
    maxlength: 50
  },
  surname: {
    type: _mongoose.Schema.Types.String,
    required: [true, "surname can not be empty"],
    minlength: 2,
    maxlength: 50
  },
  phone: {
    type: _mongoose.Schema.Types.String,
    required: true
  },
  taxNumber: {
    type: _mongoose.Schema.Types.String,
    required: [true, "unique tax number can not be empty"],
    minlength: 6,
    maxlength: 20,
    trim: true
  },
  isSuspended: {
    type: _mongoose.Schema.Types.Boolean,
    required: [true, "suspended can not be empty"],
    "default": false
  },
  place: {
    type: _mongoose.Schema.Types.String,
    required: true
  },
  isVat: {
    type: _mongoose.Schema.Types.Boolean,
    required: true,
    "default": true
  },
  email: {
    type: _mongoose.Schema.Types.String,
    required: [true, "email can not be empty"],
    validate: {
      validator: function validator(value) {
        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(value);
      },
      message: function message(props) {
        return "".concat(props.value, " is not a valid email");
      }
    },
    maxlength: 50,
    unique: true
  },
  endDateSubscription: {
    type: Date
  },
  isPaid: {
    type: _mongoose.Schema.Types.Boolean,
    "default": false,
    required: true
  },
  createdAt: {
    type: Date,
    "default": Date.now()
  },
  country: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "country",
    required: true
  },
  countries: [{
    type: String
  }],
  users: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: "user"
  }],
  staticCosts: [_staticCost["default"]],
  workers: [_worker["default"]],
  companyBases: {
    type: Array,
    "default": []
  },
  isConfirmed: {
    type: Boolean,
    "default": false,
    required: true
  },
  plan: {
    type: Object
  },
  sumKmPerMonth: {
    type: Number,
    "default": 0
  },
  sumCostsPerMonth: {
    type: Number,
    "default": 0
  },
  statistics: [Date]
}, {
  strict: false
});

var _default = _mongoose["default"].model("company", CompanySchema);

exports["default"] = _default;
//# sourceMappingURL=company.js.map