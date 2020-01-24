db.companybases.aggregate([
  {
    $unwind: "$vehicles"
  },
  {
    $group: {
      _id: "$vehicles._id",
      count: {
        $sum: 1
      }
    }
  },
  {
    $match: {
      count: {
        $gt: 1
      }
    }
  }
]);
