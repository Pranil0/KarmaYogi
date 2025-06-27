import logo from "../assets/logo.png";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-4 sm:px-6 md:px-10">
      <div className="lg:pl-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Logo + Tagline */}
          <div className="flex flex-col items-start">
            <img
              src={logo}
              alt="Logo"
              className="w-16 h-16 mb-4 transition-transform duration-300 transform hover:scale-110"
            />
            <p className="text-sm text-gray-400">Empowering freelancers worldwide.</p>
          </div>

          {/* Navigation */}
          <div>
  <h4 className="font-semibold mb-4">Navigation</h4>
  <ul className="space-y-2 text-sm text-gray-400">
    <li>
      <Link to="/" className="hover:text-white transition">Home</Link>
    </li>
    <li>
      <Link to="/jobs" className="hover:text-white transition">Jobs</Link>
    </li>
    <li>
      <Link to="/contact" className="hover:text-white transition">Contact</Link>
    </li>
    <li>
      <Link to="/about" className="hover:text-white transition">About</Link>
    </li>
  </ul>
</div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4 text-gray-400 text-xl">
              <FaFacebookF className="cursor-pointer transition-colors duration-300 hover:text-[#1877F2]" />
              <FaTwitter className="cursor-pointer transition-colors duration-300 hover:text-[#1DA1F2]" />
              <FaInstagram className="cursor-pointer transition-colors duration-300 hover:text-[#E1306C]" />
              <FaLinkedinIn className="cursor-pointer transition-colors duration-300 hover:text-[#0A66C2]" />
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-gray-500 text-sm px-4">
        &copy; {new Date().getFullYear()} Karma Yogi. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
