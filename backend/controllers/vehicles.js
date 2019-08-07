<<<<<<< HEAD
export async function getVehiclesByCompany(req, res) {
    
}

export async function getVehicleById(req, res) {}

export async function postVehicle(req, res) {}

export async function putVehicle(req, res) {}

export async function deleteVehicle(req, res) {}
=======
import Company from "../models/company";
import { Types } from "mongoose";

export async function getVehiclesByCompany(req, res) {
  if (!req.params.company_id) {
    return res.status(400).send({});
  }
  const company = await Company.findById(req.params.company_id);

  if (!company) {
    return res.status(404).send({});
  }

  res.send({
    company
  });
}
export async function postVehicle(req, res) {
  console.log("asd");
  if (!req.params.company_id) {
    return res.status(400).send({});
  }

  Company.updateOne(
    { _id: new Types.ObjectId(req.params.company_id) },
    { $push: { vehicles: req.body.vehicle } }
  )
    .then(stat => {
      console.log(stat);
      res.send({});
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({});
    });
}

export async function putVehicle(req, res) {
  const { company_id, id } = req.params;
  console.log("abc");
  if (!company_id || !id) {
    return res.status(400).send({});
  }

  Company.updateOne(
    {
      _id: new Types.ObjectId(company_id),
      "vehicles._id": new Types.ObjectId(id)
    },
    {
      $set: {
        "vehicles.$[]": { ...req.body.vehicle, _id: req.params.id }
      }
    },
    { upsert: true }
  )
    .then(stat => {
      console.log(stat);
      res.send({});
    })
    .catch(err => {
      console.log(err, "to tu");
      res.status(500).send({});
    });
}

export async function deleteVehicle(req, res) {
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
        vehicles: {
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
>>>>>>> 2254e59d472b618a201ca487775dbb412e6fcd17
