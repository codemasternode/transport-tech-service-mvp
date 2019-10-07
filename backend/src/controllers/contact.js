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
