import React from "react";
import logo from "../assets/logo.png";

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

const GigCard = ({ title, location }) => (
  <div className="bg-white shadow-md rounded-md p-4 w-full max-w-xs mx-4 shrink-0">
    <div className="mb-2 flex justify-center">
      <img src={logo} alt="Logo" className="w-16 h-auto object-contain scale-110" />
    </div>
    <h3 className="text-lg font-bold text-green-700 mb-1 text-center">{title}</h3>
    <div className="flex gap-2 mt-1 text-xs justify-center">
      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{location}</span>
      <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full">Part-time</span>
    </div>
    <p className="text-sm text-gray-600 mt-2 text-center">
      Lorem ipsum dolor sit amet consectetur. Eleifend metus vitae eu a sociis.
    </p>
    <div className="text-sm text-gray-500 mt-2 text-center">2082-01-08 · Rs.100/Hrs</div>
    <div className="mt-4 flex justify-center">
      <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition text-sm">
        Apply now
      </button>
    </div>
  </div>
);

const FeaturedGigs = () => {
  const firstRow = jobList.slice(0, 4);
  const secondRow = jobList.slice(4, 8);

  return (
    <section className="bg-black py-12 px-6 text-white overflow-hidden">
      <h2 className="text-2xl font-bold mb-8 text-green-600">Featured Gigs</h2>

      {/* First row scroll right to left */}
      <div className="w-full overflow-x-hidden mb-8">
        <div className="flex animate-slide-left w-max">
          {firstRow.map((job, index) => (
            <GigCard key={index} title={job.title} location={job.location} />
          ))}
        </div>
      </div>

      {/* Second row scroll left to right */}
      <div className="w-full overflow-x-hidden">
        <div className="flex animate-slide-right w-max">
          {secondRow.map((job, index) => (
            <GigCard key={index} title={job.title} location={job.location} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedGigs;
