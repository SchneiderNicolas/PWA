import nodemailer from "nodemailer";
import { getInvitationEmailTemplate } from "../templates/emailInvitation";
export const sendInvitationEmail = async (
  to: string,
  senderName: string,
  inviteCode: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const subject = "New Message";
  const htmlContent = getInvitationEmailTemplate(senderName, inviteCode, to);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};
