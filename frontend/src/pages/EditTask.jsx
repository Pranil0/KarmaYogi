import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../utils/axiosInstance';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const defaultPosition = [27.6749, 84.4325];

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <Marker
      position={position}
      icon={markerIcon}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const latlng = e.target.getLatLng();
          setPosition([latlng.lat, latlng.lng]);
        },
      }}
    />
  );
}

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [taskLoaded, setTaskLoaded] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [position, setPosition] = useState(defaultPosition);
  const [budget, setBudget] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axiosInstance.get(`/api/tasks/${id}`);
        const task = res.data;
        setTitle(task.title || '');
        setDescription(task.description || '');
        setCategory(task.category || '');
        setLocation(task.location || '');
        setPosition([task.latitude || defaultPosition[0], task.longitude || defaultPosition[1]]);
        setBudget(task.budget || '');
        setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
        setTaskLoaded(true);
      } catch (err) {
        console.error('Error fetching task:', err);
        toast.error('Failed to load task');
      }
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !category || !location || !budget || !position) {
      toast.error('Please fill all required fields');
      return;
    }

    const updatedTask = {
      title,
      description,
      category,
      location,
      latitude: position[0],
      longitude: position[1],
      budget: Number(budget),
      dueDate: dueDate ? new Date(dueDate) : null,
    };

    try {
      setLoading(true);
      await axiosInstance.put(`/api/tasks/${id}`, updatedTask);
      toast.success('Task updated successfully');
      setTimeout(() => navigate('/mytask'), 1500);
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl">
          <h2 className="text-2xl font-bold text-green-700 mb-6">Edit Your Task</h2>

          {!taskLoaded ? (
            <p className="text-gray-600">Loading task details...</p>
          ) : (
            <>
              <label className="block mb-4">
                <span className="block text-gray-600 mb-2">Task Title</span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border rounded"
                />
              </label>

              <label className="block mb-4">
                <span className="block text-gray-600 mb-2">Description</span>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border rounded"
                />
              </label>

              <label className="block mb-4">
                <span className="block text-gray-600 mb-2">Category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-60 p-3 border rounded"
                >
                  <option value="">Select category</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="moving">Moving</option>
                  <option value="assembly">Assembly</option>
                  <option value="handyman">Handyman</option>
                </select>
              </label>

              <label className="block mb-4">
                <span className="block text-gray-600 mb-2">Location Name or Address</span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3 border rounded"
                />
              </label>

              <div className="mb-4">
                <p className="text-gray-600 mb-2">Select exact location on the map</p>
                <div className="h-64 border rounded overflow-hidden">
                  <MapContainer
                    center={position}
                    zoom={16}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    <LocationMarker position={position} setPosition={setPosition} />
                  </MapContainer>
                </div>
              </div>

              <label className="block mb-4">
                <span className="block text-gray-600 mb-2">Budget (in Rs.)</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full p-3 border rounded"
                />
              </label>

              <label className="block mb-4">
                <span className="block text-gray-600 mb-2">Due Date (optional)</span>
                <input
                  type="date"
                  value={dueDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-3 border rounded"
                />
              </label>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-3 rounded font-semibold w-full mt-4 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Task'}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EditTask;
