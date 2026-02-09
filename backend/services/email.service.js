import nodemailer from 'nodemailer';

export async function sendOTPEmail(email, otp) {
  // Create transporter - Using port 465 for Render compatibility
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 465,
    secure: true, // Use SSL for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    family: 4, // Force IPv4 to avoid IPv6 connection issues
    connectionTimeout: 10000, // 10 second timeout
    greetingTimeout: 10000,
  });

  // Email content
  const mailOptions = {
    from: `"CodChat" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'CodChat Verification – OTP Code',

    html: `
  <div style="
    font-family: Arial, sans-serif; 
    max-width: 600px; 
    margin: 0 auto; 
    background: #0f172a; 
    padding: 28px; 
    border-radius: 14px; 
    border: 1px solid #1e293b;
    color: #e5e7eb;
    background-image: radial-gradient(#1e293b 1px, transparent 1px);
    background-size: 18px 18px;
  ">

    <!-- Header -->
    <div style="text-align: center; padding-bottom: 12px;">
      <h1 style="color: #10b981; margin: 0; font-size: 30px; font-weight: bold;">
        CodChat
      </h1>
      <p style="color: #94a3b8; margin-top: 6px; font-size: 14px;">
        Verify Your Account
      </p>
    </div>

    <hr style="border: 0; border-top: 1px solid #1e293b; margin: 22px 0;">

    <!-- Main Body -->
    <p style="font-size: 16px; color: #e5e7eb;">
      Welcome to CodChat! You are creating a new account.
      Please use the following One-Time Password (OTP) to verify your email address:
    </p>

    <div style="
      background: #020617; 
      padding: 22px; 
      text-align: center; 
      border-radius: 12px; 
      margin: 28px 0; 
      border: 1px solid #334155;
    ">
      <h1 style="
        margin: 0; 
        font-size: 38px; 
        letter-spacing: 8px; 
        color: #10b981;
      ">
        ${otp}
      </h1>
    </div>

    <p style="font-size: 15px; color: #e5e7eb;">
      This OTP is valid for <strong>10 minutes</strong>.  
      For security reasons, do not share this code with anyone.
    </p>

    <p style="font-size: 14px; color: #94a3b8;">
      If you did not attempt to sign up for CodChat, please ignore this email.
    </p>

    <hr style="border: 0; border-top: 1px solid #1e293b; margin: 30px 0;">

    <p style="color: #64748b; font-size: 12px; text-align: center;">
      This is an automated security email from <strong>CodChat</strong>.<br>
      Please do not reply to this message.
    </p>
  </div>
  `,
  };


  // Send email
  await transporter.sendMail(mailOptions);
}
