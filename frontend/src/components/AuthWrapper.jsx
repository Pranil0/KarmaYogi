import { useState, useContext, useEffect } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaUserAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    location: "",
    email: "",
    password: "",
    photo: null,
  });
  const [errors, setErrors] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) navigate("/Home");
  }, [isLoggedIn, navigate]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      location: "",
      email: "",
      password: "",
      photo: null,
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!isLogin) {
      if (!formData.fullName) newErrors.fullName = "Full name is required";
      if (!formData.location) newErrors.location = "Location is required";
      if (!formData.photo) newErrors.photo = "Please upload your photo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        const res = await axios.post("/api/users/login", {
          email: formData.email,
          password: formData.password,
        });
        login(res.data.token, res.data.user);
        toast.success("Logged in successfully!");
        navigate("/Home");
      } else {
        const data = new FormData();
        data.append("name", formData.fullName);
        data.append("location", formData.location);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("avatar", formData.photo);

        await axios.post("/api/users/register", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Account created successfully! Please log in.");
        setIsLogin(true);
        resetForm();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleToggleLogin = () => {
    setIsLogin((prev) => !prev);
    resetForm();
  };

  return (
     <div
      className={`flex items-center justify-center min-h-screen ${
        isDarkMode ? "bg-[#0E1412]" : "bg-white"
      } px-4`}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-[850px] h-[600px] bg-white backdrop-blur-lg rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] border border-white/20 flex overflow-hidden relative">
        <div
          onClick={toggleTheme}
          className="absolute top-5 right-5 cursor-pointer text-xl p-2 rounded-full bg-gray-800 text-white select-none"
        >
          {isDarkMode ? "🌙" : "🌞"}
        </div>

        {/* Left side panel */}
        <div
          className={`w-1/2 h-full p-6 transition-all duration-700 flex flex-col justify-center items-center ${
            !isLogin ? "bg-[#159063] text-white" : "bg-white text-gray-700"
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={!isLogin ? "signupForm" : "signupPrompt"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full flex flex-col justify-center items-center"
            >
              {!isLogin ? (
                <>
                  <h2 className="text-3xl font-bold mb-4">Create Account</h2>

                  <form
                    className="w-full max-w-[300px]"
                    onSubmit={handleSubmit}
                    noValidate
                  >
                    <div className="relative mb-3">
                      <FaUserAlt className="absolute left-3 top-3 text-white" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full p-2 pl-10 rounded bg-[#118b5e] text-white placeholder-gray-300 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                      />
                      {errors.fullName && (
                        <p className="text-white text-xs">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="relative mb-3">
                      <FaMapMarkerAlt className="absolute left-3 top-3 text-white" />
                      <input
                        type="text"
                        placeholder="Location"
                        className="w-full p-2 pl-10 rounded bg-[#118b5e] text-white placeholder-gray-300 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                      />
                      {errors.location && (
                        <p className="text-white text-xs">{errors.location}</p>
                      )}
                    </div>

                    <div className="relative mb-3">
                      <FaEnvelope className="absolute left-3 top-3 text-white" />
                      <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 pl-10 rounded bg-[#118b5e] text-white placeholder-gray-300 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                      {errors.email && (
                        <p className="text-white text-xs">{errors.email}</p>
                      )}
                    </div>

                    <div className="relative mb-3">
                      <FaLock className="absolute left-3 top-3 text-white" />
                      <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 pl-10 rounded bg-[#118b5e] text-white placeholder-gray-300 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                      {errors.password && (
                        <p className="text-white text-xs">{errors.password}</p>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="text-white block mb-1">Upload Your Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full p-2 bg-[#118b5e] text-white rounded"
                        onChange={(e) => handleFileChange(e, "photo")}
                      />
                      {errors.photo && (
                        <p className="text-white text-xs">{errors.photo}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-white text-[#118b5e] font-bold rounded hover:bg-green-200 transform hover:scale-105 transition-all duration-300"
                    >
                      Sign up
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6">Don't have an account?</h2>
                  <button
                    onClick={() => setIsLogin(false)}
                    className="px-6 py-2 bg-[#159063] text-white rounded hover:bg-[#118b5e] transform hover:scale-105 transition-all duration-300"
                  >
                    Create Account
                  </button>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right side panel */}
        <div
          className={`w-1/2 h-full p-6 transition-all duration-700 flex flex-col justify-center items-center ${
            isLogin ? "bg-[#159063] text-white" : "bg-white text-gray-700"
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "loginForm" : "loginPrompt"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full flex flex-col justify-center items-center"
            >
              {isLogin ? (
                <>
                  <h2 className="text-3xl font-bold mb-4">Login</h2>
                  <div className="flex space-x-4 mb-5">
                    <button className="bg-white text-[#159063] p-2 rounded-full hover:bg-gray-200 transform hover:scale-110 transition-all duration-300">
                      <FaFacebookF />
                    </button>
                    <button className="bg-white text-[#159063] p-2 rounded-full hover:bg-gray-200 transform hover:scale-110 transition-all duration-300">
                      <FaInstagram />
                    </button>
                  </div>

                  <form
                    className="w-full max-w-[300px]"
                    onSubmit={handleSubmit}
                    noValidate
                  >
                    <div className="relative mb-3">
                      <FaEnvelope className="absolute left-3 top-3 text-white" />
                      <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 pl-10 rounded bg-[#118b5e] text-white placeholder-gray-300 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                      {errors.email && (
                        <p className="text-white text-xs">{errors.email}</p>
                      )}
                    </div>

                    <div className="relative mb-3">
                      <FaLock className="absolute left-3 top-3 text-white" />
                      <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 pl-10 rounded bg-[#118b5e] text-white placeholder-gray-300 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                      {errors.password && (
                        <p className="text-white text-xs">{errors.password}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-white text-[#118b5e] font-bold rounded hover:bg-green-200 transform hover:scale-105 transition-all duration-300"
                    >
                      Log in
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6">Already have an account?</h2>
                  <button
                    onClick={() => setIsLogin(true)}
                    className="px-6 py-2 bg-[#159063] text-white rounded hover:bg-[#118b5e] transform hover:scale-105 transition-all duration-300"
                  >
                    Log in
                  </button>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
