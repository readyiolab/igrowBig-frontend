import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import toast, { Toaster } from "react-hot-toast";

const HomepageOpportunityVideo = () => {
  const navigate = useNavigate();
  const { data, loading: isLoading, error, getAll, put } = useTenantApi();

  const [tenantId, setTenantId] = useState(null);
  const [headerTitle, setHeaderTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [existingVideoUrl, setExistingVideoUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    if (storedTenantId && tenantId !== storedTenantId) {
      setTenantId(storedTenantId);
    }
  }, []);

  useEffect(() => {
    if (tenantId) {
      fetchOpportunityVideoData();
    }
  }, [tenantId, retryCount]);

  const fetchOpportunityVideoData = async () => {
    try {
      const response = await toast.promise(
        getAll(`/tenants/${tenantId}/home-page`),
        {
          loading: "Fetching video data...",
          success: "Video data loaded successfully!",
          error: "Failed to load video data.",
        }
      );
      if (response && Object.keys(response).length > 0) {
        setHeaderTitle(response.opportunity_video_header_title || "");
        setYoutubeLink(
          response.opportunity_video_url && response.opportunity_video_url.includes("youtube")
            ? response.opportunity_video_url
            : ""
        );
        setExistingVideoUrl(
          response.opportunity_video_url && !response.opportunity_video_url.includes("youtube")
            ? response.opportunity_video_url
            : null
        );
        setVideoFile(null);
        setIsEditing(!!response.opportunity_video_header_title);
      } else {
        setHeaderTitle("");
        setYoutubeLink("");
        setExistingVideoUrl(null);
        setVideoFile(null);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error fetching opportunity video data:", err.response?.data || err.message);
      if (retryCount < 3) {
        toast.error(`Failed to load data. Retrying... (${retryCount + 1}/3)`);
        setTimeout(() => setRetryCount(retryCount + 1), 2000);
      } else {
        toast.error("Unable to load data. Please try again later or start adding content.");
        setIsEditing(false);
      }
    }
  };

  const validateVideo = (file) => {
    if (!file) return true;
    if (file.type !== "video/mp4") {
      toast.error("Please upload only MP4 files.");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 50MB limit.");
      return false;
    }
    return true;
  };

  const validateYoutubeLink = (url) => {
    if (!url) return true;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (!match || match[2].length !== 11) {
      toast.error("Invalid YouTube URL. Please provide a valid link.");
      return false;
    }
    return true;
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && validateVideo(file)) {
      setVideoFile(file);
      setYoutubeLink("");
      setExistingVideoUrl(null);
      toast.info("Video selected successfully!");
    }
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleInputChange = useCallback(
    debounce((field, value) => {
      if (field === "headerTitle") setHeaderTitle(value);
      if (field === "youtubeLink") {
        setYoutubeLink(value);
        setVideoFile(null);
        setExistingVideoUrl(null);
        if (value && !validateYoutubeLink(value)) return;
      }
    }, 300),
    []
  );

  const getYoutubeEmbedUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const embedUrl = getYoutubeEmbedUrl(youtubeLink);

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.");
      navigate("/backoffice-login");
      return;
    }

    if (!headerTitle.trim()) {
      toast.error("Header title is required.");
      return;
    }

    if (!videoFile && !youtubeLink && !existingVideoUrl) {
      toast.error("Please upload a video or provide a YouTube link.");
      return;
    }

    if (youtubeLink && !validateYoutubeLink(youtubeLink)) {
      return;
    }

    const formData = new FormData();
    formData.append("opportunity_video_header_title", headerTitle);

    if (videoFile) {
      formData.append("opportunity_video", videoFile);
    } else if (youtubeLink) {
      formData.append("youtube_link", youtubeLink);
    } else if (existingVideoUrl) {
      formData.append("youtube_link", existingVideoUrl);
    }

    const existingPage = await getAll(`/tenants/${tenantId}/home-page`);
    if (existingPage && Object.keys(existingPage).length > 0) {
      formData.append("welcome_description", existingPage.welcome_description || "Default welcome");
      formData.append("introduction_content", existingPage.introduction_content || "Default introduction");
      formData.append("about_company_title", existingPage.about_company_title || "About Us");
      formData.append("about_company_content_1", existingPage.about_company_content_1 || "Default content");
      formData.append("about_company_content_2", existingPage.about_company_content_2 || "");
      formData.append("why_network_marketing_title", existingPage.why_network_marketing_title || "Why Network Marketing");
      formData.append("why_network_marketing_content", existingPage.why_network_marketing_content || "Default why content");
      formData.append("support_content", existingPage.support_content || "Default support");
    } else {
      const defaultFields = {
        welcome_description: "Welcome to our platform",
        introduction_content: "Default introduction content",
        about_company_title: "About Our Company",
        about_company_content_1: "We are a leading company in our industry.",
        why_network_marketing_title: "Why Network Marketing",
        why_network_marketing_content: "Network marketing offers great opportunities.",
        support_content: "We provide excellent support to our users.",
      };
      Object.entries(defaultFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    setIsSubmitting(true);
    try {
      await toast.promise(
        put(`/tenants/${tenantId}/home-page`, formData, true),
        {
          loading: "Saving video data...",
          success: "Opportunity video saved successfully!",
          error: (err) => `Failed to save: ${err.response?.data?.message || err.message}`,
        }
      );
      await fetchOpportunityVideoData();
    } catch (err) {
      console.error("Error saving opportunity video:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/backoffice-login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setHeaderTitle("");
    setVideoFile(null);
    setYoutubeLink("");
    setExistingVideoUrl(null);
    setIsEditing(false);
    toast.success("Form reset successfully!");
  };

  const handleStartEditing = () => {
    setHeaderTitle("Opportunity Video Overview");
    setVideoFile(null);
    setYoutubeLink("");
    setExistingVideoUrl(null);
    setIsEditing(true);
  };

  const handleRetry = () => {
    setRetryCount(0);
    fetchOpportunityVideoData();
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {isLoading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading video data...</span>
        </div>
      ) : error && retryCount >= 3 ? (
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
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load Content</h3>
          <p className="text-gray-500 mb-6">
            {error.message || "An error occurred while loading video data. You can start adding content or try again."}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleStartEditing}
              className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
            >
              Add Opportunity Video
            </button>
            <button
              onClick={handleRetry}
              className="border border-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">
            {isEditing ? "Edit Opportunity Video" : "Create Opportunity Video"}
          </h3>

          <div className="space-y-6">
            <div>
              <label htmlFor="headerTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Header Title <span className="text-red-500">*</span>
              </label>
              <input
                id="headerTitle"
                type="text"
                value={headerTitle}
                onChange={(e) => handleInputChange("headerTitle", e.target.value)}
                className="w-full px-4 py-2 text-xl font-semibold text-gray-800 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50 disabled:opacity-50"
                placeholder="Enter header title"
                disabled={isSubmitting}
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="videoUpload" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Video (MP4, Max 50MB)
              </label>
              <input
                id="videoUpload"
                type="file"
                accept="video/mp4"
                onChange={handleVideoUpload}
                disabled={isSubmitting}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50"
              />
              {videoFile && (
                <div className="mt-2 relative">
                  <p className="text-xs text-gray-500">Preview:</p>
                  <video
                    src={URL.createObjectURL(videoFile)}
                    controls
                    className="w-full max-w-[600px] rounded-lg shadow-sm"
                  />
                  <button
                    onClick={() => setVideoFile(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200"
                    aria-label="Remove selected video"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {isEditing && !videoFile && !youtubeLink && existingVideoUrl && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Current:</p>
                  <video
                    src={existingVideoUrl}
                    controls
                    className="w-full max-w-[600px] rounded-lg shadow-sm"
                    onError={(e) => (e.target.src = "/placeholder-video.mp4")}
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="youtubeLink" className="block text-sm font-medium text-gray-700 mb-2">
                Or Enter YouTube Link
              </label>
              <input
                id="youtubeLink"
                type="text"
                value={youtubeLink}
                onChange={(e) => handleInputChange("youtubeLink", e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50 disabled:opacity-50"
                placeholder="Paste YouTube URL here (e.g., https://youtu.be/xyz)"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                Right-click video → "Copy video URL" or use embed link.
              </p>
            </div>

            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-2">Video Preview</h4>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-inner">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">{headerTitle || "No title yet"}</h1>
                {videoFile ? (
                  <video
                    src={URL.createObjectURL(videoFile)}
                    controls
                    className="w-full max-w-[600px] rounded-lg shadow-md"
                  />
                ) : embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title="YouTube Video Player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full max-w-[600px] h-[337px] rounded-lg shadow-md"
                  />
                ) : existingVideoUrl && !youtubeLink ? (
                  <video
                    src={existingVideoUrl}
                    controls
                    className="w-full max-w-[600px] rounded-lg shadow-md"
                    onError={(e) => (e.target.src = "/placeholder-video.mp4")}
                  />
                ) : (
                  <div className="w-full max-w-[600px] h-[337px] bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                    <span className="text-gray-500 font-medium">Video Placeholder</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={handleReset}
              disabled={isSubmitting}
              className="px-6 py-2.5 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-medium shadow-sm disabled:opacity-50"
              aria-label="Reset form"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || !tenantId}
              className="px-6 py-2.5 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isEditing ? "Update opportunity video" : "Save opportunity video"}
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

export default HomepageOpportunityVideo;