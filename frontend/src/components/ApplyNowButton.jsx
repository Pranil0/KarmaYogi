import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "../utils/axiosInstance";

const ApplyNowButton = ({ taskId }) => {
  const token = localStorage.getItem("token");
  console.log("Auth Token:", token);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const isValidOfferAmount = () => {
    const amount = Number(offerAmount);
    return offerAmount.trim() !== "" && !isNaN(amount) && amount > 0;
  };

  const handleApplyNowClick = () => {
    setIsFormOpen(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setOfferAmount("");
    setMessage("");
    setError(null);
  };

  const handleSubmit = async () => {
    if (!isValidOfferAmount()) {
      setError("Please enter a valid offer amount");
      return;
    }

    if (!token) {
      setError("You must be logged in to send an offer.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("/api/offers", {
        task: taskId,
        offerAmount: Number(offerAmount),
        message: message.trim(),
      });

      console.log("Offer created:", res.data);
      setSuccess(true);
      setIsFormOpen(false);
    } catch (err) {
      console.error("Offer submission failed:", err.response || err.message);
      setError(err.response?.data?.message || "Failed to send offer");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <button
        disabled
        className="bg-gray-400 text-white px-4 py-1 rounded cursor-not-allowed w-full"
      >
        Offer Sent
      </button>
    );
  }

  return (
    <>
      {!isFormOpen ? (
        <button
          onClick={handleApplyNowClick}
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition w-full"
        >
          Apply now
        </button>
      ) : (
        <div className="bg-white rounded-md p-4 shadow-md space-y-3 w-full max-w-sm mx-auto">
          <input
            type="number"
            placeholder="Enter your offer amount"
            value={offerAmount}
            onChange={(e) => {
              setOfferAmount(e.target.value);
              if (error) setError(null);
            }}
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
            min="1"
          />
          <textarea
            placeholder="Write a message (optional)"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (error) setError(null);
            }}
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm resize-none"
            rows={3}
          />
          {error && <p className="text-red-600 text-xs">{error}</p>}

          <div className="flex justify-between">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !isValidOfferAmount()}
              className={`px-4 py-1 rounded text-white transition ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Sending..." : "Submit Offer"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

ApplyNowButton.propTypes = {
  taskId: PropTypes.string.isRequired,
};

export default ApplyNowButton;
