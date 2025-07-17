import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { FaEnvelope } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OTPVerification = () => {
  const context = new URLSearchParams(useLocation().search).get("context");

  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();
  const email = new URLSearchParams(useLocation().search).get("email");
  const inputRefs = useRef([]);

  // ⏳ Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    const otp = otpArray.join("");
    if (otp.length === 6 && !otpArray.includes("")) {
      handleVerify(otp);
    }
  }, [otpArray]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updated = [...otpArray];
    updated[index] = value;
    setOtpArray(updated);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otpArray[index] === "") {
        if (index > 0) inputRefs.current[index - 1]?.focus();
      } else {
        const updated = [...otpArray];
        updated[index] = "";
        setOtpArray(updated);
      }
    }
  };

  const handleVerify = async (customOtp) => {
    setError("");
    setResendMessage("");
    setLoading(true);

    const otp = customOtp || otpArray.join("");

    try {
  const res = await axios.post("/api/users/verify-otp", { email, otp });

  if (context === "reset") {
    toast.success("OTP verified. You can now reset your password.");
    setTimeout(() => navigate(`/resetpassword?email=${email}`), 1500);
  } else {
    toast.success("Email verified successfully!");
    setTimeout(() => navigate("/auth"), 1500);
  }
} catch (err) {
  setError(err.response?.data?.message || "Verification failed.");
}

  };

  const handleResendOTP = async () => {
    setError("");
    setResendMessage("");
    setLoading(true);
    try {
      const res = await axios.post("/api/users/resend-otp", { email });
      setResendMessage(res.data.message || "OTP resent successfully.");
      setCountdown(60);
      setOtpArray(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white shadow-md rounded-2xl px-6 py-8 w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <FaEnvelope className="text-green-600 text-2xl" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
  {context === "reset" ? "Reset Password Verification" : "Email Verification"}
</h2>

        <p className="text-sm text-gray-600 mt-2 mb-6">
          Enter the verification code sent to<br />
          <span className="font-medium text-black">{email}</span>
        </p>

        <div className="flex justify-center gap-2 mb-4">
          {otpArray.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              value={digit}
              maxLength="1"
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-12 text-center text-lg font-semibold border border-gray-300 rounded focus:outline-none focus:border-green-500"
            />
          ))}
        </div>

        <p className="text-sm text-gray-600 mb-2">
          Didn’t get your code?{" "}
          {countdown === 0 ? (
            <button
              onClick={handleResendOTP}
              disabled={loading}
              className="text-blue-600 font-medium hover:underline disabled:opacity-50"
            >
              {loading ? "Resending..." : "Send a new Code"}
            </button>
          ) : (
            <span className="text-gray-500">Resend in {countdown}s</span>
          )}
        </p>

        {loading && (
          <div className="text-sm text-gray-500 mt-2">Verifying...</div>
        )}
        {resendMessage && (
          <p className="text-green-600 text-sm mt-2">{resendMessage}</p>
        )}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default OTPVerification;
