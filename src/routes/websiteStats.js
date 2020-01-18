import express from "express";
import { postWebsiteStats } from "../controllers/websiteStats";

const router = express.Router();

export default () => {
  router.post("/", postWebsiteStats);
  return router;
};
