import { useState, useContext, useEffect } from "react";
import axios from "../../utils/axiosInstance";
import { AuthContext } from "../../contexts/AuthContext";

const ProfileUpdate = () => {
  const { user, token, refreshUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    avatar: null,
  });

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        location: user.location || "",
        avatar: null,
      });
      setPreview(user.avatar || "");
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, avatar: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("location", formData.location);
      if (formData.avatar) data.append("avatar", formData.avatar);

      await axios.put("/api/users/profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Profile updated successfully!");
      refreshUser();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Update Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-300"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-300"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">Avatar</label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {preview && (
              <img
                src={preview}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border"
              />
            )}
          </div>
        </div>

        {message && (
          <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdate;
