import CompanyModel from "../models/company";
import CountryModel from "../models/country";
import { CastError } from "mongoose";
import putCompanyInfoAllowModifiers from "../enums/putCompanyInfoAllowModifiers";
import {
  setToDeleteCompanyStack,
  setToTemporaryStack,
  getFromConfirmEmailStack,
  removeFromConfirmEmailStack,
  removeFromTemporaryStack
} from "../config/redis";
import {
  REDIS_INTERNAL_ERROR,
  REDIS_CONFIRM_EMAIL_STACK,
  FOUND_KEY,
  NOT_FOUND_KEY
} from "../statuses/redisStatuses";
import { setToConfirmEmailStack } from "../config/redis";
import dotenv from "dotenv/config";
import uuid from "uuid/v1";
import { loadTemplate, sendEmail } from "../config/mailer";

export function getCompaniesByPage(req, res) {
  const getAllCompanies = async function() {
    let companies = await CompanyModel.aggregate([
      {
        $skip: (Number(req.params.page) - 1) * 10
      },
      {
        $limit: 10
      }
    ]);

    if (companies.length === 0) {
      throw new Error("Error in pagination, out of range");
    }
    return companies;
  };

  const getInfoCompanies = async function() {
    return await CompanyModel.count({});
  };

  Promise.all([getAllCompanies(), getInfoCompanies()])
    .then(result => {
      res.send({
        companies: result[0],
        numberOfCompanies: result[1]
      });
    })
    .catch(err => {
      res.status(500).send({});
    });
}

export async function getCompanyById(req, res) {
  try {
    const company = await CompanyModel.findById(req.params.id);
    if (!company) {
      return res.status(404).send({});
    }
    res.send(company);
  } catch (err) {
    if (err instanceof CastError) {
      return res.status(404).send({
        msg: "Wrong ID"
      });
    }
    res.status(500).send({});
  }
}

export async function postCompany(req, res) {
  const country = await CountryModel.findOne({
    name: req.body.country
  });
  if (!country) {
    return res.status(400).send({
      country: `This country doesn't exist ${req.body.country}`
    });
  }
  //sprawdzenie czy firma istnieje w CEIDG jeśli jest to podmiot PL,
  //jeśli zagraniczny to jest wymagane sprawdzenie ręczne
  //jeżeli podmiot zagraniczny -> 202
  const newCompany = new CompanyModel({ ...req.body, country: country._id });
  newCompany.save(err => {
    if (err) {
      return res.status(400).send({ err });
    }

    let code = uuid(),
      expireAt = new Date();
    expireAt.setDate(expireAt.getDate() + 1);
    setToConfirmEmailStack(code, req.body.email);
    let users = [
      {
        name: req.body.name,
        email: req.body.email,
        url: `${process.env.URL}/api/company/confirm-email/${code}`
      }
    ];
    loadTemplate("confirmCreate", users).then(results => {
      return Promise.all(
        results.map(result => {
          sendEmail({
            to: result.context.email,
            subject: result.email.subject,
            html: result.email.html,
            text: result.email.text
          });
        })
      );
    });

    // sendEmail({ to: "arturgarlacz@teachtechservice.com", subject: "wwww", text: "WD", html: "s" })
    if (req.body.country !== "PL") {
      return res.status(202).send({
        msg:
          "Your company has to be check by our service, don't worry, it should takes no longer than 24 hours"
      });
    }
    res.status(201).send({});
  });
}

export async function putCompanyInfo(req, res) {
  for (let key in req.body.update) {
    let isInside = false;
    for (let i = 0; i < putCompanyInfoAllowModifiers.length; i++) {
      if (key === putCompanyInfoAllowModifiers[i]) {
        isInside = true;
        break;
      }
    }
    if (!isInside) {
      return res.status(400).send({
        msg: `This - ${key} can not be change`
      });
    }
  }
  try {
    const company = await CompanyModel.findById(req.params.id);
    if (!company) {
      return res.status(404).send({});
    }
  } catch (err) {
    if (err instanceof CastError) {
      return res.status(404).send({});
    }
    res.status(500).send({});
  }

  let country;
  if (req.body.update.country) {
    country = await CountryModel.findOne({
      name: req.body.update.country
    });
    if (!country) {
      return res.status(400).send({
        msg: `Country ${
          req.body.update.country
        } you are trying to change for doesn't exist`
      });
    }
    try {
      const updatedCompany = await CompanyModel.updateOne(
        {
          _id: req.params.id
        },
        {
          $set: { ...req.body.update, country: country._id }
        }
      );
      res.send({});
    } catch (error) {
      return res.status(400).send({});
    }
  } else {
    try {
      const updatedCompany = await CompanyModel.updateOne(
        {
          _id: req.params.id
        },
        {
          $set: req.body.update
        }
      );
      res.send({});
    } catch (error) {
      return res.status(400).send({});
    }
  }
}

