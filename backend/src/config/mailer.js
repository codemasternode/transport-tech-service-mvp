import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import dotenv from "dotenv/config";
import EmailTemplate from "email-templates";
import path from "path";

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

console.log(process.env.EMAIL_ADDRESS_MAILER, process.env.PASSSWORD_MAILER);

async function start() {
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ADDRESS_MAILER,
      pass: process.env.PASSSWORD_MAILER
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    await transporter.verify();
  } catch (err) {
    console.log(err);
  }
}

start();

export function sendEmail({ to, subject, html, text }) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        fromEmail,
        to,
        subject,
        html,
        text
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

export function loadTemplate(templateName, contexts) {
  console.log(path.join(__dirname, "/templates", templateName));
  let template = new EmailTemplate(
    path.join(__dirname, "/templates", templateName)
  );
  return Promise.all(
    contexts.map(context => {
      return new Promise((resolve, reject) => {
        template.render(context, (err, result) => {
          if (err) reject(err);
          else
            resolve({
              email: result,
              context
            });
        });
      });
    })
  );
}
