// backend/utils/sendOTPEmail.js
const nodemailer = require('nodemailer');

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,   // e.g. logankongmave@gmail.com
      pass: process.env.EMAIL_PASS    // e.g. app-specific password
    }
  });

  const mailOptions = {
    from: `"Karma Yogi" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your email - Karma Yogi',
    text: `Your OTP code is: ${otp}. It expires in 10 minutes.`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTPEmail;
