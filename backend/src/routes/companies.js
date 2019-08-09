import express from "express";
import {
  confirmEmail,
  getCompaniesByPage,
  getCompanyById,
  deleteCompanyByAdmin,
  postCompany,
  putCompanyInfo,
  putTaxInfo,
  putPricingPlan,
  deleteCompanyByCompany
} from "../controllers/companies";

const router = express.Router();

export default () => {
  router.get("/confirm-email/:codeConfirm", confirmEmail);
  router.get("/page/:page", getCompaniesByPage);
  router.get("/:id", getCompanyById);
  router.post("/", postCompany);
  router.put("/company-info/:id", putCompanyInfo);
  router.put("/tax-info/:id", putTaxInfo);
  router.put("/pricing-plan/:email", putPricingPlan);
  router.delete("/admin-delete/:id", deleteCompanyByAdmin);
  router.delete("/company-delete/:id", deleteCompanyByCompany);
  return router;
};
