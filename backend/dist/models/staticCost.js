"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _frequencyType = _interopRequireDefault(require("../enums/frequencyType"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var StaticCostSchema = new _mongoose["default"].Schema({
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
  returnedValue: {
    type: Number,
    required: true,
    "default": 0
  }
});
var _default = StaticCostSchema;
exports["default"] = _default;
//# sourceMappingURL=staticCost.js.map