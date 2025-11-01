import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { RichTextEditor, PreviewSection } from "@/components/common";
import {
  fetchProductPage,
  updateProductPage,
  createProductPage,
  selectProductPageData,
  selectProductPageLoading,
  selectProductPageError,
} from "@/store/slices/productPageSlice";
import {
  setSubmitting,
  incrementRetry,
  resetRetry,
  selectRetryCount,
  selectIsSubmitting,
} from "@/store/slices/uiSlice";

export default function ProductPage() {
  const { tenantId: paramTenantId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const data = useSelector(selectProductPageData);
  const loading = useSelector(selectProductPageLoading);
  const error = useSelector(selectProductPageError);
  const retryCount = useSelector(selectRetryCount);
  const isSubmitting = useSelector(selectIsSubmitting);

  const [tenantId, setTenantId] = useState(null);
  // Banner Section States
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerContent, setBannerContent] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  
  // About Section States
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutContent, setAboutContent] = useState("");
  const [aboutImage, setAboutImage] = useState(null);
  const [aboutImageFile, setAboutImageFile] = useState(null);
  
  // Video Section States
  const [videoTitle, setVideoTitle] = useState("");
  const [videoContent, setVideoContent] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState("");
  
  const [activeSection, setActiveSection] = useState("banner");

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
      dispatch(fetchProductPage(tenantId));
    }
  }, [tenantId, dispatch]);

  useEffect(() => {
    if (data) {
      // Banner Section
      setBannerTitle(data.banner_section_title || "Welcome to Our Products");
      setBannerContent(data.banner_section_content || "Discover amazing products that transform your life");
      setBannerImage(data.banner_section_image_url || null);
      
      // About Section
      setAboutTitle(data.about_section_title || "About Our Products");
      setAboutContent(data.about_section_content || "Discover our amazing products and their benefits");
      setAboutImage(data.about_section_image_url || null);
      
      // Video Section
      setVideoTitle(data.video_section_title || "Watch NHT Global Product Video");
      setVideoContent(data.video_section_content || "Learn more about our products through this video");
      setYoutubeLink(data.video_section_youtube_url || "");
    } else {
      // Initialize with defaults if no data exists
      setBannerTitle("Welcome to Our Products");
      setBannerContent("Discover amazing products that transform your life");
      setBannerImage(null);
      
      setAboutTitle("About Our Products");
      setAboutContent("Discover our amazing products and their benefits");
      setAboutImage(null);
      
      setVideoTitle("Watch NHT Global Product Video");
      setVideoContent("Learn more about our products through this video");
      setYoutubeLink("");
    }
  }, [data]);

  const validateFile = (file, type, maxSize) => {
    if (!file) return true;
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
    if (!link) return true;
    const youtubeRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[\w-]+(\?[\w=&-]*)?$/;
    if (!youtubeRegex.test(link)) {
      toast.error("Please provide a valid YouTube embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID).");
      return false;
    }
    return true;
  };

  const handleBannerImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file, "image", MAX_IMAGE_SIZE)) {
      setBannerImage(URL.createObjectURL(file));
      setBannerImageFile(file);
      toast.success("Banner image selected successfully!");
    }
  };

  const handleAboutImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file, "image", MAX_IMAGE_SIZE)) {
      setAboutImage(URL.createObjectURL(file));
      setAboutImageFile(file);
      toast.success("About image selected successfully!");
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file, "video", MAX_VIDEO_SIZE)) {
      setVideoFile(file);
      setYoutubeLink("");
      toast.success("Video selected successfully!");
    }
  };

  const handleRemoveFile = (type) => {
    if (type === "banner_image") {
      setBannerImageFile(null);
      setBannerImage(data?.banner_section_image_url || null);
      toast.success("Banner image removed.");
    } else if (type === "about_image") {
      setAboutImageFile(null);
      setAboutImage(data?.about_section_image_url || null);
      toast.success("About image removed.");
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

    // Validation
    if (!bannerTitle.trim()) {
      toast.error("Banner title is required.");
      return;
    }
    if (!bannerContent.trim()) {
      toast.error("Banner content is required.");
      return;
    }
    if (!aboutTitle.trim()) {
      toast.error("About title is required.");
      return;
    }
    if (!aboutContent.trim()) {
      toast.error("About content is required.");
      return;
    }
    if (!videoTitle.trim()) {
      toast.error("Video section title is required.");
      return;
    }
    if (!videoContent.trim()) {
      toast.error("Video section content is required.");
      return;
    }
    if (!validateYouTubeLink(youtubeLink)) {
      return;
    }
    if (!validateFile(bannerImageFile, "image", MAX_IMAGE_SIZE) || 
        !validateFile(aboutImageFile, "image", MAX_IMAGE_SIZE) || 
        !validateFile(videoFile, "video", MAX_VIDEO_SIZE)) {
      return;
    }

    const formData = new FormData();
    
    // Banner Section
    formData.append("banner_section_title", bannerTitle);
    formData.append("banner_section_content", bannerContent);
    if (bannerImageFile) formData.append("banner_section_image", bannerImageFile);
    
    // About Section
    formData.append("about_section_title", aboutTitle);
    formData.append("about_section_content", aboutContent);
    if (aboutImageFile) formData.append("about_section_image", aboutImageFile);
    
    // Video Section
    formData.append("video_section_title", videoTitle);
    formData.append("video_section_content", videoContent);
    if (videoFile) formData.append("video_section_file", videoFile);
    formData.append("video_section_youtube_url", youtubeLink);

    const config = {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        toast.loading(`Uploading... ${percentCompleted}%`, { id: "upload-progress" });
      },
    };

    dispatch(setSubmitting(true));
    try {
      const existingPage = data;
      const promise = existingPage && existingPage.id
        ? dispatch(updateProductPage({ tenantId, formData })).unwrap()
        : dispatch(createProductPage({ tenantId, formData })).unwrap();

      await toast.promise(promise, {
        loading: existingPage && existingPage.id ? "Updating product page..." : "Creating product page...",
        success: existingPage && existingPage.id ? "Product page updated successfully!" : "Product page created successfully!",
        error: (err) => `Failed to save: ${err.message || "Unknown error"}`,
      });
      dispatch(fetchProductPage(tenantId));
      setBannerImageFile(null);
      setAboutImageFile(null);
      setVideoFile(null);
    } catch (err) {
      console.error("Error saving product page:", err);
      if (err.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/backoffice-login");
      }
    } finally {
      dispatch(setSubmitting(false));
      toast.dismiss("upload-progress");
    }
  };

  const handleCancel = () => {
    dispatch(fetchProductPage(tenantId));
    setBannerImageFile(null);
    setAboutImageFile(null);
    setVideoFile(null);
  };

  const handleRetry = () => {
    dispatch(resetRetry());
    dispatch(fetchProductPage(tenantId));
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

            <div>
              <label htmlFor="banner_image" className="block text-sm font-medium text-gray-700 mb-2">
                Banner Image (1349px × 420px, JPEG/JPG/PNG, Max 4MB)
              </label>
              <input
                id="banner_image"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleBannerImageUpload}
                disabled={isSubmitting}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-800 file:text-white hover:file:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Banner image"
              />
            </div>

            <div>
              <label htmlFor="banner_title" className="block text-sm font-medium text-gray-700 mb-2">
                Banner Title <span className="text-red-500">*</span>
              </label>
              <input
                id="banner_title"
                type="text"
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter banner title"
                aria-label="Banner title"
              />
            </div>

            <div>
              <label htmlFor="banner_content" className="block text-sm font-medium text-gray-700 mb-2">
                Banner Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="banner_content"
                value={bannerContent}
                onChange={(e) => setBannerContent(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows="4"
                placeholder="Enter banner content"
                aria-label="Banner content"
              />
            </div>

            {/* Preview Section */}
            <PreviewSection title={bannerTitle} content={bannerContent}>
              {bannerImage ? (
                <div className="relative">
                  <img
                    src={bannerImage}
                    alt="Banner Preview"
                    className="w-full max-w-[1349px] h-[420px] object-cover rounded-lg shadow-md"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/1349x420?text=No+Image")}
                  />
                  {bannerImageFile && (
                    <button
                      onClick={() => handleRemoveFile("banner_image")}
                      disabled={isSubmitting}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 shadow-lg"
                      aria-label="Remove banner image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ) : (
                <div className="w-full max-w-[1349px] h-[420px] bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg">
                  <span className="text-gray-500 text-sm font-medium">Banner Image Placeholder (1349x420)</span>
                </div>
              )}
            </PreviewSection>
          </div>
        );
      case "about":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800">About Products</h1>

            <div>
              <label htmlFor="about_image" className="block text-sm font-medium text-gray-700 mb-2">
                About Image (JPEG/JPG/PNG, Max 4MB)
              </label>
              <input
                id="about_image"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleAboutImageUpload}
                disabled={isSubmitting}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-800 file:text-white hover:file:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="About image"
              />
            </div>

            <div>
              <label htmlFor="about_title" className="block text-sm font-medium text-gray-700 mb-2">
                About Title <span className="text-red-500">*</span>
              </label>
              <input
                id="about_title"
                type="text"
                value={aboutTitle}
                onChange={(e) => setAboutTitle(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter about title"
                aria-label="About title"
              />
            </div>

            <RichTextEditor
              id="about_content"
              label="About Content"
              value={aboutContent}
              onChange={setAboutContent}
              placeholder="Enter about products description..."
              required={true}
              disabled={isSubmitting}
            />

            {/* Preview Section */}
            <PreviewSection title={aboutTitle} content={aboutContent}>
              {aboutImage ? (
                <div className="relative">
                  <img
                    src={aboutImage}
                    alt="About Preview"
                    className="w-full max-w-[800px] object-cover rounded-lg shadow-md"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/800x600?text=No+Image")}
                  />
                  {aboutImageFile && (
                    <button
                      onClick={() => handleRemoveFile("about_image")}
                      disabled={isSubmitting}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 shadow-lg"
                      aria-label="Remove about image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ) : (
                <div className="w-full max-w-[800px] h-[400px] bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg">
                  <span className="text-gray-500 text-sm font-medium">About Image Placeholder</span>
                </div>
              )}
            </PreviewSection>
          </div>
        );
      case "video":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800">Video Section</h1>

            <div>
              <label htmlFor="video_title" className="block text-sm font-medium text-gray-700 mb-2">
                Video Section Title <span className="text-red-500">*</span>
              </label>
              <input
                id="video_title"
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter video section title"
                aria-label="Video section title"
              />
            </div>

            <RichTextEditor
              id="video_content"
              label="Video Section Content"
              value={videoContent}
              onChange={setVideoContent}
              placeholder="Enter video section content"
              required={true}
              disabled={isSubmitting}
            />

            <div>
              <label htmlFor="video_file" className="block text-sm font-medium text-gray-700 mb-2">
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
            </div>

            <div className="text-center text-gray-600 text-sm font-medium">OR</div>

            <div>
              <label htmlFor="youtube_link" className="block text-sm font-medium text-gray-700 mb-2">
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
              <p className="text-xs text-gray-500 mt-2">
                <strong>How to get YouTube link:</strong> Go to your video on YouTube, click
                "Share," then "Embed," and copy the iframe src URL.
              </p>
            </div>

            {/* Preview Section */}
            <PreviewSection title={videoTitle} content={videoContent}>
              {videoFile ? (
                <div className="relative">
                  <video
                    src={URL.createObjectURL(videoFile)}
                    controls
                    className="w-full max-w-[800px] rounded-lg shadow-md"
                  />
                  <button
                    onClick={() => handleRemoveFile("video")}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 shadow-lg"
                    aria-label="Remove video"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : youtubeLink ? (
                <iframe
                  src={youtubeLink}
                  title="YouTube Video Preview"
                  className="w-full max-w-[800px] h-[450px] rounded-lg shadow-md"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full max-w-[800px] h-[450px] bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg">
                  <span className="text-gray-500 text-sm font-medium">Video Placeholder</span>
                </div>
              )}
            </PreviewSection>
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
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          {loading ? (
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
              <div className="mt-8 flex space-x-3 justify-end border-t pt-6">
                <button
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Cancel changes"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSubmitting || !tenantId}
                  className="px-6 py-2.5 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 text-sm font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Save product page"
                >
                  {isSubmitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                  )}
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}