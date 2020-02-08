import express from "express";
import { loginAuth, testAuth } from "../controllers/auth";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

export default () => {
  router.post("/login", loginAuth);
  router.post("/test", verifyToken, testAuth)
  return router;
};
