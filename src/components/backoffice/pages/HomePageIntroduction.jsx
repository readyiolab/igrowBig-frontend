import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useTenantApi from "@/hooks/useTenantApi";
import toast, { Toaster } from "react-hot-toast";
import { X } from "react-feather";

const HomePageIntroduction = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [tenantId, setTenantId] = useState(null);
  const [existingPage, setExistingPage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, loading, error, getAll, put } = useTenantApi();

  // Authentication and tenant setup
  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    const token = localStorage.getItem("token");
    if (!token || !storedTenantId) {
      toast.error("Please log in to continue.");
      window.location.href = "/backoffice-login";
    } else if (tenantId !== storedTenantId) {
      setTenantId(storedTenantId);
    }
  }, [tenantId]);

  // Fetch introduction data
  useEffect(() => {
    if (tenantId) {
      fetchIntroductionData();
    }
  }, [tenantId]);

  const fetchIntroductionData = async () => {
    try {
      const response = await getAll(`/tenants/${tenantId}/home-page`);
      if (response && Object.keys(response).length > 0) {
        setContent(response.introduction_content || "");
        setImage(response.introduction_image_url || null);
        setExistingPage(response);
      } else {
        setContent("");
        setImage(null);
        setExistingPage(null);
      }
    } catch (err) {
      console.error("Error fetching introduction data:", err);
      setContent("");
      setImage(null);
      setExistingPage(null);
    }
  };

  const handleContentChange = (newContent) => {
    if (newContent.length <= 2000) {
      setContent(newContent);
    } else {
      toast.error("Content cannot exceed 2000 characters.");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error("Please upload a JPEG or PNG image.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size cannot exceed 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setSelectedImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setSelectedImageFile(null);
  };

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No authentication token found. Please log in.");
      return;
    }

    if (!content.trim() && !selectedImageFile && !image) {
      toast.error("Please provide content or an image.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("introduction_content", content || "Default introduction");

      if (existingPage) {
        const requiredFields = [
          "welcome_description",
          "about_company_title",
          "about_company_content_1",
          "why_network_marketing_title",
          "why_network_marketing_content",
          "opportunity_video_header_title",
          "support_content",
        ];
        requiredFields.forEach((field) => {
          formData.append(field, existingPage[field] || `Default ${field}`);
        });
        if (existingPage.about_company_content_2) {
          formData.append("about_company_content_2", existingPage.about_company_content_2);
        }
        if (existingPage.opportunity_video_url) {
          formData.append("youtube_link", existingPage.opportunity_video_url);
        }
      } else {
        const defaultFields = {
          welcome_description: "Welcome to our platform",
          about_company_title: "About Our Company",
          about_company_content_1: "We are a leading company in our industry.",
          why_network_marketing_title: "Why Network Marketing",
          why_network_marketing_content: "Network marketing offers great opportunities.",
          opportunity_video_header_title: "Our Opportunity",
          support_content: "We provide excellent support to our users.",
        };
        Object.entries(defaultFields).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }

      if (selectedImageFile) {
        formData.append("introduction_image", selectedImageFile);
      }

      const response = await toast.promise(
        put(`/tenants/${tenantId}/home-page`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
          },
        }),
        {
          loading: "Saving introduction...",
          success: "Introduction saved successfully!",
          error: (err) => `Failed to save: ${err.response?.data?.message || err.message}`,
        }
      );

      if (response.data?.data?.introduction_image_url) {
        setImage(response.data.data.introduction_image_url);
        setSelectedImageFile(null);
      }
      await fetchIntroductionData();
    } catch (err) {
      console.error("Error saving introduction:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (existingPage) {
      setContent(existingPage.introduction_content || "");
      setImage(existingPage.introduction_image_url || null);
      setSelectedImageFile(null);
    } else {
      setContent("");
      setImage(null);
      setSelectedImageFile(null);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ font: [] }],
      [{ size: ["small", false, "large"] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block">Loading introduction data...</span>
        </div>
      )}

      {/* No Content or Error State */}
      {(!existingPage && !loading && !content && !image) && (
        <div className="p-12 text-center bg-white shadow-lg rounded-xl border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Introduction Yet</h3>
          <p className="text-gray-500 mb-6">Get started by adding an introduction for your homepage!</p>
          <button
            onClick={() => setContent("Start writing your introduction here...")}
            className="bg-gradient-to-r from-gray-800 to-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
            aria-label="Add introduction"
          >
            Add Introduction
          </button>
        </div>
      )}

      {/* Main Editor */}
      {(!loading && (existingPage || content || image)) && (
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {existingPage ? "Edit Homepage Introduction" : "Add Homepage Introduction"}
          </h2>

          {/* Editor Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Introduction Content</label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <ReactQuill
                value={content}
                onChange={handleContentChange}
                modules={quillModules}
                theme="snow"
                className="bg-gray-50"
                aria-label="Introduction content editor"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {content.replace(/<[^>]+>/g, "").length}/2000 characters
            </p>
          </div>

          {/* Image Upload Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Introduction Image</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                aria-label="Upload introduction image"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer bg-gray-100 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-200 transition-all duration-200"
              >
                {image ? "Replace Image" : "Upload Image"}
              </label>
              <p className="text-sm text-gray-500 mt-2">JPEG or PNG, max 5MB</p>
              {image && (
                <div className="mt-4 relative inline-block">
                  <img
                    src={image}
                    alt="Introduction preview"
                    className="w-40 h-40 object-cover rounded-lg"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-all duration-200"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              {content ? (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <p className="text-gray-500">No content yet</p>
              )}
              {image && (
                <img
                  src={image}
                  alt="Introduction preview"
                  className="w-40 h-40 mt-4 object-cover rounded-lg"
                />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Cancel changes"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Save introduction"
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              )}
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePageIntroduction;