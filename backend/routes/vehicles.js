import express from "express";
import {
  getVehiclesByCompany,
  postVehicle,
  putVehicle,
  deleteVehicle
} from "../controllers/vehicles";

const router = express.Router();

export default () => {
  router.get("/:company_id", getVehiclesByCompany);
  router.post("/:company_id", postVehicle);
  router.put("/:company_id/:id", putVehicle);
  router.delete("/:company_id/:id", deleteVehicle);
  return router;
};
