
import express from "express";
import { getBasesByCompany, createOrUpdateBase } from "../controllers/companyBase";

const router = express.Router();

export default () => {
  router.get("/:company_id", getBasesByCompany);
  router.post("/:company_id", createOrUpdateBase)
  return router;
};
