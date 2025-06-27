import { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaUser,
  FaRegCommentDots,
} from "react-icons/fa";
import { BsGeoAlt } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { motion } from "framer-motion";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "How can I apply for a job?",
      answer: "You can browse available jobs and apply directly through the Jobs section.",
    },
    {
      question: "Is there a registration fee?",
      answer: "No, registering and using the platform is completely free.",
    },
    {
      question: "How do I contact support?",
      answer: "You can fill out the contact form or email us directly at karmayogi@gmail.com.",
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent!");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section className="bg-black text-white py-16 px-4 sm:px-6 md:px-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        {/* Left Side - Contact Info */}
        <div className="flex flex-col justify-between h-full">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Get In Touch With Us</h2>
            <p className="mb-8 text-gray-300 font-medium">
              We’d love to hear from you! Whether you have a question, suggestion, or just want to say hello — feel free to reach out using the form or contact details below
            </p>

            <div className="flex items-start gap-4 mb-8">
              <FaPhoneAlt className="text-white text-xl mt-1" />
              <div>
                <p className="font-semibold">Phone Number</p>
                <p className="text-gray-300">(+977 9813674597)</p>
              </div>
            </div>

            <div className="flex items-start gap-4 mb-8">
              <FaEnvelope className="text-white text-xl mt-1" />
              <div>
                <p className="font-semibold">Email Address</p>
                <p className="text-gray-300">karmayogi@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4 mb-8">
              <BsGeoAlt className="text-white text-xl mt-1" />
              <div>
                <p className="font-semibold">Address</p>
                <p className="text-gray-300">Bharatpur, Chitwan</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <p className="font-semibold mb-2">Follow Us</p>
            <div className="flex gap-5">
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                className="text-gray-400 hover:text-[#1877F2] transition"
              >
                <FaFacebookF size={22} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                className="text-gray-400 hover:text-[#E1306C] transition"
              >
                <FaInstagram size={22} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                className="text-gray-400 hover:text-[#1DA1F2] transition"
              >
                <FaTwitter size={22} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                className="text-gray-400 hover:text-[#0077B5] transition"
              >
                <FaLinkedinIn size={22} />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form with icons */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#2e3b4e] p-8 rounded-lg space-y-8 w-full"
        >
          {/* Name */}
          <div className="relative">
            <FaUser className="absolute top-3.5 left-3 text-gray-500" />
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-200 text-black rounded-md placeholder-gray-600"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute top-3.5 left-3 text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-200 text-black rounded-md placeholder-gray-600"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <FaPhoneAlt className="absolute top-3.5 left-3 text-gray-500" />
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-200 text-black rounded-md placeholder-gray-600"
            />
          </div>

          {/* Message */}
          <div className="relative">
            <FaRegCommentDots className="absolute top-3.5 left-3 text-gray-500" />
            <textarea
              name="message"
              placeholder="Your Message"
              required
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-200 text-black rounded-md placeholder-gray-600"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition"
          >
            Send message
          </button>
        </form>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mt-20">
        <h3 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFAQ === index;
            return (
              <div
                key={index}
                className="border border-gray-700 rounded-md p-4 bg-[#1f2937]"
              >
                <button
                  type="button"
                  onClick={() => setOpenFAQ(isOpen ? null : index)}
                  className="flex justify-between items-center w-full text-left"
                >
                  <span className="font-medium text-gray-100">{faq.question}</span>
                  <motion.span
                    initial={false}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <IoIosArrowDown className="text-white text-lg" />
                  </motion.span>
                </button>
                {isOpen && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-400 mt-3"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
