import Company from "../models/company";
import { Types } from "mongoose";

export async function getStaticCostsByCompany(req, res) {
  if (!req.params.company_id) {
    return res.status(400).send({});
  }
  const company = await Company.findById(req.params.company_id);

  if (!company) {
    return res.status(404).send({});
  }

  res.send({
    staticCosts: company.staticCosts
  });
}

export async function postStaticCost(req, res) {
  if (!req.params.company_id) {
    return res.status(400).send({});
  }
  const company = await Company.findById(req.params.company_id);

  if (!company) {
    return res.status(404).send({});
  }

  let companyStats;

  try {
    companyStats = await Company.updateOne(
      { _id: new Types.ObjectId(req.params.company_id) },
      { $push: { staticCosts: req.body.staticCost } }
    );
  } catch (err) {
    return res.status(400).send({});
  }

  if (companyStats.n === 0) {
    return res.status(404).send({});
  }

  res.send({});
}

export async function overwriteStaticCosts(req, res) {
  if (!req.params.company_id || !Array.isArray(req.body.staticCosts)) {
    return res.status(400).send({});
  }

  let companyStats;
  try {
    companyStats = await Company.updateOne(
      { _id: new Types.ObjectId(req.params.company_id) },
      {
        $set: {
          staticCosts: req.body.staticCosts
        }
      }
    );
  } catch (err) {
    return res.status(400).send({});
  }

  if (companyStats.n === 0) {
    return res.status(404).send({
      msg: "Company doesn't exists"
    });
  }

  res.send({});
}

export async function putStaticCost(req, res) {
  const { company_id, id } = req.params;
  console.log("static");
  if (!company_id || !id) {
    return res.status(400).send({});
  }

  Company.updateOne(
    {
      _id: new Types.ObjectId(company_id),
      "staticCosts._id": new Types.ObjectId(id)
    },
    {
      $set: {
        "staticCosts.$[]": { ...req.body.staticCost, _id: req.params.id }
      }
    },
    { upsert: true }
  )
    .then(stat => {
      console.log(stat);
      res.send({});
    })
    .catch(err => {
      res.status(500).send({});
    });
}

export async function deleteStaticCost(req, res) {
  const { company_id, id } = req.params;

  if (!company_id || !id) {
    return res.status(400).send({});
  }

  Company.updateOne(
    {
      _id: company_id
    },
    {
      $pull: {
        staticCosts: {
          _id: id
        }
      }
    }
  )
    .then(stat => {
      console.log(stat);
      res.send({});
    })
    .catch(err => {
      res.status(500).send({});
    });
}
