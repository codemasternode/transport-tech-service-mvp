"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _websiteStats = require("../controllers/websiteStats");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

var _default = function _default() {
  router.post("/", _websiteStats.postWebsiteStats);
  return router;
};

exports["default"] = _default;
//# sourceMappingURL=websiteStats.js.map