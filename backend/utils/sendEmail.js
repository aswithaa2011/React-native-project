import nodemailer from "nodemailer";
import dns from "dns";
import net from "net";
import { promisify } from "util";

const resolveDns = promisify(dns.resolve);

// ------------------------------------------------------------------
// Diagnostic function: Test DNS and TCP connection before Nodemailer
// ------------------------------------------------------------------
const testConnection = async (host, port) => {
  console.log(`\n--- [1] DNS Lookup ---`);
  try {
    const addresses = await resolveDns(host);
    console.log(`✅ DNS resolved ${host} to:`, addresses);
  } catch (err) {
    console.error(`❌ DNS lookup failed for ${host}:`, err.message);
  }

  console.log(`\n--- [2] TCP Connection Test ---`);
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(10000); // 10 second timeout for TCP

    console.log(`Attempting raw TCP connection to ${host}:${port}...`);
    
    socket.on("connect", () => {
      console.log(`✅ Raw TCP connection successful to ${host}:${port}`);
      socket.destroy();
      resolve(true);
    });

    socket.on("timeout", () => {
      console.error(`❌ TCP Connection timed out after 10s to ${host}:${port}`);
      socket.destroy();
      resolve(false);
    });

    socket.on("error", (err) => {
      console.error(`❌ TCP Connection error to ${host}:${port}:`, err.message);
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, host);
  });
};

// ------------------------------------------------------------------
// Main Email Function
// ------------------------------------------------------------------
const sendEmail = async (email, otp) => {
  try {
    console.log("\n========== SMTP DEBUG ==========");
    
    // Default to Brevo or Gmail based on ENV
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT) || 587;
    const isSecure = smtpPort === 465;

    console.log(`SMTP_HOST: ${smtpHost}`);
    console.log(`SMTP_PORT: ${smtpPort}`);
    console.log(`SMTP_SECURE (TLS): ${isSecure}`);
    console.log(`SMTP_EMAIL Exists: ${!!process.env.SMTP_EMAIL}`);
    console.log(`SMTP_PASS Exists: ${!!process.env.SMTP_PASS}`);

    // Run explicit network diagnostics
    const tcpSuccess = await testConnection(smtpHost, smtpPort);
    if (!tcpSuccess) {
      console.error("\n🚨 ALERT: Raw TCP connection failed. Nodemailer WILL fail.");
      console.error("This confirms the issue is at the network layer, not in Nodemailer.");
    }

    console.log(`\n--- [3] Nodemailer Setup ---`);
    
    // Best practice transporter configuration
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: isSecure,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
      // Essential timeouts for robust error handling
      connectionTimeout: 10000, 
      greetingTimeout: 10000,   
      socketTimeout: 15000,     
      
      // Force IPv4 to prevent IPv6 blackholing
      family: 4, 
      
      // Enable full debugging for insights
      debug: true,  
      logger: true, 
    });

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
    console.error("\n========== SMTP ERROR ==========");
    console.error("Message:", err.message);
    console.error("Code:", err.code);
    console.error("Command:", err.command);
    
    if (err.code === "ETIMEDOUT") {
      console.error("\n💡 ANALYSIS:");
      console.error("The ETIMEDOUT occurred during 'CONN' (Connection Phase).");
      console.error("This means Node.js could not even establish a TCP handshake with the SMTP server.");
      console.error("Authentication has NOT been attempted yet because there is no open socket.");
    }
    
    throw err;
  }
};

export default sendEmail;