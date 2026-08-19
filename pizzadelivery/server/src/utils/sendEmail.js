const nodemailer = require("nodemailer");
const EmailLog = require("../models/EmailLog");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail({ to, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent:", info.messageId);

    await EmailLog.create({
      to,
      subject,
      body: html,
      status: "sent",
    });

    return info;

  } catch (err) {
    console.error("❌ Email error:", err.message);

    try {
      await EmailLog.create({
        to,
        subject,
        body: html,
        status: "failed",
      });
    } catch (logError) {
      console.error("❌ Email log error:", logError.message);
    }

    throw err;
  }
}

module.exports = sendEmail;