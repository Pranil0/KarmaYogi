// backend/controllers/EmailVerificationController.js

const User = require('../models/UserModel');
const sendOTPEmail = require('../utils/sendOTPEmail');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp || user.otp.code !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otp.expiresAt < new Date())
      return res.status(400).json({ message: "OTP has expired" });

    user.isVerified = true;
    user.otp = undefined;  // Clear OTP data
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "Email already verified" });

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otp = { code: otpCode, expiresAt };
    await user.save();

    await sendOTPEmail(email, otpCode);

    res.status(200).json({ message: "OTP resent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
