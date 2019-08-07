<<<<<<< HEAD
=======
import express from "express";
>>>>>>> 2254e59d472b618a201ca487775dbb412e6fcd17
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

<<<<<<< HEAD
export default router => {
=======
const router = express.Router();

export default () => {
>>>>>>> 2254e59d472b618a201ca487775dbb412e6fcd17
  router.get("/page/:page", getCompanies);
  router.get("/:id", getCompanyById);
  router.post("/", postCompany);
  router.put("/company-info/:id", putCompanyInfo);
  router.put("/tax-info/:id", putTaxInfo);
<<<<<<< HEAD
  router.put("/pricing-plan/:id", putPricingPlan)
  router.delete("/admin-delete/:id", deleteCompanyByAdmin);
  router.delete("/company-delete/:id", deleteCompanyByCompany)
=======
  router.put("/pricing-plan/:id", putPricingPlan);
  router.delete("/admin-delete/:id", deleteCompanyByAdmin);
  router.delete("/company-delete/:id", deleteCompanyByCompany);
>>>>>>> 2254e59d472b618a201ca487775dbb412e6fcd17
  return router;
};
