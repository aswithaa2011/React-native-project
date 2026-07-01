import nodemailer from "nodemailer";

const sendEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Hostel App" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "OTP Verification",
      html: `
        <h2>Email Verification</h2>
        <h1>${otp}</h1>
        <p>OTP expires in 5 minutes.</p>
      `,
    });

    console.log("✅ Email Sent Successfully to:", email);
    return true;
  } catch (err) {
    console.error("========== SMTP ERROR ==========");
    console.error("Message:", err.message);
    console.error("Code:", err.code);
    console.error("Command:", err.command);
    console.error("Response:", err.response);
    throw err;
  }
};

export default sendEmail;