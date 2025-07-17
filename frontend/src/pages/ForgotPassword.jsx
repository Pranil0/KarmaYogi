import { useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      await axios.post("/api/users/resend-otp", { email }); // You’ll create this API next
      toast.success("OTP sent to your email");
      navigate(`/verify-otp?email=${encodeURIComponent(email)}&context=reset`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0E1412] text-white px-4">
      <form
        onSubmit={handleSendOTP}
        className="bg-[#159063] p-6 rounded-xl shadow-lg max-w-md w-full space-y-4"
      >
        <h2 className="text-2xl font-bold">Forgot Password</h2>
        <p className="text-sm text-white/80">
          Enter your registered email and we’ll send you an OTP to verify.
        </p>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-white text-black"
          required
        />
        <button
          type="submit"
          className="w-full bg-white text-[#159063] font-bold py-2 rounded hover:bg-gray-200"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
