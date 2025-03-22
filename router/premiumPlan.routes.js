import express from "express";
import { getAllPremiumPlan } from "../controller/PremiumPlanController.js";

const router = express.Router();

router.get("/plans", getAllPremiumPlan)

export default router;