export async function deleteCompanyByAdmin(req, res) {
  if (!req.params.id) {
    return res.status(400).send({});
  }

  if (req.body.message) {
    //wyslij wiadomość do użytkownika
  }

  const company = await CompanyModel.deleteOne({
    _id: req.params.id
  });

  res.send({});
}

export async function deleteCompanyByCompany(req, res) {
  if (!req.params.id) {
    return res.status(400).send({});
  }

  const company = await CompanyModel.findOne({
    _id: req.params.id
  });

  if (!company) {
    return res.status(404).send({});
  }

  const key = uuid();

  setToDeleteCompanyStack(key, company.id)
    .then(() => {
      //wyślij email potwierdzający usuwanie firmy
      let users = [
        {
          name: req.body.name,
          email: req.body.email
        }
      ];
      loadTemplate("confirmDelete", users).then(results => {
        return Promise.all(
          results.map(result => {
            sendEmail({
              to: result.context.email,
              subject: result.email.subject,
              html: result.email.html,
              text: result.email.text
            });
          })
        );
      });
      res.send({
        msg: "We send confirmation on your company email",
        email: company.email
      });
    })
    .catch(err => {
      if (err === REDIS_INTERNAL_ERROR) {
        return res.status(500).send({});
      }
      res.status(400).send({});
    });
}

export async function putTaxInfo(req, res) {
  if (
    !req.params.id ||
    !req.body.update.taxNumber ||
    !req.body.update.taxNumber.length === 0
  ) {
    return res.status(400).send({});
  }

  const company = await CompanyModel.findById(req.params.id);

  if (!company) {
    return res.status(404).send({});
  }

  //sprawdzenie danych w ceidg lub innym badziewiu
  //zmiana nazwy firmy

  try {
    let updated = await CompanyModel.updateOne(
      {
        _id: req.params.id
      },
      {
        $set: {
          taxNumber: req.body.update.taxNumber
        }
      }
    );
  } catch (err) {
    return res.status(400).send({});
  }
}

export async function putPricingPlan(req, res) {
  const { plan } = req.body;
  if (!plan) {
    return res.status(400).send({});
  }

  const company = await CompanyModel.findOne({ email: req.params.email });

  if (!company) {
    return res.status(404).send({});
  }

  if (plan === company.plan) {
    return res.status(304).send({
      msg: "Pricing without change"
    });
  }

  try {
    const updated = await CompanyModel.updateOne(
      {
        email: req.params.email
      },
      {
        $set: {
          plan
        }
      }
    );
    res.send({});
  } catch (err) {
    return res.status(400).send({});
  }
}

export async function putCompanyEmail(req, res) {}

export async function putPaidDate(req, res) {}

export async function confirmEmail(req, res) {
  if (!req.params.codeConfirm) {
    return res.redirect("/registration/checkEmail?ok=MISSING");
  }

  getFromConfirmEmailStack(req.params.codeConfirm)
    .then(response => {
      CompanyModel.updateOne(
        {
          email: response.message
        },
        {
          isConfirmed: true
        }
      ).then(stat => {
        res.redirect(
          `/registration/checkEmail?ok=OK&email=${response.message}`
        );
      });
    })
    .catch(err => {
      if (err === NOT_FOUND_KEY) {
        res.redirect("/registration/checkEmail?ok=NOT_FOUND_KEY");
      } else {
        res.redirect("/registration/checkEmail?ok=REDIS_INTERNAL_ERROR");
      }
    });
}
