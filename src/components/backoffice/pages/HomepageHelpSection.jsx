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
  useHomepageData,
  useImageValidation,
  useFormSubmit,
  useDebouncedCallback,
} from "@/hooks";
import { validateRequired, createFormDataWithDefaults } from "@/utils";

const HomepageHelpSection = () => {
  const {
    homePageData,
    loading,
    error,
    tenantId,
    handleRetry,
    maxRetriesReached,
  } = useHomepageData("Help section loaded successfully!");

  const { submitForm, isSubmitting } = useFormSubmit();
  const { image, imagePreview, handleImageUpload, resetImage, validateImage } = useImageValidation();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (homePageData) {
      setTitle(homePageData.help_section_title || "");
      setContent(homePageData.help_section_content || "");
      setExistingImageUrl(homePageData.help_section_image_url || null);
      setIsEditing(!!homePageData.help_section_content);
    }
  }, [homePageData]);

  const debouncedSetTitle = useDebouncedCallback(setTitle, 300);

  // Handle image upload with toast notifications
  const handleImageChange = (e) => {
    const result = handleImageUpload(e);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleSave = async () => {
    if (!validateRequired(title, "Title")) return;
    if (!validateRequired(content, "Help content")) return;
    
    // Validate image if one is selected
    if (image) {
      const validation = validateImage(image);
      if (!validation.isValid) {
        toast.error(validation.message);
        return;
      }
    }

    const fields = {
      help_section_title: title,
      help_section_content: content,
    };

    if (image) {
      fields.help_section_image = image;
    } else if (existingImageUrl) {
      fields.help_section_image_url = existingImageUrl;
    }

    const formData = createFormDataWithDefaults(fields, homePageData);
    
    const success = await submitForm(formData, {
      successMessage: "Help section saved successfully!"
    });
    
    if (success) setIsEditing(true);
  };

  const handleReset = () => {
    setTitle(homePageData?.help_section_title || "");
    setContent(homePageData?.help_section_content || "");
    setExistingImageUrl(homePageData?.help_section_image_url || null);
    resetImage();
    toast.success("Form reset successfully!");
  };

  const handleStartEditing = () => {
    setTitle("How Get Dream Life Can Help");
    setContent("Start writing your help message here...");
    setIsEditing(true);
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Toaster position="top-right" />
        <LoadingSpinner message="Loading help section..." />
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
          addButtonText="Add Help Section"
        />
      </div>
    );
  }

  if (!isEditing && !content) {
    return (
      <div className="container mx-auto p-4">
        <Toaster position="top-right" />
        <div className="p-12 text-center bg-white shadow-lg rounded-xl border border-gray-200">
          <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Help Section Yet</h3>
          <p className="text-gray-500 mb-6">Get started by adding a help section for your homepage!</p>
          <button onClick={handleStartEditing} className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105">
            Add Help Section
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
          {isEditing ? "Edit Help Section" : "Create Help Section"}
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
          />
          <RichTextEditor
            id="helpContent"
            label="Help Content"
            value={content}
            onChange={setContent}
            placeholder="Enter help message content..."
            required
            disabled={isSubmitting}
          />
          <ImageUpload
            label="Help Image (Max 4MB)"
            onUpload={handleImageChange}
            imagePreview={imagePreview}
            existingImageUrl={existingImageUrl}
            disabled={isSubmitting}
          />
          <PreviewSection title={title || "No title yet"} content={content || "No content yet"}>
            {(imagePreview || existingImageUrl) ? (
              <img
                src={imagePreview || existingImageUrl}
                alt="Help Preview"
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
        <FormActions onReset={handleReset} onSave={handleSave} isSubmitting={isSubmitting} disabled={!tenantId} isEditing={isEditing} />
      </div>
    </div>
  );
};

export default HomepageHelpSection;