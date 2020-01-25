import express from "express";
import { createCompany, confirmCompany } from "../controllers/company";

const router = express.Router();

export default () => {
  router.post("/create-company", createCompany);
  router.post("/confirm",confirmCompany )
  return router;
};
