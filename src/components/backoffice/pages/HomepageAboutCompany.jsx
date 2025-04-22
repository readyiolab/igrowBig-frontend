import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast, { Toaster } from "react-hot-toast";

const HomepageAboutCompany = () => {
  const navigate = useNavigate();
  const { data, loading: isLoading, error, getAll, put } = useTenantApi();

  const [tenantId, setTenantId] = useState(null);
  const [title, setTitle] = useState("");
  const [aboutContent1, setAboutContent1] = useState("");
  const [aboutContent2, setAboutContent2] = useState("");
  const [image, setImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    if (storedTenantId && tenantId !== storedTenantId) {
      setTenantId(storedTenantId);
    }
  }, []);

  useEffect(() => {
    if (tenantId) {
      fetchAboutCompanyData();
    }
  }, [tenantId, retryCount]);

  const fetchAboutCompanyData = async () => {
    try {
      const response = await toast.promise(
        getAll(`/tenants/${tenantId}/home-page`),
        {
          loading: "Fetching about company data...",
          success: "Data loaded successfully!",
          error: "Failed to load data.",
        }
      );
      if (response && Object.keys(response).length > 0) {
        setTitle(response.about_company_title || "");
        setAboutContent1(response.about_company_content_1 || "");
        setAboutContent2(response.about_company_content_2 || "");
        setExistingImageUrl(response.about_company_image_url || null);
        setImage(null);
        setImagePreview(null);
        setIsEditing(true);
      } else {
        setTitle("");
        setAboutContent1("");
        setAboutContent2("");
        setExistingImageUrl(null);
        setImage(null);
        setImagePreview(null);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error fetching about company data:", err.response?.data || err.message);
      if (retryCount < 3) {
        toast.error(`Failed to load data. Retrying... (${retryCount + 1}/3)`);
        setTimeout(() => setRetryCount(retryCount + 1), 2000);
      } else {
        toast.error("Unable to load data. Please try again later or start adding content.");
        setIsEditing(false);
      }
    }
  };

  const validateImage = (file) => {
    if (!file) return true;
    const maxSizeBytes = 4 * 1024 * 1024; // 4MB
    if (file.size > maxSizeBytes) {
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
    if (file && validateImage(file)) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      toast.info("Image selected successfully!");
    }
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleContentChange = useCallback(
    debounce((field, value) => {
      if (field === "title") setTitle(value);
      if (field === "aboutContent1") setAboutContent1(value);
      if (field === "aboutContent2") setAboutContent2(value);
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

    if (!aboutContent1.trim()) {
      toast.error("About Content 1 is required.");
      return;
    }

    if (!validateImage(image)) {
      return;
    }

    const formData = new FormData();
    formData.append("about_company_title", title);
    formData.append("about_company_content_1", aboutContent1);
    formData.append("about_company_content_2", aboutContent2 || "");
    if (image) {
      formData.append("about_company_image", image);
    } else if (existingImageUrl) {
      formData.append("about_company_image_url", existingImageUrl);
    }

    const existingPage = await getAll(`/tenants/${tenantId}/home-page`);
    if (existingPage && Object.keys(existingPage).length > 0) {
      // If updating, include existing fields or defaults
      formData.append("welcome_description", existingPage.welcome_description || "Default welcome");
      formData.append("introduction_content", existingPage.introduction_content || "Default introduction");
      formData.append("why_network_marketing_title", existingPage.why_network_marketing_title || "Why Network Marketing");
      formData.append("why_network_marketing_content", existingPage.why_network_marketing_content || "Default why content");
      formData.append("opportunity_video_header_title", existingPage.opportunity_video_header_title || "Opportunity Video");
      formData.append("opportunity_video_url", existingPage.opportunity_video_url || "");
      formData.append("support_content", existingPage.support_content || "Default support content");
    } else {
      // If adding new, provide default values for required fields
      const defaultFields = {
        welcome_description: "Welcome to our platform",
        introduction_content: "Default introduction content",
        why_network_marketing_title: "Why Network Marketing",
        why_network_marketing_content: "Network marketing offers great opportunities.",
        opportunity_video_header_title: "Our Opportunity",
        support_content: "We provide excellent support to our users.",
      };
      Object.entries(defaultFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    setIsSubmitting(true);
    try {
      await toast.promise(
        put(`/tenants/${tenantId}/home-page`, formData, true),
        {
          loading: "Saving about company data...",
          success: "About company saved successfully!",
          error: (err) => `Failed to save: ${err.response?.data?.message || err.message}`,
        }
      );
      await fetchAboutCompanyData();
    } catch (err) {
      console.error("Error saving about company:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/backoffice-login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle("");
    setAboutContent1("");
    setAboutContent2("");
    setImage(null);
    setImagePreview(null);
    setExistingImageUrl(null);
    setIsEditing(false);
    toast.success("Form reset successfully!");
  };

  const handleStartEditing = () => {
    setTitle("About Your Company");
    setAboutContent1("Start writing about your company here...");
    setAboutContent2("");
    setImage(null);
    setImagePreview(null);
    setIsEditing(true);
  };

  const handleRetry = () => {
    setRetryCount(0);
    fetchAboutCompanyData();
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
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading about company data...</span>
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
              d="M12 6v6m0 0v6m0-6h6m0-6H6"
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
              Add About Company
            </button>
            <button
              onClick={handleRetry}
              className="border border-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">
            {isEditing ? "Edit About Company" : "Create About Company"}
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
                onChange={(e) => handleContentChange("title", e.target.value)}
                className="w-full px-4 py-2 text-xl font-semibold text-gray-800 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50 disabled:opacity-50"
                placeholder="Enter title"
                disabled={isSubmitting}
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="aboutContent1" className="block text-sm font-medium text-gray-700 mb-2">
                About Content 1 <span className="text-red-500">*</span>
              </label>
              <ReactQuill
                value={aboutContent1}
                onChange={(value) => handleContentChange("aboutContent1", value)}
                modules={quillModules}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
                placeholder="Enter content for About Section 1..."
                readOnly={isSubmitting}
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="aboutContent2" className="block text-sm font-medium text-gray-700 mb-2">
                About Content 2
              </label>
              <ReactQuill
                value={aboutContent2}
                onChange={(value) => handleContentChange("aboutContent2", value)}
                modules={quillModules}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
                placeholder="Enter content for About Section 2 (optional)..."
                readOnly={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 mb-2">
                About Company Image (JPEG, JPG, PNG, Max 4MB, 348px × 348px recommended)
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageUpload}
                disabled={isSubmitting}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50"
              />
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Selected Preview"
                    className="w-[348px] h-[348px] object-cover rounded-lg shadow-sm"
                  />
                </div>
              )}
              {isEditing && !imagePreview && existingImageUrl && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Current:</p>
                  <img
                    src={existingImageUrl}
                    alt="Current Image"
                    className="w-[348px] h-[348px] object-cover rounded-lg shadow-sm"
                    onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                  />
                </div>
              )}
            </div>

            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-2">Complete Preview</h4>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-inner">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">{title || "No title yet"}</h1>
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: aboutContent1 || "No content yet" }}
                />
                <div
                  className="prose max-w-none text-gray-700 mt-4"
                  dangerouslySetInnerHTML={{ __html: aboutContent2 || "No content yet" }}
                />
                {imagePreview || existingImageUrl ? (
                  <img
                    src={imagePreview || existingImageUrl}
                    alt="Company Preview"
                    className="w-[348px] h-[348px] mt-6 object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-[348px] h-[348px] bg-gray-100 mt-6 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                    <span className="text-gray-500 font-medium">Image Placeholder (348px × 348px)</span>
                  </div>
                )}
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
              aria-label={isEditing ? "Update about company" : "Save about company"}
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

export default HomepageAboutCompany;