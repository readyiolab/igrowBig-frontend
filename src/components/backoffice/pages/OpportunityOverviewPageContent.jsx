// OpportunityOverviewPageContent.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useTenantApi from "@/hooks/useTenantApi"; // Note: Keeping for now, but ideally replace if needed
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast, { Toaster } from "react-hot-toast";
import {
  fetchOpportunityPage,
  updateOpportunityPage,
  createOpportunityPage,
  selectOpportunityPageData,
  selectOpportunityPageLoading,
  selectOpportunityPageError,
} from "@/store/slices/opportunityPageSlice";
import { setSubmitting, selectIsSubmitting } from "@/store/slices/uiSlice";

const OpportunityOverviewPageContent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const data = useSelector(selectOpportunityPageData);
  const loading = useSelector(selectOpportunityPageLoading);
  const error = useSelector(selectOpportunityPageError);
  const isSubmitting = useSelector(selectIsSubmitting);

  const [tenantId, setTenantId] = useState(null);
  const [content, setContent] = useState({
    welcome_message: "",
    page_content: "",
    page_image: null,
  });
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB in bytes

  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    if (storedTenantId && tenantId !== storedTenantId) {
      setTenantId(storedTenantId);
    }
  }, [tenantId]);

  useEffect(() => {
    if (tenantId) {
      dispatch(fetchOpportunityPage(tenantId));
    }
  }, [tenantId, dispatch]);

  useEffect(() => {
    if (data && (data.welcome_message || data.page_content || data.page_image_url)) {
      setContent({
        welcome_message: data.welcome_message || "",
        page_content: data.page_content || "",
        page_image: null,
      });
      setExistingImageUrl(data.page_image_url || null);
      setImagePreview(null);
      setIsEditing(true);
    } else {
      setContent({ welcome_message: "", page_content: "", page_image: null });
      setExistingImageUrl(null);
      setImagePreview(null);
      setIsEditing(false);
    }
  }, [data]);

  const validateFile = (file) => {
    if (!file) return true; // Image is optional
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image size exceeds 4MB limit.");
      return false;
    }
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      toast.error("Please upload a JPEG, JPG, or PNG image.");
      return false;
    }
    return true;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setContent({ ...content, page_image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      toast.success("Image selected successfully!");
    }
  };

  const handleRemoveImage = () => {
    setContent({ ...content, page_image: null });
    setImagePreview(null);
    toast.success("Selected image removed.");
  };

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.");
      navigate("/backoffice-login");
      return;
    }

    if (!content.welcome_message.replace(/<[^>]+>/g, "").trim()) {
      toast.error("Welcome message is required and cannot be empty.");
      return;
    }

    if (!content.page_content.replace(/<[^>]+>/g, "").trim()) {
      toast.error("Page content is required and cannot be empty.");
      return;
    }

    if (!validateFile(content.page_image)) {
      return;
    }

    const formData = new FormData();
    formData.append("welcome_message", content.welcome_message);
    formData.append("page_content", content.page_content);
    if (content.page_image) {
      formData.append("page_image", content.page_image);
    }

    dispatch(setSubmitting(true));
    try {
      const existingPage = data;
      const promise = existingPage && existingPage.id
        ? dispatch(updateOpportunityPage({ tenantId, formData })).unwrap()
        : dispatch(createOpportunityPage({ tenantId, formData })).unwrap();

      await toast.promise(promise, {
        loading: "Saving content...",
        success: "Content saved successfully!",
        error: (err) => `Failed to save: ${err.message || "Unknown error"}`,
      });
      dispatch(fetchOpportunityPage(tenantId));
    } catch (err) {
      console.error("Error saving opportunity page content:", err);
      if (err.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/backoffice-login");
      }
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const handleReset = () => {
    setContent({ welcome_message: "", page_content: "", page_image: null });
    setExistingImageUrl(null);
    setImagePreview(null);
    setIsEditing(false);
    toast.success("Form reset successfully!");
  };

  const handleRetry = () => {
    dispatch(fetchOpportunityPage(tenantId));
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ color: [] }, { background: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
      [{ direction: "rtl" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image", "video", "blockquote", "code-block"],
      ["clean"],
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {loading && (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading content...</span>
        </div>
      )}

      {error && !loading && (
        <div className="p-12 text-center bg-white shadow-lg rounded-xl border border-gray-200">
          <svg
            className="mx-auto h-24 w-24 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load Content</h3>
          <p className="text-gray-500 mb-6">
            {error.message || "An error occurred while loading content. You can start editing or try again."}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setContent({ welcome_message: "", page_content: "", page_image: null })}
              className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
              aria-label="Start editing content"
            >
              Start Editing
            </button>
            <button
              onClick={handleRetry}
              className="border border-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
              aria-label="Retry loading content"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {!tenantId && !loading && (
        <div className="p-12 text-center bg-white shadow-lg rounded-xl border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Authentication Required</h3>
          <p className="text-gray-500 mb-6">No tenant ID found. Please log in to continue.</p>
          <button
            onClick={() => navigate("/backoffice-login")}
            className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
            aria-label="Go to login page"
          >
            Log In
          </button>
        </div>
      )}

      {!loading && !error && tenantId && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">
            {isEditing ? "Edit Opportunity Page Content" : "Create Opportunity Page Content"}
          </h3>

          <div className="space-y-6">
            <div>
              <label htmlFor="welcome_message" className="block text-sm font-medium text-gray-700 mb-2">
                Welcome Message <span className="text-red-500">*</span>
              </label>
              <ReactQuill
                id="welcome_message"
                value={content.welcome_message}
                onChange={(value) => setContent({ ...content, welcome_message: value })}
                modules={quillModules}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
                placeholder="Enter welcome message..."
                readOnly={isSubmitting}
                aria-label="Welcome message editor"
              />
            </div>

            <div>
              <label htmlFor="page_content" className="block text-sm font-medium text-gray-700 mb-2">
                Page Content <span className="text-red-500">*</span>
              </label>
              <ReactQuill
                id="page_content"
                value={content.page_content}
                onChange={(value) => setContent({ ...content, page_content: value })}
                modules={quillModules}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
                placeholder="Enter page content..."
                readOnly={isSubmitting}
                aria-label="Page content editor"
              />
            </div>

            <div>
              <label htmlFor="page_image" className="block text-sm font-medium text-gray-700 mb-2">
                Page Image (JPEG, JPG, PNG, Max 4MB)
              </label>
              <input
                id="page_image"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageUpload}
                disabled={isSubmitting}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Upload page image"
              />
              {(imagePreview || content.page_image) && (
                <div className="mt-2 relative">
                  <p className="text-xs text-gray-500">Preview:</p>
                  <img
                    src={imagePreview || "/placeholder-image.jpg"}
                    alt="Selected Preview"
                    className="h-20 w-auto object-cover rounded shadow-sm"
                    onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                  />
                  <button
                    onClick={handleRemoveImage}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
                    aria-label="Remove selected image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {isEditing && !imagePreview && !content.page_image && existingImageUrl && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Current:</p>
                  <img
                    src={existingImageUrl}
                    alt="Current Page Image"
                    className="h-20 w-auto object-cover rounded shadow-sm"
                    onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                  />
                </div>
              )}
              {content.page_image && !imagePreview && (
                <p className="text-xs text-gray-500 mt-2">Selected: {content.page_image.name}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={handleReset}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Reset content form"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || !tenantId}
              className="px-6 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isEditing ? "Update content" : "Save content"}
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              )}
              {isSubmitting ? "Saving..." : isEditing ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityOverviewPageContent;