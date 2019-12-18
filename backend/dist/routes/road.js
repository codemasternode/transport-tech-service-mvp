"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _road = require("../controllers/road");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

var _default = function _default() {
  router.post("/", _road.getRoadOffers);
  return router;
};

exports["default"] = _default;
//# sourceMappingURL=road.js.map