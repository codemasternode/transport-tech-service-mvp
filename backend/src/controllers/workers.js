import Company from "../models/company";
import { Types } from "mongoose";

export async function getWorkerByCompany(req, res) {
  if (!req.params.company_id) {
    return res.status(400).send({});
  }
  const company = await Company.findById(req.params.company_id);

  if (!company) {
    return res.status(404).send({});
  }

  res.send({
    workers: company.workers
  });
}
export async function postWorker(req, res) {
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
      { $push: { workers: req.body.worker } }
    );
  } catch (err) {
    return res.status(400).send({});
  }

  if (companyStats.n === 0) {
    return res.status(404).send({});
  }

  res.send({});
}

export async function overwriteWorkers(req, res) {
  if (!req.params.company_id || !Array.isArray(req.body.workers)) {
    return res.status(400).send({});
  }
  console.log(req.body.workers)
  let companyStats;
  try {
    companyStats = await Company.update(
      { _id: new Types.ObjectId(req.params.company_id) },
      {
        $set: {
          workers: req.body.workers
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

export async function putWorker(req, res) {
  const { company_id, id } = req.params;

  if (!company_id || !id) {
    return res.status(400).send({});
  }

  Company.updateOne(
    {
      _id: new Types.ObjectId(company_id),
      "workers._id": new Types.ObjectId(id)
    },
    {
      $set: {
        "workers.$[]": { ...req.body.worker, _id: req.params.id }
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

export async function deleteWorker(req, res) {
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
        workers: {
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
