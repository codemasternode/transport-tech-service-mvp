import express from "express";
import { redirectWithInfo } from "../controllers/payments";

const router = express.Router();

export default () => {
  router.post("/check", redirectWithInfo);
  router.post("/check-payment")
  return router;
};
