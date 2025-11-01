import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Reusable Components
import {
  LoadingSpinner,
  ErrorState,
  FormActions,
  TextInput,
  RichTextEditor,
  ImageUpload,
  PreviewSection,
} from "@/components/common";

// Custom Hooks
import {
  useHomepageData,
  useImageValidation,
  useFormSubmit,
  useDebouncedCallback,
} from "@/hooks";

// Utils
import { validateRequired, createFormDataWithDefaults } from "@/utils";

const HomepageWelcomeSection = () => {
  const {
    homePageData,
    loading,
    error,
    tenantId,
    handleRetry,
    maxRetriesReached,
  } = useHomepageData("Welcome section data loaded successfully!");

  const { submitForm, isSubmitting } = useFormSubmit();
  const { image, imagePreview, handleImageUpload, resetImage, validateImage } = useImageValidation();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Sync initial data from Redux to local state
  useEffect(() => {
    if (homePageData) {
      setTitle(homePageData.welcome_section_title || "");
      setContent(homePageData.welcome_section_content || "");
      setExistingImageUrl(homePageData.welcome_section_image_url || null);
      setIsEditing(!!homePageData.welcome_section_content);
    }
  }, [homePageData]);

  // Debounced title changes
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
    // Validation
    if (!validateRequired(title, "Title")) return;
    if (!validateRequired(content, "Welcome content")) return;
    
    // Validate image if one is selected
    if (image) {
      const validation = validateImage(image);
      if (!validation.isValid) {
        toast.error(validation.message);
        return;
      }
    }

    // Build FormData with fields
    const fields = {
      welcome_section_title: title,
      welcome_section_content: content,
    };

    if (image) {
      fields.welcome_section_image = image;
    } else if (existingImageUrl) {
      fields.welcome_section_image_url = existingImageUrl;
    }

    const formData = createFormDataWithDefaults(fields, homePageData);

    const success = await submitForm(formData, {
      successMessage: "Welcome section saved successfully!"
    });
    
    if (success) {
      setIsEditing(true);
    }
  };

  const handleReset = () => {
    setTitle(homePageData?.welcome_section_title || "");
    setContent(homePageData?.welcome_section_content || "");
    setExistingImageUrl(homePageData?.welcome_section_image_url || null);
    resetImage();
    toast.success("Form reset successfully!");
  };

  const handleStartEditing = () => {
    setTitle("Welcome");
    setContent("Start writing your welcome message here...");
    setIsEditing(true);
  };

  // Loading State
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Toaster position="top-right" />
        <LoadingSpinner message="Loading welcome section..." />
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
          addButtonText="Add Welcome Section"
        />
      </div>
    );
  }

  // Empty State - No content yet
  if (!isEditing && !content) {
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
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Welcome Section Yet</h3>
          <p className="text-gray-500 mb-6">
            Get started by adding a welcome section for your homepage!
          </p>
          <button
            onClick={handleStartEditing}
            className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
          >
            Add Welcome Section
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
          {isEditing ? "Edit Welcome Section" : "Create Welcome Section"}
        </h3>

        <div className="space-y-6">
          {/* Title Input */}
          <TextInput
            id="title"
            label="Title"
            value={title}
            onChange={(e) => debouncedSetTitle(e.target.value)}
            placeholder="Enter title"
            required
            disabled={isSubmitting}
          />

          {/* Rich Text Editor for Content */}
          <RichTextEditor
            id="welcomeContent"
            label="Welcome Content"
            value={content}
            onChange={setContent}
            placeholder="Enter welcome content..."
            required
            disabled={isSubmitting}
          />

          {/* Image Upload */}
          <ImageUpload
            label="Welcome Image (Max 4MB)"
            onUpload={handleImageChange}
            imagePreview={imagePreview}
            existingImageUrl={existingImageUrl}
            disabled={isSubmitting}
          />

          {/* Preview Section */}
          <PreviewSection title={title || "No title"} content={content || "No content yet"}>
            {(imagePreview || existingImageUrl) ? (
              <img
                src={imagePreview || existingImageUrl}
                alt="Welcome"
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

        {/* Form Actions (Reset & Save) */}
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

export default HomepageWelcomeSection;