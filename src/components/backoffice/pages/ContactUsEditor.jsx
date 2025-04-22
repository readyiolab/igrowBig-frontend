import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Search } from "react-feather";
import { useParams, useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import toast, { Toaster } from "react-hot-toast";

const ContactUsEditor = () => {
  const { tenantId: paramTenantId } = useParams();
  const navigate = useNavigate();
  const { data, loading: isLoading, error, getAll, post, put, request } = useTenantApi();

  const [tenantId, setTenantId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pages, setPages] = useState([]);
  const [newPage, setNewPage] = useState({
    image: null,
    text: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB in bytes

  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    if (storedTenantId && tenantId !== storedTenantId) {
      if (paramTenantId && paramTenantId !== storedTenantId) {
        toast.error("Unauthorized access. Tenant ID mismatch.");
        navigate("/backoffice-login");
        return;
      }
      setTenantId(storedTenantId);
    }
  }, []);

  useEffect(() => {
    if (tenantId) {
      fetchPages();
    }
  }, [tenantId, retryCount]);

  const fetchPages = async () => {
    try {
      const response = await toast.promise(
        getAll(`/tenants/${tenantId}/contactus`),
        {
          loading: "Fetching contact us pages...",
          success: "Pages loaded successfully!",
          error: "Failed to load pages.",
        }
      );
      if (response && Array.isArray(response)) {
        setPages(
          response.map((page) => ({
            id: page.id,
            image: page.contactus_image || "",
            text: page.contactus_text || "",
            created_at: page.created_at ? page.created_at.split("T")[0] : "",
          }))
        );
      } else {
        setPages([]);
      }
    } catch (err) {
      console.error("Error fetching contact us pages:", err.response?.data || err.message);
      if (retryCount < 3) {
        toast.error(`Failed to load pages. Retrying... (${retryCount + 1}/3)`);
        setTimeout(() => setRetryCount(retryCount + 1), 2000);
      } else {
        toast.error("Unable to load pages. Please try again later.");
        setPages([]);
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
    setNewPage({ image: null, text: "" });
  };

  const handleEdit = (page) => {
    setShowForm(true);
    setIsEditing(true);
    setEditId(page.id);
    setNewPage({
      image: null,
      text: page.text,
      currentImage: page.image,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
    setNewPage({ image: null, text: "" });
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setNewPage({ ...newPage, image: file });
    }
  };

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.");
      navigate("/backoffice-login");
      return;
    }

    if (!newPage.text.trim()) {
      toast.error("Text is required.");
      return;
    }

    if (!isEditing && !newPage.image) {
      toast.error("Image is required for new pages.");
      return;
    }

    if (newPage.image && !validateFile(newPage.image)) {
      return;
    }

    const formData = new FormData();
    if (newPage.image) formData.append("contactus_image", newPage.image);
    formData.append("contactus_text", newPage.text);

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await toast.promise(
          put(`/tenants/${tenantId}/contactus/${editId}`, formData, true),
          {
            loading: "Updating page...",
            success: "Page updated successfully!",
            error: (err) => `Failed to update: ${err.response?.data?.message || err.message}`,
          }
        );
      } else {
        await toast.promise(
          post(`/tenants/${tenantId}/contactus`, formData, true),
          {
            loading: "Creating page...",
            success: "Page created successfully!",
            error: (err) => `Failed to create: ${err.response?.data?.message || err.message}`,
          }
        );
      }
      await fetchPages();
      handleCancel();
    } catch (err) {
      console.error("Error saving contact us page:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/backoffice-login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      setIsSubmitting(true);
      try {
        await toast.promise(
          request("delete", `/tenants/${tenantId}/contactus/${id}`),
          {
            loading: "Deleting page...",
            success: "Page deleted successfully!",
            error: (err) => `Failed to delete: ${err.response?.data?.message || err.message}`,
          }
        );
        await fetchPages();
      } catch (err) {
        console.error("Error deleting contact us page:", err.response?.data || err.message);
        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          navigate("/backoffice-login");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRetry = () => {
    setRetryCount(0);
    fetchPages();
  };

  const filteredPages = pages.filter((page) =>
    (page.text || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <div className="flex justify-between items-center mb-6">
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="bg-gradient-to-r from-gray-800 to-black text-white uppercase px-5 py-2 rounded-full flex items-center gap-2 hover:from-gray-900 hover:to-black transform hover:scale-105 transition-all duration-300 shadow-md"
            aria-label="Add new contact us page"
          >
            <Plus size={18} /> Add Contact Us Page
          </button>
        )}
        {!showForm && (
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search pages..."
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 shadow-sm"
              aria-label="Search contact us pages"
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
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading pages...</span>
        </div>
      )}

      {error && retryCount >= 3 && !isLoading && (
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
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load Pages</h3>
          <p className="text-gray-500 mb-6">
            {error.message || "An error occurred while loading pages. You can start adding a page or try again."}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleAddNew}
              className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
              aria-label="Add new contact us page"
            >
              Add Page
            </button>
            <button
              onClick={handleRetry}
              className="border border-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
              aria-label="Retry loading pages"
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Sr.No.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Text</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Image</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Created On</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-center text-sm text-gray-800">
                    No pages found.
                  </td>
                </tr>
              ) : (
                filteredPages.map((page, index) => (
                  <tr key={page.id} className="hover:bg-gray-50 transition-all duration-200">
                    <td className="px-4 py-3 text-sm text-gray-800">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{page.text || "No text"}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {page.image ? (
                        <img
                          src={page.image}
                          alt="Contact Us"
                          className="w-20 h-10 object-cover rounded"
                          onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                        />
                      ) : (
                        "No image"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">{page.created_at || "N/A"}</td>
                    <td className="px-4 py-3 text-sm flex gap-3">
                      <button
                        onClick={() => handleEdit(page)}
                        disabled={isSubmitting}
                        className="text-gray-600 hover:text-black transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                        aria-label={`Edit contact us page ${page.text}`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        disabled={isSubmitting}
                        className="text-gray-600 hover:text-red-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                        aria-label={`Delete contact us page ${page.text}`}
                      >
                        <Trash2 size={16} />
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {isEditing ? "Edit Contact Us Page" : "Create New Contact Us Page"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                  Text <span className="text-red-500">*</span>
                </label>
                <input
                  id="text"
                  type="text"
                  value={newPage.text}
                  onChange={(e) => setNewPage({ ...newPage, text: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter text"
                  aria-required="true"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Image (JPEG, JPG, PNG, Max 4MB) <span className="text-red-500">{isEditing ? "" : "*"}</span>
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageUpload}
                  disabled={isSubmitting}
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                  aria-label="Upload contact us image"
                />
                {newPage.image && (
                  <div className="mt-2 relative">
                    <p className="text-xs text-gray-500">Preview:</p>
                    <img
                      src={URL.createObjectURL(newPage.image)}
                      alt="Preview"
                      className="w-20 h-10 object-cover rounded shadow-sm"
                    />
                    <button
                      onClick={() => setNewPage({ ...newPage, image: null })}
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
                {isEditing && newPage.currentImage && !newPage.image && (
                  <p className="text-xs text-gray-500 mt-1">
                    Current: <img
                      src={newPage.currentImage}
                      alt="Current"
                      className="w-20 h-10 object-cover rounded inline-block"
                      onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                    />
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-medium shadow-sm disabled:opacity-50"
              aria-label="Cancel contact us form"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || !tenantId}
              className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isEditing ? "Update contact us page" : "Save contact us page"}
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

export default ContactUsEditor;