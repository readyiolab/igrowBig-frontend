
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, X } from "react-feather";
import { useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import ToastNotification, { showSuccessToast, showErrorToast } from "../../ToastNotification";

// BlogEditor Component
const BlogEditor = () => {
  const navigate = useNavigate();
  const { data, loading: isLoading, error, getAll, post, put, del } = useTenantApi();

  const [tenantId, setTenantId] = useState(null);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [editBlogId, setEditBlogId] = useState(null);
  const [editBannerId, setEditBannerId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);

  const [newBlog, setNewBlog] = useState({ title: "", content: "", image: null, is_visible: true });
  const [newBanner, setNewBanner] = useState({ image: null, image_content: "", currentImage: null });

  const MAX_RETRIES = 3;
  const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

  // Authentication and tenant setup
  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    const token = localStorage.getItem("token");
    if (!token || !storedTenantId) {
      showErrorToast("Please log in to continue.");
      navigate("/backoffice-login");
    } else {
      setTenantId(storedTenantId);
    }
  }, [navigate]);

  // Fetch blogs
  useEffect(() => {
    if (tenantId) {
      fetchBlogs();
    }
  }, [tenantId, retryCount]);

  const fetchBlogs = async () => {
    try {
      const response = await getAll(`/tenants/${tenantId}/blogs`);
      if (response && Array.isArray(response)) {
        setBlogs(
          response.map((blog) => ({
            id: blog.id,
            title: blog.title,
            content: blog.content,
            image_url: blog.image_url || null,
            is_visible: blog.is_visible,
            created_at: blog.created_at.split("T")[0],
            banners: blog.banners || [],
          }))
        );
        showSuccessToast("Blogs loaded successfully!");
        setRetryCount(0); // Reset retry count on success
      } else {
        setBlogs([]);
        showErrorToast("No blogs found.");
      }
    } catch (err) {
      console.error("Error fetching blogs:", err.response?.data || err.message);
      if (retryCount < MAX_RETRIES) {
        // Silently retry without toast
        setTimeout(() => setRetryCount(retryCount + 1), 2000);
      } else {
        showErrorToast("Unable to load blogs. Please try again later.");
        setBlogs([]);
      }
    }
  };

  // Blog Handlers
  const handleAddNewBlog = () => {
    setShowBlogForm(true);
    setIsEditingBlog(false);
    setNewBlog({ title: "", content: "", image: null, is_visible: true });
  };

  const handleEditBlog = (blog) => {
    setShowBlogForm(true);
    setIsEditingBlog(true);
    setEditBlogId(blog.id);
    setNewBlog({ title: blog.title, content: blog.content, image: null, is_visible: blog.is_visible });
  };

  // Banner Handlers
  const handleAddNewBanner = (blogId = null) => {
    if (blogs.length === 0) {
      showErrorToast("Please create a blog first to add a banner.");
      return;
    }
    setShowBannerForm(true);
    setIsEditingBanner(false);
    setEditBlogId(blogId || blogs[0].id); // Default to first blog if no specific blogId
    setNewBanner({ image: null, image_content: "", currentImage: null });
  };

  const handleEditBanner = (banner, blogId) => {
    setShowBannerForm(true);
    setIsEditingBanner(true);
    setEditBannerId(banner.id);
    setEditBlogId(blogId);
    setNewBanner({ image: null, image_content: banner.image_content, currentImage: banner.image_url });
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        showErrorToast("Image must be less than 4MB.");
        return;
      }
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        showErrorToast("Only JPEG/JPG/PNG images are allowed.");
        return;
      }
      if (type === "blog") {
        setNewBlog({ ...newBlog, image: file });
      } else {
        setNewBanner({ ...newBanner, image: file });
      }
      showSuccessToast("Image selected successfully!");
    }
  };

  const handleSaveBlog = async () => {
    if (!tenantId) {
      showErrorToast("Tenant ID not found.");
      return;
    }
    if (!newBlog.title.trim()) {
      showErrorToast("Blog title is required.");
      return;
    }
    if (!newBlog.content.trim()) {
      showErrorToast("Blog content is required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newBlog.title);
    formData.append("content", newBlog.content);
    if (newBlog.image) formData.append("image", newBlog.image);
    formData.append("is_visible", newBlog.is_visible);

    setIsSubmitting(true);
    try {
      await (isEditingBlog
        ? put(`/tenants/${tenantId}/blogs/${editBlogId}`, formData, true)
        : post(`/tenants/${tenantId}/blogs`, formData, true));
      showSuccessToast("Blog saved successfully!");
      await fetchBlogs();
      handleCancel();
    } catch (err) {
      console.error("Error saving blog:", err.response?.data || err.message);
      showErrorToast(`Failed to save blog: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveBanner = async () => {
    if (!tenantId || !editBlogId) {
      showErrorToast("Invalid blog or tenant ID.");
      return;
    }
    if (!isEditingBanner && !newBanner.image) {
      showErrorToast("Image is required for a new banner.");
      return;
    }

    const formData = new FormData();
    if (newBanner.image) formData.append("image", newBanner.image);
    formData.append("image_content", newBanner.image_content);

    setIsSubmitting(true);
    try {
      await (isEditingBanner
        ? put(`/tenants/${tenantId}/blogs/${editBlogId}/banners/${editBannerId}`, formData, true)
        : post(`/tenants/${tenantId}/blogs/${editBlogId}/banners`, formData, true));
      showSuccessToast("Banner saved successfully!");
      await fetchBlogs();
      handleCancel();
    } catch (err) {
      console.error("Error saving banner:", err.response?.data || err.message);
      showErrorToast(`Failed to save banner: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shared Handlers
  const handleCancel = () => {
    setShowBlogForm(false);
    setShowBannerForm(false);
    setIsEditingBlog(false);
    setIsEditingBanner(false);
    setEditBlogId(null);
    setEditBannerId(null);
    setShowComments(false);
    setSelectedBlogId(null);
    setNewBlog({ title: "", content: "", image: null, is_visible: true });
    setNewBanner({ image: null, image_content: "", currentImage: null });
    setIsSubmitting(false);
    setNewComment("");
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm("Are you sure you want to delete this blog and its banners?")) return;
    setIsSubmitting(true);
    try {
      await del(`/tenants/${tenantId}/blogs/${id}`);
      showSuccessToast("Blog deleted successfully!");
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (err) {
      console.error("Error deleting blog:", err.response?.data || err.message);
      showErrorToast(`Failed to delete blog: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBanner = async (blogId, bannerId) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    setIsSubmitting(true);
    try {
      await del(`/tenants/${tenantId}/blogs/${blogId}/banners/${bannerId}`);
      showSuccessToast("Banner deleted successfully!");
      await fetchBlogs();
    } catch (err) {
      console.error("Error deleting banner:", err.response?.data || err.message);
      showErrorToast(`Failed to delete banner: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Comment Handlers
  const handleShowComments = (blogId) => {
    setSelectedBlogId(blogId);
    setShowComments(true);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      showErrorToast("Comment cannot be empty.");
      return;
    }
    const newCommentObj = {
      id: comments.length + 1,
      blogId: selectedBlogId,
      content: newComment,
      is_approved: false,
    };
    setComments([...comments, newCommentObj]);
    setNewComment("");
    showSuccessToast("Comment added (pending approval).");
  };

  const handleApproveComment = (commentId) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, is_approved: true } : comment
      )
    );
    showSuccessToast("Comment approved!");
  };

  const handleDeleteComment = (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    setComments(comments.filter((comment) => comment.id !== commentId));
    showSuccessToast("Comment deleted!");
  };

  const handleRetry = () => {
    setRetryCount(0);
    fetchBlogs();
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <ToastNotification />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        {!showBlogForm && !showBannerForm && !showComments && (
          <div className="flex gap-4">
            <button
              onClick={handleAddNewBlog}
              className="bg-black text-white px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg"
              disabled={isSubmitting}
            >
              <Plus size={18} /> Add Blog
            </button>
            <button
              onClick={() => handleAddNewBanner()}
              className="bg-black text-white px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg"
              disabled={isSubmitting}
            >
              <Plus size={18} /> Add Banner
            </button>
          </div>
        )}
        {!showBlogForm && !showBannerForm && !showComments && (
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition-all duration-200 shadow-sm hover:shadow-md"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto"></div>
          <span className="text-gray-600 text-lg mt-4 block animate-pulse">Loading blogs...</span>
        </div>
      )}

      {/* Error State */}
      {error && retryCount >= MAX_RETRIES && !isLoading && (
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
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load Blogs</h3>
          <p className="text-gray-500 mb-6">
            {error.message || "An error occurred while loading blogs. You can start adding a blog or try again."}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleAddNewBlog}
              className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
              aria-label="Add new blog"
            >
              Add Blog
            </button>
            <button
              onClick={handleRetry}
              className="border border-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
              aria-label="Retry loading blogs"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Blog List */}
      {!isLoading && !error && !showBlogForm && !showBannerForm && !showComments && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Blog List</h2>
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-2xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-800 to-black text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Content</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-6 text-center text-gray-500">
                      No blogs found. Click "Add Blog" to create one!
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((blog, index) => (
                    <tr key={blog.id} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{blog.title}</td>
                      <td className="px-6 py-4">
                        {blog.image_url ? (
                          <img
                            src={blog.image_url}
                            alt={blog.title}
                            className="w-24 h-14 object-cover rounded-md shadow-sm"
                            onError={(e) => (e.target.src = "https://via.placeholder.com/150?text=No+Image")}
                          />
                        ) : (
                          <span className="text-gray-500">No Image</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">{blog.content.substring(0, 50)}...</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            blog.is_visible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {blog.is_visible ? "Visible" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">{blog.created_at}</td>
                      <td className="px-6 py-4 flex items-center gap-4">
                        <button
                          onClick={() => handleEditBlog(blog)}
                          className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-all duration-200"
                          title="Edit Blog"
                          disabled={isSubmitting}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="text-red-600 hover:text-red-800 hover:scale-110 transition-all duration-200"
                          title="Delete Blog"
                          disabled={isSubmitting}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Blog Banners */}
      {!isLoading && !error && !showBlogForm && !showBannerForm && !showComments && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Blog Banners</h2>
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-2xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-800 to-black text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Blog Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Content</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBlogs.flatMap((blog) =>
                  blog.banners.map((banner, index) => (
                    <tr key={banner.id} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{blog.title}</td>
                      <td className="px-6 py-4">
                        <img
                          src={banner.image_url}
                          alt="Banner"
                          className="w-24 h-14 object-cover rounded-md shadow-sm"
                          onError={(e) => (e.target.src = "https://via.placeholder.com/150?text=No+Image")}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">{banner.image_content.substring(0, 50)}...</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{banner.created_at.split("T")[0]}</td>
                      <td className="px-6 py-4 flex items-center gap-4">
                        <button
                          onClick={() => handleEditBanner(banner, blog.id)}
                          className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-all duration-200"
                          title="Edit Banner"
                          disabled={isSubmitting}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(blog.id, banner.id)}
                          className="text-red-600 hover:text-red-800 hover:scale-110 transition-all duration-200"
                          title="Delete Banner"
                          disabled={isSubmitting}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
                {filteredBlogs.every((blog) => blog.banners.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-6 text-center text-gray-500">
                      No banners found. Click "Add Banner" above to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Blog Form */}
      {showBlogForm && (
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 transition-all duration-300 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {isEditingBlog ? "Edit Blog" : "Create New Blog"}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 hover:scale-105 transition-all duration-200"
              disabled={isSubmitting}
            >
              <X size={24} />
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newBlog.title}
                onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition-all duration-200 disabled:opacity-50 shadow-sm"
                placeholder="Enter blog title"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blog Image (Max 4MB)</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={(e) => handleImageUpload(e, "blog")}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition-all duration-200 disabled:opacity-50"
                disabled={isSubmitting}
              />
              {newBlog.image && (
                <div className="mt-3 relative">
                  <img
                    src={URL.createObjectURL(newBlog.image)}
                    alt="Preview"
                    className="w-40 h-24 object-cover rounded-md shadow-sm"
                  />
                  <button
                    onClick={() => setNewBlog({ ...newBlog, image: null })}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {isEditingBlog && !newBlog.image && blogs.find((b) => b.id === editBlogId)?.image_url && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                  <img
                    src={blogs.find((b) => b.id === editBlogId).image_url}
                    alt="Current"
                    className="w-40 h-24 object-cover rounded-md shadow-sm"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/150?text=No+Image")}
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={newBlog.content}
                onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition-all duration-200 h-40 resize-y disabled:opacity-50 shadow-sm"
                placeholder="Enter blog content"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={newBlog.is_visible ? "Visible" : "Hidden"}
                onChange={(e) => setNewBlog({ ...newBlog, is_visible: e.target.value === "Visible" })}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition-all duration-200 disabled:opacity-50 shadow-sm"
                disabled={isSubmitting}
              >
                <option value="Visible">Visible</option>
                <option value="Hidden">Hidden</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 text-sm font-medium shadow-sm disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveBlog}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full hover:from-blue-700 hover:to-blue-900 hover:scale-105 transition-all duration-200 text-sm font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
              )}
              {isSubmitting ? "Saving..." : isEditingBlog ? "Update Blog" : "Save Blog"}
            </button>
          </div>
        </div>
      )}

      {/* Banner Form */}
      {showBannerForm && (
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 transition-all duration-300 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {isEditingBanner ? "Edit Banner" : "Create New Banner"}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 hover:scale-105 transition-all duration-200"
              disabled={isSubmitting}
            >
              <X size={24} />
            </button>
          </div>
          <div className="space-y-6">
            {isEditingBanner && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Selected Blog</label>
                <input
                  type="text"
                  value={blogs.find((b) => b.id === editBlogId)?.title || ""}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm bg-gray-100 disabled:opacity-50 shadow-sm"
                  disabled
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image (Max 4MB) {isEditingBanner ? "" : <span className="text-red-500">*</span>}
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={(e) => handleImageUpload(e, "banner")}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200 transition-all duration-200 disabled:opacity-50"
                disabled={isSubmitting}
              />
              {newBanner.image && (
                <div className="mt-3 relative">
                  <img
                    src={URL.createObjectURL(newBanner.image)}
                    alt="Preview"
                    className="w-40 h-24 object-cover rounded-md shadow-sm"
                  />
                  <button
                    onClick={() => setNewBanner({ ...newBanner, image: null })}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {isEditingBanner && newBanner.currentImage && !newBanner.image && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                  <img
                    src={newBanner.currentImage}
                    alt="Current"
                    className="w-40 h-24 object-cover rounded-md shadow-sm"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/150?text=No+Image")}
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Content</label>
              <textarea
                value={newBanner.image_content}
                onChange={(e) => setNewBanner({ ...newBanner, image_content: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm transition-all duration-200 h-32 resize-y disabled:opacity-50 shadow-sm"
                placeholder="Enter banner content"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 text-sm font-medium shadow-sm disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveBanner}
              className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-full hover:from-teal-700 hover:to-teal-900 hover:scale-105 transition-all duration-200 text-sm font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
              )}
              {isSubmitting ? "Saving..." : isEditingBanner ? "Update Banner" : "Save Banner"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogEditor;
