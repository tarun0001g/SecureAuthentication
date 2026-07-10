import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetPasswordEmail = async (
  email,
  name,
  resetToken
) => {
  const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

  await resend.emails.send({
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Reset Your Password",
    html: `
      <h2>Hello ${name},</h2>

      <p>We received a request to reset your password.</p>

      <p>Click the button below to reset your password.</p>

      <a
        href="${resetLink}"
        style="
          padding:12px 20px;
          background:#dc2626;
          color:white;
          text-decoration:none;
          border-radius:6px;
        "
      >
        Reset Password
      </a>

      <p>This link will expire in 1 hour.</p>

      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  });
};