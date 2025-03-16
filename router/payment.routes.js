import express from "express";
import { createPaymentLink, updatePaymentStatus, getAllPayments } from "../controller/PaymmentController.js";


const router = express.Router();

router.post("/create-payment-link", createPaymentLink)
router.post("/update-payment-status", updatePaymentStatus)
router.get("/getAllPayment", getAllPayments)

export default router;
