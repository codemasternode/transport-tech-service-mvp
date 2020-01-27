import express from "express";
import { createVehicle, createCompanyBase, getCompany } from "../controllers/companyDashboard";
import { verifyToken } from '../middlewares/verifyToken'

const router = express.Router();

export default () => {
    router.get("/get-company", verifyToken, getCompany)
    router.post("/create-vehicle", verifyToken, createVehicle);
    router.post("/create-company-base", verifyToken, createCompanyBase)
    return router;
};
