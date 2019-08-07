import {
  getCompanies,
  getCompanyById,
  deleteCompanyByAdmin,
  postCompany,
  putCompanyInfo,
  putTaxInfo,
  putPricingPlan,
  deleteCompanyByCompany
} from "../controllers/companies";

export default router => {
  router.get("/page/:page", getCompanies);
  router.get("/:id", getCompanyById);
  router.post("/", postCompany);
  router.put("/company-info/:id", putCompanyInfo);
  router.put("/tax-info/:id", putTaxInfo);
  router.put("/pricing-plan/:id", putPricingPlan)
  router.delete("/admin-delete/:id", deleteCompanyByAdmin);
  router.delete("/company-delete/:id", deleteCompanyByCompany)
  return router;
};
