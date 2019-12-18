"use strict";

db.vehicles.aggregate([{
  $group: {
    _id: "$type",
    count: {
      $sum: 1
    }
  }
}]);
//# sourceMappingURL=groupByType.js.map