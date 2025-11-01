// src/components/backoffice/opportunity/OpportunityCompensationPlan.jsx
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

const OpportunityCompensationPlan = () => {
  const {
    opportunityData,
    loading,
    error,
    tenantId,
    handleRetry,
    maxRetriesReached,
  } = useOpportunityData("Compensation plan loaded!");

  const { submitForm, isSubmitting } = useOpportunityFormSubmit();
  const { image, imagePreview, handleImageUpload, resetImage, validateImage } = useImageValidation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [doc, setDoc] = useState(null);
  const [existingDocUrl, setExistingDocUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (opportunityData?.compensation_plan_section_title) {
      setTitle(opportunityData.compensation_plan_section_title);
      setContent(opportunityData.compensation_plan_section_content || "");
      setExistingDocUrl(opportunityData.compensation_plan_document_url || null);
      setIsEditing(true);
    }
  }, [opportunityData]);

  const debouncedTitle = useDebouncedCallback(setTitle, 300);
  const debouncedContent = useDebouncedCallback(setContent, 300);

  const handleDocUpload = e => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf" && file.size <= 4 * 1024 * 1024) {
      setDoc(file);
      toast.success("PDF selected");
    } else {
      toast.error("PDF only, max 4 MB");
    }
  };

  const handleSave = async () => {
    if (!validateRequired(title, "Plan title")) return;
    if (!validateRequired(content, "Plan content")) return;
    if (doc && doc.size > 4 * 1024 * 1024) {
      toast.error("PDF exceeds 4 MB");
      return;
    }

    const fields = {
      compensation_plan_section_title: title,
      compensation_plan_section_content: content,
    };
    if (doc) fields.compensation_plan_document = doc;
    else if (existingDocUrl) fields.compensation_plan_document_url = existingDocUrl;

    const fd = createFormDataWithDefaults(fields, opportunityData);
    const ok = await submitForm(fd, { successMessage: "Compensation plan saved!" });
    if (ok) setIsEditing(true);
  };

  const handleReset = () => {
    setTitle(opportunityData?.compensation_plan_section_title || "");
    setContent(opportunityData?.compensation_plan_section_content || "");
    setExistingDocUrl(opportunityData?.compensation_plan_document_url || null);
    setDoc(null);
    resetImage();
    toast.success("Reset");
  };

  const start = () => {
    setTitle("What is Compensation Plan");
    setContent("Understanding how you get rewarded…");
    setIsEditing(true);
  };

  if (loading) return <LoadingSpinner />;
  if (error && maxRetriesReached)
    return <ErrorState error={error} onRetry={handleRetry} onStartEditing={start} addButtonText="Add Compensation Plan" />;

  if (!isEditing && !title)
    return (
      <div className="p-12 text-center bg-white rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-2">No Compensation Plan</h3>
        <button onClick={start} className="mt-4 px-6 py-2 bg-black text-white rounded-full">
          Add Compensation Plan
        </button>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-6 border-b pb-2">
          {isEditing ? "Edit Compensation Plan" : "Create Compensation Plan"}
        </h3>

        <TextInput label="Title" value={title} onChange={e => debouncedTitle(e.target.value)} required disabled={isSubmitting} />
        <RichTextEditor label="Content" value={content} onChange={debouncedContent} required disabled={isSubmitting} />

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">PDF Document (max 4 MB)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleDocUpload}
            disabled={isSubmitting}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-100"
          />
          {doc && <p className="mt-1 text-xs text-green-600">Selected: {doc.name}</p>}
          {existingDocUrl && !doc && (
            <p className="mt-1 text-xs">
              Current: <a href={existingDocUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">View PDF</a>
            </p>
          )}
        </div>

        <PreviewSection title={title || "No title"} content={content || "No content"} />

        <FormActions onReset={handleReset} onSave={handleSave} isSubmitting={isSubmitting} disabled={!tenantId} isEditing={isEditing} />
      </div>
    </div>
  );
};

export default OpportunityCompensationPlan;