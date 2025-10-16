import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchHomePage, updateHomePage } from "@/store/slices/homePageSlice";
import { setSubmitting, openForm, closeForm, incrementRetry, resetRetry } from "@/store/slices/uiSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast, { Toaster } from "react-hot-toast";

const HomepageWhyNetworkMarketing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: homePageData, loading: isLoading, error } = useSelector((state) => state.homePage);
  const { isSubmitting, isEditing, retryCount } = useSelector((state) => state.ui);

  const [tenantId, setTenantId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    if (storedTenantId && tenantId !== storedTenantId) {
      setTenantId(storedTenantId);
    }
  }, [tenantId]);

  useEffect(() => {
    if (tenantId) {
      dispatch(fetchHomePage(tenantId));
    }
  }, [tenantId, dispatch, retryCount]);

  useEffect(() => {
    if (homePageData && Object.keys(homePageData).length > 0) {
      setTitle(homePageData.why_network_marketing_title || "");
      setContent(homePageData.why_network_marketing_content || "");
      dispatch(openForm({ isEditing: !!homePageData.why_network_marketing_title }));
    } else {
      setTitle("");
      setContent("");
      dispatch(closeForm());
    }
  }, [homePageData, dispatch]);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleTitleChange = useCallback(
    debounce((value) => {
      setTitle(value);
    }, 300),
    []
  );

  const handleContentChange = useCallback(
    debounce((value) => {
      setContent(value);
    }, 300),
    []
  );

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.");
      navigate("/backoffice-login");
      return;
    }

    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    if (!content.trim() || content === "<p><br></p>") {
      toast.error("Content is required.");
      return;
    }

    const formData = new FormData();
    formData.append("why_network_marketing_title", title);
    formData.append("why_network_marketing_content", content);

    if (homePageData && Object.keys(homePageData).length > 0) {
      formData.append("welcome_description", homePageData.welcome_description || "Default welcome");
      formData.append("introduction_content", homePageData.introduction_content || "Default introduction");
      formData.append("about_company_title", homePageData.about_company_title || "About Us");
      formData.append("about_company_content_1", homePageData.about_company_content_1 || "Default content");
      formData.append("about_company_content_2", homePageData.about_company_content_2 || "");
      formData.append("opportunity_video_header_title", homePageData.opportunity_video_header_title || "Opportunity Video");
      formData.append("opportunity_video_url", homePageData.opportunity_video_url || "");
      formData.append("support_content", homePageData.support_content || "Default support content");
    } else {
      const defaultFields = {
        welcome_description: "Welcome to our platform",
        introduction_content: "Default introduction content",
        about_company_title: "About Our Company",
        about_company_content_1: "We are a leading company in our industry.",
        opportunity_video_header_title: "Our Opportunity",
        support_content: "We provide excellent support to our users.",
      };
      Object.entries(defaultFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    dispatch(setSubmitting(true));
    try {
      await toast.promise(
        dispatch(updateHomePage({ tenantId, formData })).unwrap(),
        {
          loading: "Saving data...",
          success: "Why Network Marketing saved successfully!",
          error: (err) => `Failed to save: ${err.message}`,
        }
      );
    } catch (err) {
      console.error("Error saving why network marketing:", err);
      if (err.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/backoffice-login");
      }
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const handleReset = () => {
    setTitle("");
    setContent("");
    dispatch(closeForm());
    toast.success("Form reset successfully!");
  };

  const handleStartEditing = () => {
    setTitle("Why Network Marketing");
    setContent("Start writing about why network marketing here...");
    dispatch(openForm({ isEditing: true }));
  };

  const handleRetry = () => {
    dispatch(resetRetry());
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

      {isLoading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading data...</span>
        </div>
      ) : error && retryCount >= 3 ? (
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
            {error.message || "An error occurred while loading data. You can start adding content or try again."}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleStartEditing}
              className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
            >
              Add Why Network Marketing
            </button>
            <button
              onClick={handleRetry}
              className="border border-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      ) : !isEditing && !title && !content ? (
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
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Why Network Marketing Content Yet</h3>
          <p className="text-gray-500 mb-6">
            Get started by adding content for the Why Network Marketing section!
          </p>
          <button
            onClick={handleStartEditing}
            className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
          >
            Add Why Network Marketing
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">
            {isEditing ? "Edit Why Network Marketing" : "Create Why Network Marketing"}
          </h3>

          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 text-xl font-semibold text-gray-800 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50 disabled:opacity-50"
                placeholder="Enter title"
                disabled={isSubmitting}
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <ReactQuill
                id="content"
                value={content}
                onChange={handleContentChange}
                modules={quillModules}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
                placeholder="Enter content for Why Network Marketing..."
                readOnly={isSubmitting}
                aria-required="true"
              />
            </div>

            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-2">Preview</h4>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-inner">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">{title || "No title yet"}</h1>
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
              aria-label={isEditing ? "Update why network marketing" : "Save why network marketing"}
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

export default HomepageWhyNetworkMarketing;