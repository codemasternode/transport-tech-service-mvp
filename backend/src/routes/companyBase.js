import express from "express";
import {
  getBasesByCompany,
  createOrUpdateBase,
  overwriteCompanyBases
} from "../controllers/companyBase";

const router = express.Router();

export default () => {
  router.get("/:company_id", getBasesByCompany);
  router.post("/:company_id", createOrUpdateBase);
  router.post("/overwrite/:company_id", overwriteCompanyBases);
  return router;
};
