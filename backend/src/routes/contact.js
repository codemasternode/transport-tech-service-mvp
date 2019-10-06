import express from "express";
import { contactToUs } from "../controllers/contact";

const router = express.Router();

export default () => {
  router.post("/contact-to-us", contactToUs);
  return router;
};
