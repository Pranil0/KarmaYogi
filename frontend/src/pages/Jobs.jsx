import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useLocation } from 'react-router-dom';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Link } from 'react-router-dom';
import QuestionsSection from '../components/QuestionsSection';


import {
  MapPin,
  Calendar,
  ClipboardList,
  Boxes,
  ArrowDownCircle,
} from 'lucide-react';

import axiosInstance from '../utils/axiosInstance';

const icon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Helper function: Calculate distance (km) between two lat/lng points using Haversine formula
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

const Jobs = () => {
  const location = useLocation();
  const selectedJobId = location.state?.selectedJobId || null;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  

   const [offers, setOffers] = useState([]);
const [loadingOffers, setLoadingOffers] = useState(false);
  const [activeTab, setActiveTab] = useState('offers'); // or 'questions'

   
  // Filters states
  const [categoryFilter, setCategoryFilter] = useState('');
  const [distanceFilter, setDistanceFilter] = useState(''); // e.g. "0-1", "1-5", "5+"
  const [priceFilter, setPriceFilter] = useState('');
  const [sortOption, setSortOption] = useState('');

  // User location for distance filter
  const [userLocation, setUserLocation] = useState(null);

  // Offer form states
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [offerLoading, setOfferLoading] = useState(false);

  useEffect(() => {
    // Fallback fetch user location from DB
    const fetchUserLocationFromDB = async () => {
      try {
        const res = await axiosInstance.get('/api/users/profile');
setUserLocation({
  lat: res.data.geoLocation.coordinates[1], // latitude
  lng: res.data.geoLocation.coordinates[0], // longitude
});

      } catch (error) {
        console.warn('Failed to fetch user location from DB:', error);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          // On error or permission denied, fallback to DB location
          fetchUserLocationFromDB();
        }
      );
    } else {
      // Browser does not support geolocation, fallback to DB location
      fetchUserLocationFromDB();
    }
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axiosInstance.get('/api/tasks');
        const filteredJobs = res.data.filter((job) => !job.isCancelled);

        const mappedJobs = filteredJobs.map((job) => ({
          ...job,
          lat: job.latitude,
          lng: job.longitude,
        }));

        setJobs(mappedJobs);

        // Fetch all offers for offer count
      const offersRes = await axiosInstance.get('/api/offers');
      const offerCounts = {};
      offersRes.data.forEach((offer) => {
        const jobId = offer.task;
        offerCounts[jobId] = (offerCounts[jobId] || 0) + 1;
      });

      // Attach offerCount to each job
      const jobsWithOffers = mappedJobs.map((job) => ({
        ...job,
        offerCount: offerCounts[job._id] || 0,
      }));

      setJobs(jobsWithOffers);

        if (selectedJobId) {
          const jobToSelect = mappedJobs.find((job) => job._id === selectedJobId);
          if (jobToSelect) {
            setSelectedJob(jobToSelect);
          }
        }
      } catch (err) {
        console.error('Error fetching jobs:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [selectedJobId]);


  useEffect(() => {
  const fetchOffers = async () => {
    if (!selectedJob) return;
    setLoadingOffers(true);
    try {
      const res = await axiosInstance.get(`/api/offers/task/${selectedJob._id}`);
      setOffers(res.data);
    } catch (error) {
      console.error('Error fetching offers:', error.response?.data || error.message);
      setOffers([]);
    } finally {
      setLoadingOffers(false);
    }
  };

  fetchOffers();
}, [selectedJob]);


  // Apply all filters & sorting
  const getFilteredJobs = () => {
    let filtered = [...jobs];

    // Filter by category
    if (categoryFilter && categoryFilter !== 'Category') {
      filtered = filtered.filter(
        (job) => job.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Filter by distance
    if (distanceFilter && userLocation) {
      filtered = filtered.filter((job) => {
        if (job.lat == null || job.lng == null) return false;
        const distanceKm = getDistanceFromLatLonInKm(
          userLocation.lat,
          userLocation.lng,
          job.lat,
          job.lng
        );
        if (distanceFilter === '0-1') return distanceKm <= 1;
        if (distanceFilter === '1-5') return distanceKm > 1 && distanceKm <= 5;
        if (distanceFilter === '5+') return distanceKm > 5;
        return true;
      });
    }

    // Filter by price
    if (priceFilter) {
      if (priceFilter === 'Below 500') {
        filtered = filtered.filter((job) => job.budget < 500);
      } else if (priceFilter === '500+') {
        filtered = filtered.filter((job) => job.budget >= 500);
      }
    }

    // Sorting
    if (sortOption) {
      if (sortOption === 'Recent') {
        filtered = filtered.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } else if (sortOption === 'Oldest') {
        filtered = filtered.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      } else if (sortOption === 'Highest Price') {
        filtered = filtered.sort((a, b) => b.budget - a.budget);
      }
    }

    return filtered;
  };

  const filteredJobs = getFilteredJobs();

  const handleOfferSubmit = async () => {
    if (!offerAmount || Number(offerAmount) <= 0) {
      alert('Please enter a valid offer amount.');
      return;
    }
    if (!selectedJob) {
      alert('No job selected.');
      return;
    }

    setOfferLoading(true);
    try {
      await axiosInstance.post('/api/offers', {
        task: selectedJob._id,
        offerAmount: Number(offerAmount),
        message: offerMessage,
      });

      alert('Offer submitted successfully!');
      setShowOfferModal(false);
      setOfferAmount('');
      setOfferMessage('');
    } catch (error) {
      console.error('Error submitting offer:', error.response?.data || error.message);
      alert('Failed to submit offer. Please try again.');
    } finally {
      setOfferLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Loading jobs...</div>;
  }

  const centerPosition =
    filteredJobs.length > 0
      ? [
          filteredJobs.reduce((sum, job) => sum + (job.lat || 0), 0) / filteredJobs.length,
          filteredJobs.reduce((sum, job) => sum + (job.lng || 0), 0) / filteredJobs.length,
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
          disabled // Disable because not implemented
        />
        <button className="w-full bg-green-700 text-white py-2 mb-4 rounded" disabled>
          New Jobs
        </button>

        <div className="flex flex-wrap gap-2 mb-4 text-sm font-semibold">
          {/* Category Filter */}
          <select
            className="bg-black border border-white px-3 py-1 rounded"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option>Category</option>
            <option>Plumber</option>
            <option>Electrician</option>
            <option>Carpenter</option>
          </select>

          {/* Distance Filter */}
          <select
            className="bg-black border border-white px-3 py-1 rounded"
            value={distanceFilter}
            onChange={(e) => setDistanceFilter(e.target.value)}
          >
            <option>Distance</option>
            <option value="0-1">0-1km</option>
            <option value="1-5">1-5km</option>
            <option value="5+">5km+</option>
          </select>

          {/* Price Filter */}
          <select
            className="bg-black border border-white px-3 py-1 rounded"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option>Price</option>
            <option>Below 500</option>
            <option>500+</option>
          </select>

          {/* Sort Filter */}
          <select
            className="bg-black border border-white px-3 py-1 rounded"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option>Sort</option>
            <option value="Recent">Recent</option>
            <option value="Oldest">Oldest</option>
            <option value="Highest Price">Highest Price</option>
          </select>
        </div>

        {filteredJobs.map((job) => (
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
              <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                {job.category || 'No category'}
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
              {filteredJobs.map(
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

                
<Link
  to={`/users/${selectedJob.createdBy?._id}/profile`}
  className="flex items-center gap-3 text-sm text-gray-400 mb-2 hover:underline"
>
  <img
    src={
      selectedJob.createdBy?.profile?.avatar
        ? `http://localhost:5000/${selectedJob.createdBy.profile.avatar}`
        : '/avatar.png'
    }
    alt="User Avatar"
    className="w-8 h-8 rounded-full object-cover"
  />
  <span className="text-white font-semibold">
    {selectedJob.createdBy?.name || 'Unknown User'}
  </span>
</Link>



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
            <div className="flex gap-4 mt-10">
  <button
    className={`px-4 py-2 rounded ${activeTab === 'offers' ? 'bg-green-700 text-white' : 'bg-gray-700 text-gray-300'}`}
    onClick={() => setActiveTab('offers')}
  >
    Offers
  </button>
  <button
    className={`px-4 py-2 rounded ${activeTab === 'questions' ? 'bg-green-700 text-white' : 'bg-gray-700 text-gray-300'}`}
    onClick={() => setActiveTab('questions')}
  >
    Questions
  </button>
</div>

{activeTab === 'offers' ? (
  <div className="mt-6">
    <h3 className="text-white text-2xl font-bold mb-6">Offers</h3>

    {loadingOffers ? (
      <div className="flex justify-center items-center py-10">
        <div className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    ) : offers.length === 0 ? (
      <p className="text-gray-400">No offers yet for this task.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <div
            key={offer._id}
            className="bg-[#1F1F1F] border border-gray-700 p-5 rounded-2xl shadow-md transition hover:shadow-lg"
          >
   <div className="flex items-center gap-4 mb-4">
  <Link
    to={`/users/${offer.user?._id}/profile`}
    className="flex items-center gap-3 hover:underline"
  >
    <img
      src={
        offer.user?.profile?.avatar
          ? `http://localhost:5000/${offer.user.profile.avatar}`
          : '/avatar.png'
      }
      alt="User Avatar"
      className="w-12 h-12 rounded-full object-cover border border-gray-600"
    />
    <h4 className="font-semibold text-white text-lg">
      {offer.user?.name || 'Unknown User'}
    </h4>
  </Link>

  {/* This part is outside the Link and won't be clickable */}
</div>
<p className="text-gray-400 text-sm -mt-2 mb-2 ml-16">
  Offered Rs.{offer.offerAmount}
</p>



            <p className="text-gray-300 text-sm leading-relaxed">
              {offer.message || 'No message provided.'}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
) 
 : (
  <div className="mt-6">
    <h3 className="text-white text-xl font-bold mb-4">Questions</h3>
    <QuestionsSection selectedJob={selectedJob} />
  </div>
)}

  


            {/* Offer Modal */}
            {showOfferModal && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-white text-black p-6 rounded-lg max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">Make an Offer</h2>
                  <label className="block mb-2 font-semibold">Offer Amount (Rs.)</label>
                  <input
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 mb-4"
                    placeholder="Enter offer amount"
                    min={1}
                  />
                  <label className="block mb-2 font-semibold">Offer Description (optional)</label>
                  <textarea
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 mb-4"
                    placeholder="Write your offer message"
                    rows={4}
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      className="bg-gray-400 text-white px-4 py-2 rounded"
                      onClick={() => setShowOfferModal(false)}
                      disabled={offerLoading}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      onClick={handleOfferSubmit}
                      disabled={offerLoading}
                    >
                      {offerLoading ? 'Submitting...' : 'Submit Offer'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;  