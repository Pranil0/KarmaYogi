import { useState, useRef, useEffect, useContext } from "react";
import logo from "../assets/logo.png";
import { HiMenu, HiX } from "react-icons/hi";
import { FiBell } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom"; // ✅ Added useNavigate
import { AuthContext } from "../contexts/AuthContext"; // ✅ Import
import { BASE_URL } from "../utils/axiosInstance";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

const { isLoggedIn, user, logout } = useContext(AuthContext);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

const avatarUrl = user?.profile?.avatar
  ? `${BASE_URL}/${user.profile.avatar.replace(/\\/g, "/")}`
  : "/default-avatar.png";

  const handleLogout = () => {
    logout(); // ✅ This will remove token and update context
    setIsDropdownOpen(false);
    navigate("/auth");
  };
  return (
    <nav className="bg-black text-white px-6 py-4 border-b border-gray-700 font-poppins relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
                    <Link to="/home">
          
          <img
            src={logo}
            alt="Logo"
            className="w-12 h-12 transition-transform duration-300 hover:scale-110"
          />
          </Link>
        </div>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>

        {/* Nav Links */}
        <ul className="hidden md:flex gap-10">
          <li><Link to="/" className="hover:text-green-600 transition">Home</Link></li>
          <li><Link to="/postjob" className="hover:text-green-600 transition">Post Job</Link></li>
          <li><Link to="/jobs" className="hover:text-green-600 transition">Jobs</Link></li>
          <li><Link to="/contact" className="hover:text-green-600 transition">Contact</Link></li>
          <li><Link to="/about" className="hover:text-green-600 transition">About</Link></li>
          {isLoggedIn && (
            <li><Link to="/mytask" className="hover:text-green-600 transition">My Task</Link></li>
          )}
        </ul>

        {/* Right section */}
        <div className="hidden md:flex items-center gap-4 relative" ref={dropdownRef}>
      {isLoggedIn ? (
        <>
          <FiBell size={22} className="cursor-pointer hover:text-green-500 transition" />
          
          {/* Avatar + greeting container */}
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-full border-2 border-green-500 overflow-hidden">
              <img
                src={avatarUrl}
                alt={`${user?.name || "User"} avatar`}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white font-semibold whitespace-nowrap">
              {getGreeting()}, {user?.name || "User"}
            </span>
          </div>

              {/* Avatar Dropdown */}
              {isDropdownOpen && (
                <div className="absolute top-12 right-0 bg-white text-black w-64 shadow-lg rounded-xl p-4 z-50">
                  <div className="mb-4">
                    <h4 className="font-semibold">BIKASH ACHARYA</h4>
                    <p className="text-sm text-gray-500">Public Profile</p>
                  </div>
                  <ul className="space-y-2">
                    <li>
                      <Link to="/dashboard" className="font-semibold hover:text-green-600 transition">
                        My Tasker Dashboard
                      </Link>
                    </li>
                    <li className="flex justify-between items-center hover:text-green-600 transition cursor-pointer">
                      Settings <span>›</span>
                    </li>
                    <li className="flex justify-between items-center hover:text-green-600 transition cursor-pointer">
                      Help topics <span>›</span>
                    </li>
                    <li>
                     <button
                        onClick={handleLogout} // ✅ Updated
                        className="font-semibold text-left text-red-600 hover:text-red-700 transition"
                      >
                        Log Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/auth">
                <button className="bg-transparent text-white border border-white px-4 py-1 rounded-full hover:bg-white hover:text-black transition">
                  Login
                </button>
              </Link>
              <Link to="/auth">
                <button className="bg-green-600 px-4 py-1 rounded-full text-white hover:bg-green-700 transition">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 text-center">
          <ul className="space-y-3">
            <li><Link to="/" onClick={() => setIsOpen(false)} className="hover:text-green-600 transition">Home</Link></li>
            <li><Link to="/jobs" onClick={() => setIsOpen(false)} className="hover:text-green-600 transition">Jobs</Link></li>
            <li><Link to="/contact" onClick={() => setIsOpen(false)} className="hover:text-green-600 transition">Contact</Link></li>
            <li><Link to="/about" onClick={() => setIsOpen(false)} className="hover:text-green-600 transition">About</Link></li>
            {isLoggedIn && (
              <li><Link to="/mytask" onClick={() => setIsOpen(false)} className="hover:text-green-600 transition">My Task</Link></li>
            )}
          </ul>
          <div className="flex flex-col items-center gap-2 mt-4">
            {isLoggedIn ? (
              <>
                <FiBell size={22} className="text-white" />
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <button className="bg-transparent text-white border border-white px-6 py-1 rounded-full hover:bg-white hover:text-black transition">
                    Login
                  </button>
                </Link>
                <Link to="/auth">
                  <button className="bg-green-600 px-6 py-1 rounded-full text-white hover:bg-green-700 transition">
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
