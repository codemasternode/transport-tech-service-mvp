import CompanyModel from "../models/company";
import CountryModel from "../models/country";
import putCompanyInfoAllowModifiers from "../enums/putCompanyInfoAllowModifiers";

export function getCompanies(req, res) {
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
      res.status(404).send({});
    });
}

export async function getCompanyById(req, res) {
  const company = await CompanyModel.findById(req.params.id);
  if (!company) {
    return res.status(404).send({});
  }
  res.send(company);
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
  //jeżeli podmiot zagraniczny -> 206
  const newCompany = new CompanyModel({ ...req.body, country: country._id });
  newCompany.save(err => {
    if (err) {
      return res.status(400).send({ err });
    }
    if (req.body.country !== "PL") {
      return res.status(206).send({
        msg:
          "Your company has to be check by our service, don't worry, it should takes no longer than 24 hours"
      });
    }
    res.status(201).send();
  });
}

export async function putCompanyInfo(req, res) {
  for (let key in req.body.update) {
    let isInside = false;
    for (let i = 0; i < putCompanyInfoAllowModifiers.length; i++) {
      if (key === putCompanyInfoAllowModifiers[i]) {
        isInside = true;
      }
    }
    if (!isInside) {
      return res.status(400).send({
        msg: `This - ${key} can not be change`
      });
    }
  }

  const company = await CompanyModel.findById(req.params.id);

  if (!company) {
    return res.status(404).send({});
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
      console.log(error)
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
      console.log(error)
      return res.status(400).send({});
    }
  }
}

export async function deleteCompany(req, res) {
  const company = await CompanyModel.deleteOne({
    _id: req.params.id
  });

  res.send(company);
}
