import { loadTemplate, sendEmail } from "../config/mailer";

export async function contactToUs(req, res) {
  const requireContactProperties = [
    "name",
    "surname",
    "email",
    "description",
    "topic"
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

  let { name, surname, email, taxNumber, description, companyName, topic } = req.body;
  if (!taxNumber) {
    taxNumber = "Brak"
  }
  if (!companyName) {
    companyName = "Brak"
  }
  loadTemplate("contactToUs", [
    { name, surname, email, taxNumber, description, companyName, topic }
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
    "startTime",
    "fullCost",
    "weight",
    "height",
    "description",
    "companyEmail",
    "vehicles",
    "points",
    "isDimensions"
  ];

  for (let i = 0; i < requireContactProperties.length; i++) {
    if (req.body[requireContactProperties[i]] === undefined) {
      return res.status(400).send({
        msg: `Missing ${requireContactProperties[i]} property`
      });
    }
  }

  let {
    name,
    surname,
    email,
    phone,
    startTime,
    companyName,
    taxNumber,
    fullCost,
    weight,
    height,
    width,
    length,
    numberOfPalettes,
    typeOfPalette,
    description,
    companyEmail,
    vehicles,
    points,
    isDimensions
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
  if (!taxNumber) {
    taxNumber = "-"
  }
  if (!companyName) {
    companyName = "-"
  }

  if(!description) {
    description = ""
  }
  loadTemplate("contactToCompany", [
    {
      name,
      surname,
      email,
      phone,
      startTime,
      companyName,
      taxNumber,
      fullCost,
      weight,
      height,
      width,
      length,
      numberOfPalettes,
      typeOfPalette,
      description,
      vehicles,
      points,
      isDimensions,
      urlRoute: generatedURL
    }
  ])
    .then(result => {
      sendEmail({
        to: companyEmail,
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
