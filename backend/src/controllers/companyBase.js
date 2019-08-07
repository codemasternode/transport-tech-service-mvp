import Company from "../models/company";
import CompanyBase from "../models/companyBase";
import { Types } from "mongoose";

export async function getBasesByCompany(req, res) {
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

export async function postCompanyBase(req, res) {
  if (!req.params.company_id) {
    return res.status(400).send({});
  }

  let createdBase;
  try {
    createdBase = await CompanyBase.create(req.body.companyBase);
  } catch (err) {
    return res.status(400).send({});
  }

  Company.updateOne(
    { _id: new Types.ObjectId(req.params.company_id) },
    { $push: { companyBases: createdBase._id } }
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

export async function putCompanyBase(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({});
  }

  const updated = await CompanyBase.updateOne(
    { _id: id },
    req.body.companyBase
  );

  res.send({});
}

export async function deleteCompanyBase(req, res) {
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
        companyBases: id
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
