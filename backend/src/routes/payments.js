import express from "express";
import { redirectWithInfo, acceptPayment } from "../controllers/payments";

const router = express.Router();

export default () => {
  router.post("/check", redirectWithInfo);
  router.post("/accept-payment", acceptPayment);
  return router;
};
