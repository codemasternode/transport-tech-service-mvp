"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.countTollPayments = countTollPayments;

var _getRoadCode = require("./getRoadCode");

var _tollRoads = _interopRequireDefault(require("../models/tollRoads"));

var _geoservices = require("./geoservices");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function countTollPayments(_x) {
  return _countTollPayments.apply(this, arguments);
}

function _countTollPayments() {
  _countTollPayments = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(waypoints) {
    var tollRoads, tollCounts, countOneTollRoad, _countOneTollRoad, i, k, value, htmlInstruction, extracted, ex;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _countOneTollRoad = function _ref2() {
              _countOneTollRoad = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee(i, k, ex, value, waypoints, extracted) {
                var _waypoints$i$steps$k, start_location, end_location, mainDirections, tollRoad, mainDirection, tollRoadPrepare, m, g, paymentPoints, startPoint, endPoint, nearestDistance, mg, _mg, costsForWholeDistance, kl;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _waypoints$i$steps$k = waypoints[i].steps[k], start_location = _waypoints$i$steps$k.start_location, end_location = _waypoints$i$steps$k.end_location;
                        mainDirections = {
                          latitudeDifference: Math.abs(end_location.lat - start_location.lat),
                          longitudeDifference: Math.abs(end_location.lng - start_location.lng),
                          latitudeDirection: start_location.lat > end_location.lat ? "SOUTH" : start_location.lat === end_location.lat ? "NONE" : "NORTH",
                          longitudeDirection: start_location.lng > end_location.lng ? "WEST" : start_location.lng === end_location.lng ? "NONE" : "EAST"
                        };
                        _context.next = 4;
                        return _tollRoads["default"].findOne({
                          nameOfRoad: extracted[ex]
                        });

                      case 4:
                        tollRoad = _context.sent;
                        mainDirection = null;

                        if (tollRoad) {
                          tollRoadPrepare = {
                            name: extracted[ex],
                            pricingPlans: []
                          };

                          for (m = 0; m < tollRoad.route.length; m++) {
                            if (mainDirections.latitudeDirection === tollRoad.route[m].mainDirection || mainDirections.longitudeDirection === tollRoad.route[m].mainDirection) {
                              mainDirection = tollRoad.route[m];

                              for (g = 0; g < mainDirection.pricingPlans.length; g++) {
                                if (mainDirection.pricingPlans[g].paymentPoints) {
                                  paymentPoints = mainDirection.pricingPlans[g].paymentPoints;
                                  startPoint = null;
                                  endPoint = null;
                                  nearestDistance = {
                                    number: 0,
                                    value: (0, _geoservices.getDistanceFromLatLonInKm)(paymentPoints[0].location, end_location)
                                  };

                                  for (mg = 0; mg < paymentPoints.length; mg++) {
                                    if ((0, _geoservices.getDistanceFromLatLonInKm)(paymentPoints[mg].location, start_location) < nearestDistance.value) {
                                      nearestDistance = {
                                        number: mg,
                                        value: (0, _geoservices.getDistanceFromLatLonInKm)(paymentPoints[mg].location, start_location)
                                      };
                                    }
                                  }

                                  startPoint = nearestDistance.number;
                                  nearestDistance = {
                                    number: 0,
                                    value: (0, _geoservices.getDistanceFromLatLonInKm)(paymentPoints[0].location, end_location)
                                  };

                                  for (_mg = 0; _mg < paymentPoints.length; _mg++) {
                                    if ((0, _geoservices.getDistanceFromLatLonInKm)(paymentPoints[_mg].location, end_location) < nearestDistance.value) {
                                      nearestDistance = {
                                        number: _mg,
                                        value: (0, _geoservices.getDistanceFromLatLonInKm)(paymentPoints[_mg].location, end_location)
                                      };
                                    }
                                  }

                                  endPoint = nearestDistance.number;
                                  costsForWholeDistance = 0;

                                  for (kl = startPoint; kl <= endPoint; kl++) {
                                    costsForWholeDistance += paymentPoints[kl].cost;
                                  }

                                  tollRoadPrepare.pricingPlans.push({
                                    requirePropertyValue: mainDirection.pricingPlans[g].requirePropertyValue,
                                    costsForWholeDistance: costsForWholeDistance
                                  });
                                } else {
                                  //policz kilometrowo cenę
                                  tollRoadPrepare.pricingPlans.push({
                                    requirePropertyValue: mainDirection.pricingPlans[g].requirePropertyValue,
                                    costsForWholeDistance: value * mainDirection.pricingPlans[g].costPerKm / 1000
                                  });
                                }
                              }
                            }
                          }

                          tollRoads.push(tollRoadPrepare);
                        }

                      case 7:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));
              return _countOneTollRoad.apply(this, arguments);
            };

            countOneTollRoad = function _ref(_x2, _x3, _x4, _x5, _x6, _x7) {
              return _countOneTollRoad.apply(this, arguments);
            };

            tollRoads = [];
            tollCounts = [];

            for (i = 0; i < waypoints.length; i++) {
              for (k = 0; k < waypoints[i].steps.length; k++) {
                value = waypoints[i].steps[k].distance.value;

                if (value > 1000) {
                  htmlInstruction = waypoints[i].steps[k].html_instructions;
                  extracted = (0, _getRoadCode.getRoadCode)(htmlInstruction);

                  if (extracted) {
                    for (ex = 0; ex < extracted.length; ex++) {
                      tollCounts.push(countOneTollRoad(i, k, ex, value, waypoints, extracted));
                    }
                  }
                }
              }
            }

            _context2.next = 7;
            return Promise.all(tollCounts);

          case 7:
            return _context2.abrupt("return", tollRoads);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _countTollPayments.apply(this, arguments);
}
//# sourceMappingURL=tollPayments.js.map