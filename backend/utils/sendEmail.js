import nodemailer from "nodemailer";

const sendEmail = async (email, otp) => {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASS) {
    throw new Error("SMTP_EMAIL and SMTP_PASS must be set in .env");
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: "OTP Verification",
    html: `
      <h2>Email Verification</h2>
      <h1>${otp}</h1>
      <p>OTP expires in 5 minutes.</p>
    `,
  });
};

export default sendEmail;
