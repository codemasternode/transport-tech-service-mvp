import express from "express";
import {
  getWorkerByCompany,
  postWorker,
  putWorker,
  deleteWorker,
  overwriteWorkers
} from "../controllers/workers";

const router = express.Router();

export default () => {
  router.post("/overwrite/:company_id", overwriteWorkers);
  router.get("/:company_id", getWorkerByCompany);
  router.post("/:company_id", postWorker);
  router.put("/:company_id/:id", putWorker);
  router.delete("/:company_id/:id", deleteWorker);
  return router;
};
