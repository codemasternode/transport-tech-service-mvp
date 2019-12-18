"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDistanceFromLatLonInKm = getDistanceFromLatLonInKm;
exports.createDistanceGoogleMapsRequest = createDistanceGoogleMapsRequest;
exports.getCountryNameByReverseGeocoding = getCountryNameByReverseGeocoding;
exports.getCountryFromAddress = getCountryFromAddress;
exports.extractHtmlInstruction = extractHtmlInstruction;

var _axios = _interopRequireDefault(require("axios"));

require("dotenv/config");

var _maps = _interopRequireDefault(require("@google/maps"));

var _commandsPrior = _interopRequireDefault(require("../data/default/commandsPrior"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var googleMapsClient = _maps["default"].createClient({
  key: process.env.GOOGLE_API,
  Promise: Promise
});

function getDistanceFromLatLonInKm(point1, point2) {
  var R = 6371; // Radius of the earth in km

  var dLat = deg2rad(point2.lat - point1.lat); // deg2rad below

  var dLon = deg2rad(point2.lng - point1.lng);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(point1.lat)) * Math.cos(deg2rad(point2.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km

  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function createDistanceGoogleMapsRequest(points) {
  var distanceConfigObj = {
    origin: "".concat(points[0].lat, ",").concat(points[0].lng),
    destination: "".concat(points[points.length - 1].lat, ",").concat(points[points.length - 1].lng)
  };

  if (points.length === 2) {
    return distanceConfigObj;
  } else {
    distanceConfigObj.waypoints = [];

    for (var i = 1; i < points.length - 1; i++) {
      distanceConfigObj.waypoints.push("".concat(points[i].lat, ",").concat(points[i].lng));
    }

    return distanceConfigObj;
  }
}

function getCountryNameByReverseGeocoding(lat, lng) {
  return new Promise(function (resolve, reject) {
    googleMapsClient.reverseGeocode({
      latlng: "".concat(lat, ",").concat(lng),
      result_type: "country"
    }).asPromise().then(function (response) {
      resolve(response.json.results[0].formatted_address);
    })["catch"](function (err) {
      reject(err);
    });
  });
}

function getCountryFromAddress(address) {
  address = address.split(",").reverse();
  return address[0].trim();
}

function extractHtmlInstruction(htmlInstruction) {
  htmlInstruction = htmlInstruction.replace(/<\/?[^>]+(>|$)/g, "");
  var roadSigns = htmlInstruction.match(/[a-z][0-9]+/gim);
  return roadSigns;
}
//# sourceMappingURL=geoservices.js.map