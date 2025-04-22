import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Search, X } from "react-feather";
import { useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import toast, { Toaster } from "react-hot-toast";

const OpportunityOverviewVideoSection = () => {
  const navigate = useNavigate();
  const { data, loading: isLoading, error, getAll, post, put, request } = useTenantApi();

  const [tenantId, setTenantId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({
    header_title: "",
    video_file: null,
    youtube_link: "",
  });
  const [videoPreview, setVideoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB in bytes

  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    if (storedTenantId && tenantId !== storedTenantId) {
      setTenantId(storedTenantId);
    }
  }, []);

  useEffect(() => {
    if (tenantId) {
      fetchVideo();
    }
  }, [tenantId, retryCount]);

  const fetchVideo = async () => {
    try {
      const response = await toast.promise(
        getAll(`/tenants/${tenantId}/opportunity-page`),
        {
          loading: "Fetching video section...",
          success: "Video section loaded!",
          error: "Failed to load video section.",
        }
      );
      if (response && (response.header_title || response.video_section_link)) {
        setVideos([
          {
            id: response.id,
            header_title: response.header_title || "NHT Global Compensation Plan",
            video_section_link: response.video_section_link || null,
            is_youtube: response.video_section_link?.includes("youtube.com") || false,
          },
        ]);
      } else {
        setVideos([]);
      }
    } catch (err) {
      console.error("Error fetching opportunity page video:", err.response?.data || err.message);
      if (retryCount < 3) {
        toast.error(`Failed to load video section. Retrying... (${retryCount + 1}/3)`);
        setTimeout(() => setRetryCount(retryCount + 1), 2000);
      } else {
        toast.error("Unable to load video section. Please try again later.");
        setVideos([]);
      }
    }
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearchChange = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const handleAddNew = () => {
    setShowForm(true);
    setIsEditing(false);
    setNewVideo({ header_title: "", video_file: null, youtube_link: "" });
    setVideoPreview(null);
  };

  const handleEdit = (video) => {
    setShowForm(true);
    setIsEditing(true);
    setNewVideo({
      header_title: video.header_title,
      video_file: null,
      youtube_link: video.is_youtube ? video.video_section_link : "",
    });
    setVideoPreview(video.is_youtube ? video.video_section_link : video.video_section_link || null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setNewVideo({ header_title: "", video_file: null, youtube_link: "" });
    setVideoPreview(null);
  };

  const validateVideoFile = (file) => {
    if (!file) return true; // File is optional if YouTube link is provided
    if (file.type !== "video/mp4") {
      toast.error("Please upload an MP4 file only.");
      return false;
    }
    if (file.size > MAX_VIDEO_SIZE) {
      toast.error("File size exceeds 50MB limit.");
      return false;
    }
    return true;
  };

  const validateYouTubeLink = (link) => {
    if (!link) return true; // YouTube link is optional if video file is provided
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(embed\/)?[\w-]+(\?[\w=&-]*)?$/;
    if (!youtubeRegex.test(link)) {
      toast.error("Please provide a valid YouTube embedded link (e.g., https://www.youtube.com/embed/VIDEO_ID).");
      return false;
    }
    return true;
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && validateVideoFile(file)) {
      setNewVideo({ ...newVideo, video_file: file, youtube_link: "" });
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      toast.success("Video selected successfully!");
    }
  };

  const handleRemoveVideo = () => {
    setNewVideo({ ...newVideo, video_file: null });
    setVideoPreview(null);
    toast.success("Selected video removed.");
  };

  const handleYoutubeLinkChange = (e) => {
    const link = e.target.value;
    setNewVideo({ ...newVideo, youtube_link: link, video_file: null });
    setVideoPreview(link && validateYouTubeLink(link) ? link : null);
  };

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.");
      navigate("/backoffice-login");
      return;
    }

    if (!newVideo.header_title.trim()) {
      toast.error("Header title is required.");
      return;
    }

    if (!newVideo.video_file && !newVideo.youtube_link) {
      toast.error("Please upload a video file or provide a YouTube link.");
      return;
    }

    if (newVideo.video_file && !validateVideoFile(newVideo.video_file)) {
      return;
    }

    if (newVideo.youtube_link && !validateYouTubeLink(newVideo.youtube_link)) {
      return;
    }

    const formData = new FormData();
    formData.append("header_title", newVideo.header_title || "NHT Global Compensation Plan");
    if (newVideo.video_file) {
      formData.append("video_section", newVideo.video_file);
    } else if (newVideo.youtube_link) {
      formData.append("video_section_link", newVideo.youtube_link);
    }

    setIsSubmitting(true);
    try {
      const existingPage = await getAll(`/tenants/${tenantId}/opportunity-page`);
      await toast.promise(
        existingPage && existingPage.id
          ? put(`/tenants/${tenantId}/opportunity-page`, formData, true)
          : post(`/tenants/${tenantId}/opportunity-page`, formData, true),
        {
          loading: "Saving video section...",
          success: "Video section saved successfully!",
          error: (err) => `Failed to save: ${err.response?.data?.message || err.message}`,
        }
      );
      await fetchVideo();
      handleCancel();
    } catch (err) {
      console.error("Error saving opportunity page video:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/backoffice-login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!tenantId || videos.length === 0) {
      toast.error("No video section to delete.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this video section?")) {
      setIsSubmitting(true);
      try {
        await toast.promise(
          request("delete", `/tenants/${tenantId}/opportunity-page`),
          {
            loading: "Deleting video section...",
            success: "Video section deleted successfully!",
            error: (err) => `Failed to delete: ${err.response?.data?.message || err.message}`,
          }
        );
        setVideos([]);
        handleCancel();
      } catch (err) {
        console.error("Error deleting opportunity page video:", err.response?.data || err.message);
        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          navigate("/backoffice-login");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRetry = () => {
    setRetryCount(0);
    fetchVideo();
  };

  const filteredVideos = videos.filter(
    (video) =>
      (video.header_title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (video.video_section_link || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <div className="flex justify-between items-center mb-6">
        {!showForm && (
          <>
            <h2 className="text-2xl font-semibold text-gray-800">Video Section</h2>
            <div className="flex items-center gap-4">
              <div className="relative w-72">
                <input
                  type="text"
                  placeholder="Search videos..."
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 shadow-sm text-sm"
                  aria-label="Search video section"
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button
                onClick={handleAddNew}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md"
                aria-label="Add new video section"
              >
                <Plus size={16} className="mr-2" /> Add New
              </button>
            </div>
          </>
        )}
      </div>

      {isLoading && (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading video section...</span>
        </div>
      )}

      {error && retryCount >= 3 && !isLoading && (
        <div className="p-12 text-center bg-white shadow-lg rounded-xl border border-gray-200">
          <svg
            className="mx-auto h-24 w-24 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load Video Section</h3>
          <p className="text-gray-500 mb-6">
            {error.message || "An error occurred while loading the video section. You can start adding a video or try again."}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleAddNew}
              className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
              aria-label="Add new video section"
            >
              Add Video
            </button>
            <button
              onClick={handleRetry}
              className="border border-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
              aria-label="Retry loading video section"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {!tenantId && !isLoading && (
        <div className="p-12 text-center bg-white shadow-lg rounded-xl border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Authentication Required</h3>
          <p className="text-gray-500 mb-6">No tenant ID found. Please log in to continue.</p>
          <button
            onClick={() => navigate("/backoffice-login")}
            className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
            aria-label="Go to login page"
          >
            Log In
          </button>
        </div>
      )}

      {!isLoading && !error && !showForm && tenantId && (
        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-800 to-black text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Sr.No.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Header Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Video Section</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVideos.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                    No video found.{" "}
                    <button
                      onClick={handleAddNew}
                      className="text-blue-600 hover:underline"
                      aria-label="Add new video section"
                    >
                      Add one now
                    </button>.
                  </td>
                </tr>
              ) : (
                filteredVideos.map((video, index) => (
                  <tr key={video.id} className="hover:bg-gray-50 transition-all duration-200">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{index + 1}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{video.header_title}</td>
                    <td className="px-4 py-4 text-sm text-gray-800">
                      {video.video_section_link ? (
                        video.is_youtube ? (
                          <iframe
                            src={video.video_section_link}
                            title="YouTube Video"
                            className="w-32 h-20 rounded"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            src={video.video_section_link}
                            controls
                            className="w-32 h-20 object-cover rounded"
                            onError={(e) => (e.target.src = "/placeholder-video.mp4")}
                          />
                        )
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(video)}
                        disabled={isSubmitting}
                        className="text-gray-600 hover:text-black transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                        aria-label="Edit video section"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={isSubmitting}
                        className="text-gray-600 hover:text-red-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                        aria-label="Delete video section"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {isEditing ? "Edit Video Section" : "Create New Video Section"}
            </h3>
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="text-gray-500 hover:text-gray-700 hover:scale-105 transition-all duration-200 disabled:opacity-50"
              aria-label="Close video section form"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="header_title" className="block text-sm font-medium text-gray-700 mb-2">
                Header Title <span className="text-red-500">*</span>
              </label>
              <input
                id="header_title"
                type="text"
                value={newVideo.header_title}
                onChange={(e) => setNewVideo({ ...newVideo, header_title: e.target.value })}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter header title"
                aria-label="Header title"
              />
            </div>

            <div>
              <label htmlFor="video_file" className="block text-sm font-medium text-gray-700 mb-2">
                Opportunity Video Clip (MP4 only, Max 50MB)
              </label>
              <input
                id="video_file"
                type="file"
                accept="video/mp4"
                onChange={handleVideoUpload}
                disabled={isSubmitting || newVideo.youtube_link.length > 0}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Upload video file"
              />
              {(videoPreview || newVideo.video_file) && !newVideo.youtube_link && (
                <div className="mt-2 relative">
                  <p className="text-xs text-gray-500">Preview:</p>
                  <video
                    src={videoPreview || "/placeholder-video.mp4"}
                    controls
                    className="w-48 h-28 object-cover rounded shadow-sm"
                    onError={(e) => (e.target.src = "/placeholder-video.mp4")}
                  />
                  <button
                    onClick={handleRemoveVideo}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
                    aria-label="Remove selected video"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {isEditing && !newVideo.video_file && !newVideo.youtube_link && videos[0]?.video_section_link && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Current:</p>
                  {videos[0].is_youtube ? (
                    <iframe
                      src={videos[0].video_section_link}
                      title="Current YouTube Video"
                      className="w-48 h-28 rounded"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={videos[0].video_section_link}
                      controls
                      className="w-48 h-28 object-cover rounded shadow-sm"
                      onError={(e) => (e.target.src = "/placeholder-video.mp4")}
                    />
                  )}
                </div>
              )}
              {newVideo.video_file && !videoPreview && (
                <p className="text-xs text-gray-500 mt-2">Selected: {newVideo.video_file.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="youtube_link" className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Embedded Link
              </label>
              <input
                id="youtube_link"
                type="text"
                value={newVideo.youtube_link}
                onChange={handleYoutubeLinkChange}
                disabled={isSubmitting || newVideo.video_file !== null}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="e.g., https://www.youtube.com/embed/VIDEO_ID"
                aria-label="YouTube embedded link"
              />
              <p className="text-xs text-gray-500 mt-1">
                <strong>How to get YouTube link:</strong> Go to your video on YouTube, click "Share," then "Embed," and copy the iframe src URL.
              </p>
              {videoPreview && newVideo.youtube_link && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Preview:</p>
                  <iframe
                    src={videoPreview}
                    title="YouTube Preview"
                    className="w-48 h-28 rounded shadow-sm"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Cancel video section form"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || !tenantId}
              className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isEditing ? "Update video section" : "Save video section"}
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              )}
              {isSubmitting ? "Saving..." : isEditing ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityOverviewVideoSection;