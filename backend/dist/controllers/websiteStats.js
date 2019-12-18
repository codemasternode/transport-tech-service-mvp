"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postWebsiteStats = postWebsiteStats;

var _websiteStatistics = _interopRequireDefault(require("../models/websiteStatistics"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function postWebsiteStats(_x, _x2) {
  return _postWebsiteStats.apply(this, arguments);
}

function _postWebsiteStats() {
  _postWebsiteStats = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            res.send({});
            _context.next = 3;
            return _websiteStatistics["default"].update({
              name: req.body.name
            }, {
              $push: {
                visits: Date.parse(req.body.date)
              }
            }, {
              upsert: true
            });

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _postWebsiteStats.apply(this, arguments);
}
//# sourceMappingURL=websiteStats.js.map