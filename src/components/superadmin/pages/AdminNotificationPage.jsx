import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendAdminNotification,
  clearAdminNotificationStatus,
} from "@/store/slices/adminNotificationSlice";

const AdminNotificationPage = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  
  const dispatch = useDispatch();
  const { loading, success, error, lastNotification } = useSelector(
    (state) => state.adminNotification
  );

  // Clear status messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(clearAdminNotificationStatus());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(sendAdminNotification({ title, message })).unwrap();
      
      // Clear form on success
      setTitle("");
      setMessage("");
    } catch (err) {
      // Error is handled by Redux state
      console.error("Failed to send notification:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Send Notification to Tenants
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter notification title"
            required
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700"
          >
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
            required
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-32 resize-y disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-md ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          } transition-colors`}
        >
          {loading ? "Sending..." : "Send Notification"}
        </button>
      </form>

      {success && lastNotification && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
          {success} (ID: {lastNotification.notification_id}, Sent to:{" "}
          {lastNotification.recipients_count} tenants)
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
          Error: {error.error || "Unknown error"} - {error.message}
        </div>
      )}
    </div>
  );
};

export default AdminNotificationPage;