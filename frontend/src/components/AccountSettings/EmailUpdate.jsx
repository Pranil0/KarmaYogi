import { useState, useContext } from "react";
import axios from "../../utils/axiosInstance";
import { AuthContext } from "../../contexts/AuthContext";
const EmailUpdate = () => {
  const { token } = useContext(AuthContext);

  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    setLoading(true);
    setMessage("");
    try {
      await axios.put(
        "/api/users/email",
        { newEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("OTP sent to your new email.");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const confirmOtp = async () => {
    setLoading(true);
    setMessage("");
    try {
      await axios.post(
        "/api/users/email/confirm",
        { otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Email updated successfully!");
      setStep(1);
      setNewEmail("");
      setOtp("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to confirm OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md space-y-4">
      {step === 1 ? (
        <>
          <label className="block font-semibold mb-1">New Email</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={sendOtp}
            disabled={loading || !newEmail}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      ) : (
        <>
          <label className="block font-semibold mb-1">Enter OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={confirmOtp}
            disabled={loading || !otp}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loading ? "Confirming..." : "Confirm OTP"}
          </button>
          <button
            onClick={() => setStep(1)}
            className="mt-2 text-sm text-blue-600 underline"
          >
            Change Email
          </button>
        </>
      )}

      {message && (
        <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default EmailUpdate;
