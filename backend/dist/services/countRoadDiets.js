"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.countRoadDiets = countRoadDiets;

var _diets = _interopRequireDefault(require("../models/diets"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function countRoadDiets(_x, _x2, _x3) {
  return _countRoadDiets.apply(this, arguments);
}

function _countRoadDiets() {
  _countRoadDiets = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(waypoints, time, listOfCountries) {
    var scaleOfTime, sumDiets, dietsTo24Hours, dietsAbove24Hours, avaiableHoursPerDay, dietsInCountries, fullTime, fullNumberOfDays, timeNeededCounter, ck, l, timeNeeded, numberOfDays, _timeNeededCounter, _ck, country, c, i, counter, isFull, mk;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            scaleOfTime = 1.2;
            sumDiets = 0;
            dietsTo24Hours = [{
              from: 0,
              to: 0.33,
              value: 1 / 3
            }, {
              from: 0.33,
              to: 0.5,
              value: 1 / 2
            }, {
              from: 0.5,
              to: 1,
              value: 1
            }];
            dietsAbove24Hours = [{
              from: 0,
              to: 0.5,
              value: 1 / 2
            }, {
              from: 0.5,
              to: 1,
              value: 1
            }];
            avaiableHoursPerDay = [10, 10, 9, 9, 9, 9];
            _context.next = 7;
            return _diets["default"].find({
              countryName: {
                $in: listOfCountries
              }
            });

          case 7:
            dietsInCountries = _context.sent;
            fullTime = time * scaleOfTime; //czas na dojazd w jednym kierunku

            fullNumberOfDays = 0;
            timeNeededCounter = 0;
            ck = 0;

            while (timeNeededCounter < fullTime) {
              if (avaiableHoursPerDay[ck % 6] > fullTime - timeNeededCounter) {
                fullNumberOfDays += (fullTime - timeNeededCounter) / 24;
              } else {
                fullNumberOfDays += 1;
              }

              timeNeededCounter += avaiableHoursPerDay[ck % 6];

              if (ck != 0 && ck % 6 == 0) {
                fullNumberOfDays += 2;
              }

              ck++;
            }

            for (l = 0; l < waypoints.length; l++) {
              timeNeeded = waypoints[l].duration.value / 60 / 60 * scaleOfTime; //czas na dojazd w jednym kierunku

              numberOfDays = 0;
              _timeNeededCounter = 0;
              _ck = 0;

              while (_timeNeededCounter < timeNeeded) {
                if (avaiableHoursPerDay[_ck % 6] > timeNeeded - _timeNeededCounter) {
                  numberOfDays += (timeNeeded - _timeNeededCounter) / 24;
                } else {
                  numberOfDays += 1;
                }

                _timeNeededCounter += avaiableHoursPerDay[_ck % 6];

                if (_ck != 0 && _ck % 6 == 0) {
                  numberOfDays += 2;
                }

                _ck++;
              }

              country = listOfCountries[l * 2 + 1];

              for (c = 0; c < dietsInCountries.length; c++) {
                if (country === dietsInCountries[c].countryName) {
                  country = dietsInCountries[c];
                }
              }

              if (fullNumberOfDays < 1) {
                for (i = 0; i < dietsTo24Hours.length; i++) {
                  if (numberOfDays <= dietsTo24Hours[i].to && numberOfDays > dietsTo24Hours[i].from) {
                    sumDiets += dietsTo24Hours[i].value * country.dietValueInPLN;
                  }
                }
              } else {
                counter = 0;

                while (numberOfDays > counter) {
                  isFull = false;

                  for (mk = 0; mk < dietsAbove24Hours.length; mk++) {
                    if (!isFull && dietsAbove24Hours[mk].to + counter >= numberOfDays) {
                      isFull = true;
                      sumDiets += country.dietValueInPLN * dietsAbove24Hours[mk].value;
                      counter += dietsAbove24Hours[mk].to;
                    }
                  }

                  if (!isFull) {
                    sumDiets += country.dietValueInPLN * dietsAbove24Hours[dietsAbove24Hours.length - 1].value;
                    counter += dietsAbove24Hours[dietsAbove24Hours.length - 1].to;
                  }
                }

                sumDiets += Math.floor(numberOfDays) * country.dietValueInPLN * 1.5;
              }
            }

            return _context.abrupt("return", {
              sumDiets: sumDiets,
              fullNumberOfDays: fullNumberOfDays
            });

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _countRoadDiets.apply(this, arguments);
}
//# sourceMappingURL=countRoadDiets.js.map