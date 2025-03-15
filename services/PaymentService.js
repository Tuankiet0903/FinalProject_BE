import PayOS from "@payos/node";
import PaymentHistory from "../model/PaymentHistory.js";
import { sequelize } from "../database/connect.js";

const callbackUrl = `${process.env.FE_URL}/setting/upgrade`;

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

export const createPaymentLinkService = async (userId, planId, name, price) => {

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


export const updatePaymentStatusService = async (orderCode, status) => {

  const transaction = await sequelize.transaction();
  
  try {
    const payment = await PaymentHistory.findOne({
      where: { order_code: orderCode },
      transaction,
    });

    if (!payment) {
      throw new Error("Payment record not found");
    }

    payment.status = status;
    await payment.save({ transaction });

    await transaction.commit(); // ✅ Commit nếu cập nhật thành công
    return payment;
  } catch (error) {
    await transaction.rollback(); // ❌ Rollback nếu có lỗi
    console.error("Error updating payment:", error);
    throw error;
  }
};