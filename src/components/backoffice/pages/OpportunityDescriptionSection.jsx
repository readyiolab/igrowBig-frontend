// src/components/backoffice/opportunity/OpportunityDescriptionSection.jsx
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  LoadingSpinner,
  ErrorState,
  FormActions,
  RichTextEditor,
  PreviewSection,
} from "@/components/common";
import { useOpportunityData, useOpportunityFormSubmit, useDebouncedCallback } from "@/hooks";
import { validateRequired, createFormDataWithDefaults } from "@/utils";

const OpportunityDescriptionSection = () => {
  const {
    opportunityData,
    loading,
    error,
    tenantId,
    handleRetry,
    maxRetriesReached,
  } = useOpportunityData("Description loaded!");

  const { submitForm, isSubmitting } = useOpportunityFormSubmit();

  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (opportunityData?.description_section_content) {
      setContent(opportunityData.description_section_content);
      setIsEditing(true);
    }
  }, [opportunityData]);

  const debouncedSetContent = useDebouncedCallback(setContent, 300);

  const handleSave = async () => {
    if (!validateRequired(content, "Description")) return;

    const formData = createFormDataWithDefaults(
      { description_section_content: content },
      opportunityData
    );

    const ok = await submitForm(formData, { successMessage: "Description saved!" });
    if (ok) setIsEditing(true);
  };

  const handleReset = () => {
    setContent(opportunityData?.description_section_content || "");
    toast.success("Reset");
  };

  const startEditing = () => {
    setContent("Discover the opportunity that can change your life…");
    setIsEditing(true);
  };

  if (loading) return <LoadingSpinner message="Loading description…" />;
  if (error && maxRetriesReached)
    return <ErrorState error={error} onRetry={handleRetry} onStartEditing={startEditing} addButtonText="Add Description" />;

  if (!isEditing && !content)
    return (
      <div className="p-12 text-center bg-white rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-2">No Description Yet</h3>
        <button onClick={startEditing} className="mt-4 px-6 py-2 bg-black text-white rounded-full">
          Add Description
        </button>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-6 border-b pb-2">
          {isEditing ? "Edit Description" : "Create Description"}
        </h3>

        <RichTextEditor
          label="Description Content"
          value={content}
          onChange={debouncedSetContent}
          required
          disabled={isSubmitting}
        />

        <PreviewSection title="Description Preview" content={content || "No content"} />

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

export default OpportunityDescriptionSection;