// src/components/backoffice/opportunity/OpportunityHeroSection.jsx
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  LoadingSpinner,
  ErrorState,
  FormActions,
  TextInput,
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

const OpportunityHeroSection = () => {
  const {
    opportunityData,
    loading,
    error,
    tenantId,
    handleRetry,
    maxRetriesReached,
  } = useOpportunityData("Hero section loaded!");

  const { submitForm, isSubmitting } = useOpportunityFormSubmit();
  const { image, imagePreview, handleImageUpload, resetImage, validateImage } = useImageValidation();

  const [heroContent, setHeroContent] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Sync Redux → local state
  useEffect(() => {
    if (opportunityData?.hero_section_content) {
      setHeroContent(opportunityData.hero_section_content);
      setExistingImageUrl(opportunityData.hero_section_image_url || null);
      setIsEditing(true);
    }
  }, [opportunityData]);

  const debouncedSetContent = useDebouncedCallback(setHeroContent, 300);

  const handleImageChange = e => {
    const result = handleImageUpload(e);
    toast[result.success ? "success" : "error"](result.message);
  };

  const handleSave = async () => {
    if (!validateRequired(heroContent, "Hero content")) return;
    if (image && !validateImage(image).isValid) return;

    const fields = { hero_section_content: heroContent };
    if (image) fields.hero_section_image = image;
    else if (existingImageUrl) fields.hero_section_image_url = existingImageUrl;

    const formData = createFormDataWithDefaults(fields, opportunityData);
    const ok = await submitForm(formData, { successMessage: "Hero section saved!" });
    if (ok) setIsEditing(true);
  };

  const handleReset = () => {
    setHeroContent(opportunityData?.hero_section_content || "");
    setExistingImageUrl(opportunityData?.hero_section_image_url || null);
    resetImage();
    toast.success("Reset complete");
  };

  const startEditing = () => {
    setHeroContent("Welcome to Your Opportunity");
    setIsEditing(true);
  };

  /* ---------- UI STATES ---------- */
  if (loading) return <LoadingSpinner message="Loading hero…" />;
  if (error && maxRetriesReached)
    return <ErrorState error={error} onRetry={handleRetry} onStartEditing={startEditing} addButtonText="Add Hero" />;

  if (!isEditing && !heroContent)
    return (
      <div className="p-12 text-center bg-white rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-2">No Hero Section Yet</h3>
        <button onClick={startEditing} className="mt-4 px-6 py-2 bg-black text-white rounded-full">
          Add Hero Section
        </button>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-6 border-b pb-2">
          {isEditing ? "Edit Hero Section" : "Create Hero Section"}
        </h3>

        <TextInput
          label="Hero Content"
          value={heroContent}
          onChange={e => debouncedSetContent(e.target.value)}
          required
          disabled={isSubmitting}
        />

        <ImageUpload
          label="Hero Image (max 4 MB, JPEG/PNG)"
          onUpload={handleImageChange}
          imagePreview={imagePreview}
          existingImageUrl={existingImageUrl}
          disabled={isSubmitting}
        />

        <PreviewSection title={heroContent || "No title"}>
          {imagePreview || existingImageUrl ? (
            <img src={imagePreview || existingImageUrl} alt="Hero preview" className="mt-4 w-full max-w-md rounded-lg" />
          ) : (
            <div className="mt-4 w-full max-w-md h-48 bg-gray-200 border-2 border-dashed rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Image placeholder</span>
            </div>
          )}
        </PreviewSection>

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

export default OpportunityHeroSection;