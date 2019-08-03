import express from "express";
import {
  getStaticCostsByCompany,
  postStaticCost,
  putStaticCost,
  deleteStaticCost
} from "../controllers/staticCosts";

const router = express.Router();

export default () => {
  router.get("/:company_id", getStaticCostsByCompany);
  router.post("/:company_id", postStaticCost);
  router.put("/:company_id/:id", putStaticCost);
  router.delete("/:company_id/:id", deleteStaticCost);
  return router;
};
