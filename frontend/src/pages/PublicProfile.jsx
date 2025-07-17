import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";

const PublicProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/users/${id}/profile`);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch public profile:", err);
        setError(err?.response?.data?.message || "Failed to load profile");
      }
    };

    fetchProfile();
  }, [id]);

  if (error) return <div className="text-red-500 text-center mt-6">{error}</div>;
  if (!profile) return <div className="text-center text-gray-400 mt-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-black px-4 py-10">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white text-black rounded-xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl text-gray-600">Meet</h2>
              <h1 className="text-2xl font-bold">{profile.name}</h1>
            </div>
            <img
              src={`http://localhost:5000/${profile.avatar}`}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover border shadow"
            />
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <FaMapMarkerAlt className="mr-2" />
            <span>{profile.location}</span>
          </div>
        </div>

        {/* Review Placeholder Card */}
        <div className="bg-white text-black rounded-xl p-6 shadow-md flex flex-col">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            Reviews
            <FaStar className="text-yellow-400 ml-2" />
            <FaStar className="text-yellow-400 ml-1" />
            <FaStar className="text-yellow-400 ml-1" />
          </h2>
          <p className="text-sm text-gray-600 italic mt-auto">No reviews yet. Stay tuned!</p>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
