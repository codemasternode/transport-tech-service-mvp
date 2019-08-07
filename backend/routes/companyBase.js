<<<<<<< HEAD
import {
    
  } from "../controllers/companyBase";
  
  export default router => {
    router.get("/:company_id", getVehiclesByCompany);
    router.get("/:id", getVehicleById);
    router.post("/:company_id", postVehicle);
    router.put("/:company_id/:id", putVehicle);
    router.delete("/:company_id/:id", deleteVehicle);
    return router;
  };
  
=======
import express from "express";
import {} from "../controllers/companyBase";

const router = express.Router();

export default () => {
  router.get("/:company_id", getVehiclesByCompany);
  router.get("/:id", getVehicleById);
  router.post("/:company_id", postVehicle);
  router.put("/:company_id/:id", putVehicle);
  router.delete("/:company_id/:id", deleteVehicle);
  return router;
};
>>>>>>> 2254e59d472b618a201ca487775dbb412e6fcd17
