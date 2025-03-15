import PayOS from "@payos/node";
import PaymentHistory from "../model/PaymentHistory.js";

const callbackUrl = `${process.env.FE_URL}/setting/upgrade`;

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

export const createPaymentLinkService = async (userId, planId, name, price) => {
  const orderCode = Number(
    `${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`.slice(-6)
  );

  price = Number(price)

  const paymentRecord = await PaymentHistory.create({
    user_id: userId,
    plan_id: planId,
    amount: price,
    status: "pending",
    order_code: orderCode,
  });

  const body = {
    orderCode: orderCode,
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
    cancelUrl: `${callbackUrl}?canceled=true`,
  };

  try {
    const paymentLinkResponse = await payOS.createPaymentLink(body);
    return paymentLinkResponse.checkoutUrl; // Return the link instead of redirecting
  } catch (error) {
    console.error("Error creating payment link:", error);
    throw new Error("Failed to create payment link");
  }
};


export const updatePaymentStatusService = async (orderCode, status) => {
  try {
      const payment = await PaymentHistory.findOne({ where: { order_code: orderCode } });

      if (!payment) {
        throw new Error("Payment record not found"); // Throw error instead of using `res`
      }
  
      payment.status = status;
      await payment.save();
  
      return payment; // Return the updated payment object
    } catch (error) {
      console.error("Error updating payment:", error);
      throw error; // Let the controller handle the error response
    }
  };