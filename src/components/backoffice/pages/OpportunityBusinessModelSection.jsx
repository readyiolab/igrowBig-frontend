// src/components/backoffice/OpportunityBusinessModelSection.jsx
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  LoadingSpinner,
  ErrorState,
  FormActions,
  TextInput,
  RichTextEditor,
  ImageUpload,
  PreviewSection,
} from "@/components/common";
import {
  useOpportunityData,
  useOpportunityFormSubmit,
  useImageValidation,
  useDebouncedCallback,
} from "@/hooks";
import { validateRequired, createFormDataWithDefaults } from "@/utils";

const OpportunityBusinessModelSection = () => {
  const {
    opportunityData,
    loading,
    error,
    tenantId,
    handleRetry,
    maxRetriesReached,
    refresh, // Add refresh function
  } = useOpportunityData("Business Model section loaded!");

  const { submitForm, isSubmitting } = useOpportunityFormSubmit();
  const { image, imagePreview, handleImageUpload, resetImage, validateImage } = useImageValidation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Sync Redux data to local state
  useEffect(() => {
    if (opportunityData?.business_model_section_title || opportunityData?.business_model_section_content) {
      setTitle(opportunityData.business_model_section_title || "");
      setContent(opportunityData.business_model_section_content || "");
      setExistingImageUrl(opportunityData.business_model_section_image_url || null);
      setIsEditing(true); // Set isEditing to true if any data exists
    }
  }, [opportunityData]);

  const debouncedSetTitle = useDebouncedCallback(setTitle, 300);
  const debouncedSetContent = useDebouncedCallback((value) => {
    setContent(value || ""); // Ensure content is a string
  }, 300);

  // Handle image upload with toast notifications
  const handleImageChange = (e) => {
    const result = handleImageUpload(e);
    toast[result.success ? "success" : "error"](result.message);
  };

  const handleSave = async () => {
    if (!validateRequired(title, "Title")) return;
    if (!validateRequired(content.replace(/<[^>]+>/g, "").trim(), "Content")) return;
    if (image && !validateImage(image).isValid) return;

    const fields = {
      business_model_section_title: title,
      business_model_section_content: content,
    };
    if (image) fields.business_model_section_image = image;
    else if (existingImageUrl) fields.business_model_section_image_url = existingImageUrl;

    const formData = createFormDataWithDefaults(fields, opportunityData);
    const success = await submitForm(formData, {
      successMessage: "Business Model section saved successfully!",
    });
    if (success) {
      setIsEditing(true);
      refresh(); // Trigger data refresh after save
    }
  };

  const handleReset = () => {
    setTitle(opportunityData?.business_model_section_title || "");
    setContent(opportunityData?.business_model_section_content || "");
    setExistingImageUrl(opportunityData?.business_model_section_image_url || null);
    resetImage();
    toast.success("Form reset successfully!");
  };

  const handleStartEditing = () => {
    setTitle("Our Business Model");
    setContent("Learn about our unique business model...");
    setIsEditing(true);
  };

  // Loading State
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Toaster position="top-right" />
        <LoadingSpinner message="Loading Business Model section..." />
      </div>
    );
  }

  // Error State with Retry
  if (error && maxRetriesReached) {
    return (
      <div className="container mx-auto p-4">
        <Toaster position="top-right" />
        <ErrorState
          error={error}
          onStartEditing={handleStartEditing}
          onRetry={handleRetry}
          addButtonText="Add Business Model Section"
        />
      </div>
    );
  }

  // Empty State - No content yet
  if (!isEditing && !title && !content) {
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
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Business Model Section Yet</h3>
          <p className="text-gray-500 mb-6">
            Get started by adding Business Model content for your opportunity page!
          </p>
          <button
            onClick={handleStartEditing}
            className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
          >
            Add Business Model Section
          </button>
        </div>
      </div>
    );
  }

  // Main Form
  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">
          {isEditing ? "Edit Business Model Section" : "Create Business Model Section"}
        </h3>
        <div className="space-y-6">
          <TextInput
            id="business-model-title"
            label="Title"
            value={title}
            onChange={(e) => debouncedSetTitle(e.target.value)}
            placeholder="Enter title"
            required
            disabled={isSubmitting}
          />
          <RichTextEditor
            id="business-model-content"
            label="Content"
            value={content}
            onChange={debouncedSetContent}
            placeholder="Enter Business Model content..."
            required
            disabled={isSubmitting}
          />
          <ImageUpload
            label="Image (Max 4MB, JPEG/PNG)"
            onUpload={handleImageChange}
            imagePreview={imagePreview}
            existingImageUrl={existingImageUrl}
            disabled={isSubmitting}
          />
          <PreviewSection title={title || "No title"} content={content || "No content"}>
            {(imagePreview || existingImageUrl) ? (
              <img
                src={imagePreview || existingImageUrl}
                alt="Business Model Preview"
                className="w-full max-w-[600px] mt-4 rounded-lg shadow-sm object-cover"
                onError={(e) => (e.target.src = "/placeholder-image.jpg")}
              />
            ) : (
              <div className="w-full max-w-[600px] h-[300px] bg-gray-200 border-2 border-dashed rounded-lg mt-4 flex items-center justify-center">
                <span className="text-gray-500">Image Placeholder</span>
              </div>
            )}
          </PreviewSection>
        </div>
        <FormActions
          onReset={handleReset}
          onSave={handleSave}
          isSubmitting={isSubmitting}
          disabled={!tenantId}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
};

export default OpportunityBusinessModelSection;