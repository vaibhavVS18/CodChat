import nodemailer from 'nodemailer';

export async function sendForgotPasswordOTP(email, otp) {
    // Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Email content for Password Reset
    const mailOptions = {
        from: `"Template App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset Your Password – OTP Code',

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
            Reset Your Password
          </h1>
          <p style="color: #94a3b8; margin-top: 6px; font-size: 14px;">
            Secure Password Recovery
          </p>
        </div>

        <hr style="border: 0; border-top: 1px solid #1e293b; margin: 22px 0;">

        <!-- Main Body -->
        <p style="font-size: 16px; color: #e5e7eb;">
          We received a request to reset your account password.
          To confirm that this request is legitimate and secure, please use the OTP code below:
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
          Please do not share this code with anyone.
        </p>

        <p style="font-size: 14px; color: #94a3b8; margin-top: 10px;">
          If you did not request a password reset, please ignore this email — your account remains secure.
        </p>

        <hr style="border: 0; border-top: 1px solid #1e293b; margin: 30px 0;">

        <p style="color: #64748b; font-size: 12px; text-align: center;">
          This is an automated email — please do not reply.<br>
          © Template App. All rights reserved.
        </p>
      </div>
    `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
}
