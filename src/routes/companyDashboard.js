import express from "express";
import { createVehicle, createCompanyBase, getCompany, deleteVehicle, deleteCompanyBase, updateVehicle, updateCompanyBase } from "../controllers/companyDashboard";
import { verifyToken } from '../middlewares/verifyToken'

const router = express.Router();

export default () => {
    router.get("/get-company", verifyToken, getCompany)
    router.post("/create-vehicle", verifyToken, createVehicle);
    router.post("/create-company-base", verifyToken, createCompanyBase)
    router.post("/delete-vehicle", verifyToken, deleteVehicle)
    router.post("/delete-company-base", verifyToken, deleteCompanyBase)
    router.post("/update-vehicle", verifyToken, updateVehicle)
    router.post("/update-company-base", verifyToken, updateCompanyBase)
    return router;
};
