"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadData = loadData;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function loadData(_x) {
  return _loadData.apply(this, arguments);
}

function _loadData() {
  _loadData = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(fileNames) {
    var getFileData, arrayOfPromisesWithFileData, i, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            getFileData = function getFileData(fileName) {
              return new Promise(function (resolve, reject) {
                _fs["default"].readFile(_path["default"].join(__dirname, "../data/".concat(fileName)), function (err, data) {
                  if (err) {
                    reject();
                  }

                  resolve(JSON.parse(data));
                });
              });
            };

            arrayOfPromisesWithFileData = [];

            for (i = 0; i < fileNames.length; i++) {
              arrayOfPromisesWithFileData.push(getFileData(fileNames[i]));
            }

            _context.next = 5;
            return Promise.all(arrayOfPromisesWithFileData);

          case 5:
            result = _context.sent;
            return _context.abrupt("return", result);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _loadData.apply(this, arguments);
}
//# sourceMappingURL=loadData.js.map