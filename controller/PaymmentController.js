import {
  createPaymentLinkService,
  updatePaymentStatusService,
} from "../services/PaymentService.js";
import { getPremiumPlanByIdService } from "../services/PremiumPlanService.js";

export const createPaymentLink = async (req, res) => {
  try {
    const { planId, userId } = req.body;

    const planData = await getPremiumPlanByIdService(planId);

    const response = await createPaymentLinkService(
      userId,
      planId,
      planData.planName,
      planData.price
    );
    res.json({ paymentUrl: response });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderCode, status } = req.body;
    const paymentData = await updatePaymentStatusService(orderCode, status);
    res.json({ message: "Payment status updated", data: paymentData });
  } catch (error) {
    console.error("Error updating payment:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to update payment status" });
  }
};
