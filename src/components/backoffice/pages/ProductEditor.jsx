import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Search, X } from "react-feather";
import { useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import RichTextEditor from "./RichTextEditor";
import ToastNotification, { showSuccessToast, showErrorToast } from "../../ToastNotification";

const ProductEditor = () => {
  const navigate = useNavigate();
  const { data, loading: isLoading, error, getAll, post, put, request, del } = useTenantApi();

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tenantId, setTenantId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const [newProduct, setNewProduct] = useState({
    category_id: "",
    name: "",
    title: "",
    price: "",
    price_description: "",
    availability: "in_stock",
    status: "active",
    image: null,
    banner_image: null,
    guide_pdf: null,
    video: null,
    youtube_link: "",
    instructions: "",
    description: "",
  });

  const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB
  const MAX_PDF_SIZE = 4 * 1024 * 1024; // 4MB
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_RETRIES = 3;

  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    if (storedTenantId && tenantId !== storedTenantId) {
      setTenantId(storedTenantId);
    }
  }, []);

  useEffect(() => {
    if (tenantId) {
      fetchProducts();
      fetchCategories();
    }
  }, [tenantId, retryCount]);

  const fetchProducts = async () => {
    try {
      const response = await getAll(`/tenants/${tenantId}/products`);
      setProducts(Array.isArray(response) ? response : []);
      showSuccessToast("Products loaded!");
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error("Error fetching products:", err.response?.data || err.message);
      if (retryCount < MAX_RETRIES) {
        // Silently retry without toast
        setTimeout(() => setRetryCount(retryCount + 1), 2000);
      } else {
        showErrorToast("Unable to load products. Please try again later.");
        setProducts([]);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAll(`/tenants/${tenantId}/categories`);
      setCategories(Array.isArray(response) ? response : []);
      showSuccessToast("Categories loaded!");
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error("Error fetching categories:", err.response?.data || err.message);
      if (retryCount < MAX_RETRIES) {
        // Silently retry without toast
        setTimeout(() => setRetryCount(retryCount + 1), 2000);
      } else {
        showErrorToast("Unable to load categories. Please try again later.");
        setCategories([]);
      }
    }
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearchChange = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const handleAddNew = () => {
    setShowForm(true);
    setIsEditing(false);
    setEditId(null);
    setNewProduct({
      category_id: "",
      name: "",
      title: "",
      price: "",
      price_description: "",
      availability: "in_stock",
      status: "active",
      image: null,
      banner_image: null,
      guide_pdf: null,
      video: null,
      youtube_link: "",
      instructions: "",
      description: "",
    });
  };

  const handleEdit = (product) => {
    setShowForm(true);
    setIsEditing(true);
    setEditId(product.id);
    setNewProduct({
      category_id: product.category_id || "",
      name: product.name || "",
      title: product.title || "",
      price: product.price || "",
      price_description: product.price_description || "",
      availability: product.availability || "in_stock",
      status: product.status || "active",
      image: null,
      banner_image: null,
      guide_pdf: null,
      video: null,
      youtube_link: product.video_url || "",
      instructions: product.instructions || "",
      description: product.description || "",
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
    setNewProduct({
      category_id: "",
      name: "",
      title: "",
      price: "",
      price_description: "",
      availability: "in_stock",
      status: "active",
      image: null,
      banner_image: null,
      guide_pdf: null,
      video: null,
      youtube_link: "",
      instructions: "",
      description: "",
    });
  };

  const validateFile = (file, type, maxSize) => {
    if (!file) return true; // Files are optional
    if (file.size > maxSize) {
      showErrorToast(`${type.charAt(0).toUpperCase() + type.slice(1)} size exceeds ${maxSize / 1024 / 1024}MB limit.`);
      return false;
    }
    if (type === "image" && !["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      showErrorToast("Only JPEG, JPG, or PNG images are allowed.");
      return false;
    }
    if (type === "pdf" && file.type !== "application/pdf") {
      showErrorToast("Only PDF files are allowed.");
      return false;
    }
    if (type === "video" && file.type !== "video/mp4") {
      showErrorToast("Only MP4 videos are allowed.");
      return false;
    }
    return true;
  };

  const validateYouTubeLink = (link) => {
    if (!link) return true; // YouTube link is optional
    const youtubeRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[\w-]+(\?[\w=&-]*)?$/;
    if (!youtubeRegex.test(link)) {
      showErrorToast("Please provide a valid YouTube embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID).");
      return false;
    }
    return true;
  };

  const handleFileChange = (field, file) => {
    setNewProduct({ ...newProduct, [field]: file });
    if (file && field !== "youtube_link") {
      showSuccessToast(`${field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())} selected successfully!`);
    }
  };

  const handleRemoveFile = (field) => {
    setNewProduct({ ...newProduct, [field]: null });
    showSuccessToast(`${field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())} removed.`);
  };

  const handleSave = async () => {
    if (!tenantId) {
      showErrorToast("Tenant ID not found. Please log in again.");
      navigate("/backoffice-login");
      return;
    }

    if (!newProduct.category_id) {
      showErrorToast("Please select a product category.");
      return;
    }
    if (!newProduct.name.trim()) {
      showErrorToast("Product name is required.");
      return;
    }
    if (!newProduct.title.trim()) {
      showErrorToast("Product title is required.");
      return;
    }
    if (!newProduct.price || isNaN(newProduct.price) || Number(newProduct.price) < 0) {
      showErrorToast("Please enter a valid price (0 or greater).");
      return;
    }

    if (!validateYouTubeLink(newProduct.youtube_link)) {
      return;
    }

    if (
      !validateFile(newProduct.image, "image", MAX_IMAGE_SIZE) ||
      !validateFile(newProduct.banner_image, "image", MAX_IMAGE_SIZE) ||
      !validateFile(newProduct.guide_pdf, "pdf", MAX_PDF_SIZE) ||
      !validateFile(newProduct.video, "video", MAX_VIDEO_SIZE)
    ) {
      return;
    }

    const formData = new FormData();
    formData.append("category_id", newProduct.category_id);
    formData.append("name", newProduct.name);
    formData.append("title", newProduct.title);
    formData.append("price", newProduct.price);
    formData.append("price_description", newProduct.price_description);
    formData.append("availability", newProduct.availability);
    formData.append("status", newProduct.status);
    if (newProduct.image) formData.append("image", newProduct.image);
    if (newProduct.banner_image) formData.append("banner_image", newProduct.banner_image);
    if (newProduct.guide_pdf) formData.append("guide_pdf", newProduct.guide_pdf);
    if (newProduct.video) formData.append("video", newProduct.video);
    formData.append("youtube_link", newProduct.youtube_link);
    formData.append("instructions", newProduct.instructions);
    formData.append("description", newProduct.description);

    const config = {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        toast.loading(`Uploading... ${percentCompleted}%`, { id: "upload-progress" });
      },
    };

    setIsSubmitting(true);
    try {
      const response = await (isEditing
        ? put(`/tenants/${tenantId}/products/${editId}`, formData, true, config)
        : post(`/tenants/${tenantId}/products`, formData, true, config));
      showSuccessToast(isEditing ? "Product updated" : "Product added");
      await fetchProducts();
      handleCancel();
    } catch (err) {
      console.error("Error saving product:", err.response?.data || err.message);
      const errorData = err.response?.data;
      if (errorData?.error === "FILE_ERROR") {
        showErrorToast(errorData.message || "Invalid file type or size.");
      } else if (errorData?.error === "MISSING_FIELDS") {
        showErrorToast(errorData.message || "Please fill in all required fields.");
      } else if (errorData?.error === "UNAUTHORIZED" || err.response?.status === 401) {
        showErrorToast("Session expired. Please log in again.");
        navigate("/backoffice-login");
      } else {
        showErrorToast(errorData?.message || "Failed to save product. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
      toast.dismiss("upload-progress");
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setIsSubmitting(true);
      try {
        await del(`/tenants/${tenantId}/products/${productId}`);
        showSuccessToast("Product deleted");
        await fetchProducts();
      } catch (err) {
        console.error("Error deleting product:", err.response?.data || err.message);
        const errorData = err.response?.data;
        if (errorData?.error === "UNAUTHORIZED" || err.response?.status === 401) {
          showErrorToast("Session expired. Please log in again.");
          navigate("/backoffice-login");
        } else {
          showErrorToast(errorData?.message || "Failed to delete product. Please try again.");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRetry = () => {
    setRetryCount(0);
    fetchProducts();
    fetchCategories();
  };

  const filteredProducts = products.filter(
    (product) =>
      (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <ToastNotification />

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

      {isLoading && (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading products...</span>
        </div>
      )}

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
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load Products</h3>
          <p className="text-gray-500 mb-6">
            {error.message || "An error occurred while loading products. You can start adding a product or try again."}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleAddNew}
              className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
              aria-label="Add new product"
            >
              Add Product
            </button>
            <button
              onClick={handleRetry}
              className="border border-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
              aria-label="Retry loading products"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {!tenantId && !isLoading && (
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

      {!showForm && !isLoading && !error && tenantId && (
        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
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
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-md shadow-sm hover:scale-105 transition-transform duration-200"
                            onError={(e) => (e.target.src = "https://via.placeholder.com/50x50?text=No+Image")}
                          />
                        ) : (
                          <span className="text-gray-500 italic">No image</span>
                        )}
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
                  value={newProduct.category_id}
                  onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
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
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
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
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter product title"
                  aria-label="Product title"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Price <span className="text-red-500">*</span>
                </label>
                <input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  aria-label="Product price"
                />
              </div>

              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <select
                  id="availability"
                  value={newProduct.availability}
                  onChange={(e) => setNewProduct({ ...newProduct, availability: e.target.value })}
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
                  value={newProduct.status}
                  onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
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
                <label htmlFor="price_description" className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                <textarea
                  id="price_description"
                  value={newProduct.price_description}
                  onChange={(e) => setNewProduct({ ...newProduct, price_description: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter price description"
                  rows="2"
                  aria-label="Price description"
                />
              </div>

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
                {(newProduct.image || (isEditing && newProduct.image === null)) && (
                  <div className="mt-2 relative">
                    <p className="text-xs text-gray-500">{newProduct.image ? "Selected:" : "Current:"}</p>
                    {newProduct.image ? (
                      <img
                        src={URL.createObjectURL(newProduct.image)}
                        alt="Selected Preview"
                        className="h-20 w-auto object-cover rounded shadow-sm"
                        onError={(e) => (e.target.src = "https://via.placeholder.com/50x50?text=No+Image")}
                      />
                    ) : (
                      <img
                        src={products.find((p) => p.id === editId)?.image_url || "https://via.placeholder.com/50x50?text=No+Image"}
                        alt="Current"
                        className="h-20 w-auto object-cover rounded shadow-sm"
                      />
                    )}
                    {newProduct.image && (
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
                {newProduct.banner_image && (
                  <div className="mt-2 relative">
                    <p className="text-xs text-gray-500">Selected:</p>
                    <img
                      src={URL.createObjectURL(newProduct.banner_image)}
                      alt="Selected Preview"
                      className="h-20 w-auto object-cover rounded shadow-sm"
                      onError={(e) => (e.target.src = "https://via.placeholder.com/50x50?text=No+Image")}
                    />
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
                {newProduct.guide_pdf && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Selected: {newProduct.guide_pdf.name}</p>
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
                {newProduct.video && (
                  <div className="mt-2 relative">
                    <p className="text-xs text-gray-500">Selected:</p>
                    <video
                      src={URL.createObjectURL(newProduct.video)}
                      controls
                      className="w-48 h-28 object-cover rounded shadow-sm"
                      onError={(e) => (e.target.src = "https://via.placeholder.com/50x50?text=No+Video")}
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

              <div>
                <label htmlFor="youtube_link" className="block text-sm font-medium text-gray-700 mb-1">
                  OR Enter YouTube Embedded Link
                </label>
                <input
                  id="youtube_link"
                  type="text"
                  value={newProduct.youtube_link}
                  onChange={(e) => setNewProduct({ ...newProduct, youtube_link: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="e.g., https://www.youtube.com/embed/VIDEO_ID"
                  aria-label="YouTube embedded link"
                />
                <p className="text-xs text-gray-500 mt-1">
                  How to get link: Click Share → Embed → Copy iframe src
                </p>
                {newProduct.youtube_link && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Preview:</p>
                    <iframe
                      src={newProduct.youtube_link}
                      title="YouTube Preview"
                      className="w-full h-32 rounded-md shadow-sm"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                Product Instructions (if any)
              </label>
              <RichTextEditor
                id="instructions"
                value={newProduct.instructions}
                onChange={(value) => setNewProduct({ ...newProduct, instructions: value })}
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
                value={newProduct.description}
                onChange={(value) => setNewProduct({ ...newProduct, description: value })}
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
              disabled={isSubmitting || !tenantId}
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