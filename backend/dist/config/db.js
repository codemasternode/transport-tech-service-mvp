"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _v = _interopRequireDefault(require("uuid/v1"));

var _loadData = require("../services/loadData");

var _company = _interopRequireDefault(require("../models/company"));

var _companyBase = _interopRequireDefault(require("../models/companyBase"));

var _country = _interopRequireDefault(require("../models/country"));

var _vehicle = _interopRequireDefault(require("../models/vehicle"));

var _user = _interopRequireDefault(require("../models/user"));

var _palletes = _interopRequireDefault(require("../models/palletes"));

var _tollRoads = _interopRequireDefault(require("../models/tollRoads"));

var _diets = _interopRequireDefault(require("../models/diets"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(URI) {
    var dbOptions, data, diets, ratesCallback, i, rates, g, isIniside, _i, nearestCountry, nearestCountrySaved, _ref2, _ref3, savedPalettes, _ref4, _ref5, savedCountries, _ref6, _ref7, savedTollRoads, h, companies, _i2, PL, distinctVehicles, k, m, isInside, _g, savedVehicles, l, _k, _m;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            dbOptions = {
              poolSize: 4,
              useNewUrlParser: true,
              useUnifiedTopology: true
            };

            _mongoose["default"].connect("mongodb://localhost:27017/tt111", dbOptions, function (err) {
              if (err) {
                throw new Error("Error while trying to connect MongoDB ".concat(err));
              }

              console.log("Connected to MongoDB");
            });

            _context.next = 4;
            return (0, _loadData.loadData)(["default/countries.json", //2
            "default/fuels.json", // 3
            "default/palettes.json", //5
            "default/tollRoads.json", //6
            "default/diets.json", //7
            "mockData/companies.json"]);

          case 4:
            data = _context.sent;
            _context.next = 7;
            return Promise.all([_country["default"].deleteMany({}), _vehicle["default"].deleteMany({}), _company["default"].deleteMany({}), _companyBase["default"].deleteMany({}), _user["default"].deleteMany({}), _palletes["default"].deleteMany({}), _tollRoads["default"].deleteMany({}), _diets["default"].deleteMany({})]);

          case 7:
            diets = data[4];
            ratesCallback = [];

            for (i = 0; i < diets.length; i++) {
              ratesCallback.push((0, _axios["default"])("https://api.exchangeratesapi.io/latest?base=".concat(diets[i].currency, "&symbols=PLN")));
            }

            _context.prev = 10;
            _context.next = 13;
            return Promise.all(ratesCallback.map(function (call) {
              return call["catch"](function (e) {
                return e;
              });
            }));

          case 13:
            rates = _context.sent;

            for (g = 0; g < diets.length; g++) {
              isIniside = false;

              for (_i = 0; _i < rates.length; _i++) {
                if (rates[_i].status === 200 && rates[_i].data.base === diets[g].currency) {
                  diets[g].dietValueInPLN = Math.ceil(rates[_i].data.rates.PLN * diets[g].dietValue);
                  diets[g].nightLimitValueInPLN = Math.ceil(rates[_i].data.rates.PLN * diets[g].nightLimitValue);
                  isIniside = true;
                }
              }

              if (!isIniside) {
                diets[g].dietValueInPLN = 0;
                diets[g].nightLimitValueInPLN = 0;
              }
            }

            _diets["default"].create(diets);

            _context.next = 21;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](10);
            console.log(_context.t0);

          case 21:
            nearestCountry = ["Poland", "Germany", "France", "UK", "Czechia", "Switzerland", "Slovenia", "Slovakia", "Latvia"];
            nearestCountrySaved = [];
            _context.next = 25;
            return Promise.all([_palletes["default"].create(data[2])]);

          case 25:
            _ref2 = _context.sent;
            _ref3 = _slicedToArray(_ref2, 1);
            savedPalettes = _ref3[0];
            _context.next = 30;
            return Promise.all([_country["default"].create(data[0])]);

          case 30:
            _ref4 = _context.sent;
            _ref5 = _slicedToArray(_ref4, 1);
            savedCountries = _ref5[0];
            _context.next = 35;
            return Promise.all([_tollRoads["default"].create(data[3])]);

          case 35:
            _ref6 = _context.sent;
            _ref7 = _slicedToArray(_ref6, 1);
            savedTollRoads = _ref7[0];

            for (h = 0; h < savedCountries.length; h++) {
              if (nearestCountry.includes(savedCountries[h].countryCode)) {
                nearestCountrySaved.push(savedCountries[h].countryCode);
              }
            } //const emissionsLevel = ["EURO 2", "EURO 3", "EURO 4", "EURO 5"];


            companies = data[5];
            _i2 = 0;

          case 41:
            if (!(_i2 < companies.length)) {
              _context.next = 58;
              break;
            }

            _context.next = 44;
            return _country["default"].findOne({
              countryCode: "PL"
            });

          case 44:
            PL = _context.sent;
            companies[_i2].country = PL;
            companies[_i2].countries = nearestCountry;
            distinctVehicles = [];

            for (k = 0; k < companies[_i2].companyBases.length; k++) {
              for (m = 0; m < companies[_i2].companyBases[k].vehicles.length; m++) {
                isInside = false;

                for (_g = 0; _g < distinctVehicles.length; _g++) {
                  if (distinctVehicles[_g].name === companies[_i2].companyBases[k].vehicles[m].name) {
                    isInside = true;
                  }
                }

                if (!isInside) {
                  distinctVehicles.push(companies[_i2].companyBases[k].vehicles[m]);
                }
              }
            }

            _context.next = 51;
            return _vehicle["default"].create(distinctVehicles);

          case 51:
            savedVehicles = _context.sent;

            for (l = 0; l < savedVehicles.length; l++) {
              for (_k = 0; _k < companies[_i2].companyBases.length; _k++) {
                for (_m = 0; _m < companies[_i2].companyBases[_k].vehicles.length; _m++) {
                  if (savedVehicles[l].name === companies[_i2].companyBases[_k].vehicles[_m].name) {
                    companies[_i2].companyBases[_k].vehicles[_m] = savedVehicles[l];
                  }
                }
              }
            }

            _context.next = 55;
            return _company["default"].create(companies[_i2]);

          case 55:
            _i2++;
            _context.next = 41;
            break;

          case 58:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[10, 18]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;
//# sourceMappingURL=db.js.map