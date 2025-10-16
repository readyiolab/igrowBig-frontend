import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Search, X, MessageCircle } from "react-feather";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

// Redux imports for blogs
import {
  fetchBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  createBanner,
  updateBanner,
  deleteBanner,
  setBlogFormData,
  resetBlogForm,
  setBannerFormData,
  resetBannerForm,
  clearError,
  selectBlogs,
  selectBlogForm,
  selectBannerForm,
  selectBlogLoading,
  selectBlogError,
} from "@/store/slices/blogSlice";

// Redux imports for UI
import {
  openForm,
  closeForm,
  setSearchTerm,
  setSubmitting,
  incrementRetry,
  resetRetry,
  selectShowForm,
  selectIsEditing,
  selectEditId,
  selectSearchTerm,
  selectIsSubmitting,
  selectRetryCount,
} from "@/store/slices/uiSlice";

// Redux imports for auth
import { selectTenantId } from "@/store/slices/authSlice";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const MAX_RETRIES = 3;

const BlogEditor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state for blogs
  const blogs = useSelector(selectBlogs);
  const blogForm = useSelector(selectBlogForm);
  const bannerForm = useSelector(selectBannerForm);
  const loading = useSelector(selectBlogLoading);
  const error = useSelector(selectBlogError);

  // Redux state for UI (for blog form)
  const showForm = useSelector(selectShowForm);
  const isEditing = useSelector(selectIsEditing);
  const editId = useSelector(selectEditId);
  const searchTerm = useSelector(selectSearchTerm);
  const isSubmitting = useSelector(selectIsSubmitting);
  const retryCount = useSelector(selectRetryCount);

  // Redux state for auth
  const tenantId = useSelector(selectTenantId);

  // Local state for banner form
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [editBannerId, setEditBannerId] = useState(null);
  const [editBlogId, setEditBlogId] = useState(null);

  // Local state for comments
  const [showComments, setShowComments] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  const editingBlog = blogs.find((blog) => blog.id === editId);

  // Fetch blogs on mount
  useEffect(() => {
    if (!tenantId) {
      const storedTenantId = localStorage.getItem("tenant_id");
      if (!storedTenantId) {
        toast.error("Please log in to continue.");
        navigate("/backoffice-login");
      }
      return;
    }

    dispatch(fetchBlogs(tenantId))
      .unwrap()
      .then(() => {
        toast.success("Blogs loaded successfully!");
        dispatch(resetRetry());
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        if (retryCount < MAX_RETRIES) {
          setTimeout(() => dispatch(incrementRetry()), 2000);
        } else {
          toast.error("Unable to load blogs. Please try again later.");
        }
      });
  }, [tenantId, retryCount, dispatch, navigate]);

  // Debounced search
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearchChange = useCallback(
    debounce((value) => {
      dispatch(setSearchTerm(value));
    }, 300),
    [dispatch]
  );

  // Validate file
  const validateFile = (file) => {
    if (!file) return true;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be less than 4MB.");
      return false;
    }
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      toast.error("Only JPEG/JPG/PNG images are allowed.");
      return false;
    }
    return true;
  };

  // Image upload handler
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (validateFile(file)) {
      if (type === "blog") {
        dispatch(setBlogFormData({ image: file }));
      } else {
        dispatch(setBannerFormData({ image: file }));
      }
      toast.success("Image selected successfully!");
    } else {
      e.target.value = "";
    }
  };

  // Blog Handlers
  const handleAddNewBlog = () => {
    dispatch(openForm({ isEditing: false }));
    dispatch(resetBlogForm());
  };

  const handleEditBlog = (blog) => {
    dispatch(openForm({ isEditing: true, editId: blog.id }));
    dispatch(setBlogFormData({
      title: blog.title || "",
      content: blog.content || "",
      image: null,
      is_visible: blog.is_visible || true,
    }));
  };

  // Banner Handlers
  const handleAddNewBanner = (blogId = null) => {
    if (blogs.length === 0) {
      toast.error("Please create a blog first to add a banner.");
      return;
    }
    setShowBannerForm(true);
    setIsEditingBanner(false);
    setEditBannerId(null);
    setEditBlogId(blogId || blogs[0].id);
    dispatch(resetBannerForm());
  };

  const handleEditBanner = (banner, blogId) => {
    setShowBannerForm(true);
    setIsEditingBanner(true);
    setEditBannerId(banner.id);
    setEditBlogId(blogId);
    dispatch(setBannerFormData({
      image: null,
      image_content: banner.image_content || "",
      currentImage: banner.image_url || null,
    }));
  };

  // Shared cancel
  const handleCancel = () => {
    dispatch(closeForm());
    dispatch(resetBlogForm());
    setShowBannerForm(false);
    setIsEditingBanner(false);
    setEditBannerId(null);
    setEditBlogId(null);
    dispatch(resetBannerForm());
    setShowComments(false);
    setSelectedBlogId(null);
    setNewComment("");
  };

  const handleSaveBlog = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.");
      navigate("/backoffice-login");
      return;
    }

    if (!blogForm.title.trim()) {
      toast.error("Blog title is required.");
      return;
    }

    if (!blogForm.content.trim()) {
      toast.error("Blog content is required.");
      return;
    }

    if (blogForm.image && !validateFile(blogForm.image)) {
      return;
    }

    const formData = new FormData();
    formData.append("title", blogForm.title);
    formData.append("content", blogForm.content);
    if (blogForm.image) formData.append("image", blogForm.image);
    formData.append("is_visible", blogForm.is_visible.toString());

    dispatch(setSubmitting(true));

    try {
      if (isEditing) {
        await toast.promise(
          dispatch(updateBlog({ tenantId, blogId: editId, formData })).unwrap(),
          {
            loading: "Updating blog...",
            success: "Blog updated successfully!",
            error: (err) => `Failed to update: ${err.message || "Unknown error"}`,
          }
        );
      } else {
        await toast.promise(
          dispatch(createBlog({ tenantId, formData })).unwrap(),
          {
            loading: "Creating blog...",
            success: "Blog created successfully!",
            error: (err) => `Failed to create: ${err.message || "Unknown error"}`,
          }
        );
      }
      await dispatch(fetchBlogs(tenantId));
      handleCancel();
    } catch (err) {
      console.error("Error saving blog:", err);
      if (err.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/backoffice-login");
      } else {
        toast.error(err.message || "Failed to save blog. Please try again.");
      }
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const handleSaveBanner = async () => {
    if (!tenantId || !editBlogId) {
      toast.error("Invalid blog or tenant ID.");
      return;
    }

    if (!isEditingBanner && !bannerForm.image) {
      toast.error("Image is required for a new banner.");
      return;
    }

    if (bannerForm.image && !validateFile(bannerForm.image)) {
      return;
    }

    const formData = new FormData();
    if (bannerForm.image) formData.append("image", bannerForm.image);
    formData.append("image_content", bannerForm.image_content);

    dispatch(setSubmitting(true));

    try {
      if (isEditingBanner) {
        await toast.promise(
          dispatch(updateBanner({ tenantId, blogId: editBlogId, bannerId: editBannerId, formData })).unwrap(),
          {
            loading: "Updating banner...",
            success: "Banner updated successfully!",
            error: (err) => `Failed to update: ${err.message || "Unknown error"}`,
          }
        );
      } else {
        await toast.promise(
          dispatch(createBanner({ tenantId, blogId: editBlogId, formData })).unwrap(),
          {
            loading: "Creating banner...",
            success: "Banner created successfully!",
            error: (err) => `Failed to create: ${err.message || "Unknown error"}`,
          }
        );
      }
      await dispatch(fetchBlogs(tenantId));
      handleCancel();
    } catch (err) {
      console.error("Error saving banner:", err);
      if (err.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/backoffice-login");
      } else {
        toast.error(err.message || "Failed to save banner. Please try again.");
      }
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog and its banners?")) {
      dispatch(setSubmitting(true));
      try {
        await toast.promise(
          dispatch(deleteBlog({ tenantId, blogId: id })).unwrap(),
          {
            loading: "Deleting blog...",
            success: "Blog deleted successfully!",
            error: (err) => `Failed to delete: ${err.message || "Unknown error"}`,
          }
        );
        await dispatch(fetchBlogs(tenantId));
      } catch (err) {
        console.error("Error deleting blog:", err);
        if (err.status === 401) {
          toast.error("Session expired. Please log in again.");
          navigate("/backoffice-login");
        } else {
          toast.error(err.message || "Failed to delete blog. Please try again.");
        }
      } finally {
        dispatch(setSubmitting(false));
      }
    }
  };

  const handleDeleteBanner = async (blogId, bannerId) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      dispatch(setSubmitting(true));
      try {
        await toast.promise(
          dispatch(deleteBanner({ tenantId, blogId, bannerId })).unwrap(),
          {
            loading: "Deleting banner...",
            success: "Banner deleted successfully!",
            error: (err) => `Failed to delete: ${err.message || "Unknown error"}`,
          }
        );
        await dispatch(fetchBlogs(tenantId));
      } catch (err) {
        console.error("Error deleting banner:", err);
        if (err.status === 401) {
          toast.error("Session expired. Please log in again.");
          navigate("/backoffice-login");
        } else {
          toast.error(err.message || "Failed to delete banner. Please try again.");
        }
      } finally {
        dispatch(setSubmitting(false));
      }
    }
  };

  // Comment Handlers (local)
  const handleShowComments = (blogId) => {
    setSelectedBlogId(blogId);
    setShowComments(true);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
    const newCommentObj = {
      id: Date.now(), // Simple ID
      blogId: selectedBlogId,
      content: newComment,
      is_approved: false,
    };
    setComments([...comments, newCommentObj]);
    setNewComment("");
    toast.success("Comment added (pending approval).");
  };

  const handleApproveComment = (commentId) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, is_approved: true } : comment
      )
    );
    toast.success("Comment approved!");
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setComments(comments.filter((comment) => comment.id !== commentId));
      toast.success("Comment deleted!");
    }
  };

  const handleRetry = () => {
    dispatch(resetRetry());
    dispatch(fetchBlogs(tenantId));
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        {(!showForm && !showBannerForm && !showComments) && (
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
        {(!showForm && !showBannerForm && !showComments) && (
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search blogs..."
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm transition-all duration-200 shadow-sm hover:border-gray-400"
              aria-label="Search blogs"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-4 block animate-pulse">Loading blogs...</span>
        </div>
      )}

      {/* Error State */}
      {error && retryCount >= MAX_RETRIES && !loading && (
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
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load Blogs</h3>
          <p className="text-gray-500 mb-6">
            {error.message || "An error occurred while loading blogs."}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleAddNewBlog}
              className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
            >
              Add Blog
            </button>
            <button
              onClick={handleRetry}
              className="border border-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* No Tenant ID */}
      {!tenantId && !loading && (
        <div className="p-12 text-center bg-white shadow-lg rounded-xl border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Authentication Required</h3>
          <p className="text-gray-500 mb-6">No tenant ID found. Please log in to continue.</p>
          <button
            onClick={() => navigate("/backoffice-login")}
            className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
          >
            Log In
          </button>
        </div>
      )}

      {/* Blog List */}
      {!showForm && !showBannerForm && !showComments && !loading && tenantId && !error && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Blog List</h2>
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 transition-all duration-300">
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
                          onClick={() => handleShowComments(blog.id)}
                          className="text-purple-600 hover:text-purple-800 hover:scale-110 transition-all duration-200"
                          title="View Comments"
                          disabled={isSubmitting}
                        >
                          <MessageCircle size={18} />
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
      {!showForm && !showBannerForm && !showComments && !loading && tenantId && !error && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Blog Banners</h2>
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 transition-all duration-300">
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
                      <td className="px-6 py-4 text-sm text-gray-800">{banner.created_at}</td>
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

      {/* Comments Section */}
      {showComments && (
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Comments for {blogs.find((b) => b.id === selectedBlogId)?.title}
            </h3>
            <button
              onClick={() => {
                setShowComments(false);
                setSelectedBlogId(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            <div className="space-y-4 mb-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border p-3 rounded">
                  <p className="text-sm mb-2">{comment.content}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        comment.is_approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {comment.is_approved ? "Approved" : "Pending"}
                    </span>
                    <button
                      onClick={() => handleApproveComment(comment.id)}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600 hover:underline text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="border-t pt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a new comment..."
              className="w-full p-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
              rows={3}
            />
            <button
              onClick={handleAddComment}
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition"
            >
              Add Comment
            </button>
          </div>
        </div>
      )}

      {/* Blog Form */}
      {showForm && (
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {isEditing ? "Edit Blog" : "Create New Blog"}
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
                value={blogForm.title}
                onChange={(e) => dispatch(setBlogFormData({ title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm transition-all duration-200 disabled:opacity-50 shadow-sm"
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
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              />
              {(blogForm.image || (isEditing && editingBlog?.image_url)) && (
                <div className="mt-3 relative">
                  <p className="text-xs text-gray-500">{blogForm.image ? "Selected:" : "Current:"}</p>
                  <img
                    src={blogForm.image ? URL.createObjectURL(blogForm.image) : editingBlog.image_url}
                    alt="Preview"
                    className="w-40 h-24 object-cover rounded-md shadow-sm"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/150?text=No+Image")}
                  />
                  {blogForm.image && (
                    <button
                      onClick={() => dispatch(setBlogFormData({ image: null }))}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-all duration-200"
                      disabled={isSubmitting}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={blogForm.content}
                onChange={(e) => dispatch(setBlogFormData({ content: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm transition-all duration-200 h-40 resize-y disabled:opacity-50 shadow-sm"
                placeholder="Enter blog content"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={blogForm.is_visible ? "Visible" : "Hidden"}
                onChange={(e) => dispatch(setBlogFormData({ is_visible: e.target.value === "Visible" }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm transition-all duration-200 disabled:opacity-50 shadow-sm"
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
              className="px-6 py-2.5 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 text-sm font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
              )}
              {isSubmitting ? "Saving..." : isEditing ? "Update Blog" : "Save Blog"}
            </button>
          </div>
        </div>
      )}

      {/* Banner Form */}
      {showBannerForm && (
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 transition-all duration-300">
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
                Image (Max 4MB) {!isEditingBanner && <span className="text-red-500">*</span>}
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={(e) => handleImageUpload(e, "banner")}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              />
              {(bannerForm.image || (isEditingBanner && bannerForm.currentImage)) && (
                <div className="mt-3 relative">
                  <p className="text-xs text-gray-500">{bannerForm.image ? "Selected:" : "Current:"}</p>
                  <img
                    src={bannerForm.image ? URL.createObjectURL(bannerForm.image) : bannerForm.currentImage}
                    alt="Preview"
                    className="w-40 h-24 object-cover rounded-md shadow-sm"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/150?text=No+Image")}
                  />
                  {bannerForm.image && (
                    <button
                      onClick={() => dispatch(setBannerFormData({ image: null }))}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-all duration-200"
                      disabled={isSubmitting}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Content</label>
              <textarea
                value={bannerForm.image_content}
                onChange={(e) => dispatch(setBannerFormData({ image_content: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm transition-all duration-200 h-32 resize-y disabled:opacity-50 shadow-sm"
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
              className="px-6 py-2.5 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 text-sm font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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