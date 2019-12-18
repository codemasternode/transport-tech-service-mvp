"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TollRoadSchema = new _mongoose["default"].Schema({
  nameOfRoad: {
    required: true,
    type: String
  },
  route: {
    type: Array,
    required: true
  }
}, {
  strict: false
});

var _default = _mongoose["default"].model("tollRoad", TollRoadSchema);

exports["default"] = _default;
//# sourceMappingURL=tollRoads.js.map