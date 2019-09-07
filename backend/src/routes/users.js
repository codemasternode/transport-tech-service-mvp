import express from "express";
import {
  getUsersByCompany,
  overwriteUsers,
  postUser
} from "../controllers/users";

const router = express.Router();

export default () => {
  router.post("/overwrite/:company_id", overwriteUsers);
  router.get("/:company_id", getUsersByCompany);
  router.post("/:company_id", postUser);
  return router;
};
