"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var WorkerSchema = new _mongoose["default"].Schema({
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
  salary: {
    type: Number,
    required: true
  },
  returnedValue: {
    type: Number,
    required: true,
    "default": 0
  },
  jobName: {
    type: String,
    "default": "driver",
    required: true
  }
});
var _default = WorkerSchema;
exports["default"] = _default;
//# sourceMappingURL=worker.js.map