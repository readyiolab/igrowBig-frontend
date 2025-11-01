// src/components/backoffice/opportunity/OpportunityVideoSection.jsx
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  LoadingSpinner,
  ErrorState,
  FormActions,
  TextInput,
  PreviewSection,
} from "@/components/common";
import { useOpportunityData, useOpportunityFormSubmit, useVideoValidation } from "@/hooks";
import { validateRequired, createFormDataWithDefaults } from "@/utils";

const OpportunityVideoSection = () => {
  const {
    opportunityData,
    loading,
    error,
    tenantId,
    handleRetry,
    maxRetriesReached,
  } = useOpportunityData("Video section loaded!");

  const { submitForm, isSubmitting } = useOpportunityFormSubmit();
  const { video, videoPreview, handleVideoUpload, resetVideo, validateVideo } = useVideoValidation();

  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [existingVideoUrl, setExistingVideoUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (opportunityData?.overview_section_title) {
      setTitle(opportunityData.overview_section_title);
      setYoutubeUrl(opportunityData.overview_section_youtube_url || "");
      setExistingVideoUrl(opportunityData.overview_section_video_url || null);
      setIsEditing(true);
    }
  }, [opportunityData]);

  const handleSave = async () => {
    if (!validateRequired(title, "Title")) return;
    if (!video && !youtubeUrl && !existingVideoUrl) {
      toast.error("Provide either a video file or a YouTube link.");
      return;
    }
    if (video && !validateVideo(video).isValid) return;

    const fields = { overview_section_title: title };
    if (video) fields.overview_section_video = video;
    else if (youtubeUrl) fields.overview_section_youtube_url = youtubeUrl;
    else fields.overview_section_video_url = existingVideoUrl;

    const fd = createFormDataWithDefaults(fields, opportunityData);
    const ok = await submitForm(fd, { successMessage: "Video section saved!" });
    if (ok) setIsEditing(true);
  };

  const handleReset = () => {
    setTitle(opportunityData?.overview_section_title || "");
    setYoutubeUrl(opportunityData?.overview_section_youtube_url || "");
    setExistingVideoUrl(opportunityData?.overview_section_video_url || null);
    resetVideo();
    toast.success("Reset");
  };

  const start = () => {
    setTitle("NHT Global Opportunity Overview");
    setIsEditing(true);
  };

  if (loading) return <LoadingSpinner />;
  if (error && maxRetriesReached)
    return <ErrorState error={error} onRetry={handleRetry} onStartEditing={start} addButtonText="Add Video Section" />;

  if (!isEditing && !title)
    return (
      <div className="p-12 text-center bg-white rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-2">No Video Section</h3>
        <button onClick={start} className="mt-4 px-6 py-2 bg-black text-white rounded-full">
          Add Video Section
        </button>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-6 border-b pb-2">
          {isEditing ? "Edit Overview Video" : "Create Overview Video"}
        </h3>

        <TextInput label="Title" value={title} onChange={e => setTitle(e.target.value)} required disabled={isSubmitting} />

        {/* ---- Video Upload ---- */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">MP4 Video (max 50 MB)</label>
          <input
            type="file"
            accept="video/mp4"
            onChange={e => {
              const r = handleVideoUpload(e);
              toast[r.success ? "success" : "error"](r.message);
            }}
            disabled={isSubmitting || !!youtubeUrl}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-100"
          />
        </div>

        {/* ---- YouTube ---- */}
        <div className="mt-4">
          <TextInput
            label="YouTube embed URL (optional)"
            value={youtubeUrl}
            onChange={e => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/embed/…"
            disabled={isSubmitting || !!video}
          />
        </div>

        <PreviewSection title={title || "No title"}>
          {videoPreview ? (
            <video src={videoPreview} controls className="mt-4 w-full max-w-2xl rounded-lg" />
          ) : youtubeUrl ? (
            <iframe src={youtubeUrl} title="YouTube" className="mt-4 w-full max-w-2xl h-96 rounded-lg" allowFullScreen />
          ) : existingVideoUrl ? (
            <video src={existingVideoUrl} controls className="mt-4 w-full max-w-2xl rounded-lg" />
          ) : (
            <div className="mt-4 w-full max-w-2xl h-96 bg-gray-200 border-2 border-dashed rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No video</span>
            </div>
          )}
        </PreviewSection>

        <FormActions onReset={handleReset} onSave={handleSave} isSubmitting={isSubmitting} disabled={!tenantId} isEditing={isEditing} />
      </div>
    </div>
  );
};

export default OpportunityVideoSection;