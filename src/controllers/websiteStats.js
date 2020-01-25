import WebsiteStats from "../models/websiteStatistics";

export async function postWebsiteStats(req, res) {
  res.send({});
  await WebsiteStats.update(
    { name: req.body.name },
    {
      $push: {
        visits: new Date(req.body.date)
      }
    },
    {
      upsert: true
    }
  );
}
