"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PalleteSchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    required: true
  },
  length: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  totalWeight: {
    type: Number,
    required: true
  }
});

var _default = _mongoose["default"].model("pallete", PalleteSchema);

exports["default"] = _default;
//# sourceMappingURL=palletes.js.map