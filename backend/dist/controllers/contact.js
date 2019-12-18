"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contactToUs = contactToUs;
exports.contactToCompany = contactToCompany;

var _mailer = require("../config/mailer");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function contactToUs(_x, _x2) {
  return _contactToUs.apply(this, arguments);
}

function _contactToUs() {
  _contactToUs = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var requireContactProperties, i, _req$body, name, surname, email, taxNumber, description, companyName, topic;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            requireContactProperties = ["name", "surname", "email", "description", "topic"];
            i = 0;

          case 2:
            if (!(i < requireContactProperties.length)) {
              _context.next = 8;
              break;
            }

            if (!(!req.body[requireContactProperties[i]] || req.body[requireContactProperties[i]].length === 0)) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return", res.status(400).send({
              msg: "Missing ".concat(requireContactProperties[i], " property")
            }));

          case 5:
            i++;
            _context.next = 2;
            break;

          case 8:
            _req$body = req.body, name = _req$body.name, surname = _req$body.surname, email = _req$body.email, taxNumber = _req$body.taxNumber, description = _req$body.description, companyName = _req$body.companyName, topic = _req$body.topic;

            if (!taxNumber) {
              taxNumber = "Brak";
            }

            if (!companyName) {
              companyName = "Brak";
            }

            (0, _mailer.loadTemplate)("contactToUs", [{
              name: name,
              surname: surname,
              email: email,
              taxNumber: taxNumber,
              description: description,
              companyName: companyName,
              topic: topic
            }]).then(function (result) {
              (0, _mailer.sendEmail)({
                to: "marcinwarzybok@outlook.com",
                subject: "New Customer ".concat(name, " ").concat(surname),
                html: result[0].email.html,
                text: result[0].email.text
              });
            })["catch"](function (err) {
              console.log(err);
            });
            res.send({});

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _contactToUs.apply(this, arguments);
}

function contactToCompany(_x3, _x4) {
  return _contactToCompany.apply(this, arguments);
}

function _contactToCompany() {
  _contactToCompany = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var requireContactProperties, i, _req$body2, name, surname, email, phone, startTime, companyName, taxNumber, fullCost, weight, height, width, length, numberOfPalettes, typeOfPalette, description, companyEmail, vehicles, points, isDimensions, generatedURL, _i;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            requireContactProperties = ["name", "surname", "email", "phone", "startTime", "fullCost", "weight", "height", "description", "companyEmail", "vehicles", "points", "isDimensions"];
            i = 0;

          case 2:
            if (!(i < requireContactProperties.length)) {
              _context2.next = 8;
              break;
            }

            if (!(req.body[requireContactProperties[i]] === undefined)) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt("return", res.status(400).send({
              msg: "Missing ".concat(requireContactProperties[i], " property")
            }));

          case 5:
            i++;
            _context2.next = 2;
            break;

          case 8:
            _req$body2 = req.body, name = _req$body2.name, surname = _req$body2.surname, email = _req$body2.email, phone = _req$body2.phone, startTime = _req$body2.startTime, companyName = _req$body2.companyName, taxNumber = _req$body2.taxNumber, fullCost = _req$body2.fullCost, weight = _req$body2.weight, height = _req$body2.height, width = _req$body2.width, length = _req$body2.length, numberOfPalettes = _req$body2.numberOfPalettes, typeOfPalette = _req$body2.typeOfPalette, description = _req$body2.description, companyEmail = _req$body2.companyEmail, vehicles = _req$body2.vehicles, points = _req$body2.points, isDimensions = _req$body2.isDimensions;
            generatedURL = "https://www.google.com/maps/dir/?api=1&";

            for (_i = 0; _i < points.length; _i++) {
              if (_i === 0) {
                generatedURL += "origin=".concat(points[_i].lat, ",").concat(points[_i].lng, "&waypoints=");
              } else if (_i === points.length - 1) {
                generatedURL = generatedURL.substring(0, generatedURL.length - 1);
                generatedURL += "&destination=".concat(points[_i].lat, ",").concat(points[_i].lng);
              } else {
                generatedURL += "".concat(points[_i].lat, ",").concat(points[_i].lng, "|");
              }
            }

            generatedURL += "&travelmode=driving";
            console.log(generatedURL);

            if (!taxNumber) {
              taxNumber = "-";
            }

            if (!companyName) {
              companyName = "-";
            }

            (0, _mailer.loadTemplate)("contactToCompany", [{
              name: name,
              surname: surname,
              email: email,
              phone: phone,
              startTime: startTime,
              companyName: companyName,
              taxNumber: taxNumber,
              fullCost: fullCost,
              weight: weight,
              height: height,
              width: width,
              length: length,
              numberOfPalettes: numberOfPalettes,
              typeOfPalette: typeOfPalette,
              description: description,
              vehicles: vehicles,
              points: points,
              isDimensions: isDimensions,
              urlRoute: generatedURL
            }]).then(function (result) {
              (0, _mailer.sendEmail)({
                to: companyEmail,
                subject: "New Customer ".concat(name, " ").concat(surname),
                html: result[0].email.html,
                text: result[0].email.text
              });
            })["catch"](function (err) {
              console.log(err);
            });
            res.send({});

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _contactToCompany.apply(this, arguments);
}
//# sourceMappingURL=contact.js.map