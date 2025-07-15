import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../contexts/AuthContext";
import { FaCalendarAlt, FaRupeeSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TaskerDashboard = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyOffers = async () => {
      try {
        const res = await axiosInstance.get("/api/offers/my-offers");
        setOffers(res.data);
      } catch (err) {
        console.error("Error fetching tasker's offers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOffers();
  }, []);

  const filteredOffers = offers.filter(
    (offer) =>
      offer.task &&
      offer.status !== "declined" &&
      offer.status !== "withdrawn"
  );

  if (loading)
    return <div className="p-6 text-gray-600">Loading your offers...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Offers</h1>

      {filteredOffers.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          You haven’t submitted any valid offers yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredOffers.map((offer) => {
            const isCancelled = offer.task?.status === "cancelled";

            return (
              <div
                key={offer._id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition cursor-pointer relative"
                onClick={() => navigate(`/my-offers/${offer._id}`)}
              >
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {offer.task.title}
                  </h2>
                  <p className="text-gray-500">{offer.task.location}</p>
                  <p className="flex items-center gap-2 text-gray-600 mt-2 text-sm">
                    <FaCalendarAlt />
                    {offer.task.dueDate
                      ? new Date(offer.task.dueDate).toLocaleDateString()
                      : "Flexible"}
                  </p>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="text-gray-700">
                    <span className="font-semibold">Your Offer: </span>
                    <span className="text-green-600 font-medium">
                      <FaRupeeSign className="inline mr-1" />
                      {offer.offerAmount}
                    </span>
                  </div>

                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isCancelled
                        ? "bg-red-100 text-red-700"
                        : offer.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {isCancelled
                      ? "Cancelled"
                      : offer.status === "accepted"
                      ? "Accepted"
                      : "Pending"}
                  </div>
                </div>

                {offer.message && (
                  <p className="text-gray-700 mt-4 text-sm italic">
                    “{offer.message}”
                  </p>
                )}

                {/* Show task status only if not cancelled */}
                {!isCancelled && offer.task.status && (
                  <div className="mt-4">
                    <span className="text-xs font-semibold text-gray-600">
                      Task Status:
                    </span>{" "}
                    <span className="text-sm font-medium capitalize text-blue-800">
                      {offer.task.status}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskerDashboard;
