import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Search } from "react-feather";
import { useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import toast, { Toaster } from "react-hot-toast";

const CategoryEditor = () => {
  const navigate = useNavigate();
  const { data, loading: isLoading, error, getAll, post, put, del } = useTenantApi();

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image: null,
    status: "active",
  });
  const [tenantId, setTenantId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB in bytes
  const MAX_RETRIES = 3;

  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    if (storedTenantId && tenantId !== storedTenantId) {
      setTenantId(storedTenantId);
    }
  }, []);

  useEffect(() => {
    if (tenantId) {
      fetchCategories();
    }
  }, [tenantId, retryCount]);

  const fetchCategories = async () => {
  try {
    const response = await getAll(`/tenants/${tenantId}/categories`);
    setCategories(Array.isArray(response) ? response : []);
    toast.success("Categories loaded!");
    setRetryCount(0);
  } catch (err) {
    console.error("Error fetching categories:", err.response?.data || err.message);
    if (retryCount < MAX_RETRIES) {
      setTimeout(() => setRetryCount(retryCount + 1), 2000);
    } else {
      toast.error("Unable to load categories. Please try again later.");
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
    setNewCategory({ name: "", description: "", image: null, status: "active" });
  };

  const handleEdit = (category) => {
    setShowForm(true);
    setIsEditing(true);
    setEditId(category.id);
    setNewCategory({
      name: category.name || "",
      description: category.description || "",
      image: null,
      status: category.status || "active",
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
    setNewCategory({ name: "", description: "", image: null, status: "active" });
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

    if (!newCategory.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    if (!validateFile(newCategory.image)) {
      return;
    }

    const formData = new FormData();
    formData.append("name", newCategory.name);
    formData.append("description", newCategory.description || "");
    formData.append("status", newCategory.status.toLowerCase());
    if (newCategory.image) formData.append("image", newCategory.image);

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await toast.promise(
          put(`/tenants/${tenantId}/categories/${editId}`, formData, true),
          {
            loading: "Updating category...",
            success: "Category updated successfully!",
            error: (err) => `Failed to update: ${err.response?.data?.message || err.message}`,
          }
        );
      } else {
        await toast.promise(
          post(`/tenants/${tenantId}/categories`, formData, true),
          {
            loading: "Creating category...",
            success: "Category created successfully!",
            error: (err) => `Failed to create: ${err.response?.data?.message || err.message}`,
          }
        );
      }
      await fetchCategories();
      handleCancel();
    } catch (err) {
      console.error("Error saving category:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/backoffice-login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setIsSubmitting(true);
      try {
        await toast.promise(
          await del( `/tenants/${tenantId}/categories/${categoryId}`),
          {
            loading: "Deleting category...",
            success: "Category deleted successfully!",
            error: (err) => `Failed to delete: ${err.response?.data?.message || err.message}`,
          }
        );
        await fetchCategories();
      } catch (err) {
        console.error("Error deleting category:", err.response?.data || err.message);
        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          navigate("/backoffice-login");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRetry = () => {
    setRetryCount(0);
    fetchCategories();
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <div className="flex justify-between items-center mb-6">
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="bg-gradient-to-r from-gray-800 to-black text-white px-5 py-2 rounded-full flex items-center gap-2 hover:from-gray-900 hover:to-black transform hover:scale-105 transition-all duration-300 shadow-md"
            aria-label="Add new category"
          >
            <Plus size={18} /> Add Category
          </button>
        )}
        {!showForm && (
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search categories..."
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 shadow-sm"
              aria-label="Search categories"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        )}
      </div>

      {isLoading && (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading categories...</span>
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
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load Categories</h3>
          <p className="text-gray-500 mb-6">
            {error.message || "An error occurred while loading categories. You can start adding a category or try again."}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleAddNew}
              className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
              aria-label="Add new category"
            >
              Add Category
            </button>
            <button
              onClick={handleRetry}
              className="border border-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
              aria-label="Retry loading categories"
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

      {!showForm && !isLoading && tenantId && !error && (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 transition-all duration-300">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Sr.No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-800">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category, index) => (
                  <tr
                    key={category.id}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {category.description || "No description"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {category.image_url ? (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="w-10 h-10 object-cover rounded shadow-sm"
                          onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                        />
                      ) : (
                        "No image"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          category.status.toLowerCase() === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-4">
                      <button
                        onClick={() => handleEdit(category)}
                        disabled={isSubmitting}
                        className="text-gray-600 hover:text-black transform hover:scale-105 transition-all duration-200 flex items-center gap-1 disabled:opacity-50"
                        aria-label={`Edit category ${category.name}`}
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={isSubmitting}
                        className="text-gray-600 hover:text-red-600 transform hover:scale-105 transition-all duration-200 flex items-center gap-1 disabled:opacity-50"
                        aria-label={`Delete category ${category.name}`}
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
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">
            {isEditing ? "Edit Category" : "Create New Category"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div>
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="categoryName"
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter category name"
                  aria-required="true"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter description"
                  rows="3"
                />
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Image (JPEG, JPG, PNG, Max 4MB)
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  disabled={isSubmitting}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                  onChange={(e) => setNewCategory({ ...newCategory, image: e.target.files[0] })}
                  aria-label="Upload category image"
                />
                {newCategory.image && (
                  <div className="mt-2 relative">
                    <p className="text-xs text-gray-500">Preview:</p>
                    <img
                      src={URL.createObjectURL(newCategory.image)}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded shadow-sm"
                    />
                    <button
                      onClick={() => setNewCategory({ ...newCategory, image: null })}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200"
                      aria-label="Remove selected image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                {isEditing && newCategory.image === null && (
                  <p className="text-xs text-gray-500 mt-2">
                    Current: <img
                      src={categories.find((c) => c.id === editId)?.image_url || "/placeholder-image.jpg"}
                      alt="Current"
                      className="inline h-8 w-auto object-cover rounded"
                      onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                    />
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={newCategory.status}
                  onChange={(e) => setNewCategory({ ...newCategory, status: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  aria-label="Select category status"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-5 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-medium shadow-sm disabled:opacity-50"
              aria-label="Cancel category form"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || !tenantId}
              className="px-5 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isEditing ? "Update category" : "Save category"}
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

export default CategoryEditor;