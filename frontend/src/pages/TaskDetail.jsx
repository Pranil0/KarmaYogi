import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { FaCalendarAlt, FaRupeeSign, FaEllipsisV } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [offers, setOffers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    const fetchTaskAndOffers = async () => {
      try {
        const taskRes = await axiosInstance.get(`/api/tasks/${id}`);
        const offerRes = await axiosInstance.get(`/api/offers/task/${id}`);
        setTask(taskRes.data);
        setOffers(offerRes.data);
      } catch (err) {
        console.error("Error fetching task or offers:", err.response?.data || err.message);
      }
    };

    fetchTaskAndOffers();
  }, [id]);

  const handleAcceptOffer = async (offerId) => {
    try {
      await axiosInstance.put(`/api/offers/${offerId}/accept`);
      toast.success("✅ Offer accepted");
      window.location.reload();
    } catch (err) {
      toast.error("❌ Failed to accept offer");
      console.error(err);
    }
  };

 const handleCancelTask = async () => {
  try {
    await axiosInstance.put(`/api/tasks/${task._id}/cancel`);
    toast.success("Task cancelled successfully");
    setTask((prev) => ({ ...prev, status: "cancelled" }));
    setShowCancelConfirm(false);
    // NO navigate() or window.location.reload() here!
  } catch (error) {
    toast.error("Failed to cancel task");
    console.error(error);
  }
};

  if (!task) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-black p-6 relative">
      <ToastContainer  />
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-green-600 rounded-2xl px-8 py-12 mb-10 flex flex-col lg:flex-row justify-between gap-8 w-full min-h-[340px]">
          {/* Offers Info */}
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-base text-white font-semibold mb-3">• New offers!</p>
            <h2 className="text-5xl font-extrabold text-white mb-4">
              You have {offers.length} offer{offers.length !== 1 && 's'}
            </h2>
            <p className="text-lg text-white mb-5 leading-relaxed">
              Discuss details with Taskers and accept an offer when you're ready.
            </p>
          </div>

          {/* Task Info */}
          <div className="bg-white shadow-lg rounded-2xl p-6 relative flex flex-col justify-between min-h-[340px] max-w-sm w-full">
            <div className="absolute top-4 right-4">
              <button onClick={() => setShowDropdown(!showDropdown)}>
                <FaEllipsisV className="text-gray-600" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-md z-40">
                  <Link
                    to={`/edit-task/${task._id}`}
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => setShowDropdown(false)}
                  >
                    ✏️ Edit Task
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                    onClick={() => {
                      setShowCancelConfirm(true);
                      setShowDropdown(false);
                    }}
                  >
                    ❌ Cancel Task
                  </button>
                </div>
              )}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-1">{task.title}</h3>
            <p className="text-gray-700 text-lg mb-3">{task.location}</p>
            <p className="flex items-center gap-2 text-base text-gray-800 mb-1">
              <FaCalendarAlt className="text-gray-600" />
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Flexible"}
            </p>
            <p className="flex items-center gap-2 text-base text-gray-800">
              <FaRupeeSign className="text-gray-600" />
              ₹{task.budget}
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

        {/* Modal-style Cancel Confirmation */}
        {showCancelConfirm && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg"
                onClick={() => setShowCancelConfirm(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Are you sure?</h2>
              <p className="text-gray-700 mb-6">
                Just a heads up: if you do cancel this job, you won’t be able to un-cancel it.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-blue-600 font-semibold px-4 py-2 rounded-full"
                >
                  Nevermind
                </button>
                <button
                  onClick={handleCancelTask}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full"
                >
                  Cancel the task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Offers */}
        {task.status !== "cancelled" && (
          <div className="space-y-4">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col md:flex-row md:items-stretch justify-between"
              >
                <div className="flex flex-col gap-2 w-full md:w-1/3 md:pr-4 md:border-r md:border-gray-300">
                  <div className="flex items-center gap-3">
                    <img
                      src={offer.user?.avatar || "https://via.placeholder.com/40"}
                      alt="avatar"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xl font-semibold text-gray-800">{offer.user?.name || "Unknown"}</p>
                    </div>
                  </div>

                  {offer.status === "accepted" ? (
                    <div className="text-green-600 font-medium text-sm mt-2">✅ You accepted this offer</div>
                  ) : task.status !== "assigned" ? (
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => handleAcceptOffer(offer._id)}
                        className="bg-green-600 hover:bg-blue-700 text-white text-base px-4 py-1.5 rounded-full"
                      >
                        Accept
                      </button>
                      <div>
                        <p className="text-sm text-gray-800 font-medium">₹{offer.offerAmount}</p>
                        <p className="text-[11px] text-gray-400">Offer price</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 text-gray-400 text-sm">Not accepted</div>
                  )}
                </div>

                {/* Right: Message */}
                <div className="w-full md:w-2/3 mt-4 md:mt-0 md:pl-6">
                  <div className="bg-gray-100 text-gray-800 rounded-md p-4 text-sm leading-relaxed h-full">
                    {offer.message || "No message provided."}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;
