import React, { useEffect, useCallback, useState, useMemo } from "react";
import { Plus, Edit, Trash2, Search, X } from "react-feather";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

// Redux imports
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  setFormData,
  resetForm,
  clearError,
  selectCategories,
  selectCategoryForm,
  selectCategoryLoading,
  selectCategoryError,
} from "@/store/slices/categorySlice";

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

import { selectTenantId } from "@/store/slices/authSlice";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const MAX_RETRIES = 3;

// Reliable placeholder URL
const PLACEHOLDER_IMAGE = "https://placehold.co/50x50?text=No+Image&font=roboto";

const CategoryEditor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const categories = useSelector(selectCategories);
  const form = useSelector(selectCategoryForm);
  const loading = useSelector(selectCategoryLoading);
  const error = useSelector(selectCategoryError);
  const tenantId = useSelector(selectTenantId);
  
  const showForm = useSelector(selectShowForm);
  const isEditing = useSelector(selectIsEditing);
  const editId = useSelector(selectEditId);
  const searchTerm = useSelector(selectSearchTerm);
  const isSubmitting = useSelector(selectIsSubmitting);
  const retryCount = useSelector(selectRetryCount);

  const editingCategory = categories.find((cat) => cat.id === editId);

  // Fetch categories on mount
  useEffect(() => {
    if (!tenantId) {
      const storedTenantId = localStorage.getItem("tenant_id");
      if (!storedTenantId) {
        toast.error("Please log in to continue.");
        navigate("/backoffice-login");
      }
      return;
    }
    
    dispatch(fetchCategories(tenantId))
      .unwrap()
      .then(() => {
        toast.success("Categories loaded!");
        dispatch(resetRetry());
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        if (retryCount < MAX_RETRIES) {
          setTimeout(() => dispatch(incrementRetry()), 2000);
        } else {
          toast.error("Unable to load categories. Please try again later.");
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

  // Handlers
  const handleAddNew = () => {
    dispatch(openForm({ isEditing: false }));
    dispatch(resetForm());
  };

  const handleEdit = (category) => {
    dispatch(openForm({ isEditing: true, editId: category.id }));
    dispatch(setFormData({
      name: category.name || '',
      description: category.description || '',
      image: null,
      status: category.status || 'active',
    }));
  };

  const handleCancel = () => {
    dispatch(closeForm());
    dispatch(resetForm());
  };

  const validateFile = (file) => {
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

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.");
      navigate("/backoffice-login");
      return;
    }

    if (!form.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    if (!validateFile(form.image)) {
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description || "");
    formData.append("status", form.status.toLowerCase());
    if (form.image) formData.append("image", form.image);

    dispatch(setSubmitting(true));

    try {
      if (isEditing) {
        await toast.promise(
          dispatch(updateCategory({ tenantId, categoryId: editId, formData })).unwrap(),
          {
            loading: "Updating category...",
            success: "Category updated successfully!",
            error: (err) => `Failed to update: ${err.message || 'Unknown error'}`,
          }
        );
      } else {
        await toast.promise(
          dispatch(createCategory({ tenantId, formData })).unwrap(),
          {
            loading: "Creating category...",
            success: "Category created successfully!",
            error: (err) => `Failed to create: ${err.message || 'Unknown error'}`,
          }
        );
      }
      
      await dispatch(fetchCategories(tenantId));
      handleCancel();
    } catch (err) {
      console.error("Error saving category:", err);
      if (err.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/backoffice-login");
      } else {
        toast.error(err.message || "Failed to save category. Please try again.");
      }
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(setSubmitting(true));
      try {
        await toast.promise(
          dispatch(deleteCategory({ tenantId, categoryId })).unwrap(),
          {
            loading: "Deleting category...",
            success: "Category deleted successfully!",
            error: (err) => `Failed to delete: ${err.message || 'Unknown error'}`,
          }
        );
        await dispatch(fetchCategories(tenantId));
      } catch (err) {
        console.error("Error deleting category:", err);
        if (err.status === 401) {
          toast.error("Session expired. Please log in again.");
          navigate("/backoffice-login");
        } else {
          toast.error(err.message || "Failed to delete category. Please try again.");
        }
      } finally {
        dispatch(setSubmitting(false));
      }
    }
  };

  const handleRetry = () => {
    dispatch(resetRetry());
    dispatch(fetchCategories(tenantId));
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const name = category.name ?? ''; // Safe fallback
      const description = category.description ?? ''; // Safe fallback

      const lowerSearch = searchTerm.toLowerCase();
      return (
        name.toLowerCase().includes(lowerSearch) ||
        description.toLowerCase().includes(lowerSearch)
      );
    });
  }, [categories, searchTerm]);

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
        <div className={`w-full h-full bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500 ${className}`}>
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

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        {!showForm && (
          <h2 className="text-2xl font-semibold text-gray-800">Categories</h2>
        )}
        {!showForm && (
          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <input
                type="text"
                placeholder="Search categories..."
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 shadow-sm text-sm"
                aria-label="Search categories"
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
            <button
              onClick={handleAddNew}
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Add new category"
            >
              <Plus size={16} className="mr-2" /> Add Category
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading categories...</span>
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
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load Categories</h3>
          <p className="text-gray-500 mb-6">
            {error.message || "An error occurred while loading categories."}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleAddNew}
              disabled={isSubmitting}
              className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105 disabled:opacity-50"
            >
              Add Category
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

      {/* Categories Table */}
      {!showForm && !loading && tenantId && !error && (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-800 to-black text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Sr.No.</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No categories found.{" "}
                      <button
                        onClick={handleAddNew}
                        disabled={isSubmitting}
                        className="text-blue-600 hover:underline disabled:opacity-50"
                        aria-label="Add new category"
                      >
                        Add one now
                      </button>.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category, index) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                       {category.name ?? 'Unnamed Category'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {category.description || "No description"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        <ImageWithFallback
                          src={category.image_url}
                          alt={category.name}
                          className="w-10 h-10 object-cover rounded shadow-sm"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          category.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-4">
                        <button
                          onClick={() => handleEdit(category)}
                          disabled={isSubmitting}
                          className="text-gray-600 hover:text-blue-600 transform hover:scale-105 transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Edit category"
                        >
                          <Edit size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          disabled={isSubmitting}
                          className="text-gray-600 hover:text-red-600 transform hover:scale-105 transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Delete category"
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

      {/* Category Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {isEditing ? "Edit Category" : "Add New Category"}
            </h3>
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="text-gray-500 hover:text-gray-700 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close category form"
            >
              <X size={20} />
            </button>
          </div>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={form.name}
                onChange={(e) => dispatch(setFormData({ name: e.target.value }))}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter category name"
                aria-label="Category name"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => dispatch(setFormData({ description: e.target.value }))}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter description"
                aria-label="Category description"
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Image (JPEG, JPG, PNG, Max 4MB)
              </label>
              <input
                type="file"
                id="image"
                accept="image/jpeg,image/jpg,image/png"
                disabled={isSubmitting}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (validateFile(file)) {
                    dispatch(setFormData({ image: file }));
                  } else {
                    e.target.value = '';
                  }
                }}
                aria-label="Category image"
              />
              {form.image && typeof form.image === 'object' && (
                <div className="mt-2 relative">
                  <p className="text-xs text-gray-500">Selected: {form.image.name}</p>
                  <ImageWithFallback
                    src={URL.createObjectURL(form.image)}
                    alt="Preview"
                    className="h-20 w-auto object-cover rounded shadow-sm"
                  />
                  <button
                    onClick={() => dispatch(setFormData({ image: null }))}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
                    aria-label="Remove selected image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {isEditing && !form.image && editingCategory?.image_url && (
                <div className="mt-2 relative">
                  <p className="text-xs text-gray-500">Current:</p>
                  <ImageWithFallback
                    src={editingCategory.image_url}
                    alt={editingCategory.name}
                    className="h-20 w-auto object-cover rounded border shadow-sm"
                  />
                </div>
              )}
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => dispatch(setFormData({ status: e.target.value }))}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                aria-label="Category status"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Cancel category form"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting || !form.name.trim()}
                className="px-6 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-300 font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={isEditing ? "Update category" : "Create category"}
              >
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                )}
                {isSubmitting ? "Saving..." : (isEditing ? "Update" : "Create")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CategoryEditor;