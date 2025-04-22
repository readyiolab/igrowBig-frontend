import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import toast, { Toaster } from "react-hot-toast";

export default function ProductPage() {
  const { tenantId: paramTenantId } = useParams();
  const navigate = useNavigate();
  const { data, loading: isLoading, error, getAll, post, put } = useTenantApi();

  const [tenantId, setTenantId] = useState(null);
  const [bannerText, setBannerText] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [aboutDescription, setAboutDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [activeSection, setActiveSection] = useState("banner");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    if (storedTenantId && tenantId !== storedTenantId) {
      setTenantId(storedTenantId);
    } else if (!storedTenantId) {
      toast.error("No tenant ID found. Please log in.");
      navigate("/backoffice-login");
    }
  }, [navigate, tenantId]);

  useEffect(() => {
    if (tenantId) {
      fetchProductPage();
    }
  }, [tenantId, retryCount]);

  const fetchProductPage = async () => {
    try {
      const response = await toast.promise(
        getAll(`/tenants/${tenantId}/product-page`),
        {
          loading: "Fetching product page...",
          success: "Product page loaded!",
          error: "Failed to load product page.",
        }
      );
      if (response) {
        setBannerText(response.banner_content || "Welcome to Our Products");
        setBannerImage(response.banner_image_url || null);
        setAboutDescription(response.about_description || "Discover our amazing products.");
        setYoutubeLink(response.video_section_link || "");
      } else {
        // Initialize with defaults if no data exists
        setBannerText("Welcome to Our Products");
        setBannerImage(null);
        setAboutDescription("Discover our amazing products.");
        setYoutubeLink("");
      }
    } catch (err) {
      console.error("Error fetching product page:", err.response?.data || err.message);
      if (retryCount < 3) {
        toast.error(`Failed to load product page. Retrying... (${retryCount + 1}/3)`);
        setTimeout(() => setRetryCount(retryCount + 1), 2000);
      } else {
        toast.error("Unable to load product page. Please try again later.");
      }
    }
  };

  const validateFile = (file, type, maxSize) => {
    if (!file) return true; // Files are optional
    if (file.size > maxSize) {
      toast.error(`${type.charAt(0).toUpperCase() + type.slice(1)} size exceeds ${maxSize / 1024 / 1024}MB limit.`);
      return false;
    }
    if (type === "image" && !["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      toast.error("Please upload a JPEG, JPG, or PNG image.");
      return false;
    }
    if (type === "video" && file.type !== "video/mp4") {
      toast.error("Please upload an MP4 video.");
      return false;
    }
    return true;
  };

  const validateYouTubeLink = (link) => {
    if (!link) return true; // YouTube link is optional
    const youtubeRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[\w-]+(\?[\w=&-]*)?$/;
    if (!youtubeRegex.test(link)) {
      toast.error("Please provide a valid YouTube embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID).");
      return false;
    }
    return true;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file, "image", MAX_IMAGE_SIZE)) {
      setBannerImage(URL.createObjectURL(file));
      setBannerImageFile(file);
      toast.success("Banner image selected successfully!");
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file, "video", MAX_VIDEO_SIZE)) {
      setVideoFile(file); // Store file object, not URL
      setYoutubeLink("");
      toast.success("Video selected successfully!");
    }
  };

  const handleRemoveFile = (type) => {
    if (type === "image") {
      setBannerImageFile(null);
      setBannerImage(null);
      toast.success("Banner image removed.");
    } else if (type === "video") {
      setVideoFile(null);
      toast.success("Video removed.");
    }
  };

  const handleYoutubeLinkChange = (e) => {
    const link = e.target.value;
    setYoutubeLink(link);
    setVideoFile(null);
  };

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.");
      navigate("/backoffice-login");
      return;
    }

    if (!bannerText.trim()) {
      toast.error("Banner text is required.");
      return;
    }
    if (!aboutDescription.trim()) {
      toast.error("About description is required.");
      return;
    }
    if (!validateYouTubeLink(youtubeLink)) {
      return;
    }
    if (!validateFile(bannerImageFile, "image", MAX_IMAGE_SIZE) || !validateFile(videoFile, "video", MAX_VIDEO_SIZE)) {
      return;
    }

    const formData = new FormData();
    formData.append("banner_content", bannerText);
    if (bannerImageFile) formData.append("banner_image", bannerImageFile);
    formData.append("about_description", aboutDescription);
    if (videoFile) formData.append("video", videoFile);
    formData.append("video_section_link", youtubeLink);

    const config = {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        toast.loading(`Uploading... ${percentCompleted}%`, { id: "upload-progress" });
      },
    };

    setIsSubmitting(true);
    try {
      const existingPage = await getAll(`/tenants/${tenantId}/product-page`);
      await toast.promise(
        existingPage && existingPage.id
          ? put(`/tenants/${tenantId}/product-page`, formData, true, config)
          : post(`/tenants/${tenantId}/product-page`, formData, true, config),
        {
          loading: existingPage && existingPage.id ? "Updating product page..." : "Creating product page...",
          success: existingPage && existingPage.id ? "Product page updated successfully!" : "Product page created successfully!",
          error: (err) => `Failed to save: ${err.response?.data?.message || err.message}`,
        }
      );
      await fetchProductPage();
      setBannerImageFile(null);
      setVideoFile(null);
    } catch (err) {
      console.error("Error saving product page:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/backoffice-login");
      }
    } finally {
      setIsSubmitting(false);
      toast.dismiss("upload-progress");
    }
  };

  const handleCancel = () => {
    fetchProductPage();
    setBannerImageFile(null);
    setVideoFile(null);
  };

  const handleRetry = () => {
    setRetryCount(0);
    fetchProductPage();
  };

  const navItems = [
    { id: "banner", label: "Page Banner" },
    { id: "about", label: "About Products" },
    { id: "video", label: "Video Section" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "banner":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800 uppercase">Product Page Banner</h1>

            {bannerImage ? (
              <div className="relative">
                <img
                  src={bannerImage}
                  alt="Banner Preview"
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/1349x420?text=No+Image")}
                />
                {(bannerImageFile || (bannerImage && !bannerImageFile)) && (
                  <button
                    onClick={() => handleRemoveFile("image")}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
                    aria-label="Remove banner image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-lg shadow-md">
                <span className="text-gray-500 text-sm font-medium">No Image Uploaded</span>
              </div>
            )}

            <div>
              <label htmlFor="banner_image" className="block text-sm font-medium text-gray-700 mb-1">
                Banner Image (1349px × 420px, JPEG/JPG/PNG, Max 4MB)
              </label>
              <input
                id="banner_image"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageUpload}
                disabled={isSubmitting}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-800 file:text-white hover:file:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Banner image"
              />
            </div>

            <div>
              <label htmlFor="banner_text" className="block text-sm font-medium text-gray-700 mb-1">
                Banner Text <span className="text-red-500">*</span>
              </label>
              <input
                id="banner_text"
                type="text"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter banner text"
                aria-label="Banner text"
              />
            </div>
          </div>
        );
      case "about":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800">About Products</h1>
            <div>
              <label htmlFor="about_description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="about_description"
                value={aboutDescription}
                onChange={(e) => setAboutDescription(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows="5"
                placeholder="Enter about products description..."
                aria-label="About products description"
              />
            </div>
          </div>
        );
      case "video":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800">Video Section</h1>

            <div>
              <label htmlFor="video_file" className="block text-sm font-medium text-gray-700 mb-1">
                Product Video Clip (MP4, Max 50MB)
              </label>
              <input
                id="video_file"
                type="file"
                accept="video/mp4"
                onChange={handleVideoUpload}
                disabled={isSubmitting}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-800 file:text-white hover:file:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Product video"
              />
              {videoFile && (
                <div className="relative mt-3">
                  <video
                    src={URL.createObjectURL(videoFile)}
                    controls
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/640x360?text=No+Video")}
                  />
                  <button
                    onClick={() => handleRemoveFile("video")}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
                    aria-label="Remove video"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <div className="text-center text-gray-600 text-sm font-medium">OR</div>

            <div>
              <label htmlFor="youtube_link" className="block text-sm font-medium text-gray-700 mb-1">
                YouTube Embedded Link
              </label>
              <input
                id="youtube_link"
                type="text"
                value={youtubeLink}
                onChange={handleYoutubeLinkChange}
                disabled={isSubmitting}
                placeholder="e.g., https://www.youtube.com/embed/VIDEO_ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                aria-label="YouTube embedded link"
              />
              {youtubeLink && (
                <iframe
                  src={youtubeLink}
                  title="YouTube Video Preview"
                  className="w-full h-48 rounded-lg shadow-md mt-3"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
              <p className="text-xs text-gray-500 mt-2">
                <strong>How to get YouTube link:</strong> Go to your video on YouTube, click
                "Share," then "Embed," and copy the iframe src URL (e.g.,
                https://www.youtube.com/embed/VIDEO_ID).
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <aside className="w-56 bg-white shadow-lg p-4 rounded-2xl">
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium ${
                activeSection === item.id
                  ? "bg-gradient-to-r from-gray-800 to-black text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
              }`}
              aria-label={`Navigate to ${item.label} section`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900"></div>
              <span className="text-gray-500 text-lg ml-3 animate-pulse">Loading...</span>
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
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load Product Page</h3>
              <p className="text-gray-500 mb-6">
                {error.message || "An error occurred while loading the product page. Please try again."}
              </p>
              <button
                onClick={handleRetry}
                className="border border-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                aria-label="Retry loading product page"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {renderContent()}
              <div className="mt-6 flex space-x-3 justify-end">
                <button
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="px-5 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Cancel changes"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSubmitting || !tenantId}
                  className="px-5 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 text-sm font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Save product page"
                >
                  {isSubmitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                  )}
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}