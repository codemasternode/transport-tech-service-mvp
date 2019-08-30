import express from "express";
import {
  getVehiclesByCompany,
  postVehicle,
  putVehicle,
  deleteVehicle,
  getVehiclesWithCompanyBases,
  overwriteVehiclesWithCompanyBases
} from "../controllers/vehicles";

const router = express.Router();

export default () => {
  router.get("/:company_id", getVehiclesByCompany);
  router.get("/by-company-bases/:company_id", getVehiclesWithCompanyBases);
  router.post("/overwrite/:company_id", overwriteVehiclesWithCompanyBases);
  router.post("/:company_id/:companyBase_id", postVehicle);
  router.put("/:company_id/:id", putVehicle);
  router.delete("/:company_id/:id", deleteVehicle);
  return router;
};
