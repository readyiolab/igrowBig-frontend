import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  LoadingSpinner,
  ErrorState,
  FormActions,
  TextInput,
  PreviewSection,
} from "@/components/common";
import {
  useHomepageData,
  useFormSubmit,
  useDebouncedCallback,
} from "@/hooks";
import {
  validateRequired,
  validateVideo,
  validateYoutubeLink,
  getYoutubeEmbedUrl,
  createFormDataWithDefaults,
  getObjectURL,
} from "@/utils";

const HomepageVideoSection = () => {
  const {
    homePageData,
    loading,
    error,
    tenantId,
    handleRetry,
    maxRetriesReached,
  } = useHomepageData("Video data loaded successfully!");

  const { submitForm, isSubmitting } = useFormSubmit();

  const [title, setTitle] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [existingVideoUrl, setExistingVideoUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (homePageData) {
      setTitle(homePageData.video_section_title || "");
      const videoUrl = homePageData.video_section_youtube_url || homePageData.video_section_file_url || "";
      
      if (videoUrl.includes("youtube") || videoUrl.includes("youtu.be")) {
        setYoutubeLink(videoUrl);
        setExistingVideoUrl(null);
      } else if (videoUrl) {
        setExistingVideoUrl(videoUrl);
        setYoutubeLink("");
      }
      setIsEditing(!!homePageData.video_section_title);
    }
  }, [homePageData]);

  const debouncedSetTitle = useDebouncedCallback(setTitle, 300);
  const debouncedSetYoutubeLink = useDebouncedCallback((value) => {
    setYoutubeLink(value);
    if (value) {
      setVideoFile(null);
      setExistingVideoUrl(null);
    }
  }, 300);

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && validateVideo(file)) {
      setVideoFile(file);
      setYoutubeLink("");
      setExistingVideoUrl(null);
      toast.success("Video selected successfully!");
    }
  };

  const handleSave = async () => {
    if (!validateRequired(title, "Title")) return;
    if (!videoFile && !youtubeLink && !existingVideoUrl) {
      toast.error("Please upload a video or provide a YouTube link.");
      return;
    }
    if (youtubeLink && !validateYoutubeLink(youtubeLink)) return;

    const fields = { video_section_title: title };
    
    if (videoFile) {
      fields.video_section_file = videoFile;
    } else if (youtubeLink) {
      fields.video_section_youtube_url = youtubeLink;
    } else if (existingVideoUrl) {
      fields.video_section_file_url = existingVideoUrl;
    }

    const formData = createFormDataWithDefaults(fields, homePageData);
    
    const success = await submitForm(formData, {
      successMessage: "Video section saved successfully!"
    });
    
    if (success) {
      setVideoFile(null);
      setIsEditing(true);
    }
  };

  const handleReset = () => {
    setTitle(homePageData?.video_section_title || "");
    setYoutubeLink("");
    setVideoFile(null);
    setExistingVideoUrl(homePageData?.video_section_file_url || homePageData?.video_section_youtube_url || null);
    toast.success("Form reset successfully!");
  };

  const handleStartEditing = () => {
    setTitle("Watch NHT Global Video");
    setIsEditing(true);
  };

  const embedUrl = getYoutubeEmbedUrl(youtubeLink);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Toaster position="top-right" />
        <LoadingSpinner message="Loading video data..." />
      </div>
    );
  }

  if (error && maxRetriesReached) {
    return (
      <div className="container mx-auto p-4">
        <Toaster position="top-right" />
        <ErrorState
          error={error}
          onStartEditing={handleStartEditing}
          onRetry={handleRetry}
          addButtonText="Add Video Section"
        />
      </div>
    );
  }

  if (!isEditing && !title) {
    return (
      <div className="container mx-auto p-4">
        <Toaster position="top-right" />
        <div className="p-12 text-center bg-white shadow-lg rounded-xl border border-gray-200">
          <svg
            className="mx-auto h-24 w-24 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Video Section Yet</h3>
          <p className="text-gray-500 mb-6">
            Get started by adding a video section for your homepage!
          </p>
          <button
            onClick={handleStartEditing}
            className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
          >
            Add Video Section
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">
          {isEditing ? "Edit Video Section" : "Create Video Section"}
        </h3>
        <div className="space-y-6">
          <TextInput
            id="title"
            label="Title"
            value={title}
            onChange={(e) => debouncedSetTitle(e.target.value)}
            placeholder="Enter title"
            required
            disabled={isSubmitting}
            className="text-xl font-semibold"
          />
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
                <video src={getObjectURL(videoFile)} controls className="w-full max-w-[600px] rounded-lg shadow-sm" />
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
                <video src={existingVideoUrl} controls className="w-full max-w-[600px] rounded-lg shadow-sm" onError={(e) => (e.target.src = "/placeholder-video.mp4")} />
              </div>
            )}
          </div>
          <div>
            <TextInput
              id="youtubeLink"
              label="Or Enter YouTube Link"
              value={youtubeLink}
              onChange={(e) => debouncedSetYoutubeLink(e.target.value)}
              placeholder="Paste YouTube URL here (e.g., https://youtu.be/xyz)"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">Right-click video → "Copy video URL" or use embed link.</p>
          </div>
          <PreviewSection title={title || "No title yet"}>
            {videoFile ? (
              <video src={getObjectURL(videoFile)} controls className="w-full max-w-[600px] rounded-lg shadow-md mt-4" />
            ) : embedUrl ? (
              <iframe
                src={embedUrl}
                title="YouTube Video Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full max-w-[600px] h-[337px] rounded-lg shadow-md mt-4"
              />
            ) : existingVideoUrl && !youtubeLink ? (
              <video src={existingVideoUrl} controls className="w-full max-w-[600px] rounded-lg shadow-md mt-4" onError={(e) => (e.target.src = "/placeholder-video.mp4")} />
            ) : (
              <div className="w-full max-w-[600px] h-[337px] bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg mt-4">
                <span className="text-gray-500 font-medium">Video Placeholder</span>
              </div>
            )}
          </PreviewSection>
        </div>
        <FormActions onReset={handleReset} onSave={handleSave} isSubmitting={isSubmitting} disabled={!tenantId} isEditing={isEditing} />
      </div>
    </div>
  );
};

export default HomepageVideoSection;