const nodemailer = require("nodemailer");

const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS  // your app-specific password
      },
    });

    const mailOptions = {
      from: `"Karma Yogi" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - Karma Yogi",
      text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    throw new Error("Could not send OTP email");
  }
};

module.exports = sendOTPEmail;
