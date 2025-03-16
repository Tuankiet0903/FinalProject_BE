import {
  createPaymentLinkService,
  updatePaymentStatusService,
  getPaymentHistoryService,
} from "../services/PaymentService.js";
import { getPremiumPlanByIdService } from "../services/PremiumPlanService.js";

export const createPaymentLink = async (req, res) => {
  try {
    const { planId, userId, workspaceId } = req.body;

    const planData = await getPremiumPlanByIdService(planId);

    const response = await createPaymentLinkService(
      userId,
      workspaceId,
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
    const { orderCode, status, userId, workspaceId } = req.body;
    const paymentData = await updatePaymentStatusService(orderCode, status, userId, workspaceId);
    res.json({ message: "Payment status updated", data: paymentData });
  } catch (error) {
    console.error("Error updating payment:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to update payment status" });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const paymentData = await getPaymentHistoryService();
    res.json({ message: "Payment history retrieved successfully", data: paymentData });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ error: error.message || "Failed to fetch payment history" });
  }
};
