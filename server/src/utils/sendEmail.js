import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
  email,
  name,
  verifyToken
) => {
  
  const verificationLink =
  `http://localhost:5173/verify-email/${verifyToken}`;

  await resend.emails.send({
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Verify your Email",
    html: `
      <h2>Hello ${name},</h2>

      <p>Thank you for registering.</p>

      <p>Please click the button below to verify your email.</p>

      <a href="${verificationLink}"
         style="
         padding:12px 20px;
         background:#2563eb;
         color:white;
         text-decoration:none;
         border-radius:6px;">
         Verify Email
      </a>

      <p>This link will expire in 24 hours.</p>
    `,
  });
};