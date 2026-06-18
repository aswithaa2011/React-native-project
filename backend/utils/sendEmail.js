import nodemailer from "nodemailer";

const sendEmail = async (email, otp) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER and EMAIL_PASS must be set in .env");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
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
