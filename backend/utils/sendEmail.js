import nodemailer from "nodemailer";

const sendEmail = async (email, otp) => {
  try {

    console.log(process.env.SMTP_EMAIL)
    console.log(process.env.SMTP_PASS)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "OTP Verification",
      html: `
        <h2>Email Verification</h2>
        <h1>${otp}</h1>
        <p>OTP expires in 5 minutes.</p>
      `,
    });

    console.log("Email Sent:", info);
  } catch (err) {
    console.log("Mail Error:", err);
    throw err;
  }
};

export default sendEmail;