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
    return res
      .status(400)
      .send({ msg: "You reached max number of company bases" });
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
        const A = await CompanyBase.updateOne(
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

        const generateSetParam = {};
        for (let key in req.body) {
          generateSetParam["companyBases.$[element]." + key] = req.body[key];
        }
        console.log(generateSetParam);

        const B = await Company.updateOne(
          {
            _id: req.params.company_id
          },
          {
            $set: {
              "companyBases.$[element].street": "ul.Małapolska 123"
            }
          },
          {
            arrayFilters: [
              { "element._id": ObjectId("5d652c6b2af78e6889a2458d") }
            ],
            session
          }
        );
      } else {
        const [companyBase] = await CompanyBase.create([{ ...req.body }], {
          session
        });
        console.log(companyBase);
        const B = await Company.updateOne(
          {
            _id: req.params._id
          },
          {
            $push: { companyBases: companyBase }
          },
          {
            session
          }
        );
        console.log(B);
      }
      await session.commitTransaction();
      session.endSession();
      return true;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }
}
