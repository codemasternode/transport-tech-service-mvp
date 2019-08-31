import express from "express";
import {
  getStaticCostsByCompany,
  postStaticCost,
  putStaticCost,
  deleteStaticCost,
  overwriteStaticCosts
} from "../controllers/staticCosts";

const router = express.Router();

export default () => {
  router.post("/overwrite/:company_id", overwriteStaticCosts);
  router.get("/:company_id", getStaticCostsByCompany);
  router.post("/:company_id", postStaticCost);
  router.put("/:company_id/:id", putStaticCost);
  router.delete("/:company_id/:id", deleteStaticCost);
  return router;
};
