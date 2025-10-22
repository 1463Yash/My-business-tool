import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config({ path: "../.env" });
export const sendOTP = async(email) => {
  const OTP = Math.floor(100000 + Math.random() * 900000);
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailcontext = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🔐 Your OTP Code for MYBUSINESS TOOL Verification",
    html: `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden;">
      
      <!-- Header -->
      <div style="background-color: #007bff; color: white; text-align: center; padding: 20px;">
        <h2 style="margin: 0;">MYBUSINESS TOOL</h2>
        <p style="margin: 5px 0 0;">Secure Email Verification</p>
      </div>
      
      <!-- Body -->
      <div style="padding: 30px; color: #333;">
        <p>Dear User,</p>
        <p>We received a request to verify your email address. Please use the following One-Time Password (OTP) to complete your verification process:</p>

        <div style="text-align: center; margin: 25px 0;">
          <div style="display: inline-block; background-color: #e9ecef; color: #000; font-size: 28px; font-weight: bold; padding: 15px 30px; border-radius: 10px; letter-spacing: 3px;">
            ${OTP}
          </div>
        </div>

        <p>This OTP is valid for <strong>2 minutes</strong> and will expire automatically.</p>
        <p style="color: #dc3545;"><strong>⚠️ Please do not share this code with anyone.</strong></p>

        <p>If you didn’t request this, you can safely ignore this email.</p>

        <br>
        <p>Warm regards,</p>
        <p><strong>MYBUSINESS TOOL Support Team</strong></p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f1f3f5; text-align: center; padding: 15px; font-size: 13px; color: #666;">
        <p style="margin: 0;">© ${new Date().getFullYear()} MYBUSINESS TOOL. All rights reserved.</p>
        <p style="margin: 4px 0;">This is an automated message. Please do not reply.</p>
      </div>

    </div>
  </div>
  `,
  };
  try {
    const info = await transport.sendMail(mailcontext);
    console.log('Mail sent:', info.response);
    return { success: true, OTP };
  } catch (err) {
    console.error('Error in sending mail:', err);
    return { success: false };
  }
};