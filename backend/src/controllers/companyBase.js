import Company from "../models/company";
import CompanyBase from "../models/companyBase";
import Vehicle from "../models/vehicle";
import { Types } from "mongoose";

export async function getBasesByCompany(req, res) {
  if (!req.params.company_id) {
    return res.status(400).send({});
  }

  let company;
  try {
    company = await Company.findById(req.params.company_id);
  } catch (err) {
    return res.status(400).send({ err });
  }

  if (!company) {
    return res.status(404).send({});
  }

  res.send({
    companyBases: company.companyBases
  });
}

export async function createOrUpdateBase(req, res) {
  if (!req.params.company_id) {
    return res.status(400).send({});
  }

  let company;
  try {
    company = await Company.findById(req.params.company_id);
  } catch (err) {
    return res.status(400).send({ err });
  }

  if (!company) {
    return res.status(404).send({});
  }

  if (req.body._id) {
    let isInside = false;
    for (let i = 0; i < company.companyBases.length; i++) {
      if (company.companyBases[i]._id.toString() === req.body._id) {
        isInside = true;
      }
    }
    if (!isInside) {
      return res.status(400).send({
        err: "You are trying to update non existing company base"
      });
    }
  }

  if (company.plan.companyBases === company.companyBases.length) {
    return res.status(400).send({
      msg: `You reached max number of company bases: ${company.plan.companyBases}`
    });
  }

  execute()
    .then(() => {
      res.send({});
    })
    .catch(err => {
      res.status(400).send({ err });
    });

  async function execute() {
    const session = await CompanyBase.startSession();
    session.startTransaction();

    try {
      const vehiclesToRemove = [];

      for (let i = 0; i < company.companyBases.length; i++) {
        if (company.companyBases[i]._id === req.body._id) {
          vehiclesToRemove = company.companyBases[i].vehicles.map(value => {
            return value._id;
          });
          break;
        }
      }

      const deleteStats = await Vehicle.deleteMany(
        {
          _id: { $in: vehiclesToRemove }
        },
        { session }
      );

      let vehicles = [];
      if (req.body.vehicles && req.body.vehicles.length > 0) {
        vehicles = await Vehicle.create(req.body.vehicles, { session });
      }

      if (req.body._id) {
        const companyBaseStats = await CompanyBase.updateOne(
          { _id: req.body._id },
          {
            $set: {
              ...req.body,
              vehicles
            }
          },
          {
            session
          }
        );

        if (companyBaseStats.nModified === 0) {
          throw { msg: "You don't modify CompanyBase" };
        }

        const generateSetParam = {};
        for (let key in req.body) {
          if (key !== "_id") {
            generateSetParam["companyBases.$[element]." + key] = req.body[key];
          }
        }
        generateSetParam["companyBases.$[element].vehicles"] = vehicles;

        const companyStats = await Company.updateOne(
          {
            _id: req.params.company_id
          },
          {
            $set: generateSetParam
          },
          {
            arrayFilters: [{ "element._id": new Types.ObjectId(req.body._id) }],
            session
          }
        );
        if (companyStats.nModified === 0) {
          throw { msg: "You don't modify companyBase in Company model" };
        }
      } else {
        const [companyBase] = await CompanyBase.create(
          [{ ...req.body, vehicles }],
          {
            session
          }
        );

        const stats = await Company.updateOne(
          {
            _id: req.params.company_id
          },
          {
            $push: { companyBases: companyBase }
          },
          {
            session
          }
        );
        if (stats.nModified === 0) {
          throw { msg: "You don't modify companyBase in Company model" };
        }
      }
      await session.commitTransaction();
      session.endSession();
      return true;
    } catch (err) {
      console.log(err);
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }
}

export async function overwriteCompanyBases(req, res) {
  if (
    !req.params.company_id ||
    !Array.isArray(req.body.companyBases) ||
    req.body.companyBases.length === 0
  ) {
    return res.status(400).send({});
  }

  const company = await Company.findById(req.params.company_id);

  if (!company) {
    return res.status(404).send({});
  }

  if (req.body.companyBases.length > company.plan.companyBases) {
    return res.status(400).send({
      msg: `You reached max number of company bases: ${company.plan.companyBases}`
    });
  }

  const companyBasesToRemove = company.companyBases.filter(value => {
    return value._id;
  });

  execute()
    .then(() => {
      res.send({});
    })
    .catch(err => {
      res.status(400).send({ err });
    });

  async function execute() {
    const session = await CompanyBase.startSession();
    session.startTransaction();
    try {
      const companyBaseStats = await CompanyBase.deleteMany(
        {
          _id: {
            $in: companyBasesToRemove
          }
        },
        { session }
      );

      const companyBases = await CompanyBase.insertMany(req.body.companyBases);

      const companyStats = await Company.updateOne(
        {
          _id: req.params.company_id
        },
        {
          $set: {
            companyBases
          }
        },
        { session }
      );

      await session.commitTransaction();
      session.endSession();
      return true;
    } catch (err) {
      console.log(err);
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }
}
