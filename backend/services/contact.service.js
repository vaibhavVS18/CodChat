import nodemailer from 'nodemailer';

export async function sendContactEmail({ name, email, message }) {
  const port = parseInt(process.env.EMAIL_PORT) || 465;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465, // 465 is implicit TLS, 587 upgrades via STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    family: 4, // Force IPv4 to avoid IPv6 connection issues
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });

  const escape = (str) =>
    String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const mailOptions = {
    from: `"CodChat Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
    replyTo: email, // so hitting reply goes straight back to the sender
    subject: `CodChat – New message from ${name}`,

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
  ">

    <div style="text-align: center; padding-bottom: 12px;">
      <h1 style="color: #10b981; margin: 0; font-size: 30px; font-weight: bold;">
        CodChat
      </h1>
      <p style="color: #94a3b8; margin-top: 6px; font-size: 14px;">
        New Contact Form Submission
      </p>
    </div>

    <hr style="border: 0; border-top: 1px solid #1e293b; margin: 22px 0;">

    <p style="font-size: 15px; margin: 0 0 6px;">
      <strong style="color: #10b981;">From:</strong> ${escape(name)}
    </p>
    <p style="font-size: 15px; margin: 0 0 6px;">
      <strong style="color: #10b981;">Email:</strong> ${escape(email)}
    </p>

    <div style="
      background: #020617;
      padding: 20px;
      border-radius: 12px;
      margin: 22px 0;
      border: 1px solid #334155;
      white-space: pre-wrap;
      font-size: 15px;
      line-height: 1.6;
    ">${escape(message)}</div>

    <hr style="border: 0; border-top: 1px solid #1e293b; margin: 30px 0;">

    <p style="color: #64748b; font-size: 12px; text-align: center;">
      Sent from the <strong>CodChat</strong> contact form.<br>
      Reply directly to this email to respond to ${escape(name)}.
    </p>
  </div>
  `,
  };

  await transporter.sendMail(mailOptions);
}
