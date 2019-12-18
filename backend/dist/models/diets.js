"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var dietSchema = new _mongoose["default"].Schema({
  dietValue: {
    type: Number,
    required: true
  },
  nightLimitValue: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    "default": "EUR",
    required: true
  },
  countryName: {
    type: String,
    required: true
  },
  dietValueInPLN: {
    type: Number,
    required: true
  },
  nightLimitValueInPLN: {
    type: Number,
    required: true
  }
});

var _default = _mongoose["default"].model("diets", dietSchema);

exports["default"] = _default;
//# sourceMappingURL=diets.js.map