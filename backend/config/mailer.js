import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import dotenv from "dotenv/config";
import EmailTemplate from 'email-templates'

const options = {
  viewEngine: {
    extname: ".hbs",
    layoutsDir: "emailsTemplates/templates/",
    defaultLayout: "template",
    partialsDir: "emailsTemplates/partials/"
  },
  viewPath: "emailsTemplates/templates/",
  extName: ".hbs"
};

const fromEmail = `transport-tech-service-notifications <${
  process.env.EMAIL_ADDRESS_MAILER
}>`;

let transporter;

async function start() {
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ADDRESS_MAILER,
      pass: process.env.PASSSWORD_MAILER
    }
  });

  try {
    await transporter.verify();
  } catch (err) {
    console.log(err);
  }
}

start();

export function sendEmail({ to, subject, text, html }) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        fromEmail,
        to,
        subject,
        text,
        html
      },
      (err, info) => {
        if (err) {
          reject(err);
        }
        resolve();
      }
    );
  });
}
