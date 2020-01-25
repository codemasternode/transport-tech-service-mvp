import express from "express";
import {confirmInvitation} from '../controllers/invites'

const router = express.Router();

export default () => {
  router.post("/", confirmInvitation);
  return router;
};
