db.vehicles.aggregate([
  {
    $group: {
      _id: "$type",
      count: {
        $sum: 1
      }
    }
  }
]);
