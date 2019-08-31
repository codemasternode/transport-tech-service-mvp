import Company from "../models/company";
import User from "../models/user";
import { Types } from "mongoose";

export async function getUsersByCompany(req, res) {
  if (!req.params.company_id) {
    return res.status(400).send({});
  }
  const company = await Company.findById(req.params.company_id);

  if (!company) {
    return res.status(404).send({});
  }

  const users = await User.find(
    {
      _id: {
        $in: company.users
      }
    },
    {
      password: 0
    }
  );

  res.send({
    users
  });
}

export async function postUser(req, res) {
  if (!req.params.company_id) {
    return res.status(400).send({});
  }
  const company = await Company.findById(req.params.company_id);

  if (!company) {
    return res.status(404).send({});
  }

  if (company.users.length === company.plan.users) {
    return res.status(400).send({
      msg: `You reached max number of users: ${company.plan.users}`
    });
  }

  execute();

  async function execute() {
    const session = await User.startSession();
    session.startTransaction();
    try {
      const [user] = await User.create([req.body.user], { session });
      console.log(user);
      const companyStats = await Company.updateOne(
        {
          _id: new Types.ObjectId(req.params.company_id)
        },
        {
          $push: {
            users: user._id
          }
        },
        {
          session
        }
      );
      console.log(companyStats);
      if (companyStats.nModified === 0) {
        throw new Error("You don't modify user model");
      }
      await session.commitTransaction();
      session.endSession();

      res.send({});
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send({ err });
    }
  }
}

export async function overwriteUsers(req, res) {
  if (!req.params.company_id || !Array.isArray(req.body.users)) {
    return res.status(400).send({});
  }
  const company = await Company.findById(req.params.company_id);

  if (!company) {
    return res.status(404).send({});
  }
  console.log(req.body.users.length, company.plan.users);
  if (req.body.users.length > company.plan.users) {
    return res.status(400).send({
      msg: `You reached max number of users: ${company.plan.users}`
    });
  }

  execute();

  async function execute() {
    const session = await User.startSession();
    session.startTransaction();
    try {
      await User.deleteMany(
        {
          _id: {
            $in: company.users
          }
        },
        { session }
      );

      let users;

      if (req.body.users.length !== 0) {
        users = await User.create(req.body.users, { session });
      } else {
        users = [];
      }

      const usersIds = users.map(value => {
        return value._id;
      });

      await Company.updateOne(
        {
          _id: new Types.ObjectId(req.params.company_id)
        },
        {
          $set: {
            users: usersIds
          }
        },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      res.send({});
    } catch (err) {
      console.log(err);
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send({ err });
    }
  }
}
