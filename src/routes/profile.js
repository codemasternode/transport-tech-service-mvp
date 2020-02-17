import express from "express";
import { getProfileInfo, updateProfileInfo } from '../controllers/profile'
import { verifyToken } from '../middlewares/verifyToken'

const router = express.Router();

export default () => {
    router.get("/get-profile", verifyToken, getProfileInfo)
    router.post("/update-profile", verifyToken, )
    return router;
};
