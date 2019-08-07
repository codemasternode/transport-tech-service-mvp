import {
  deleteVehicle,
  getVehicleById,
  getVehiclesByCompany,
  putVehicle,
  postVehicle
} from "../controllers/vehicles";

export default router => {
  router.get("/:company_id", getVehiclesByCompany);
  router.get("/:id", getVehicleById);
  router.post("/:company_id", postVehicle);
  router.put("/:company_id/:id", putVehicle);
  router.delete("/:company_id/:id", deleteVehicle);
  return router;
};
