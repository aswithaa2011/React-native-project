import { BrevoClient } from '@getbrevo/brevo';

// ------------------------------------------------------------------
// Modern OTP Email Template
// ------------------------------------------------------------------
const getOtpTemplate = (otp) => {
  return `
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #eaeaea;">
      
      <!-- Header Area -->
      <div style="background-color: #d1fae5; padding: 40px 20px; text-align: center;">
        <img src="https://res.cloudinary.com/dfqeq12he/image/upload/v1782940796/image-1_ub7vov.png" alt="Security Lock" style="width: 100%; max-width: 250px; height: auto; display: block; margin: 0 auto;" />
      </div>

      <!-- Main Body -->
      <div style="padding: 40px 20px; text-align: center;">
        <h1 style="color: #000000; font-size: 24px; font-weight: 700; margin-bottom: 25px;">Your one-time code is</h1>
        
        <!-- OTP Box -->
        <div style="display: inline-block; padding: 15px 40px; border: 2px solid #000000; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #000000; margin-bottom: 30px;">
          ${otp}
        </div>
        
        <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 auto; max-width: 400px;">
          Please verify you're really you by entering this 6-digit code when you sign in. Just a heads up, this code will expire in 10 minutes for security reasons.
        </p>
      </div>

      <!-- Security Notice -->
      <div style="padding: 30px 20px; text-align: center; border-top: 1px solid #f0f0f0;">
        <h2 style="color: #000000; font-size: 18px; margin-bottom: 15px;">We noticed a new login attempt</h2>
        <p style="color: #333333; font-size: 14px; margin-bottom: 20px;">
          If you didn't just try to sign in, we recommend you secure your account immediately.
        </p>
        <a href="#" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 30px; font-weight: bold; font-size: 14px; border-radius: 4px;">
          Contact Support
        </a>
      </div>

      <!-- Footer -->
      <div style="background-color: #f9f9f9; padding: 40px 20px; text-align: center; border-top: 1px solid #eeeeee;">
        <p style="color: #333333; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
          If you have any questions, contact our Website Guides.<br/>
          Or, visit our Help Center.
        </p>
        
        <div style="margin-top: 20px;">
          <p style="color: #777777; font-size: 12px;">&copy; ${new Date().getFullYear()} Hostel App. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;
};

// ------------------------------------------------------------------
// Main Email Function
// ------------------------------------------------------------------
export default async function sendEmail(email, otp) {
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error("Missing required environment variable: BREVO_API_KEY");
    }

    const senderEmail = process.env.EMAIL_FROM || "noreply@yourdomain.com";

    // Initialize the official Brevo SDK (v5+)
    const brevo = new BrevoClient({
      apiKey: process.env.BREVO_API_KEY
    });

    const response = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: "Hostel App",
        email: senderEmail
      },
      to: [{ email }],
      subject: "OTP Verification - Hostel App",
      htmlContent: getOtpTemplate(otp),
      textContent: `Your One-Time Password (OTP) for Hostel App verification is: ${otp}. This OTP is valid for 10 minutes. If you did not request this, please ignore this email.`
    });

    console.log("========== BREVO DEBUG ==========");
    console.log(`Recipient: ${email}`);
    console.log(`Subject: OTP Verification - Hostel App`);
    console.log(`Status: Success`);
    console.log(`Message ID: ${response.messageId || JSON.stringify(response)}`);
    console.log("================================");

    return true;
  } catch (err) {
    console.error("========== BREVO ERROR ==========");
    console.error(`Message: ${err.message}`);
    console.error(`Status: ${err.statusCode || err.response?.status || "N/A"}`);
    console.error(`Response: ${JSON.stringify(err.body || err.response?.body || err.message)}`);
    console.error(`Stack: ${err.stack}`);
    console.error("================================");

    throw err;
  }
}