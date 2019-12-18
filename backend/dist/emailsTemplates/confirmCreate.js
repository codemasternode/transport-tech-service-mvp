"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _nodemailerExpressHandlebars = _interopRequireDefault(require("nodemailer-express-handlebars"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var languages = [{
  language: "PL",
  welcomeText: "Witaj",
  infoText: "Potwierdzenie założenia konta na platformie",
  buttonConfirmText: "Zatwierdź"
}, {
  language: "ENG",
  welcomeText: "Welcome",
  infoText: "Confirmation of account creation on the platform",
  buttonConfirmText: "Confirm"
}];

var _default = function _default() {};

exports["default"] = _default;
//# sourceMappingURL=confirmCreate.js.map