import express from "express";
import { startSubscription, updateSubscription } from '../controllers/payments'

const router = express.Router();

export default () => {
    router.post("/subscribe", startSubscription);
    router.post("/update-payment", updateSubscription)
    return router;
};
