import express from "express";
import { createCompany, confirmCompany, resetPassword, updateCompany, getInfoAboutPayments } from "../controllers/company";
import { verifyToken } from '../middlewares/verifyToken'

const router = express.Router();

export default () => {
  router.post("/create-company", createCompany);
  router.post("/confirm", confirmCompany)
  router.post("/reset-password", verifyToken, resetPassword)
  router.post("/update-company", verifyToken, updateCompany)
  router.get("/payments-info", verifyToken, getInfoAboutPayments)
  return router;
};
