import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast, { Toaster } from "react-hot-toast";

// Redux imports
import {
  fetchHomePage,
  updateHomePage,
  selectHomePageData,
  selectHomePageLoading,
  selectHomePageError,
} from "@/store/slices/homePageSlice";

import {
  setSubmitting,
  selectIsSubmitting,
} from "@/store/slices/uiSlice";

import { selectTenantId } from "@/store/slices/authSlice";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const MAX_RETRIES = 3;

const HomepageAboutCompany = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const homePageData = useSelector(selectHomePageData);
  const loading = useSelector(selectHomePageLoading);
  const error = useSelector(selectHomePageError);
  const tenantId = useSelector(selectTenantId);
  const isSubmitting = useSelector(selectIsSubmitting);

  // Local form state
  const [formData, setFormData] = useState({
    title: "",
    aboutContent1: "",
    aboutContent2: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Sync initial data from Redux to local state
  useEffect(() => {
    if (homePageData && Object.keys(homePageData).length > 0) {
      setFormData({
        title: homePageData.about_company_title || "",
        aboutContent1: homePageData.about_company_content_1 || "",
        aboutContent2: homePageData.about_company_content_2 || "",
      });
      setExistingImageUrl(homePageData.about_company_image_url || null);
      setIsEditing(true);
    }
  }, [homePageData]);

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
        toast.success("Data loaded successfully!");
        setRetryCount(0);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        if (retryCount < MAX_RETRIES) {
          setTimeout(() => setRetryCount(retryCount + 1), 2000);
        } else {
          toast.error("Unable to load data. Start adding content.");
          setIsEditing(false);
        }
      });
  }, [tenantId, retryCount, dispatch, navigate]);

  const validateImage = (file) => {
    if (!file) return true;
    if (file.size > MAX_FILE_SIZE) {
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
      toast.info("Image selected!");
    }
  };

  // Local change handlers
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.");
      navigate("/backoffice-login");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Title is required.");
      return;
    }

    if (!formData.aboutContent1.trim()) {
      toast.error("About Content 1 is required.");
      return;
    }

    if (image && !validateImage(image)) {
      return;
    }

    const data = new FormData();
    data.append("about_company_title", formData.title);
    data.append("about_company_content_1", formData.aboutContent1);
    data.append("about_company_content_2", formData.aboutContent2 || "");

    // Only append image if new one uploaded; otherwise, send existing URL to preserve
    if (image) {
      data.append("about_company_image", image);
    } else if (existingImageUrl) {
      data.append("about_company_image_url", existingImageUrl);
    }

    dispatch(setSubmitting(true));

    try {
      await toast.promise(
        dispatch(updateHomePage({ tenantId, formData: data })).unwrap(),
        {
          loading: "Saving...",
          success: "Saved successfully!",
          error: (err) => `Failed: ${err.message || 'Unknown error'}`,
        }
      );
      await dispatch(fetchHomePage(tenantId)); // Refresh data
    } catch (err) {
      console.error("Save error:", err);
      if (err.status === 401) {
        toast.error("Session expired. Logging out...");
        navigate("/backoffice-login");
      }
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const handleReset = () => {
    setFormData({
      title: homePageData.about_company_title || "",
      aboutContent1: homePageData.about_company_content_1 || "",
      aboutContent2: homePageData.about_company_content_2 || "",
    });
    setImage(null);
    setImagePreview(null);
    toast.success("Form reset!");
  };

  const handleStartEditing = () => {
    setFormData({
      title: "About Your Company",
      aboutContent1: "Start writing here...",
      aboutContent2: "",
    });
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
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image", "video", "blockquote", "code-block"],
      ["clean"],
    ],
  };

  const handleImageError = (e) => {
    e.target.src = "/placeholder-image.jpg";
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />

      {loading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block">Loading...</span>
        </div>
      ) : error && retryCount >= MAX_RETRIES ? (
        <div className="p-12 text-center bg-white shadow-lg rounded-xl border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load</h3>
          <p className="text-gray-500 mb-6">{error.message || "Error loading data."}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleStartEditing}
              className="bg-black text-white px-6 py-2 rounded-full hover:scale-105"
            >
              Add Content
            </button>
            <button
              onClick={handleRetry}
              className="border border-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">
            {isEditing ? "Edit" : "Create"} About Company
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-300"
                placeholder="Enter title"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Content 1 <span className="text-red-500">*</span>
              </label>
              <ReactQuill
                value={formData.aboutContent1}
                onChange={(value) => handleFieldChange("aboutContent1", value)}
                modules={quillModules}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
                placeholder="Enter content..."
                readOnly={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Content 2
              </label>
              <ReactQuill
                value={formData.aboutContent2}
                onChange={(value) => handleFieldChange("aboutContent2", value)}
                modules={quillModules}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
                placeholder="Enter optional content..."
                readOnly={isSubmitting}
              />
            </div>

            {/* Image upload and preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image (Max 4MB, 348x348 recommended)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageUpload}
                disabled={isSubmitting}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
              />
              {(imagePreview || existingImageUrl) && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Preview:</p>
                  <img
                    src={imagePreview || existingImageUrl}
                    alt="Preview"
                    className="w-[348px] h-[348px] object-cover rounded-lg shadow-sm"
                    onError={handleImageError}
                  />
                </div>
              )}
            </div>

            {/* Preview Section */}
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-2">Preview</h4>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h1 className="text-2xl font-bold">{formData.title || "No title"}</h1>
                <div
                  dangerouslySetInnerHTML={{ __html: formData.aboutContent1 || "No content" }}
                  className="prose max-w-none text-gray-700"
                />
                <div
                  dangerouslySetInnerHTML={{ __html: formData.aboutContent2 || "" }}
                  className="prose max-w-none text-gray-700 mt-4"
                />
                {(imagePreview || existingImageUrl) ? (
                  <img
                    src={imagePreview || existingImageUrl}
                    alt="Preview"
                    className="w-[348px] h-[348px] mt-4 rounded object-cover"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-[348px] h-[348px] bg-gray-200 border-2 border-dashed rounded mt-4 flex items-center justify-center">
                    <span className="text-gray-500">Image Placeholder</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={handleReset}
              disabled={isSubmitting}
              className="px-6 py-2.5 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-black text-white rounded-full hover:scale-105 flex items-center gap-2"
            >
              {isSubmitting && <div className="animate-spin h-4 w-4 border-t-2 border-white rounded-full"></div>}
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomepageAboutCompany;