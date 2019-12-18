"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _contact = require("../controllers/contact");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

var _default = function _default() {
  router.post("/contact-to-us", _contact.contactToUs);
  router.post("/contact-to-company", _contact.contactToCompany);
  return router;
};

exports["default"] = _default;
//# sourceMappingURL=contact.js.map