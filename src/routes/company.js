import express from "express";
import { createCompany, confirmCompany, resetPassword, getInfoAboutPayments } from "../controllers/company";
import { verifyToken } from '../middlewares/verifyToken'

const router = express.Router();

export default () => {
  router.post("/create-company", createCompany);
  router.post("/confirm", confirmCompany)
  router.post("/reset-password", verifyToken, resetPassword)
  return router;
};
