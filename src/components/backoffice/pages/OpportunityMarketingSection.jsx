// src/components/backoffice/OpportunityMarketingSection.jsx
// Manages the "Why Network Marketing" section of the opportunity page, allowing users to edit
// the title, rich text content, and optional image. Corresponds to backend fields:
// marketing_section_title, marketing_section_content, marketing_section_image_url.
// Uses reusable components: TextInput, RichTextEditor, ImageUpload, FormActions, ErrorState,
// LoadingSpinner, PreviewSection.
// Uses hooks: useOpportunityData, useOpportunityFormSubmit, useImageValidation, useDebouncedCallback.

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

const OpportunityMarketingSection = () => {
  const {
    opportunityData,
    loading,
    error,
    tenantId,
    handleRetry,
    maxRetriesReached,
  } = useOpportunityData("Why Network Marketing section loaded!");

  const { submitForm, isSubmitting } = useOpportunityFormSubmit();
  const { image, imagePreview, handleImageUpload, resetImage, validateImage } = useImageValidation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Sync Redux data to local state
  useEffect(() => {
    if (opportunityData?.marketing_section_title) {
      setTitle(opportunityData.marketing_section_title);
      setContent(opportunityData.marketing_section_content || "");
      setExistingImageUrl(opportunityData.marketing_section_image_url || null);
      setIsEditing(true);
    }
  }, [opportunityData]);

  const debouncedSetTitle = useDebouncedCallback(setTitle, 300);
  const debouncedSetContent = useDebouncedCallback(setContent, 300);

  // Handle image upload with toast notifications
  const handleImageChange = (e) => {
    const result = handleImageUpload(e);
    toast[result.success ? "success" : "error"](result.message);
  };

  const handleSave = async () => {
    if (!validateRequired(title, "Title")) return;
    if (!validateRequired(content.replace(/<[^>]+>/g, ""), "Content")) return;
    if (image && !validateImage(image).isValid) return;

    const fields = {
      marketing_section_title: title,
      marketing_section_content: content,
    };
    if (image) fields.marketing_section_image = image;
    else if (existingImageUrl) fields.marketing_section_image_url = existingImageUrl;

    const formData = createFormDataWithDefaults(fields, opportunityData);
    const success = await submitForm(formData, {
      successMessage: "Why Network Marketing section saved successfully!",
    });
    if (success) setIsEditing(true);
  };

  const handleReset = () => {
    setTitle(opportunityData?.marketing_section_title || "");
    setContent(opportunityData?.marketing_section_content || "");
    setExistingImageUrl(opportunityData?.marketing_section_image_url || null);
    resetImage();
    toast.success("Form reset successfully!");
  };

  const handleStartEditing = () => {
    setTitle("Why Network Marketing");
    setContent("Explore the benefits of network marketing...");
    setIsEditing(true);
  };

  // Loading State
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Toaster position="top-right" />
        <LoadingSpinner message="Loading Why Network Marketing section..." />
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
          addButtonText="Add Why Network Marketing Section"
        />
      </div>
    );
  }

  // Empty State - No content yet
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
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Why Network Marketing Section Yet</h3>
          <p className="text-gray-500 mb-6">
            Get started by adding Why Network Marketing content for your opportunity page!
          </p>
          <button
            onClick={handleStartEditing}
            className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
          >
            Add Why Network Marketing Section
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
          {isEditing ? "Edit Why Network Marketing Section" : "Create Why Network Marketing Section"}
        </h3>
        <div className="space-y-6">
          <TextInput
            id="marketing-title"
            label="Title"
            value={title}
            onChange={(e) => debouncedSetTitle(e.target.value)}
            placeholder="Enter title"
            required
            disabled={isSubmitting}
          />
          <RichTextEditor
            id="marketing-content"
            label="Content"
            value={content}
            onChange={debouncedSetContent}
            placeholder="Enter Why Network Marketing content..."
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
                alt="Marketing Preview"
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

export default OpportunityMarketingSection;