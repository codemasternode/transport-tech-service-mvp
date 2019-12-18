"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _db = _interopRequireDefault(require("./config/db"));

var _road = _interopRequireDefault(require("./routes/road"));

var _websiteStats = _interopRequireDefault(require("./routes/websiteStats"));

var _path = _interopRequireDefault(require("path"));

var _contact = _interopRequireDefault(require("./routes/contact"));

var _mailer = _interopRequireDefault(require("./config/mailer"));

var _config = _interopRequireDefault(require("dotenv/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PORT = process.env.PORT || 5000,
    MONGO_DB_URL = process.env.MONGO_DB_URL;

if (process.env.mode === "DEV") {
  PORT = 5000;
  MONGO_DB_URL = "mongodb://localhost:27017/tts";
} //`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@localhost:27018,localhost:27019,localhost:27017/transporttechservice?replicaSet=rs0`,


var app = (0, _express["default"])();
(0, _db["default"])(MONGO_DB_URL);
app.use(_express["default"]["static"](_path["default"].join(__dirname, '../../client/build')));
app.use((0, _cors["default"])({
  credentials: true,
  origin: 'http://localhost:5000'
}));
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use(_express["default"].json());
app.use("/api/distance", (0, _road["default"])());
app.use("/api/webStatsRoutes", (0, _websiteStats["default"])());
app.use("/api/contact", (0, _contact["default"])());
app.get('*', function (req, res) {
  console.log(_path["default"].join(__dirname, '../../client/build/index.html'));
  res.sendFile(_path["default"].join(__dirname, '../../client/build/index.html'));
});
var server = app.listen(PORT, function () {
  console.log("Application is running on port ".concat(PORT));
});
process.on("exit", function () {
  server.close();
});
var _default = app;
exports["default"] = _default;
//# sourceMappingURL=index.js.map