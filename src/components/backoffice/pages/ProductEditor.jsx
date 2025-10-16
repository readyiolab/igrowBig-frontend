import React, { useEffect, useCallback, useState } from "react";
import { Plus, Edit, Trash2, Search, X } from "react-feather";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import RichTextEditor from "./RichTextEditor";

// Redux imports for products
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  setFormData,
  resetForm,
  clearError,
  selectProducts,
  selectProductForm,
  selectProductLoading,
  selectProductError,
} from "@/store/slices/productSlice";

// Redux imports for categories
import {
  fetchCategories,
  selectCategories,
} from "@/store/slices/categorySlice";

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

const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB
const MAX_PDF_SIZE = 4 * 1024 * 1024; // 4MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_RETRIES = 3;

// Reliable placeholder URL (via.placeholder.com is defunct)
const PLACEHOLDER_IMAGE = "https://placehold.co/50x50?text=No+Image&font=roboto";

const ProductEditor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state for products
  const products = useSelector(selectProducts);
  const form = useSelector(selectProductForm);
  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);

  // Redux state for categories
  const categories = useSelector(selectCategories);

  // Redux state for UI
  const showForm = useSelector(selectShowForm);
  const isEditing = useSelector(selectIsEditing);
  const editId = useSelector(selectEditId);
  const searchTerm = useSelector(selectSearchTerm);
  const isSubmitting = useSelector(selectIsSubmitting);
  const retryCount = useSelector(selectRetryCount);

  // Redux state for auth
  const tenantId = useSelector(selectTenantId);

  const editingProduct = products.find((product) => product.id === editId);

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

    // Fetch products with retry logic
    dispatch(fetchProducts(tenantId))
      .unwrap()
      .then(() => {
        toast.success("Products loaded!");
        dispatch(resetRetry());
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        if (retryCount < MAX_RETRIES) {
          setTimeout(() => dispatch(incrementRetry()), 2000);
        } else {
          toast.error("Unable to load products. Please try again later.");
        }
      });

    // Fetch categories (no retry toast)
    dispatch(fetchCategories(tenantId)).catch((err) => {
      console.error("Error fetching categories:", err);
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

  // Handlers
  const handleAddNew = () => {
    dispatch(openForm({ isEditing: false }));
    dispatch(resetForm());
  };

  const handleEdit = (product) => {
    dispatch(openForm({ isEditing: true, editId: product.id }));
    dispatch(setFormData({
      category_id: product.category_id || '',
      name: product.name || '',
      title: product.title || '',
      your_price: product.your_price || '',
      base_price: product.base_price || '',
      preferred_customer_price: product.preferred_customer_price || '',
      availability: product.availability || 'in_stock',
      status: product.status || 'active',
      image: null,
      banner_image: null,
      guide_pdf: null,
      video: null,
      video_url: product.video_url || '',
      instructions: product.instructions || '',
      description: product.description || '',
      buy_link: product.buy_link || '',
    }));
  };

  const handleCancel = () => {
    dispatch(closeForm());
    dispatch(resetForm());
  };

  const validateFile = (file, type, maxSize) => {
    if (!file) return true;
    if (file.size > maxSize) {
      toast.error(`${type.charAt(0).toUpperCase() + type.slice(1)} size exceeds ${maxSize / 1024 / 1024}MB limit.`);
      return false;
    }
    if (type === "image" && !["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      toast.error("Only JPEG, JPG, or PNG images are allowed.");
      return false;
    }
    if (type === "pdf" && file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return false;
    }
    if (type === "video" && !["video/mp4"].includes(file.type)) {
      toast.error("Only MP4 videos are allowed.");
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

  const handleFileChange = (field, file) => {
    if (validateFile(file, field.includes("image") ? "image" : field.includes("pdf") ? "pdf" : "video", 
      field.includes("image") ? MAX_IMAGE_SIZE : field.includes("pdf") ? MAX_PDF_SIZE : MAX_VIDEO_SIZE)) {
      dispatch(setFormData({ [field]: file }));
      toast.success(`${field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())} selected successfully!`);
    }
  };

  const handleRemoveFile = (field) => {
    dispatch(setFormData({ [field]: null }));
    toast.success(`${field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())} removed.`);
  };

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.");
      navigate("/backoffice-login");
      return;
    }

    if (!form.category_id) {
      toast.error("Please select a product category.");
      return;
    }
    if (!form.name.trim()) {
      toast.error("Product name is required.");
      return;
    }
    if (!form.title.trim()) {
      toast.error("Product title is required.");
      return;
    }
    if (!form.your_price || isNaN(form.your_price) || Number(form.your_price) < 0) {
      toast.error("Please enter a valid 'Your Price' (0 or greater).");
      return;
    }
    if (!form.base_price || isNaN(form.base_price) || Number(form.base_price) < 0) {
      toast.error("Please enter a valid 'Base Price' (0 or greater).");
      return;
    }
    if (!form.preferred_customer_price || isNaN(form.preferred_customer_price) || Number(form.preferred_customer_price) < 0) {
      toast.error("Please enter a valid 'Preferred Customer Price' (0 or greater).");
      return;
    }

    if (!validateYouTubeLink(form.video_url)) {
      return;
    }

    if (
      !validateFile(form.image, "image", MAX_IMAGE_SIZE) ||
      !validateFile(form.banner_image, "image", MAX_IMAGE_SIZE) ||
      !validateFile(form.guide_pdf, "pdf", MAX_PDF_SIZE) ||
      !validateFile(form.video, "video", MAX_VIDEO_SIZE)
    ) {
      return;
    }

    const formData = new FormData();
    formData.append("category_id", form.category_id);
    formData.append("name", form.name);
    formData.append("title", form.title);
    formData.append("your_price", form.your_price);
    formData.append("base_price", form.base_price);
    formData.append("preferred_customer_price", form.preferred_customer_price);
    formData.append("availability", form.availability);
    formData.append("status", form.status);
    if (form.image) formData.append("image", form.image);
    if (form.banner_image) formData.append("banner_image", form.banner_image);
    if (form.guide_pdf) formData.append("guide_pdf", form.guide_pdf);
    if (form.video) formData.append("video", form.video);
    formData.append("video_url", form.video_url);
    formData.append("instructions", form.instructions);
    formData.append("description", form.description);
    formData.append("buy_link", form.buy_link);

    dispatch(setSubmitting(true));

    const config = {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        toast.loading(`Uploading... ${percentCompleted}%`, { id: "upload-progress" });
      },
    };

    try {
      if (isEditing) {
        await toast.promise(
          dispatch(updateProduct({ tenantId, productId: editId, formData, config })).unwrap(),
          {
            loading: "Updating product...",
            success: "Product updated successfully!",
            error: (err) => `Failed to update: ${err.message || 'Unknown error'}`,
          }
        );
      } else {
        await toast.promise(
          dispatch(createProduct({ tenantId, formData, config })).unwrap(),
          {
            loading: "Creating product...",
            success: "Product created successfully!",
            error: (err) => `Failed to create: ${err.message || 'Unknown error'}`,
          }
        );
      }
      
      await dispatch(fetchProducts(tenantId));
      handleCancel();
    } catch (err) {
      console.error("Error saving product:", err);
      const errorData = err;
      if (errorData?.error === "FILE_ERROR") {
        toast.error(errorData.message || "Invalid file type or size.");
      } else if (errorData?.error === "MISSING_FIELDS") {
        toast.error(errorData.message || "Please fill in all required fields.");
      } else if (errorData?.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/backoffice-login");
      } else {
        toast.error(errorData?.message || "Failed to save product. Please try again.");
      }
    } finally {
      dispatch(setSubmitting(false));
      toast.dismiss("upload-progress");
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(setSubmitting(true));
      try {
        await toast.promise(
          dispatch(deleteProduct({ tenantId, productId })).unwrap(),
          {
            loading: "Deleting product...",
            success: "Product deleted successfully!",
            error: (err) => `Failed to delete: ${err.message || 'Unknown error'}`,
          }
        );
        await dispatch(fetchProducts(tenantId));
      } catch (err) {
        console.error("Error deleting product:", err);
        const errorData = err;
        if (errorData?.status === 401) {
          toast.error("Session expired. Please log in again.");
          navigate("/backoffice-login");
        } else {
          toast.error(errorData?.message || "Failed to delete product. Please try again.");
        }
      } finally {
        dispatch(setSubmitting(false));
      }
    }
  };

  const handleRetry = () => {
    dispatch(resetRetry());
    dispatch(fetchProducts(tenantId));
    dispatch(fetchCategories(tenantId));
  };

  const filteredProducts = products.filter(
    (product) =>
      (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Image Fallback Component
  const ImageWithFallback = ({ src, alt, className }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
      if (!hasError) {
        setHasError(true);
        setImgSrc(PLACEHOLDER_IMAGE);
      }
    };

    if (!src) {
      return (
        <div className={`w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500 ${className}`}>
          No Image
        </div>
      );
    }

    return (
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        onError={handleError}
        loading="lazy"
      />
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <div className="flex justify-between items-center mb-6">
        {!showForm && (
          <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
        )}
        {!showForm && (
          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <input
                type="text"
                placeholder="Search products..."
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 shadow-sm text-sm"
                aria-label="Search products"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={handleAddNew}
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Add new product"
            >
              <Plus size={16} className="mr-2" /> Add Product
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading products...</span>
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
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load Products</h3>
          <p className="text-gray-500 mb-6">
            {error.message || "An error occurred while loading products."}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleAddNew}
              className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
            >
              Add Product
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

      {/* Products Table */}
      {!showForm && !loading && tenantId && !error && (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-800 to-black text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Sr.No.</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No products found.{" "}
                      <button
                        onClick={handleAddNew}
                        className="text-blue-600 hover:underline"
                        aria-label="Add new product"
                      >
                        Add one now
                      </button>.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product, index) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{product.category_name || "Uncategorized"}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        <ImageWithFallback
                          src={product.image_url}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-md shadow-sm hover:scale-105 transition-transform duration-200"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-4">
                        <button
                          onClick={() => handleEdit(product)}
                          disabled={isSubmitting}
                          className="text-gray-600 hover:text-black transform hover:scale-105 transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={`Edit product ${product.name}`}
                        >
                          <Edit size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={isSubmitting}
                          className="text-gray-600 hover:text-red-600 transform hover:scale-105 transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={`Delete product ${product.name}`}
                        >
                          <Trash2 size={16} /> Delete
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

      {/* Product Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {isEditing ? "Edit Product" : "Create New Product"}
            </h3>
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="text-gray-500 hover:text-gray-700 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close product form"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category_id"
                  value={form.category_id}
                  onChange={(e) => dispatch(setFormData({ category_id: e.target.value }))}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  aria-label="Product category"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => dispatch(setFormData({ name: e.target.value }))}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter product name"
                  aria-label="Product name"
                />
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(e) => dispatch(setFormData({ title: e.target.value }))}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter product title"
                  aria-label="Product title"
                />
              </div>

              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <select
                  id="availability"
                  value={form.availability}
                  onChange={(e) => dispatch(setFormData({ availability: e.target.value }))}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  aria-label="Product availability"
                >
                  <option value="in_stock">In Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="pre_order">Pre-Order</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => dispatch(setFormData({ status: e.target.value }))}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  aria-label="Product status"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="your_price" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Price <span className="text-red-500">*</span>
                </label>
                <input
                  id="your_price"
                  type="number"
                  value={form.your_price}
                  onChange={(e) => dispatch(setFormData({ your_price: e.target.value }))}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter your price"
                  min="0"
                  step="0.01"
                  aria-label="Your price"
                />
              </div>

              <div>
                <label htmlFor="base_price" className="block text-sm font-medium text-gray-700 mb-1">
                  Base Price <span className="text-red-500">*</span>
                </label>
                <input
                  id="base_price"
                  type="number"
                  value={form.base_price}
                  onChange={(e) => dispatch(setFormData({ base_price: e.target.value }))}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter base price"
                  min="0"
                  step="0.01"
                  aria-label="Base price"
                />
              </div>

              <div>
                <label htmlFor="preferred_customer_price" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Customer Price <span className="text-red-500">*</span>
                </label>
                <input
                  id="preferred_customer_price"
                  type="number"
                  value={form.preferred_customer_price}
                  onChange={(e) => dispatch(setFormData({ preferred_customer_price: e.target.value }))}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter preferred customer price"
                  min="0"
                  step="0.01"
                  aria-label="Preferred customer price"
                />
              </div>

              <div>
                <label htmlFor="buy_link" className="block text-sm font-medium text-gray-700 mb-1">
                  Buy Link
                </label>
                <input
                  id="buy_link"
                  type="url"
                  value={form.buy_link}
                  onChange={(e) => dispatch(setFormData({ buy_link: e.target.value }))}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter buy link (optional)"
                  aria-label="Buy link"
                />
              </div>
            </div>
          </div>

          {/* Video URL */}
          <div className="mt-6">
            <label htmlFor="video_url" className="block text-sm font-medium text-gray-700 mb-1">
              YouTube Embed Link (Optional)
            </label>
            <input
              id="video_url"
              type="text"
              value={form.video_url}
              onChange={(e) => dispatch(setFormData({ video_url: e.target.value }))}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="e.g., https://www.youtube.com/embed/VIDEO_ID"
              aria-label="YouTube embedded link"
            />
            <p className="text-xs text-gray-500 mt-1">
              How to get link: Click Share → Embed → Copy iframe src
            </p>
            {form.video_url && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">Preview:</p>
                <iframe
                  src={form.video_url}
                  title="YouTube Preview"
                  className="w-full h-32 rounded-md shadow-sm"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          {/* File Uploads */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image (JPEG, JPG, PNG, Max 4MB)
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  disabled={isSubmitting}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={(e) => handleFileChange("image", e.target.files[0])}
                  aria-label="Product image"
                />
                {(form.image || (isEditing && editingProduct?.image_url)) && (
                  <div className="mt-2 relative">
                    <p className="text-xs text-gray-500">{form.image ? "Selected:" : "Current:"}</p>
                    <ImageWithFallback
                      src={form.image ? URL.createObjectURL(form.image) : editingProduct?.image_url}
                      alt="Preview"
                      className="h-20 w-auto object-cover rounded shadow-sm"
                    />
                    {form.image && (
                      <button
                        onClick={() => handleRemoveFile("image")}
                        disabled={isSubmitting}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
                        aria-label="Remove selected image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="banner_image" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Banner Image (JPEG, JPG, PNG, Max 4MB)
                </label>
                <input
                  id="banner_image"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  disabled={isSubmitting}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={(e) => handleFileChange("banner_image", e.target.files[0])}
                  aria-label="Product banner image"
                />
                {(form.banner_image || (isEditing && editingProduct?.banner_image_url)) && (
                  <div className="mt-2 relative">
                    <p className="text-xs text-gray-500">{form.banner_image ? "Selected:" : "Current:"}</p>
                    <ImageWithFallback
                      src={form.banner_image ? URL.createObjectURL(form.banner_image) : editingProduct?.banner_image_url}
                      alt="Preview"
                      className="h-20 w-auto object-cover rounded shadow-sm"
                    />
                    {form.banner_image && (
                      <button
                        onClick={() => handleRemoveFile("banner_image")}
                        disabled={isSubmitting}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
                        aria-label="Remove selected banner image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="guide_pdf" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Guide PDF (Max 4MB)
                </label>
                <input
                  id="guide_pdf"
                  type="file"
                  accept="application/pdf"
                  disabled={isSubmitting}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={(e) => handleFileChange("guide_pdf", e.target.files[0])}
                  aria-label="Product guide PDF"
                />
                {form.guide_pdf && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Selected: {form.guide_pdf.name}</p>
                    <button
                      onClick={() => handleRemoveFile("guide_pdf")}
                      disabled={isSubmitting}
                      className="text-red-500 hover:text-red-600 text-sm disabled:opacity-50"
                      aria-label="Remove selected guide PDF"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Video Clip (MP4, Max 50MB)
                </label>
                <input
                  id="video"
                  type="file"
                  accept="video/mp4"
                  disabled={isSubmitting}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={(e) => handleFileChange("video", e.target.files[0])}
                  aria-label="Product video"
                />
                {form.video && (
                  <div className="mt-2 relative">
                    <p className="text-xs text-gray-500">Selected:</p>
                    <video
                      src={URL.createObjectURL(form.video)}
                      controls
                      className="w-48 h-28 object-cover rounded shadow-sm"
                      onError={(e) => {
                        e.target.style.display = "none";
                        toast.error("Failed to load video preview.");
                      }}
                    />
                    <button
                      onClick={() => handleRemoveFile("video")}
                      disabled={isSubmitting}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
                      aria-label="Remove selected video"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rich Text Editors */}
          <div className="mt-6 space-y-6">
            <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                Product Instructions (if any)
              </label>
              <RichTextEditor
                id="instructions"
                value={form.instructions}
                onChange={(value) => dispatch(setFormData({ instructions: value }))}
                placeholder="Enter product instructions here..."
                height="200px"
                readOnly={isSubmitting}
                aria-label="Product instructions"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Product Description
              </label>
              <RichTextEditor
                id="description"
                value={form.description}
                onChange={(value) => dispatch(setFormData({ description: value }))}
                placeholder="Enter product description here..."
                height="200px"
                readOnly={isSubmitting}
                aria-label="Product description"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Cancel product form"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || !tenantId || !form.name.trim() || !form.category_id}
              className="px-6 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-300 font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isEditing ? "Update product" : "Save product"}
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

export default ProductEditor;