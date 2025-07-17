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
    const { email, purpose } = req.body; // purpose: "verify" or "reset"
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (purpose === "verify") {
      if (user.isVerified) return res.status(400).json({ message: "Email already verified" });
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = { code: otpCode, expiresAt, purpose }; // Store purpose for validation
    await user.save();

    // Send email with appropriate message
    const subject = purpose === "reset" ? "Reset Your Password" : "Verify Your Email";
    await sendOTPEmail(email, otpCode, subject);

    res.status(200).json({ message: `OTP sent for ${purpose}` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
