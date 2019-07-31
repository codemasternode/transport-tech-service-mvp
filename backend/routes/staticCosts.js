import {
  getStaticCostsByCompany,
  postStaticCost,
  putStaticCost,
  deleteStaticCost
} from "../controllers/staticCosts";

export default router => {
  router.get("/:company_id", getStaticCostsByCompany);
  router.post("/:company_id", postStaticCost);
  router.put("/:company_id/:id", putStaticCost);
  router.delete("/:company_id/:id", deleteStaticCost);
  return router;
};
