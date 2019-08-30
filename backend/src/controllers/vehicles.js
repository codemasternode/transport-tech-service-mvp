import Company from "../models/company";
import Vehicle from "../models/vehicle";
import CompanyBase from "../models/companyBase";
import { Types } from "mongoose";
import { isEqual } from "../helpers/object";

export async function getVehiclesByCompany(req, res) {
  if (!req.params.company_id) {
    return res.status(400).send({});
  }
  const company = await Company.findById(req.params.company_id);

  if (!company) {
    return res.status(404).send({});
  }

  res.send({
    vehicles: company.vehicles
  });
}

export async function getVehiclesWithCompanyBases(req, res) {
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

export async function postVehicle(req, res) {
  if (!req.params.company_id || !req.params.companyBase_id) {
    return res.status(400).send({});
  }

  const [company, companyBase, statDistinct] = await Promise.all([
    Company.findById(req.params.company_id),
    CompanyBase.findById(req.params.companyBase_id),
    Company.distinct("companyBases.vehicles._id", {
      _id: ObjectId("5d66b17b3601e93520b36908")
    })
  ]);

  if (!company) {
    return res.status(404).send({});
  }

  if (statDistinct.length === company.plan.vehicles) {
    return res.status(400).send({
      msg: `Your plan reached max number of vehicles: ${company.plan.vehicles}`
    });
  }

  execute();

  async function execute() {
    const session = Vehicle.startSession();
    session.startTransaction();

    try {
      const [vehicle] = await Vehicle.create([{ ...req.body }], { session });

      const cbStats = await CompanyBase.updateOne(
        {
          _id: req.params.companyBase_id
        },
        {
          $push: {
            vehicles: vehicle
          }
        },
        { session }
      );

      if (cbStats.nModified === 0) {
        throw { msg: "You don't modify vehicle in CompanyBase model" };
      }

      const cStats = await Company.updateOne(
        {
          _id: req.params.company_id,
          "companyBases._id": req.params.companyBase_id
        },
        {
          $push: {
            "companyBases.$.vehicles": vehicle
          }
        }
      );

      if (cStats.nModified === 0) {
        throw { msg: "You don't modify vehicle in CompanyBase model" };
      }
    } catch (error) {
      console.log(err);
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
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

export async function overwriteVehiclesWithCompanyBases(req, res) {
  if (
    !req.params.company_id ||
    !Array.isArray(req.body.companyBases) ||
    req.body.companyBases.length === 0
  ) {
    return res.status(400).send({});
  }

  const company = await Company.findById(req.params.company_id);

  if (!company) {
    return res.status(404).send({ msg: "Your company doesn't exist" });
  }

  if (req.body.companyBases.length > company.plan.companyBases) {
    return res.status(400).send({
      msg: `You reached max number of company bases: ${company.plan.companyBases}`
    });
  }

  const vehicles = [];
  for (let i = 0; i < req.body.companyBases.length; i++) {
    for (let k = 0; k < req.body.companyBases[i].vehicles.length; k++) {
      let isInside = false;
      for (let m = 0; m < vehicles.length; m++) {
        let coupe = { ...vehicles[m] };
        delete coupe.companyBasesId;
        if (isEqual(coupe, req.body.companyBases[i].vehicles[k])) {
          vehicles[m].companyBasesId.push(req.body.companyBases[i]._id);
          isInside = true;
        }
      }
      if (!isInside) {
        vehicles.push({
          ...req.body.companyBases[i].vehicles[k],
          companyBasesId: [req.body.companyBases[i]._id]
        });
      }
    }
  }

  if (company.plan.vehicles < vehicles.length) {
    return res.status(400).send({});
  }

  const vehiclesToRemove = [];
  for (let i = 0; i < company.companyBases.length; i++) {
    for (let k = 0; k < company.companyBases[i].vehicles.length; k++) {
      vehiclesToRemove.push(company.companyBases[i].vehicles[k]._id);
    }
  }

  execute()
    .then(() => {
      res.send({});
    })
    .catch(err => {
      console.log(err);
      res.status(400).send({ err });
    });

  async function execute() {
    const session = await Vehicle.startSession();
    session.startTransaction();

    try {
      const vehicleStats = await Vehicle.deleteMany(
        {
          _id: {
            $in: vehiclesToRemove
          }
        },
        { session }
      );

      const savedVehicles = await Vehicle.insertMany([...vehicles], {
        session
      });

      const setCompanyBase = {};
      const arrayFilters = [];

      for (let i = 0; i < vehicles.length; i++) {
        vehicles[i]._id = savedVehicles[i]._id;
        for (let k = 0; k < vehicles[i].companyBasesId.length; k++) {
          let couped = { ...vehicles[i] };
          delete couped.companyBasesId;
          if (setCompanyBase[`companyBases.$[filter${vehicles[i].companyBasesId[k]}].vehicles`]) {
            setCompanyBase[`companyBases.$[filter${vehicles[i].companyBasesId[k]}].vehicles`].push(couped);
          } else {
            setCompanyBase[`companyBases.$[filter${vehicles[i].companyBasesId[k]}].vehicles`] = [couped];
          }
          let isInside = false;
          for (let m = 0; m < arrayFilters.length; m++) {
            if (arrayFilters[m][`filter${vehicles[i].companyBasesId[k]}._id`]) {
              isInside = true;
            }
          }
          if (!isInside) {
            arrayFilters.push({
              [`filter${vehicles[i].companyBasesId[k]}._id`]: new Types.ObjectId(
                vehicles[i].companyBasesId[k]
              )
            });
          }
        }
      }

      console.log(setCompanyBase);
      console.log(arrayFilters);

      console.log(req.params.company_id);
      const companyStats = await Company.updateOne(
        { _id: req.params.company_id },
        {
          $set: setCompanyBase
        },
        {
          arrayFilters,
          session
        }
      );
      console.log(companyStats);

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
