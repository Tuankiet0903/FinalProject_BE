import { getAllPremiumPlanService } from "../services/PremiumPlanService.js";

export const getAllPremiumPlan = async (req, res) => {
  try {
    const response = await getAllPremiumPlanService();
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

