const nodemailer = require('nodemailer');
require('dotenv').config();

const sendVerificationEmail = async (toEmail, link) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Peer Doubt Solving platform <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: "Verify your Email",
    html: `
      <h3>Welcome to This Platform!</h3>
      <p>Click the link below to verify your email:</p>
      <a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };