"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRoadOffers = getRoadOffers;

var _vehicle = _interopRequireDefault(require("../models/vehicle"));

var _palletes = _interopRequireDefault(require("../models/palletes"));

var _company = _interopRequireDefault(require("../models/company"));

var _vehicleFilter = require("../services/vehicleFilter");

var _maps = _interopRequireDefault(require("@google/maps"));

var _getRoadCode = require("../services/getRoadCode");

var _tollPayments = require("../services/tollPayments");

var _countRoadDiets = require("../services/countRoadDiets");

require("dotenv/config");

var _geoservices = require("../services/geoservices");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var googleMapsClient = _maps["default"].createClient({
  key: process.env.GOOGLE_API,
  Promise: Promise
});

function getRoadOffers(_x, _x2) {
  return _getRoadOffers.apply(this, arguments);
}

function _getRoadOffers() {
  _getRoadOffers = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(req, res) {
    var getVehicles, requireKeys, i, isInside, key, _req$body, points, numberOfPallets, typeOfPallet, height, weight, palette, road, waypoints, distance, time, listOfCountries, _i, _ref, _ref2, tollPayment, companies, diets, _i2, k, m, l, isIt, o, currentRequireProperty, _getVehicles, _requireKeys, _i6, _isInside2, _key, _req$body2, _points, volume, _weight, _road, _waypoints, _distance, _time, _listOfCountries, _i7, _ref8, _ref9, _tollPayment, _companies, _diets, _i8, _k4, _m3, _l, _isIt, _o, _currentRequireProperty;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (!(req.body.typeOfSearch === "Palette")) {
              _context5.next = 41;
              break;
            }

            getVehicles =
            /*#__PURE__*/
            function () {
              var _ref3 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee2() {
                var _ref4, _ref5, vehicles, formattedCompanies, operateOnCompanies, _operateOnCompanies, _i3, _k, _m, _i4, isNo, filtered, _k2;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _operateOnCompanies = function _ref7() {
                          _operateOnCompanies = _asyncToGenerator(
                          /*#__PURE__*/
                          regeneratorRuntime.mark(function _callee() {
                            var companies, distinctVehiclesInCompanies, _i5, com, _k3, diffDistance, backDistance, _m2, _isInside, g;

                            return regeneratorRuntime.wrap(function _callee$(_context) {
                              while (1) {
                                switch (_context.prev = _context.next) {
                                  case 0:
                                    _context.next = 2;
                                    return _company["default"].find({});

                                  case 2:
                                    companies = _context.sent;
                                    distinctVehiclesInCompanies = [];

                                    for (_i5 = 0; _i5 < companies.length; _i5++) {
                                      com = {
                                        nameOfCompany: companies[_i5].nameOfCompany,
                                        _id: companies[_i5]._id,
                                        email: companies[_i5].email,
                                        logo: companies[_i5].logo,
                                        isVat: companies[_i5].isVat,
                                        place: companies[_i5].place,
                                        phone: companies[_i5].phone,
                                        taxNumber: companies[_i5].taxNumber,
                                        vehicles: []
                                      };

                                      for (_k3 = 0; _k3 < companies[_i5].companyBases.length; _k3++) {
                                        diffDistance = (0, _geoservices.getDistanceFromLatLonInKm)(companies[_i5].companyBases[_k3].location, points[0]) * 1.2;
                                        backDistance = (0, _geoservices.getDistanceFromLatLonInKm)(companies[_i5].companyBases[_k3].location, points[points.length - 1]) * 1.2;

                                        for (_m2 = 0; _m2 < companies[_i5].companyBases[_k3].vehicles.length; _m2++) {
                                          _isInside = false;

                                          for (g = 0; g < com.vehicles.length; g++) {
                                            if (com.vehicles[g]._id.toString() === companies[_i5].companyBases[_k3].vehicles[_m2]._id.toString() && com.vehicles[g].diffDistance > diffDistance) {
                                              com.vehicles[g] = _objectSpread({}, companies[_i5].companyBases[_k3].vehicles[_m2], {
                                                diffDistance: diffDistance,
                                                backDistance: backDistance,
                                                fullCost: 0,
                                                toll: 0
                                              });
                                              _isInside = true;
                                            }
                                          }

                                          if (!_isInside) {
                                            com.vehicles.push(_objectSpread({}, companies[_i5].companyBases[_k3].vehicles[_m2], {
                                              diffDistance: diffDistance,
                                              backDistance: backDistance
                                            }));
                                          }
                                        }
                                      }

                                      distinctVehiclesInCompanies.push(com);
                                    }

                                    return _context.abrupt("return", distinctVehiclesInCompanies);

                                  case 6:
                                  case "end":
                                    return _context.stop();
                                }
                              }
                            }, _callee);
                          }));
                          return _operateOnCompanies.apply(this, arguments);
                        };

                        operateOnCompanies = function _ref6() {
                          return _operateOnCompanies.apply(this, arguments);
                        };

                        _context2.next = 4;
                        return Promise.all([_vehicle["default"].aggregate([{
                          $match: {
                            "dimensions.height": {
                              $gt: height + palette.height
                            },
                            "range.maxRange": {
                              $gte: distance
                            },
                            countries: {
                              $all: listOfCountries
                            }
                          }
                        }, {
                          $addFields: {
                            palettes: {
                              oneRow: {
                                $floor: {
                                  $divide: [{
                                    $multiply: ["$dimensions.length", "$dimensions.width"]
                                  }, //rozmiary palety EUR-EPAL
                                  {
                                    $multiply: [palette.length, palette.width]
                                  }]
                                }
                              },
                              secondRow: {
                                $cond: {
                                  "if": {
                                    $gt: [{
                                      $subtract: [//odjęcie wysokości pojazdu od tego co zajmuje pierwszy rząd = wysokość która pozostałą
                                      "$dimensions.height", height + palette.height]
                                    }, height + palette.height]
                                  },
                                  then: {
                                    $floor: {
                                      $divide: [{
                                        $multiply: ["$dimensions.length", "$dimensions.width"]
                                      }, //rozmiary palety EUR-EPAL
                                      {
                                        $multiply: [palette.length, palette.width]
                                      }]
                                    }
                                  },
                                  "else": 0
                                }
                              }
                            },
                            costPerKm: {
                              $sum: [{
                                $multiply: [{
                                  $divide: [1, "$averageDistancePerMonth"]
                                }, "$monthCosts"]
                              }, {
                                $divide: [{
                                  $divide: [{
                                    $multiply: ["$valueOfTruck", {
                                      $divide: ["$deprecationPerYear", 100]
                                    }]
                                  }, 12]
                                }, "$averageDistancePerMonth"]
                              }]
                            }
                          }
                        }]), operateOnCompanies()]);

                      case 4:
                        _ref4 = _context2.sent;
                        _ref5 = _slicedToArray(_ref4, 2);
                        vehicles = _ref5[0];
                        formattedCompanies = _ref5[1];
                        _i3 = 0;

                      case 9:
                        if (!(_i3 < vehicles.length)) {
                          _context2.next = 26;
                          break;
                        }

                        _k = 0;

                      case 11:
                        if (!(_k < formattedCompanies.length)) {
                          _context2.next = 23;
                          break;
                        }

                        _m = 0;

                      case 13:
                        if (!(_m < formattedCompanies[_k].vehicles.length)) {
                          _context2.next = 20;
                          break;
                        }

                        if (!(vehicles[_i3]._id.toString() === formattedCompanies[_k].vehicles[_m]._id.toString())) {
                          _context2.next = 17;
                          break;
                        }

                        formattedCompanies[_k].vehicles[_m] = _objectSpread({}, formattedCompanies[_k].vehicles[_m], {
                          costPerKm: vehicles[_i3].costPerKm,
                          palettes: vehicles[_i3].palettes.oneRow + vehicles[_i3].palettes.secondRow,
                          isInside: true
                        });
                        return _context2.abrupt("break", 20);

                      case 17:
                        _m++;
                        _context2.next = 13;
                        break;

                      case 20:
                        _k++;
                        _context2.next = 11;
                        break;

                      case 23:
                        _i3++;
                        _context2.next = 9;
                        break;

                      case 26:
                        for (_i4 = 0; _i4 < formattedCompanies.length; _i4++) {
                          isNo = false;
                          formattedCompanies[_i4].vehicles = formattedCompanies[_i4].vehicles.filter(function (value) {
                            return value.isInside === true;
                          });

                          if (formattedCompanies[_i4].vehicles.length === 0) {
                            formattedCompanies.splice(_i4, 1);
                            _i4--;
                            isNo = true;
                          }

                          if (!isNo) {
                            filtered = (0, _vehicleFilter.vehicleFilterByPallet)(formattedCompanies[_i4].vehicles, numberOfPallets, weight);

                            if (filtered) {
                              formattedCompanies[_i4].vehicles = filtered.map(function (value, index) {
                                return value.truck;
                              });

                              for (_k2 = 0; _k2 < formattedCompanies[_i4].vehicles.length; _k2++) {
                                if (formattedCompanies[_i4].vehicles[_k2].diffDistance + formattedCompanies[_i4].vehicles[_k2].backDistance > formattedCompanies[_i4].vehicles[_k2].range.operationRange) {
                                  formattedCompanies[_i4].vehicles[_k2] = _objectSpread({}, formattedCompanies[_i4].vehicles[_k2], {
                                    fullCost: formattedCompanies[_i4].vehicles[_k2].diffDistance * formattedCompanies[_i4].vehicles[_k2].costPerKm + distance * formattedCompanies[_i4].vehicles[_k2].costPerKm + formattedCompanies[_i4].vehicles[_k2].backDistance * formattedCompanies[_i4].vehicles[_k2].costPerKm
                                  });
                                } else {
                                  formattedCompanies[_i4].vehicles[_k2] = _objectSpread({}, formattedCompanies[_i4].vehicles[_k2], {
                                    fullCost: distance * formattedCompanies[_i4].vehicles[_k2].costPerKm
                                  });
                                }
                              }
                            }
                          }
                        }

                        return _context2.abrupt("return", formattedCompanies);

                      case 28:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function getVehicles() {
                return _ref3.apply(this, arguments);
              };
            }();

            requireKeys = ["numberOfPallets", "typeOfPallet", "height", "points", "weight"];
            i = 0;

          case 4:
            if (!(i < requireKeys.length)) {
              _context5.next = 12;
              break;
            }

            isInside = false;

            for (key in req.body) {
              if (requireKeys[i] === key) {
                isInside = true;
              }
            }

            if (isInside) {
              _context5.next = 9;
              break;
            }

            return _context5.abrupt("return", res.status(400).send({
              msg: "Missing Parameter ".concat(requireKeys[i])
            }));

          case 9:
            i++;
            _context5.next = 4;
            break;

          case 12:
            _req$body = req.body, points = _req$body.points, numberOfPallets = _req$body.numberOfPallets, typeOfPallet = _req$body.typeOfPallet, height = _req$body.height, weight = _req$body.weight;

            if (!(!points || points.length < 2)) {
              _context5.next = 15;
              break;
            }

            return _context5.abrupt("return", res.status(400).send({
              err: "There is no points"
            }));

          case 15:
            _context5.next = 17;
            return _palletes["default"].findOne({
              name: typeOfPallet
            });

          case 17:
            palette = _context5.sent;

            if (palette) {
              _context5.next = 20;
              break;
            }

            return _context5.abrupt("return", res.status(400).send({
              msg: "Can not find pallete ".concat(typeOfPallet)
            }));

          case 20:
            _context5.next = 22;
            return googleMapsClient.directions((0, _geoservices.createDistanceGoogleMapsRequest)(points)).asPromise();

          case 22:
            road = _context5.sent;
            waypoints = road.json.routes[0].legs;
            distance = 0;
            time = 0;
            listOfCountries = [];

            for (_i = 0; _i < waypoints.length; _i++) {
              distance += waypoints[_i].distance.value;
              time += waypoints[_i].duration.value;
              listOfCountries.push((0, _geoservices.getCountryFromAddress)(waypoints[_i].start_address));
              listOfCountries.push((0, _geoservices.getCountryFromAddress)(waypoints[_i].end_address));
            }

            distance = distance / 1000;
            time = time / 60 / 60;
            _context5.next = 32;
            return Promise.all([(0, _tollPayments.countTollPayments)(waypoints), getVehicles(), (0, _countRoadDiets.countRoadDiets)(waypoints, time, listOfCountries)]);

          case 32:
            _ref = _context5.sent;
            _ref2 = _slicedToArray(_ref, 3);
            tollPayment = _ref2[0];
            companies = _ref2[1];
            diets = _ref2[2];

            for (_i2 = 0; _i2 < companies.length; _i2++) {
              for (k = 0; k < companies[_i2].vehicles.length; k++) {
                for (m = 0; m < tollPayment.length; m++) {
                  for (l = 0; l < tollPayment[m].pricingPlans.length; l++) {
                    isIt = [];

                    for (o = 0; o < tollPayment[m].pricingPlans[l].requirePropertyValue.length; o++) {
                      currentRequireProperty = tollPayment[m].pricingPlans[l].requirePropertyValue[o];

                      if (currentRequireProperty.value != undefined && companies[_i2].vehicles[k][currentRequireProperty.name] === currentRequireProperty.value) {
                        isIt.push(true);
                      } else if (currentRequireProperty.from != undefined && currentRequireProperty.to != undefined && companies[_i2].vehicles[k][currentRequireProperty.name] >= currentRequireProperty.from && companies[_i2].vehicles[k][currentRequireProperty.name] < currentRequireProperty.to) {
                        isIt.push(true);
                      }
                    }

                    if (isIt.length === tollPayment[m].pricingPlans[l].requirePropertyValue.length && isIt.includes(true) && !isIt.includes(false)) {
                      if (companies[_i2].vehicles[k].toll === undefined) {
                        companies[_i2].vehicles[k].toll = tollPayment[m].pricingPlans[l].costsForWholeDistance;
                      } else {
                        companies[_i2].vehicles[k].toll += tollPayment[m].pricingPlans[l].costsForWholeDistance;
                      }
                    }
                  }
                }

                companies[_i2].vehicles[k].fullCost += diets.sumDiets + Math.floor(diets.fullNumberOfDays) * companies[_i2].vehicles[k].salary / 30 + (diets.fullNumberOfDays - Math.floor(diets.fullNumberOfDays) > 0.5 ? companies[_i2].vehicles[k].salary / 30 : companies[_i2].vehicles[k].salary / 60);
                companies[_i2].vehicles[k] = {
                  _id: companies[_i2].vehicles[k]._id,
                  name: companies[_i2].vehicles[k].name,
                  fullCost: companies[_i2].vehicles[k].fullCost * (100 + companies[_i2].vehicles[k].margin) / 100
                };
                companies[_i2].vehicles[k].fullCost = Math.floor(companies[_i2].vehicles[k].fullCost * 100) / 100;
              }
            }

            res.send({
              companies: companies
            });
            _context5.next = 81;
            break;

          case 41:
            if (!(req.body.typeOfSearch === "Dimensions")) {
              _context5.next = 81;
              break;
            }

            _getVehicles =
            /*#__PURE__*/
            function () {
              var _ref10 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee4() {
                var _ref11, _ref12, vehicles, formattedCompanies, operateOnCompanies, _operateOnCompanies2, _i9, _k5, _m4, _i10, filtered, _k6;

                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _operateOnCompanies2 = function _ref14() {
                          _operateOnCompanies2 = _asyncToGenerator(
                          /*#__PURE__*/
                          regeneratorRuntime.mark(function _callee3() {
                            var companies, distinctVehiclesInCompanies, _i11, com, _k7, diffDistance, backDistance, _m5, _isInside3, g;

                            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                              while (1) {
                                switch (_context3.prev = _context3.next) {
                                  case 0:
                                    _context3.next = 2;
                                    return _company["default"].find({});

                                  case 2:
                                    companies = _context3.sent;
                                    distinctVehiclesInCompanies = [];

                                    for (_i11 = 0; _i11 < companies.length; _i11++) {
                                      com = {
                                        nameOfCompany: companies[_i11].nameOfCompany,
                                        _id: companies[_i11]._id,
                                        email: companies[_i11].email,
                                        logo: companies[_i11].logo,
                                        isVat: companies[_i11].isVat,
                                        place: companies[_i11].place,
                                        phone: companies[_i11].phone,
                                        taxNumber: companies[_i11].taxNumber,
                                        vehicles: []
                                      };

                                      for (_k7 = 0; _k7 < companies[_i11].companyBases.length; _k7++) {
                                        diffDistance = (0, _geoservices.getDistanceFromLatLonInKm)(companies[_i11].companyBases[_k7].location, _points[0]) * 1.2;
                                        backDistance = (0, _geoservices.getDistanceFromLatLonInKm)(companies[_i11].companyBases[_k7].location, _points[_points.length - 1]) * 1.2;

                                        for (_m5 = 0; _m5 < companies[_i11].companyBases[_k7].vehicles.length; _m5++) {
                                          _isInside3 = false;

                                          for (g = 0; g < com.vehicles.length; g++) {
                                            if (com.vehicles[g]._id.toString() === companies[_i11].companyBases[_k7].vehicles[_m5]._id.toString() && com.vehicles[g].diffDistance > diffDistance) {
                                              com.vehicles[g] = _objectSpread({}, companies[_i11].companyBases[_k7].vehicles[_m5], {
                                                diffDistance: diffDistance,
                                                backDistance: backDistance,
                                                fullCost: 0,
                                                toll: 0
                                              });
                                              _isInside3 = true;
                                            }
                                          }

                                          if (!_isInside3) {
                                            com.vehicles.push(_objectSpread({}, companies[_i11].companyBases[_k7].vehicles[_m5], {
                                              diffDistance: diffDistance,
                                              backDistance: backDistance
                                            }));
                                          }
                                        }
                                      }

                                      distinctVehiclesInCompanies.push(com);
                                    }

                                    return _context3.abrupt("return", distinctVehiclesInCompanies);

                                  case 6:
                                  case "end":
                                    return _context3.stop();
                                }
                              }
                            }, _callee3);
                          }));
                          return _operateOnCompanies2.apply(this, arguments);
                        };

                        operateOnCompanies = function _ref13() {
                          return _operateOnCompanies2.apply(this, arguments);
                        };

                        _context4.next = 4;
                        return Promise.all([_vehicle["default"].aggregate([{
                          $match: {
                            "range.maxRange": {
                              $gte: _distance
                            },
                            countries: {
                              $all: _listOfCountries
                            }
                          }
                        }, {
                          $addFields: {
                            volume: {
                              $multiply: ["$dimensions.height", {
                                $multiply: ["$dimensions.width", "$dimensions.length"]
                              }]
                            },
                            costPerKm: {
                              $sum: [{
                                $multiply: [{
                                  $divide: [1, "$averageDistancePerMonth"]
                                }, "$monthCosts"]
                              }, {
                                $divide: [{
                                  $divide: [{
                                    $multiply: ["$valueOfTruck", {
                                      $divide: ["$deprecationPerYear", 100]
                                    }]
                                  }, 12]
                                }, "$averageDistancePerMonth"]
                              }]
                            },
                            toll: 0
                          }
                        }]), operateOnCompanies()]);

                      case 4:
                        _ref11 = _context4.sent;
                        _ref12 = _slicedToArray(_ref11, 2);
                        vehicles = _ref12[0];
                        formattedCompanies = _ref12[1];
                        _i9 = 0;

                      case 9:
                        if (!(_i9 < vehicles.length)) {
                          _context4.next = 26;
                          break;
                        }

                        _k5 = 0;

                      case 11:
                        if (!(_k5 < formattedCompanies.length)) {
                          _context4.next = 23;
                          break;
                        }

                        _m4 = 0;

                      case 13:
                        if (!(_m4 < formattedCompanies[_k5].vehicles.length)) {
                          _context4.next = 20;
                          break;
                        }

                        if (!(vehicles[_i9]._id.toString() === formattedCompanies[_k5].vehicles[_m4]._id.toString())) {
                          _context4.next = 17;
                          break;
                        }

                        formattedCompanies[_k5].vehicles[_m4] = _objectSpread({}, formattedCompanies[_k5].vehicles[_m4], {
                          costPerKm: vehicles[_i9].costPerKm,
                          volume: vehicles[_i9].volume,
                          isInside: true
                        });
                        return _context4.abrupt("break", 20);

                      case 17:
                        _m4++;
                        _context4.next = 13;
                        break;

                      case 20:
                        _k5++;
                        _context4.next = 11;
                        break;

                      case 23:
                        _i9++;
                        _context4.next = 9;
                        break;

                      case 26:
                        for (_i10 = 0; _i10 < formattedCompanies.length; _i10++) {
                          formattedCompanies[_i10].vehicles = formattedCompanies[_i10].vehicles.filter(function (value) {
                            return value.isInside === true;
                          });
                          filtered = (0, _vehicleFilter.vehicleFilterByVolume)(formattedCompanies[_i10].vehicles, volume, _weight);

                          if (filtered) {
                            formattedCompanies[_i10].vehicles = filtered.map(function (value, index) {
                              return value.truck;
                            });

                            for (_k6 = 0; _k6 < formattedCompanies[_i10].vehicles.length; _k6++) {
                              if (formattedCompanies[_i10].vehicles[_k6].diffDistance + formattedCompanies[_i10].vehicles[_k6].backDistance > formattedCompanies[_i10].vehicles[_k6].range.operationRange) {
                                formattedCompanies[_i10].vehicles[_k6] = _objectSpread({}, formattedCompanies[_i10].vehicles[_k6], {
                                  fullCost: formattedCompanies[_i10].vehicles[_k6].diffDistance * formattedCompanies[_i10].vehicles[_k6].costPerKm + _distance * formattedCompanies[_i10].vehicles[_k6].costPerKm + formattedCompanies[_i10].vehicles[_k6].backDistance * formattedCompanies[_i10].vehicles[_k6].costPerKm
                                });
                              } else {
                                formattedCompanies[_i10].vehicles[_k6] = _objectSpread({}, formattedCompanies[_i10].vehicles[_k6], {
                                  fullCost: _distance * formattedCompanies[_i10].vehicles[_k6].costPerKm
                                });
                              }
                            }
                          } else {
                            formattedCompanies.splice(_i10, 1);
                            _i10--;
                          }
                        }

                        return _context4.abrupt("return", formattedCompanies);

                      case 28:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function _getVehicles() {
                return _ref10.apply(this, arguments);
              };
            }();

            _requireKeys = ["volume", "points", "weight"];
            _i6 = 0;

          case 45:
            if (!(_i6 < _requireKeys.length)) {
              _context5.next = 53;
              break;
            }

            _isInside2 = false;

            for (_key in req.body) {
              if (_requireKeys[_i6] === _key) {
                _isInside2 = true;
              }
            }

            if (_isInside2) {
              _context5.next = 50;
              break;
            }

            return _context5.abrupt("return", res.status(400).send({
              msg: "Missing Parameter ".concat(_requireKeys[_i6])
            }));

          case 50:
            _i6++;
            _context5.next = 45;
            break;

          case 53:
            _req$body2 = req.body, _points = _req$body2.points, volume = _req$body2.volume, _weight = _req$body2.weight;

            if (!(!_points || _points.length < 2)) {
              _context5.next = 56;
              break;
            }

            return _context5.abrupt("return", res.status(400).send({
              err: "There is no points"
            }));

          case 56:
            _context5.prev = 56;
            _context5.next = 59;
            return googleMapsClient.directions((0, _geoservices.createDistanceGoogleMapsRequest)(_points)).asPromise();

          case 59:
            _road = _context5.sent;
            _context5.next = 65;
            break;

          case 62:
            _context5.prev = 62;
            _context5.t0 = _context5["catch"](56);
            return _context5.abrupt("return", res.status(500).send({}));

          case 65:
            _waypoints = _road.json.routes[0].legs;
            _distance = 0;
            _time = 0;
            _listOfCountries = [];

            for (_i7 = 0; _i7 < _waypoints.length; _i7++) {
              _distance += _waypoints[_i7].distance.value;
              _time += _waypoints[_i7].duration.value;

              _listOfCountries.push((0, _geoservices.getCountryFromAddress)(_waypoints[_i7].start_address));

              _listOfCountries.push((0, _geoservices.getCountryFromAddress)(_waypoints[_i7].end_address));
            }

            _distance = _distance / 1000;
            _time = _time / 60 / 60;
            _context5.next = 74;
            return Promise.all([(0, _tollPayments.countTollPayments)(_waypoints), _getVehicles(), (0, _countRoadDiets.countRoadDiets)(_waypoints, _time, _listOfCountries)]);

          case 74:
            _ref8 = _context5.sent;
            _ref9 = _slicedToArray(_ref8, 3);
            _tollPayment = _ref9[0];
            _companies = _ref9[1];
            _diets = _ref9[2];

            for (_i8 = 0; _i8 < _companies.length; _i8++) {
              for (_k4 = 0; _k4 < _companies[_i8].vehicles.length; _k4++) {
                for (_m3 = 0; _m3 < _tollPayment.length; _m3++) {
                  for (_l = 0; _l < _tollPayment[_m3].pricingPlans.length; _l++) {
                    _isIt = [];

                    for (_o = 0; _o < _tollPayment[_m3].pricingPlans[_l].requirePropertyValue.length; _o++) {
                      _currentRequireProperty = _tollPayment[_m3].pricingPlans[_l].requirePropertyValue[_o];

                      if (_currentRequireProperty.value != undefined && _companies[_i8].vehicles[_k4][_currentRequireProperty.name] === _currentRequireProperty.value) {
                        _isIt.push(true);
                      } else if (_currentRequireProperty.from != undefined && _currentRequireProperty.to != undefined && _companies[_i8].vehicles[_k4][_currentRequireProperty.name] >= _currentRequireProperty.from && _companies[_i8].vehicles[_k4][_currentRequireProperty.name] < _currentRequireProperty.to) {
                        _isIt.push(true);
                      }
                    }

                    if (_isIt.length === _tollPayment[_m3].pricingPlans[_l].requirePropertyValue.length && _isIt.includes(true) && !_isIt.includes(false)) {
                      if (_companies[_i8].vehicles[_k4].toll === undefined) {
                        _companies[_i8].vehicles[_k4].toll = _tollPayment[_m3].pricingPlans[_l].costsForWholeDistance;
                      } else {
                        _companies[_i8].vehicles[_k4].toll += _tollPayment[_m3].pricingPlans[_l].costsForWholeDistance;
                      }
                    }
                  }
                }

                _companies[_i8].vehicles[_k4].fullCost += _diets.sumDiets + Math.floor(_diets.fullNumberOfDays) * _companies[_i8].vehicles[_k4].salary / 30 + (_diets.fullNumberOfDays - Math.floor(_diets.fullNumberOfDays) > 0.5 ? _companies[_i8].vehicles[_k4].salary / 30 : _companies[_i8].vehicles[_k4].salary / 60);
                _companies[_i8].vehicles[_k4] = {
                  _id: _companies[_i8].vehicles[_k4]._id,
                  name: _companies[_i8].vehicles[_k4].name,
                  fullCost: _companies[_i8].vehicles[_k4].fullCost * (100 + _companies[_i8].vehicles[_k4].margin) / 100
                };
                _companies[_i8].vehicles[_k4].fullCost = Math.floor(_companies[_i8].vehicles[_k4].fullCost * 100) / 100;
              }
            }

            res.send({
              companies: _companies
            });

          case 81:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[56, 62]]);
  }));
  return _getRoadOffers.apply(this, arguments);
}
//# sourceMappingURL=road.js.map