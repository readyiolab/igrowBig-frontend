import React, { useEffect, useState, useCallback } from "react";
import { Plus, Edit, Trash2, Search } from "react-feather";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

// Redux imports
import {
  fetchContactUs,
  createContactUs,
  updateContactUs,
  deleteContactUs,
  setFormData,
  resetForm,
  selectContactUs,
  selectContactUsForm,
  selectContactUsLoading,
  selectContactUsError,
} from "@/store/slices/contactUsSlice";

import {
  openForm,
  closeForm,
  setSearchTerm,
  setSubmitting,
  selectShowForm,
  selectIsEditing,
  selectEditId,
  selectSearchTerm,
  selectIsSubmitting,
} from "@/store/slices/uiSlice";

import { selectTenantId } from "@/store/slices/authSlice";

const MAX_FILE_SIZE = 4 * 1024 * 1024;

const ContactUsEditor = () => {
  const { tenantId: paramTenantId } = useParams();
  const dispatch = useDispatch();

  // Redux state
  const pages = useSelector(selectContactUs);
  const form = useSelector(selectContactUsForm);
  const loading = useSelector(selectContactUsLoading);
  const error = useSelector(selectContactUsError);
  const tenantId = useSelector(selectTenantId);
  
  const showForm = useSelector(selectShowForm);
  const isEditing = useSelector(selectIsEditing);
  const editId = useSelector(selectEditId);
  const searchTerm = useSelector(selectSearchTerm);
  const isSubmitting = useSelector(selectIsSubmitting);

  // Local state for File object (non-serializable)
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const editingPage = pages.find((page) => page.id === editId);

  // Fetch on mount
  useEffect(() => {
    if (!tenantId) {
      const storedTenantId = localStorage.getItem("tenant_id");
      if (!storedTenantId) {
        toast.error("Please log in to continue.");
        return;
      }
      if (paramTenantId && paramTenantId !== storedTenantId) {
        toast.error("Unauthorized access. Tenant ID mismatch.");
        return;
      }
      return;
    }

    dispatch(fetchContactUs(tenantId))
      .unwrap()
      .then(() => {
        toast.success("Pages loaded successfully!");
      })
      .catch((err) => {
        console.error("Error fetching contact us pages:", err);
        toast.error(err.message || "Unable to load pages. Please try again later.");
      });
  }, [tenantId, dispatch, paramTenantId]);

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
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleEdit = (page) => {
    dispatch(openForm({ isEditing: true, editId: page.id }));
    dispatch(setFormData({
      text: page.text || '',
      currentImage: page.image || null,
    }));
    setSelectedImage(null);
    setImagePreview(page.image || null);
  };

  const handleCancel = () => {
    dispatch(closeForm());
    dispatch(resetForm());
    setSelectedImage(null);
    setImagePreview(null);
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
    if (validateFile(file)) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      toast.info("Image selected!");
    } else {
      e.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(isEditing ? form.currentImage : null);
  };

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.");
      return;
    }

    if (!form.text.trim()) {
      toast.error("Text is required.");
      return;
    }

    if (!isEditing && !selectedImage) {
      toast.error("Image is required for new pages.");
      return;
    }

    if (selectedImage && !validateFile(selectedImage)) {
      return;
    }

    const formData = new FormData();
    if (selectedImage) formData.append("contactus_image", selectedImage);
    formData.append("contactus_text", form.text);

    dispatch(setSubmitting(true));

    try {
      if (isEditing) {
        await toast.promise(
          dispatch(updateContactUs({ tenantId, pageId: editId, formData })).unwrap(),
          {
            loading: "Updating page...",
            success: "Page updated successfully!",
            error: (err) => `Failed to update: ${err.message || 'Unknown error'}`,
          }
        );
      } else {
        await toast.promise(
          dispatch(createContactUs({ tenantId, formData })).unwrap(),
          {
            loading: "Creating page...",
            success: "Page created successfully!",
            error: (err) => `Failed to create: ${err.message || 'Unknown error'}`,
          }
        );
      }
      
      await dispatch(fetchContactUs(tenantId));
      handleCancel();
    } catch (err) {
      console.error("Error saving contact us page:", err);
      if (err.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error(err.message || "Failed to save page. Please try again.");
      }
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const handleDelete = async (pageId) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      dispatch(setSubmitting(true));
      try {
        await toast.promise(
          dispatch(deleteContactUs({ tenantId, pageId })).unwrap(),
          {
            loading: "Deleting page...",
            success: "Page deleted successfully!",
            error: (err) => `Failed to delete: ${err.message || 'Unknown error'}`,
          }
        );
        await dispatch(fetchContactUs(tenantId));
      } catch (err) {
        console.error("Error deleting contact us page:", err);
        if (err.status === 401) {
          toast.error("Session expired. Please log in again.");
        } else {
          toast.error(err.message || "Failed to delete page. Please try again.");
        }
      } finally {
        dispatch(setSubmitting(false));
      }
    }
  };

  const filteredPages = pages.filter(
    (page) => (page.text || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />

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

      {loading && (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading pages...</span>
        </div>
      )}

      {!tenantId && !loading && (
        <div className="p-12 text-center bg-white shadow-lg rounded-xl border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Authentication Required</h3>
          <p className="text-gray-500 mb-6">No tenant ID found. Please log in to continue.</p>
          <button
            onClick={() => window.location.href = "/backoffice-login"}
            className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
            aria-label="Go to login page"
          >
            Log In
          </button>
        </div>
      )}

      {!showForm && !loading && tenantId && !error && (
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
                  value={form.text}
                  onChange={(e) => dispatch(setFormData({ text: e.target.value }))}
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
                {imagePreview && (
                  <div className="mt-2 relative inline-block">
                    <p className="text-xs text-gray-500 mb-1">Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-10 object-cover rounded shadow-sm"
                      onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                    />
                    {selectedImage && (
                      <button
                        onClick={handleRemoveImage}
                        disabled={isSubmitting}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
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