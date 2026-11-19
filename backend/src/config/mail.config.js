
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.gmail.com",

  port: Number(process.env.MAIL_PORT) || 587,

  // Gmail port 587 uses STARTTLS.
  // Port 465 uses SSL/TLS.
  secure: Number(process.env.MAIL_PORT) === 465,

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 20000,
});

// Verify SMTP connection
const verifyMailConnection = async () => {
  try {
    await transporter.verify();
    console.log("Mail server is ready to send emails.");
  } catch (error) {
    console.error("Mail server connection failed:", error.message);
  }
};

module.exports = {
  transporter,
  verifyMailConnection,
};
