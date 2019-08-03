import express from "express";
import {
  getWorkerByCompany,
  postWorker,
  putWorker,
  deleteWorker
} from "../controllers/workers";

const router = express.Router();

export default () => {
  router.get("/:company_id", getWorkerByCompany);
  router.post("/:company_id", postWorker);
  router.put("/:company_id/:id", putWorker);
  router.delete("/:company_id/:id", deleteWorker);
  return router;
};
