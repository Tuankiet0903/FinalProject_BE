import nodemailer from "nodemailer";
import { FRONTEND_URL } from "../config.js";

export const sendInviteEmail = async (email, token) => {
    const link = `${FRONTEND_URL}/activate/${token}`;
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Workspace Invitation",
        html: `<p>You have been invited to join a workspace. Click the link below to activate your account:</p>
               <a href="${link}">Activate Account</a>`
    };

    await transporter.sendMail(mailOptions);
};
