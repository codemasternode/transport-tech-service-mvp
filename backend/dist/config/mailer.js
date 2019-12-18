"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendEmail = sendEmail;
exports.loadTemplate = loadTemplate;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _nodemailerExpressHandlebars = _interopRequireDefault(require("nodemailer-express-handlebars"));

var _config = _interopRequireDefault(require("dotenv/config"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var EmailTemplate = require("email-templates").EmailTemplate;

var fromEmail = "transport-tech-service-notifications <".concat(process.env.EMAIL_ADDRESS_MAILER, ">");
var transporter;

function start() {
  return _start.apply(this, arguments);
}

function _start() {
  _start = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            transporter = _nodemailer["default"].createTransport({
              host: "smtp.gmail.com",
              port: 465,
              secure: true,
              auth: {
                user: process.env.EMAIL_ADDRESS_MAILER,
                pass: process.env.PASSSWORD_MAILER
              },
              tls: {
                rejectUnauthorized: false
              }
            });
            _context.prev = 1;
            _context.next = 4;
            return transporter.verify();

          case 4:
            _context.next = 9;
            break;

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](1);
            console.log(_context.t0);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 6]]);
  }));
  return _start.apply(this, arguments);
}

start();

function sendEmail(_ref) {
  var to = _ref.to,
      subject = _ref.subject,
      html = _ref.html,
      text = _ref.text;
  return new Promise(function (resolve, reject) {
    transporter.sendMail({
      fromEmail: fromEmail,
      to: to,
      subject: subject,
      html: html,
      text: text
    }, function (err, info) {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
}

function loadTemplate(templateName, contexts) {
  console.log(_path["default"].join(__dirname, "../emailsTemplates/templates", templateName));
  var template = new EmailTemplate(_path["default"].join(__dirname, "../emailsTemplates/templates", templateName));
  return Promise.all(contexts.map(function (context) {
    return new Promise(function (resolve, reject) {
      template.render(context, function (err, result) {
        console.log(result, 65);
        if (err) reject(err);else resolve({
          email: result,
          context: context
        });
      });
    });
  }));
}
//# sourceMappingURL=mailer.js.map