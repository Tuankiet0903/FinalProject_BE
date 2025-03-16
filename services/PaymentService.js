import PayOS from "@payos/node";
import PaymentHistory from "../model/PaymentHistory.js";
import { sequelize } from "../database/connect.js";
import Subscription from "../model/Subcriptions.js";
import PremiumPlans from "../model/PremiunPlans.js";
import User from "../model/User.js";
import Workspace from "../model/WorkSpace.js";

const callbackUrl = `${process.env.FE_URL}/setting/upgrade`;

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

export const createPaymentLinkService = async (userId, workspaceId, planId, name, price) => {
  const transaction = await sequelize.transaction();

  try {
    const orderCode = Number(
      `${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`.slice(-6)
    );

    price = Number(price);

    // 1️⃣ Lưu bản ghi vào PaymentHistory (tạm thời)
    const paymentRecord = await PaymentHistory.create(
      {
        user_id: userId,
        plan_id: planId,
        workspace_id : workspaceId,
        amount: price,
        status: "pending", // Chưa thanh toán
        order_code: orderCode,
      },
      { transaction }
    );

    // 2️⃣ Gọi API tạo link thanh toán từ PayOS
    const body = {
      orderCode,
      amount: price,
      description: `Upgrade to ${name} Tier`,
      items: [
        {
          name: `Upgrade to ${name} Tier`,
          quantity: 1,
          price: price,
        },
      ],
      returnUrl: `${callbackUrl}?success=true&orderCode=${orderCode}`,
      cancelUrl: `${callbackUrl}?canceled=true&orderCode=${orderCode}`,
    };

    const paymentLinkResponse = await payOS.createPaymentLink(body);

    await transaction.commit(); // ✅ Xác nhận transaction nếu thành công
    return paymentLinkResponse.checkoutUrl; // Trả về link thanh toán
  } catch (error) {
    await transaction.rollback(); // ❌ Rollback nếu có lỗi
    console.error("Error creating payment link:", error);
    throw new Error("Failed to create payment link");
  }
};

export const updatePaymentStatusService = async (
  orderCode,
  status,
  userId,
  workspaceId
) => {
  const transaction = await sequelize.transaction();

  try {
    const payment = await PaymentHistory.findOne({
      where: { order_code: orderCode },
      transaction,
    });

    if (!payment) {
      throw new Error("Payment record not found");
    }

    const subscription = await Subscription.findOne({
      where: { userId: userId, workspaceId: workspaceId },
      transaction,
    });

    if (!subscription) {
      throw new Error("Subscription record not found");
    }

    subscription.planId = payment.plan_id;
    await subscription.save({ transaction });

    payment.status = status;
    await payment.save({ transaction });

    await transaction.commit(); // ✅ Commit only if everything is successful
    return payment;
  } catch (error) {
    await transaction.rollback(); // ❌ Rollback on error
    console.error("Error updating payment:", error);
    throw error;
  }
};

export const getPaymentHistoryService = async () => {
  try {
    const query = `SELECT
    ph.order_code,
    ph.status,
    ph.created_at,
    u."userId",
    u."fullName",
    w."workspaceId",
    w.name AS workspace_name,
    ph.plan_id,
    pp."planName",
    pp.price
FROM payment_history ph
INNER JOIN "User" u
    ON ph.user_id = u."userId"
INNER JOIN "Workspace" w
    ON ph.workspace_id = w."workspaceId"
INNER JOIN "PremiumPlans" pp
    ON ph.plan_id = pp."planId";
`;

    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    console.log(results);
    

    if (!results || results.length === 0) {
      throw new Error("Không có lịch sử thanh toán");
    }

    return results;
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử thanh toán:", error);
    throw error;
  }
};
