import PremiumPlans from "../model/PremiunPlans.js";


export const getAllPremiumPlanService = async() => {
  try {
    const plans = await PremiumPlans.findAll();
    return plans;
  } catch (error) {
    console.error("Error fetching plan:", error);
    throw new Error("Database Error");
  }
}

export const getPremiumPlanByIdService = async (id) => {
  try {
    const plan = await PremiumPlans.findByPk(id);
    if (!plan) {
      throw new Error(`Plan with ID ${id} not found`);
    }
    return plan;
  } catch (error) {
    console.error("Error fetching plan:", error);
    throw new Error("Database Error");
  }
};

