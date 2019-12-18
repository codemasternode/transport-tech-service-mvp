"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var VehicleSchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  combustion: {
    type: Number,
    required: true,
    "default": 20,
    min: 1
  },
  capacity: {
    type: Number
  },
  dimensions: {
    length: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  },
  deprecationPerYear: {
    type: Number,
    required: true
  },
  valueOfTruck: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  averageDistancePerMonth: {
    type: Number,
    required: true,
    min: 0
  },
  range: {
    maxRange: {
      type: Number
    },
    minRange: {
      type: Number,
      "default": 0
    },
    operationRange: {
      type: Number,
      "default": 600
    }
  },
  margin: {
    type: Number,
    required: true,
    min: 0
  },
  waitingTimeParams: {
    maxFreeTime: {
      type: Number,
      min: 0
    },
    pricePerHourWaiting: {
      type: Number,
      min: 0
    }
  },
  fuel: {
    name: {
      type: String,
      required: true,
      "enum": ["Olej napędowy", "Olej napędowy +", "Benzyna Pb95", "Benzyna Pb98"]
    },
    price: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true,
      "default": "l/100km"
    },
    date: {
      type: Date,
      required: true,
      "default": new Date()
    }
  },
  countries: [{
    type: String
  }],
  sumKmPerMonth: {
    type: Number,
    "default": 0
  },
  sumCostPerMonth: {
    type: Number,
    "default": 0
  },
  monthCosts: {
    type: Number,
    "default": 0
  },
  salary: {
    type: Number,
    "default": 0
  },
  numberOfAxles: {
    type: Number,
    "default": 4
  },
  emissionLevel: {
    type: String,
    "default": "EURO 5"
  },
  permissibleGrossWeight: {
    type: Number,
    required: true
  }
}, {
  strict: false
});

var _default = _mongoose["default"].model("vehicle", VehicleSchema);

exports["default"] = _default;
//# sourceMappingURL=vehicle.js.map