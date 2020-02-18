import express from "express";
import { getPaymentPlan, modifyPaymentPlan } from '../controllers/payments'
import { verifyToken } from '../middlewares/verifyToken'

const router = express.Router();

export default () => {
    router.get("/get-payment-plan", verifyToken, getPaymentPlan);
    router.post("/modify-payment-plan", verifyToken, modifyPaymentPlan)
    return router;
};
