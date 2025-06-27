import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import {
  MapPin,
  Calendar,
  ClipboardList,
  Boxes,
  ArrowDownCircle,
} from 'lucide-react';

import axiosInstance from '../utils/axiosInstance';

// Fix Leaflet icon issue
const icon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const offerSteps = [
  { id: 'profilePic', label: 'Upload a profile picture', type: 'file' },
  { id: 'dob', label: 'Enter your date of birth', type: 'date' },
  { id: 'phone', label: 'Verify your phone number', type: 'tel' },
  { id: 'bank', label: 'Connect your bank account', type: 'text' },
  { id: 'address', label: 'Add your billing address', type: 'text' },
];

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [expandedFields, setExpandedFields] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axiosInstance.get('/api/tasks');
        const mappedJobs = res.data.map((job) => ({
          ...job,
          lat: job.latitude,
          lng: job.longitude,
        }));
        setJobs(mappedJobs);
      } catch (err) {
        console.error('Error fetching jobs:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const toggleField = (id) => {
    setExpandedFields((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Loading jobs...</div>;
  }

  const centerPosition =
    jobs.length > 0
      ? [
          jobs.reduce((sum, job) => sum + (job.lat || 0), 0) / jobs.length,
          jobs.reduce((sum, job) => sum + (job.lng || 0), 0) / jobs.length,
        ]
      : [27.6749, 84.4325];

  return (
    <div className="flex h-screen relative">
      {/* Left Panel */}
      <div className="w-1/3 bg-black text-white p-4 overflow-y-auto">
        <input
          type="text"
          placeholder="Search for a task"
          className="w-full p-2 mb-4 rounded text-white bg-gray-900"
        />
        <button className="w-full bg-green-700 text-white py-2 mb-4 rounded">
          New Jobs
        </button>

        <div className="flex flex-wrap gap-2 mb-4 text-sm font-semibold">
          <select className="bg-black border border-white px-3 py-1 rounded">
            <option>Category</option>
            <option>Plumber</option>
            <option>Electrician</option>
            <option>Carpenter</option>
          </select>
          <select className="bg-black border border-white px-3 py-1 rounded">
            <option>Distance</option>
            <option>0-1km</option>
            <option>1-5km</option>
            <option>5km+</option>
          </select>
          <select className="bg-black border border-white px-3 py-1 rounded">
            <option>Price</option>
            <option>Below 500</option>
            <option>500+</option>
          </select>
          <select className="bg-black border border-white px-3 py-1 rounded">
            <option>Sort</option>
            <option>Recent</option>
            <option>Oldest</option>
            <option>Highest Price</option>
          </select>
        </div>

        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white text-black border rounded shadow-sm p-4 mb-4 cursor-pointer hover:shadow-lg"
            onClick={() => setSelectedJob(job)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">{job.title}</h3>
              <span className="text-md font-semibold">Rs.{job.budget}</span>
            </div>
            <div className="flex gap-2 text-sm mt-1 mb-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {job.location}
              </span>
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
                {job.category}
              </span>
            </div>
            {job.description && (
              <p className="text-sm text-gray-600">{job.description}</p>
            )}
            {job.dueDate && (
              <div className="text-sm text-gray-400 mt-2">
                {new Date(job.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right Panel */}
      <div className="w-2/3 h-screen bg-black text-white overflow-y-auto p-6">
        {!selectedJob ? (
          <div style={{ height: '90vh', width: '100%' }}>
            <MapContainer
              center={centerPosition}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {jobs.map(
                (job) =>
                  job.lat &&
                  job.lng && (
                    <Marker
                      key={job._id}
                      position={[job.lat, job.lng]}
                      icon={icon}
                      eventHandlers={{
                        click: () => setSelectedJob(job),
                      }}
                    >
                      <Popup>
                        <strong>{job.title}</strong>
                        <br />
                        {job.location}
                      </Popup>
                    </Marker>
                  )
              )}
            </MapContainer>
          </div>
        ) : (
          <div className="relative text-white">
            <div className="flex justify-between items-start gap-6">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4">{selectedJob.title}</h2>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-green-400 mb-4"
                >
                  &lt; Return to map
                </button>

                <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
                  <img
                    src={selectedJob.createdBy?.profile?.avatar || '/avatar.png'}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-white font-semibold">
                    {selectedJob.createdBy?.name || 'Unknown User'}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2 text-sm text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span>Location</span>
                </div>
                <p className="text-white mb-4">{selectedJob.location}</p>

                {selectedJob.dueDate && (
                  <>
                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>To be done on</span>
                    </div>
                    <p className="text-white mb-6">
                      {new Date(selectedJob.dueDate).toLocaleDateString()}
                    </p>
                  </>
                )}

                <div className="mt-6">
                  <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                    <ClipboardList className="w-4 h-4" />
                    <h3 className="text-white text-lg font-bold">Details</h3>
                  </div>
                  <div className="space-y-1 text-sm text-white">
                    <p className="flex items-center gap-2">
                      <Boxes className="w-4 h-4 text-gray-400" /> Category:{' '}
                      {selectedJob.category}
                    </p>
                    {selectedJob.description && (
                      <p className="flex items-center gap-2">
                        <ArrowDownCircle className="w-4 h-4 text-gray-400" />{' '}
                        {selectedJob.description}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded mt-6"
                  onClick={() => setShowOfferModal(true)}
                >
                  Make an Offer
                </button>
              </div>

              <div className="bg-white text-black p-6 rounded-xl shadow-xl w-64 text-center sticky top-6">
                <p className="text-gray-500 text-sm mb-2">Task Budget</p>
                <p className="text-green-600 text-3xl font-bold mb-4">
                  Rs.{selectedJob.budget}/-
                </p>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
                  onClick={() => setShowOfferModal(true)}
                >
                  Make an Offer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
