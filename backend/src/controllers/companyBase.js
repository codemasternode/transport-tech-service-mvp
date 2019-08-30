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
    companyBases: company.companyBases
  });
}

export async function createOrUpdateBase(req, res) {
  console.log(req.params.company_id);
  if (!req.params.company_id) {
    return res.status(400).send({});
  }

  const company = await Company.findById(req.params.company_id);

  if (!company) {
    return res.status(404).send({});
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
      if (req.body._id) {
        const companyBaseStats = await CompanyBase.updateOne(
          { _id: req.body._id },
          {
            $set: {
              ...req.body
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
        console.log(generateSetParam);

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
        const [companyBase] = await CompanyBase.create([{ ...req.body }], {
          session
        });
        console.log(companyBase);
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
    return res
      .status(400)
      .send({
        msg: `You reached max number of company bases: ${company.plan.companyBases}`
      });
  }

  const companyBasesToRemove = company.companyBases.filter(value => {
    return value._id;
  });

  console.log(companyBasesToRemove);

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
