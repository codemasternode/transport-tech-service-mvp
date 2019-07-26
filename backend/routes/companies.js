import {
  getCompanies,
  getCompanyById,
  deleteCompany,
  postCompany,
  putCompanyInfo
} from "../controllers/companies";

export default router => {
  router.get("/page/:page", getCompanies);
  router.get("/:id", getCompanyById);
  router.post("/", postCompany);
  router.put("/:id", putCompanyInfo);
  router.delete("/:id", deleteCompany);
  return router;
};
