import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast, { Toaster } from "react-hot-toast";

// Redux imports
import {
  fetchHomePage,
  updateHomePage,
  setData,
  selectHomePageData,
  selectHomePageLoading,
  selectHomePageError,
} from "@/store/slices/homePageSlice";

import {
  setSubmitting,
  selectIsSubmitting,
} from "@/store/slices/uiSlice";

import { selectTenantId } from "@/store/slices/authSlice";

const MAX_RETRIES = 3;

const HomepageSupportMessage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const homePageData = useSelector(selectHomePageData);
  const loading = useSelector(selectHomePageLoading);
  const error = useSelector(selectHomePageError);
  const tenantId = useSelector(selectTenantId);
  const isSubmitting = useSelector(selectIsSubmitting);

  // Local state
  const [retryCount, setRetryCount] = useState(0);

  const content = homePageData.support_content || "";
  const isEditing = !!content;

  // Fetch on mount
  useEffect(() => {
    if (!tenantId) {
      const storedTenantId = localStorage.getItem("tenant_id");
      if (!storedTenantId) {
        toast.error("Please log in to continue.");
        navigate("/backoffice-login");
      }
      return;
    }

    dispatch(fetchHomePage(tenantId))
      .unwrap()
      .then(() => {
        toast.success("Support content loaded successfully!");
        setRetryCount(0);
      })
      .catch((err) => {
        console.error("Error fetching support content:", err);
        if (retryCount < MAX_RETRIES) {
          setTimeout(() => setRetryCount(retryCount + 1), 2000);
        } else {
          toast.error("Unable to load data. Please try again later or start adding content.");
          setIsEditing(false);
        }
      });
  }, [tenantId, retryCount, dispatch, navigate]);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleContentChange = useCallback(
    debounce((value) => {
      dispatch(setData({ support_content: value }));
    }, 300),
    [dispatch]
  );

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.");
      navigate("/backoffice-login");
      return;
    }

    if (!content.trim() || content === "<p><br></p>") {
      toast.error("Support content is required.");
      return;
    }

    const formData = new FormData();
    formData.append("support_content", content);

    // Add other fields from existing data or defaults
    const defaults = {
      welcome_description: "Welcome to our platform",
      introduction_content: "Default introduction content",
      about_company_title: "About Our Company",
      about_company_content_1: "Default about content",
      about_company_content_2: "",
      why_network_marketing_title: "Why Network Marketing",
      why_network_marketing_content: "Default why content",
      opportunity_video_header_title: "Opportunity Video",
      opportunity_video_url: "",
    };

    Object.entries(defaults).forEach(([key, value]) => {
      formData.append(key, homePageData[key] || value);
    });

    dispatch(setSubmitting(true));

    try {
      await toast.promise(
        dispatch(updateHomePage({ tenantId, formData })).unwrap(),
        {
          loading: "Saving support content...",
          success: "Support content saved successfully!",
          error: (err) => `Failed to save: ${err.message || 'Unknown error'}`,
        }
      );
      await dispatch(fetchHomePage(tenantId));
    } catch (err) {
      console.error("Error saving support message:", err);
      if (err.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/backoffice-login");
      }
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const handleReset = () => {
    dispatch(setData({ support_content: "" }));
    setIsEditing(false);
    toast.success("Form reset successfully!");
  };

  const handleStartEditing = () => {
    dispatch(setData({ support_content: "Start writing your support message here..." }));
    setIsEditing(true);
  };

  const handleRetry = () => {
    setRetryCount(0);
    dispatch(fetchHomePage(tenantId));
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

      {loading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading support content...</span>
        </div>
      ) : error && retryCount >= MAX_RETRIES ? (
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
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load Content</h3>
          <p className="text-gray-500 mb-6">
            {error.message || "An error occurred while loading support content. You can start adding content or try again."}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleStartEditing}
              className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
            >
              Add Support Message
            </button>
            <button
              onClick={handleRetry}
              className="border border-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      ) : !isEditing && !content ? (
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
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Support Message Yet</h3>
          <p className="text-gray-500 mb-6">
            Get started by adding a support message for your homepage!
          </p>
          <button
            onClick={handleStartEditing}
            className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
          >
            Add Support Message
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">
            {isEditing ? "Edit Support Message" : "Create Support Message"}
          </h3>

          <div className="space-y-6">
            <div>
              <label htmlFor="supportContent" className="block text-sm font-medium text-gray-700 mb-2">
                Support Content <span className="text-red-500">*</span>
              </label>
              <ReactQuill
                id="supportContent"
                value={content}
                onChange={handleContentChange}
                modules={quillModules}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
                placeholder="Enter support message content..."
                readOnly={isSubmitting}
                aria-required="true"
              />
            </div>

            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-2">Preview</h4>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-inner">
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: content || "No content yet" }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={handleReset}
              disabled={isSubmitting}
              className="px-6 py-2.5 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-medium shadow-sm disabled:opacity-50"
              aria-label="Reset form"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || !tenantId}
              className="px-6 py-2.5 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isEditing ? "Update support message" : "Save support message"}
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

export default HomepageSupportMessage;