import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";



const languages = [
  {
    language: "PL",
    welcomeText: "Witaj",
    infoText: "Potwierdzenie założenia konta na platformie",
    buttonConfirmText: "Zatwierdź"
  },
  {
    language: "ENG",
    welcomeText: "Welcome",
    infoText: "Confirmation of account creation on the platform",
    buttonConfirmText: "Confirm"
  }
];

export default () => {};
