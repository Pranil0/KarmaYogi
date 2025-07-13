import { useState, useRef, useEffect, useContext } from "react";
import logo from "../assets/logo.png";
import { HiMenu, HiX } from "react-icons/hi";
import { FiBell, FiCheckCircle, FiXCircle, FiEdit3 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { BASE_URL } from "../utils/axiosInstance";
import { formatDistanceToNow } from "date-fns";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotif, setLoadingNotif] = useState(false);

  const avatarRef = useRef(null);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  const { isLoggedIn, user, logout } = useContext(AuthContext);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
        setShowSettingsDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user?.id || !isNotifOpen) return;

    const fetchNotifications = async () => {
      try {
        setLoadingNotif(true);
        const res = await axios.get(`${BASE_URL}/api/notifications/${user.id}`);
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoadingNotif(false);
      }
    };

    fetchNotifications();
  }, [user, isNotifOpen]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`${BASE_URL}/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleNotificationClick = (n) => {
    if (n.link) {
      navigate(n.link);
    }
    if (!n.read) {
      markAsRead(n._id);
    }
    setIsNotifOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/auth");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const avatarPath = user?.avatar || user?.profile?.avatar || "";
const avatarUrl = avatarPath
  ? avatarPath.startsWith("http") 
    ? avatarPath 
    : `${BASE_URL}/${avatarPath.replace(/\\/g, "/")}`
  : "/assets/default-avatar.png"; // Make sure this file exists in public/assets/


  const getIconByType = (type) => {
    switch (type) {
      case "new-offer":
        return <FiBell className="text-blue-500 mr-2 flex-shrink-0" />;
      case "offer-accepted":
        return <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />;
      case "task-edited":
        return <FiEdit3 className="text-yellow-500 mr-2 flex-shrink-0" />;
      case "task-cancelled":
        return <FiXCircle className="text-red-500 mr-2 flex-shrink-0" />;
      default:
        return <FiBell className="text-gray-500 mr-2 flex-shrink-0" />;
    }
  };

  return (
    <nav className="bg-black text-white px-6 py-4 border-b border-gray-700 font-poppins relative shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/home">
          <img src={logo} alt="Logo" className="w-12 h-12 hover:scale-110 transition-transform" />
        </Link>

        {/* Hamburger for mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>

        {/* Desktop nav */}
        <ul className="hidden md:flex gap-12 text-lg font-medium select-none">
          <li><Link to="/" className="hover:text-green-500">Home</Link></li>
          <li><Link to="/postjob" className="hover:text-green-500">Post Job</Link></li>
          <li><Link to="/jobs" className="hover:text-green-500">Jobs</Link></li>
          <li><Link to="/contact" className="hover:text-green-500">Contact</Link></li>
          <li><Link to="/about" className="hover:text-green-500">About</Link></li>
          {isLoggedIn && <li><Link to="/mytask" className="hover:text-green-500">My Task</Link></li>}
        </ul>

        {/* Right: Notifications + Avatar */}
        <div className="hidden md:flex items-center gap-5 relative">
          {isLoggedIn ? (
            <>
              {/* Notification bell */}
              <div ref={notifRef}>
                <button onClick={() => setIsNotifOpen(!isNotifOpen)}>
                  <FiBell size={24} className="hover:text-green-500 relative" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-600 text-xs rounded-full px-2 font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto bg-white text-black rounded-xl shadow-xl z-50 ring-1 ring-black ring-opacity-5">
                    <h3 className="p-4 border-b font-semibold text-lg">Notifications</h3>
                    {loadingNotif ? (
                      <p className="p-4 text-center">Loading...</p>
                    ) : notifications.length === 0 ? (
                      <p className="p-4 text-center">No notifications</p>
                    ) : (
                      <ul>
                        {notifications.map((n) => (
                          <li
                            key={n._id}
                            onClick={() => handleNotificationClick(n)}
                            className={`flex items-center px-5 py-3 border-b hover:bg-green-100 cursor-pointer ${
                              !n.read ? "bg-green-200 font-semibold" : "bg-white"
                            }`}
                          >
                            {getIconByType(n.type)}
                            <div>
                              <p className="text-sm">{n.message}</p>
                              <p className="text-xs text-gray-500 mt-1 font-mono">
                                {formatDistanceToNow(new Date(n.createdAt), {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Avatar */}
              <div
                ref={avatarRef}
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                  setShowSettingsDropdown(false);
                }}
                className="w-10 h-10 rounded-full border-2 border-green-500 overflow-hidden cursor-pointer hover:scale-105"
              >
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              </div>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute top-14 right-0 bg-white text-black w-64 shadow-xl rounded-xl p-4 z-50 ring-1 ring-black ring-opacity-10"
                >
                  {!showSettingsDropdown ? (
                    <ul className="space-y-3 font-medium">
                      <li>
                        <Link
                          to="/dashboard"
                          className="block hover:text-green-600"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          My Tasker Dashboard
                        </Link>
                      </li>
                      <li
                        onClick={() => setShowSettingsDropdown(true)}
                        className="flex justify-between items-center cursor-pointer hover:text-green-600"
                      >
                        Settings <span>{">"}</span>
                      </li>
                      <li className="hover:text-green-600 cursor-pointer">Help Topics</li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left text-red-600 hover:text-red-700 font-semibold"
                        >
                          Log Out
                        </button>
                      </li>
                    </ul>
                  ) : (
                    <ul className="space-y-3 font-medium">
                      <li
                        onClick={() => setShowSettingsDropdown(false)}
                        className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-green-600"
                      >
                        <span>{"<"}</span> Back
                      </li>
                      <li>
                        <Link
                          to="/settings/profile"
                          className="block hover:text-green-600"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setShowSettingsDropdown(false);
                          }}
                        >
                          Profile Info
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/settings/phone"
                          className="block hover:text-green-600"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setShowSettingsDropdown(false);
                          }}
                        >
                          Phone Number
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/settings/email"
                          className="block hover:text-green-600"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setShowSettingsDropdown(false);
                          }}
                        >
                          Email Update
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/settings/password"
                          className="block hover:text-green-600"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setShowSettingsDropdown(false);
                          }}
                        >
                          Change Password
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/auth">
                <button className="border border-white px-5 py-2 rounded-full hover:bg-white hover:text-black">
                  Login
                </button>
              </Link>
              <Link to="/auth">
                <button className="bg-green-600 px-5 py-2 rounded-full hover:bg-green-700 ml-3">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-5 text-center bg-black/90 backdrop-blur-sm rounded-lg py-6 px-4 shadow-lg">
          <ul className="space-y-4 text-lg font-medium">
            <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
            <li><Link to="/postjob" onClick={() => setIsOpen(false)}>Post Job</Link></li>
            <li><Link to="/jobs" onClick={() => setIsOpen(false)}>Jobs</Link></li>
            <li><Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
            <li><Link to="/about" onClick={() => setIsOpen(false)}>About</Link></li>
            {isLoggedIn && (
              <li><Link to="/mytask" onClick={() => setIsOpen(false)}>My Task</Link></li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
