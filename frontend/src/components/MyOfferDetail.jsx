import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { FaCalendarAlt, FaRupeeSign } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyOfferDetail = () => {
  const { id } = useParams(); // Offer ID
  const location = useLocation();
  const reason = new URLSearchParams(location.search).get("reason");
  const navigate = useNavigate();

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await axiosInstance.get(`/api/offers/${id}`);
        setOffer(res.data);
      } catch (err) {
        console.error("Error fetching offer details:", err.response?.data || err.message);
        toast.error("Failed to load your offer details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id]);

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (!offer) return <div className="p-6 text-red-600">Offer not found.</div>;

  const { task } = offer;

  return (
    <div className="min-h-screen bg-black p-6">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        {/* Notification Reason Banner */}
        {reason === "task-cancelled" && (
          <div className="bg-red-100 text-red-800 text-sm px-4 py-2 rounded mb-4">
            The task you made an offer on was cancelled.
          </div>
        )}
        {reason === "task-edited" && (
          <div className="bg-blue-100 text-blue-800 text-sm px-4 py-2 rounded mb-4">
            The task you submitted an offer for has been updated.
          </div>
        )}
        {reason === "offer-accepted" && (
          <div className="bg-green-100 text-green-800 text-sm px-4 py-2 rounded mb-4">
            Your offer was accepted by the task poster!
          </div>
        )}

        {/* Header Section */}
        <div className="bg-green-600 rounded-2xl px-8 py-12 mb-10 flex flex-col lg:flex-row justify-between gap-8 w-full min-h-[340px]">
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-base text-white font-semibold mb-3">• Offer details</p>
            <h2 className="text-5xl font-extrabold text-white mb-4">Your Offer</h2>
            <p className="text-lg text-white mb-5 leading-relaxed">
              Review the details of your offer and task before continuing.
            </p>
          </div>

          {/* Task Summary */}
          <div className="bg-white shadow-lg rounded-2xl p-6 relative flex flex-col justify-between min-h-[340px] max-w-sm w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{task.title}</h3>
            <p className="text-gray-700 text-lg mb-3">{task.location}</p>
            <p className="flex items-center gap-2 text-base text-gray-800 mb-1">
              <FaCalendarAlt className="text-gray-600" />
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Flexible"}
            </p>
            <p className="flex items-center gap-2 text-base text-gray-800">
              <FaRupeeSign className="text-gray-600" /> ₹{task.budget}
            </p>
            {task.status && (
              <div
                className={`mt-4 inline-block px-4 py-2 text-sm font-semibold rounded-full ${
                  task.status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : task.status === "assigned"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {task.status.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Offer Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
          {/* Offer Price & Status */}
          <div className="flex flex-col gap-4 w-full md:w-1/3">
            <p className="text-xl font-semibold text-gray-800">
              {offer.user?.name || "You"}
            </p>

            <div className="mt-2">
              <p className="text-gray-800 font-medium text-lg">₹{offer.offerAmount}</p>
              <p className="text-sm text-gray-400">Offer price</p>
            </div>

            <div className="mt-3">
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  task.status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : offer.status === "accepted"
                    ? "bg-green-100 text-green-700"
                    : offer.status === "declined"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                Status: {(task.status === "cancelled" ? "Cancelled" : offer.status)?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Offer Message */}
          <div className="w-full md:w-2/3">
            <div className="bg-gray-100 text-gray-800 rounded-md p-4 text-sm leading-relaxed h-full min-h-[120px]">
              {offer.message ? `“${offer.message}”` : "No message provided."}
            </div>

            {/* Go Back Button */}
            <div className="mt-6">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-full font-semibold"
              >
                ← Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOfferDetail;
