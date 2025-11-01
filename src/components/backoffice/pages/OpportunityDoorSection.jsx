// src/components/backoffice/opportunity/OpportunityDoorSection.jsx
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

const OpportunityDoorSection = () => {
  const {
    opportunityData,
    loading,
    error,
    tenantId,
    handleRetry,
    maxRetriesReached,
  } = useOpportunityData("Door section loaded!");

  const { submitForm, isSubmitting } = useOpportunityFormSubmit();
  const { image, imagePreview, handleImageUpload, resetImage, validateImage } = useImageValidation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [existingImg, setExistingImg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (opportunityData?.door_section_title) {
      setTitle(opportunityData.door_section_title);
      setContent(opportunityData.door_section_content || "");
      setExistingImg(opportunityData.door_section_image_url || null);
      setIsEditing(true);
    }
  }, [opportunityData]);

  const debouncedTitle = useDebouncedCallback(setTitle, 300);
  const debouncedContent = useDebouncedCallback(setContent, 300);

  const handleImg = e => {
    const r = handleImageUpload(e);
    toast[r.success ? "success" : "error"](r.message);
  };

  const handleSave = async () => {
    if (!validateRequired(title, "Door title")) return;
    if (!validateRequired(content, "Door content")) return;
    if (image && !validateImage(image).isValid) return;

    const fields = {
      door_section_title: title,
      door_section_content: content,
    };
    if (image) fields.door_section_image = image;
    else if (existingImg) fields.door_section_image_url = existingImg;

    const fd = createFormDataWithDefaults(fields, opportunityData);
    const ok = await submitForm(fd, { successMessage: "Door section saved!" });
    if (ok) setIsEditing(true);
  };

  const handleReset = () => {
    setTitle(opportunityData?.door_section_title || "");
    setContent(opportunityData?.door_section_content || "");
    setExistingImg(opportunityData?.door_section_image_url || null);
    resetImage();
    toast.success("Reset");
  };

  const start = () => {
    setTitle("Open the Door of Opportunity");
    setContent("Take the first step towards financial freedom…");
    setIsEditing(true);
  };

  if (loading) return <LoadingSpinner />;
  if (error && maxRetriesReached)
    return <ErrorState error={error} onRetry={handleRetry} onStartEditing={start} addButtonText="Add Door Section" />;

  if (!isEditing && !title)
    return (
      <div className="p-12 text-center bg-white rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-2">No Door Section</h3>
        <button onClick={start} className="mt-4 px-6 py-2 bg-black text-white rounded-full">
          Add Door Section
        </button>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-6 border-b pb-2">
          {isEditing ? "Edit Door of Opportunity" : "Create Door of Opportunity"}
        </h3>

        <TextInput label="Title" value={title} onChange={e => debouncedTitle(e.target.value)} required disabled={isSubmitting} />
        <RichTextEditor label="Content" value={content} onChange={debouncedContent} required disabled={isSubmitting} />
        <ImageUpload label="Image (max 4 MB)" onUpload={handleImg} imagePreview={imagePreview} existingImageUrl={existingImg} disabled={isSubmitting} />

        <PreviewSection title={title || "No title"} content={content || "No content"}>
          {(imagePreview || existingImg) ? (
            <img src={imagePreview || existingImg} alt="Door preview" className="mt-4 w-full max-w-md rounded-lg" />
          ) : (
            <div className="mt-4 w-full max-w-md h-48 bg-gray-200 border-2 border-dashed rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Image placeholder</span>
            </div>
          )}
        </PreviewSection>

        <FormActions onReset={handleReset} onSave={handleSave} isSubmitting={isSubmitting} disabled={!tenantId} isEditing={isEditing} />
      </div>
    </div>
  );
};

export default OpportunityDoorSection;