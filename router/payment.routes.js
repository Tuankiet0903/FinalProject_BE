import express from "express";
import { createPaymentLink, updatePaymentStatus } from "../controller/PaymmentController.js";


const router = express.Router();

router.post("/create-payment-link", createPaymentLink)
router.post("/update-payment-status", updatePaymentStatus)

export default router;
