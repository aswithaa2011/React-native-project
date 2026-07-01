import nodemailer from "nodemailer";

const sendEmail = async (email, otp) => {
  try {
    console.log("========== SMTP DEBUG ==========");
    console.log("SMTP_EMAIL:", process.env.SMTP_EMAIL);
    console.log("SMTP_PASS Exists:", !!process.env.SMTP_PASS);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000, // 10 sec
      greetingTimeout: 10000,
      socketTimeout: 10000,
      debug: true,
      logger: true,
    });

    console.log("Verifying SMTP...");
    await transporter.verify();
    console.log("✅ SMTP Verified");

    console.log("Sending Email...");

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

    console.log("✅ Email Sent Successfully");
    console.log(info);

    return true;
  } catch (err) {
    console.error("========== SMTP ERROR ==========");
    console.error("Message:", err.message);
    console.error("Code:", err.code);
    console.error("Command:", err.command);
    console.error("Response:", err.response);
    console.error("Full Error:", err);

    throw err;
  }
};

export default sendEmail;