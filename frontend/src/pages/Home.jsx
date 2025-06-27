import React from 'react';
import logo from '../assets/logo.png';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import { FaUserCheck, FaClipboardList, FaSmile, FaPen, FaTools, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const jobList = [
  { title: "Carpenter", location: "Bharatpur" },
  { title: "Plumber", location: "Pokhara" },
  { title: "Electrician", location: "Lalitpur" },
  { title: "Sweeper", location: "Kathmandu" },
  { title: "Painter", location: "Butwal" },
  { title: "Gardener", location: "Biratnagar" },
  { title: "Welder", location: "Nepalgunj" },
  { title: "Mason", location: "Hetauda" },
];

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

  return (
    <>
      {/* Hero Section */}
      <section className="bg-black text-white text-center py-16 px-4 sm:px-6 md:px-10">
        <div className="max-w-5xl mx-auto px-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-snug md:leading-tight">
            Your One-Stop Platform for Short-Term Gigs & Reliable Taskers!
          </h1>
          <p className="text-green-500 font-semibold mt-4 text-lg sm:text-xl">
            KARMA YOGI
          </p>
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
          {jobList.map((job, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-md p-4 w-full mx-auto max-w-sm"
            >
              <div className="mb-2 flex justify-center">
                <img src={logo} alt="Logo" className="w-16 h-auto object-contain" />
              </div>
              <h3 className="text-lg font-bold text-green-700 mb-1 text-center">{job.title}</h3>
              <div className="flex gap-2 mt-1 text-xs justify-center flex-wrap">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{job.location}</span>
                <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full">Part-time</span>
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Lorem ipsum dolor sit amet consectetur. Eleifend metus vitae eu a sociis.
              </p>
              <div className="text-sm text-gray-500 mt-2 text-center">2082-01-08 · Rs.100/Hrs</div>
              <div className="flex mt-4 justify-end">
                <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition text-sm">
                  Apply now
                </button>
              </div>
            </div>
          ))}
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
              delay: 1,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            speed={4000}
            loop={true}
            allowTouchMove={false}
            loopedSlides={testimonials.length}
            onSwiper={(swiper) => {
              const section = document.querySelector('.group');
              section.addEventListener('mouseenter', () => swiper.autoplay.stop());
              section.addEventListener('mouseleave', () => swiper.autoplay.start());
            }}
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
