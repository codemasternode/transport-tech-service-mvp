"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.search = search;
var vehiclesWithVolume = ["Silos", "Cysterna chemiczna", "Cysterna gazowa", "Cysterna paliwowa"];

function search(array, dimensions, capacityOrVolume, type) {
  if (type === "capacity") {
    var demandVolume = dimensions.width * dimensions.height * dimensions.length;
    var chooseVehicles = [];
    array.sort(function (a, b) {
      return a.fullCost - b.fullCost;
    });

    for (var i = 0; i < array.length; i++) {
      var _array$i$dimensions = array[i].dimensions,
          width = _array$i$dimensions.width,
          height = _array$i$dimensions.height,
          length = _array$i$dimensions.length;
      var vehicleVolume = width * height * length;

      if (vehicleVolume > demandVolume && array[i].capacity > capacityOrVolume) {
        chooseVehicles.push(array[i]);
        return chooseVehicles;
      }
    }

    chooseVehicles = [];
    var enoughVolume = 0;
    var enoughCapacity = 0;
    array.sort(function (a, b) {
      return b.capacity - a.capacity;
    });

    for (var _i = 0; _i < array.length; _i++) {
      var _array$_i$dimensions = array[_i].dimensions,
          width = _array$_i$dimensions.width,
          height = _array$_i$dimensions.height,
          length = _array$_i$dimensions.length;

      var _vehicleVolume = width * height * length;

      chooseVehicles.push(array[_i]);
      enoughVolume += _vehicleVolume;
      enoughCapacity += array[_i].capacity;

      if (enoughVolume > demandVolume && enoughCapacity > capacityOrVolume) {
        return chooseVehicles;
      }
    }

    return null;
  } else if (type === "volume") {
    var _chooseVehicles = [];
    array.sort(function (a, b) {
      return a.fullCost - b.fullCost;
    });

    for (var _i2 = 0; _i2 < array.length; _i2++) {
      if (array[_i2].volume > capacityOrVolume) {
        _chooseVehicles.push(array[_i2]);

        return _chooseVehicles;
      }
    }

    _chooseVehicles = [];
    var _enoughVolume = 0;
    array.sort(function (a, b) {
      return b.volume - a.volume;
    });

    for (var _i3 = 0; _i3 < array.length; _i3++) {
      _chooseVehicles.push(array[_i3]);

      _enoughVolume += array[_i3].volume;

      if (_enoughVolume > capacityOrVolume) {
        return _chooseVehicles;
      }
    }

    return null;
  }
}
//# sourceMappingURL=subsetsum.js.map