import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { AuthContext } from "../contexts/AuthContext";
import { Loader2 } from 'lucide-react';


const QuestionsSection = ({ selectedJob }) => {
  const { user } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/questions/task/${selectedJob._id}`);
      setQuestions(res.data);
    } catch (err) {
      console.error('Failed to fetch questions:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedJob?._id) {
      fetchQuestions();
    }
  }, [selectedJob]);

  const handleAsk = async () => {
    if (!newQuestion.trim()) return;
    try {
      await axiosInstance.post('/api/questions', {
        taskId: selectedJob._id,
        text: newQuestion,
      });
      setNewQuestion('');
      fetchQuestions();
    } catch (err) {
      console.error('Failed to submit question:', err.response?.data || err.message);
    }
  };

  const handleReply = async (questionId) => {
    if (!replyText.trim()) return;
    try {
      await axiosInstance.put(`/api/questions/${questionId}/answer`, {
        text: replyText,
      });
      setReplyText('');
      setReplyingTo(null);
      fetchQuestions();
    } catch (err) {
      console.error('Failed to submit reply:', err.response?.data || err.message);
    }
  };

  return (
    <div className="mt-6">
      <p className="text-sm text-gray-400 mb-3">
        These messages are public and can be seen by anyone. Do not share your personal info.
      </p>

      {user ? (
        <div className="bg-[#f5f6f8] rounded-xl p-4 mb-6">
          <textarea
            className="w-full resize-none text-sm p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Ask a question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <div className="text-right mt-2">
            <button
              onClick={handleAsk}
              className="bg-[#D9E3FF] text-[#1D3D8C] text-sm font-semibold px-4 py-1.5 rounded-md hover:bg-[#c7d8fd]"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-400">Please log in to ask a question.</p>
      )}

      {loading ? (
        <p className="text-gray-400">Loading questions...</p>
      ) : questions.length === 0 ? (
        <p className="text-gray-400">No questions yet for this task.</p>
      ) : (
        <div className="space-y-5">
          {questions.map((q) => (
            <div key={q._id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <img
  src={
    q.createdBy?.profile?.avatar
      ? `http://localhost:5000/${q.createdBy.profile.avatar}`
      : '/avatar.png'
  }
  alt="User Avatar"
  className="w-8 h-8 rounded-full object-cover"
/>

                <p className="text-sm font-medium text-gray-800">{q.createdBy?.name}</p>
              </div>
              <p className="text-sm text-gray-900">{q.text}</p>
              <p className="text-xs text-gray-500 mt-1">about 1 hour ago</p>

              {q.answers?.length > 0 && (
                <div className="mt-3 ml-4 border-l-2 border-gray-200 pl-4">
                  {q.answers.map((a, i) => (
                    <div key={i} className="mt-2">
                      <p className="text-sm text-gray-800">{a.text}</p>
                      <p className="text-xs text-gray-500">Replied by {a.createdBy?.name}</p>
                    </div>
                  ))}
                </div>
              )}

              {user && (
                <>
                  {replyingTo === q._id ? (
                    <div className="mt-4">
                      <textarea
                        className="w-full text-sm p-2 border border-gray-300 rounded-md"
                        rows={2}
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => handleReply(q._id)}
                          className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Submit
                        </button>
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="text-sm text-gray-600 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyingTo(q._id)}
                      className="text-sm text-blue-600 mt-3 hover:underline"
                    >
                      Reply
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionsSection;
