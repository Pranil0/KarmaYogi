import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaRupeeSign, FaImage } from 'react-icons/fa';
import axiosInstance from "../utils/axiosInstance";

const MyTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const res = await axiosInstance.get('/api/tasks/my-tasks');
        console.log('My tasks:', res.data);
        setTasks(res.data);
      } catch (err) {
        console.error('Error fetching my tasks:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTasks();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading tasks...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Tasks</h1>

      {tasks.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">You haven't posted any tasks yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white rounded-lg shadow p-6 relative">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{task.title}</h2>
                  <p className="text-gray-500">{task.location}</p>
                  <p className="mt-2 text-gray-700">{task.dueDate}</p>
                </div>
                <div className="text-green-600 text-xl">
                  <FaImage />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-6 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt />
                  <span>Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Flexible'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaRupeeSign />
                  <span className="font-medium">{task.budget}/-</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between text-sm text-green-600 font-medium">
                <button className="hover:underline">Edit</button>
                <button className="hover:underline">New offers!</button>
              </div>

              {task.offers && task.offers.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-center font-semibold text-green-700 mb-4">
                    Offers ({task.offers.length})
                  </h3>
                  {/* You can map offers here in future if needed */}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTask;
