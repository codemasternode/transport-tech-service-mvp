import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import dotenv from "dotenv/config";
const EmailTemplate = require("email-templates").EmailTemplate;
import path from "path";

const fromEmail = `transport-tech-service-notifications <${process.env.EMAIL_ADDRESS_MAILER}>`;

let transporter;

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
  console.log(
    path.join(__dirname, "../emailsTemplates/templates", templateName)
  );
  let template = new EmailTemplate(
    path.join(__dirname, "../emailsTemplates/templates", templateName)
  );
  return Promise.all(
    contexts.map(context => {
      return new Promise((resolve, reject) => {
        template.render(context, (err, result) => {
          console.log(result, 65)
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
