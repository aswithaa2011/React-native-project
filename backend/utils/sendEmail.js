import nodemailer from "nodemailer";

const sendEmail = async (email, otp) => {
  try {
    console.log("========== SMTP DEBUG ==========");
    console.log("SMTP_EMAIL:", process.env.SMTP_EMAIL);
    console.log("SMTP_PASS Exists:", !!process.env.SMTP_PASS);
    
    // Determine host and port (defaults to Brevo if not specified)
    // Gmail SMTP is highly unreliable on cloud hosts like Render due to IP blocks and IPv6 routing issues.
    const smtpHost = process.env.SMTP_HOST || "smtp-relay.brevo.com";
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;

    console.log(`Configuring Nodemailer for ${smtpHost}:${smtpPort}`);

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
      // Force IPv4. Render frequently experiences IPv6 routing timeouts (ETIMEDOUT) 
      // when communicating with external SMTP servers like Gmail or Brevo.
      family: 4, 
      
      // Robust connection timeouts for production
      connectionTimeout: 10000, // Time to wait for a connection to be established
      greetingTimeout: 10000,   // Time to wait for the greeting after connection
      socketTimeout: 15000,     // Time of inactivity until the connection is closed
      
      debug: false,  // Disable verbose debug in production unless needed
      logger: false, // Disable verbose logger in production
    });

    // NOTE: transporter.verify() is intentionally removed. 
    // It can block the event loop, cause deployment timeouts on Render, 
    // and is not necessary since sendMail will throw an error if it fails to connect anyway.

    console.log(`Sending Email to ${email}...`);

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
    console.log("Message ID:", info.messageId);

    return true;
  } catch (err) {
    console.error("========== SMTP ERROR ==========");
    console.error("Message:", err.message);
    console.error("Code:", err.code);
    console.error("Command:", err.command);
    console.error("Response:", err.response);
    
    // Provide actionable advice based on the error
    if (err.code === "ETIMEDOUT") {
      console.error("💡 TIP: ETIMEDOUT means Render could not connect to the SMTP server. If using Gmail, Google may be blocking the datacenter IP. Please switch to Brevo (smtp-relay.brevo.com).");
    } else if (err.code === "EAUTH") {
      console.error("💡 TIP: EAUTH means authentication failed. Check your SMTP_EMAIL and SMTP_PASS. If using Gmail, ensure you have an App Password generated.");
    }
    
    console.error("Full Error:", err);

    throw err;
  }
};

export default sendEmail;