"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var FuelSchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true,
    "default": "l/100km"
  },
  date: {
    type: Date,
    required: true,
    "default": new Date()
  }
});

var _default = _mongoose["default"].model("fuel", FuelSchema);

exports["default"] = _default;
//# sourceMappingURL=fuel.js.map