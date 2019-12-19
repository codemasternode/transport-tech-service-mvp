import express from "express";
import { contactToUs, contactToCompany } from "../controllers/contact";

const router = express.Router();

export default () => {
  router.post("/contact-to-us", contactToUs);
  router.post("/contact-to-company", contactToCompany);
  return router;
};
