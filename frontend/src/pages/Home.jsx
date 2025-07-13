import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import {
  FaUserCheck,
  FaClipboardList,
  FaSmile,
  FaPen,
  FaTools,
  FaStar,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'; // ✅ Added useNavigate
import axios from '../utils/axiosInstance';

const testimonials = [
  {
    name: 'John Doe',
    role: 'Web Developer',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    quote: 'This platform helped me land my dream freelance job in just a few weeks. Amazing experience!',
  },
  {
    name: 'Sarah Smith',
    role: 'Graphic Designer',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    quote: 'I love how smooth and professional everything is. Highly recommend to all creatives!',
  },
  {
    name: 'Carlos Lopez',
    role: 'SEO Expert',
    photo: 'https://randomuser.me/api/portraits/men/45.jpg',
    quote: 'Reliable clients, secure payments, and amazing support. This site changed my career!',
  },
  {
    name: 'Ava Johnson',
    role: 'Content Writer',
    photo: 'https://randomuser.me/api/portraits/women/65.jpg',
    quote: 'A fantastic experience from start to finish. I found long-term clients here!',
  },
  {
    name: 'Mike Taylor',
    role: 'App Developer',
    photo: 'https://randomuser.me/api/portraits/men/67.jpg',
    quote: 'Highly intuitive and well designed. It connects freelancers to the right gigs effortlessly.',
  },
];

const stats = [
  { icon: <FaUserCheck size={30} />, label: 'No. of Taskers', end: 10, suffix: ' +' },
  { icon: <FaClipboardList size={30} />, label: 'Gigs Completed', end: 5, suffix: '+' },
  { icon: <FaSmile size={30} />, label: 'Happy Clients', end: 10, suffix: ' %' },
  { icon: <FaPen size={30} />, label: 'Task Posted', end: 3, suffix: ' +' },
  { icon: <FaTools size={30} />, label: 'Skills Offered', end: 10, suffix: ' +' },
];

const Home = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });
  const [featuredGigs, setFeaturedGigs] = useState([]);
  const navigate = useNavigate(); // ✅ Init navigate

  useEffect(() => {
    const fetchFeaturedGigs = async () => {
      try {
        const response = await axios.get('/api/tasks/featured');
        const filteredGigs = response.data.filter((job) => !job.isCancelled);
        setFeaturedGigs(filteredGigs);
      } catch (error) {
        console.error('Error fetching featured gigs:', error);
      }
    };
    fetchFeaturedGigs();
  }, []);

  // ✅ Navigation handler
  const handleJobClick = (jobId) => {
    navigate('/jobs', { state: { selectedJobId: jobId } });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-black text-white text-center py-16 px-4 sm:px-6 md:px-10">
        <div className="max-w-5xl mx-auto px-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-snug md:leading-tight">
            Your One-Stop Platform for Short-Term Gigs & Reliable Taskers!
          </h1>
          <p className="text-green-500 font-semibold mt-4 text-lg sm:text-xl">KARMA YOGI</p>
          <Link to="/jobs">
            <button className="mt-6 bg-green-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-md font-bold hover:bg-green-700 transition">
              Browse Jobs
            </button>
          </Link>
        </div>
      </section>

      {/* Featured Gigs */}
      <section className="bg-black py-12 px-4 sm:px-6 text-white">
        <h2 className="text-2xl font-bold mb-8 text-green-600 text-center">Featured Gigs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredGigs.length > 0 ? (
            featuredGigs.map((job) => (
              <div
                key={job._id}
                className="bg-white shadow-md rounded-md p-4 w-full mx-auto max-w-sm cursor-pointer"
                onClick={() => handleJobClick(job._id)} // ✅ Click card to navigate
              >
                <div className="mb-2 flex justify-center">
                  <img src={logo} alt="Logo" className="w-16 h-auto object-contain" />
                </div>

                <h3 className="text-lg font-bold text-black mb-2 text-center">{job.title}</h3>

                <div className="flex justify-center gap-4 text-gray-600 text-sm mt-2">
                  <div className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-green-600" />
                    <span>{job.location}</span>
                  </div>
                  {job.dueDate && (
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt className="text-blue-500" />
                      <span>{new Date(job.dueDate).toLocaleDateString('en-CA')}</span>
                    </div>
                  )}
                </div>

                <div className="text-center text-sm text-gray-700 mt-2">
                  Rs.{job.budget}/Hrs
                </div>

                {/* ✅ Apply button also navigates */}
                <div className="mt-4 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click propagation
                      handleJobClick(job._id);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-white col-span-full">No featured gigs available</p>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-black text-white py-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-500 mb-4">Why Choose Us?</h2>
          <div className="w-16 h-1 bg-white mx-auto mb-10" />
          <div
            ref={ref}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition"
              >
                <div className="text-green-400 mb-2">{stat.icon}</div>
                <p className="text-base font-medium">{stat.label}</p>
                <div className="text-2xl font-bold text-white">
                  {inView ? (
                    <CountUp end={stat.end} duration={2} suffix={stat.suffix} />
                  ) : (
                    '0'
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-black py-16 px-4 sm:px-6 md:px-10 group">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-400 mb-10 inline-block border-b-4 border-white pb-2">
            What Our Users Say
          </h2>

          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={3}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={1000}
            loop={true}
            allowTouchMove={false}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="bg-[#254733] shadow-lg rounded-2xl p-6 h-full mx-auto max-w-xs sm:max-w-sm md:max-w-md text-white min-h-[350px] flex flex-col justify-between">
                  <img
                    src={testimonial.photo}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                  />
                  <p className="text-sm mb-4">"{testimonial.quote}"</p>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm">{testimonial.role}</p>
                  <div className="flex justify-center mt-2 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default Home;
