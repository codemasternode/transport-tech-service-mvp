"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var CountrySchema = new _mongoose["default"].Schema({
  countryName: {
    type: String,
    required: true,
    "default": "PL"
  },
  countryCode: {
    type: String,
    required: true,
    "default": "Poland"
  }
});

var _default = _mongoose["default"].model("country", CountrySchema);

exports["default"] = _default;
//# sourceMappingURL=country.js.map