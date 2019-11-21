import { loadTemplate, sendEmail } from "../config/mailer";

export async function contactToUs(req, res) {
  const requireContactProperties = [
    "name",
    "surname",
    "email",
    "phone",
    "taxNumber",
    "description"
  ];

  for (let i = 0; i < requireContactProperties.length; i++) {
    if (
      !req.body[requireContactProperties[i]] ||
      req.body[requireContactProperties[i]].length === 0
    ) {
      return res.status(400).send({
        msg: `Missing ${requireContactProperties[i]} property`
      });
    }
  }

  const { name, surname, email, phone, taxNumber, description } = req.body;

  loadTemplate("contactToUs", [
    { name, surname, email, phone, taxNumber, description }
  ])
    .then(result => {
      sendEmail({
        to: "marcinwarzybok@outlook.com",
        subject: `New Customer ${name} ${surname}`,
        html: result[0].email.html,
        text: result[0].email.text
      });
    })
    .catch(err => {
      console.log(err);
    });
  res.send({});
}

export async function contactToCompany(req, res) {
  const requireContactProperties = [
    "name",
    "surname",
    "email",
    "phone",
    "taxNumber",
    "description",
    "points",
    "companyEmail"
  ];

  for (let i = 0; i < requireContactProperties.length; i++) {
    if (!req.body[requireContactProperties[i]]) {
      return res.status(400).send({
        msg: `Missing ${requireContactProperties[i]} property`
      });
    }
  }

  const {
    name,
    surname,
    email,
    phone,
    taxNumber,
    description,
    companyEmail,
    points
  } = req.body;

  let generatedURL = "https://www.google.com/maps/dir/?api=1&";
  for (let i = 0; i < points.length; i++) {
    if (i === 0) {
      generatedURL += `origin=${points[i].lat},${points[i].lng}&waypoints=`;
    } else if (i === points.length - 1) {
      generatedURL = generatedURL.substring(0, generatedURL.length - 1);
      generatedURL += `&destination=${points[i].lat},${points[i].lng}`;
    } else {
      generatedURL += `${points[i].lat},${points[i].lng}|`;
    }
  }
  generatedURL += "&travelmode=driving"
  console.log(generatedURL);

  // loadTemplate("contactToCompany", [
  //   { name, surname, email, phone, taxNumber, description, companyEmail }
  // ])
  //   .then(result => {
  //     sendEmail({
  //       to: "marcinwarzybok@outlook.com",
  //       subject: `New Customer ${name} ${surname}`,
  //       html: result[0].email.html,
  //       text: result[0].email.text
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
  res.send({});
}