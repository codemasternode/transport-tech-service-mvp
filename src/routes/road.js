import express from "express";
import {getRoadOffers} from "../controllers/road";

const router = express.Router();

export default () => {
  router.post("/", getRoadOffers);
  return router;
};
