import nodemailer from "nodemailer";

export const sendResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/reset-password/${token}`; // frontend route

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Reset your password",
    html: `
      <p>You requested a password reset.</p>
      <p>Click this link to reset: <a href="${resetLink}">${resetLink}</a></p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
