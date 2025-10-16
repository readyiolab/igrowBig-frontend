import React, { useState, useEffect, useCallback } from "react";
import { Edit, Trash2, Search, X } from "react-feather";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import {
  fetchDisclaimer,
  createDisclaimer,
  updateDisclaimer,
  deleteDisclaimer,
  setFormData,
  resetForm,
  selectDisclaimer,
  selectDisclaimerForm,
  selectDisclaimerLoading,
  selectDisclaimerError,
} from "@/store/slices/disclaimerSlice";
import {
  openForm,
  closeForm,
  setSearchTerm,
  setSubmitting,
  selectShowForm,
  selectIsEditing,
  selectSearchTerm,
  selectIsSubmitting,
} from "@/store/slices/uiSlice";

const FooterEditor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tenantId, setTenantId] = useState(null);

  const disclaimer = useSelector(selectDisclaimer);
  const form = useSelector(selectDisclaimerForm);
  const loading = useSelector(selectDisclaimerLoading);
  const error = useSelector(selectDisclaimerError);
  const showForm = useSelector(selectShowForm);
  const isEditing = useSelector(selectIsEditing);
  const searchTerm = useSelector(selectSearchTerm);
  const isSubmitting = useSelector(selectIsSubmitting);

  // Authentication and tenant setup
  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    const token = localStorage.getItem("token");
    if (!token || !storedTenantId) {
      toast.error("Please log in to continue.");
      navigate("/backoffice-login");
    } else if (tenantId !== storedTenantId) {
      setTenantId(storedTenantId);
    }
  }, [navigate, tenantId]);

  // Fetch disclaimers when tenantId changes
  useEffect(() => {
    if (tenantId) {
      dispatch(fetchDisclaimer(tenantId))
        .unwrap()
        .then(() => {
          console.log("Disclaimers loaded");
        })
        .catch((err) => {
          console.error("Error loading disclaimers:", err);
          if (err?.status === 401) {
            toast.error("Session expired. Please log in again.");
            navigate("/backoffice-login");
          }
        });
    }
  }, [tenantId, dispatch, navigate]);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      dispatch(setSearchTerm(value));
    }, 300),
    [dispatch]
  );

  const handleAddNew = () => {
    dispatch(resetForm());
    dispatch(openForm({ isEditing: false }));
  };

  const handleEdit = () => {
    dispatch(
      setFormData({
        site_disclaimer: disclaimer.site_disclaimer || "",
        product_disclaimer: disclaimer.product_disclaimer || "",
        income_disclaimer: disclaimer.income_disclaimer || "",
      })
    );
    dispatch(openForm({ isEditing: true }));
  };

  const handleCancel = () => {
    dispatch(closeForm());
    dispatch(resetForm());
  };

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.");
      navigate("/backoffice-login");
      return;
    }

    const { site_disclaimer, product_disclaimer, income_disclaimer } = form;
    if (!site_disclaimer.trim() && !product_disclaimer.trim() && !income_disclaimer.trim()) {
      toast.error("Please provide at least one disclaimer.");
      return;
    }

    const payload = {
      site_disclaimer: site_disclaimer.trim() || null,
      product_disclaimer: product_disclaimer.trim() || null,
      income_disclaimer: income_disclaimer.trim() || null,
    };

    dispatch(setSubmitting(true));
    try {
      const action = isEditing
        ? updateDisclaimer({ tenantId, formData: payload })
        : createDisclaimer({ tenantId, formData: payload });

      await toast.promise(
        dispatch(action).unwrap(),
        {
          loading: "Saving disclaimers...",
          success: "Disclaimers saved successfully!",
          error: (err) => `Failed to save: ${err.message || "Unknown error"}`,
        }
      );

      // Close form and reset
      dispatch(closeForm());
      dispatch(resetForm());
      
      // No need to refetch - Redux already updated the state from the response
    } catch (err) {
      console.error("Error saving disclaimers:", err);
      if (err?.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/backoffice-login");
      }
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete all disclaimers?")) return;
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.");
      navigate("/backoffice-login");
      return;
    }

    dispatch(setSubmitting(true));
    try {
      await toast.promise(
        dispatch(deleteDisclaimer(tenantId)).unwrap(),
        {
          loading: "Deleting disclaimers...",
          success: "Disclaimers deleted successfully!",
          error: (err) => `Failed to delete: ${err.message || "Unknown error"}`,
        }
      );
      
      dispatch(closeForm());
      dispatch(resetForm());
    } catch (err) {
      console.error("Error deleting disclaimers:", err);
      if (err?.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/backoffice-login");
      }
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const hasContent = Object.values(disclaimer)
    .filter((v) => typeof v === "string")
    .some((v) => v.trim());

  const filteredDisclaimers = [
    ["Site Disclaimer", disclaimer.site_disclaimer],
    ["Product Disclaimer", disclaimer.product_disclaimer],
    ["Income Disclaimer", disclaimer.income_disclaimer],
  ].filter(([_, content]) => content && content.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Loading State */}
      {loading && (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block">Loading disclaimers...</span>
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
            aria-label="Go to login page"
          >
            Log In
          </button>
        </div>
      )}

      {/* Error State */}
      {error && !loading && tenantId && !showForm && (
        <div className="p-12 text-center bg-white shadow-lg rounded-xl border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load Disclaimers</h3>
          <p className="text-gray-500 mb-6">
            {error.message || "An error occurred while loading disclaimers. You can start adding disclaimers."}
          </p>
          <button
            onClick={handleAddNew}
            className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
            aria-label="Add new disclaimers"
          >
            Add Disclaimers
          </button>
        </div>
      )}

      {/* No Content State */}
      {!loading && !error && !showForm && tenantId && !hasContent && (
        <div className="p-12 text-center bg-white shadow-lg rounded-xl border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Disclaimers Found</h3>
          <p className="text-gray-500 mb-6">Add some disclaimers to get started!</p>
          <button
            onClick={handleAddNew}
            className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
            aria-label="Add new disclaimers"
          >
            Add Disclaimers
          </button>
        </div>
      )}

      {/* Header and Table */}
      {!loading && !error && !showForm && tenantId && hasContent && (
        <>
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleEdit}
              className="bg-gradient-to-r from-gray-800 to-black text-white px-5 py-2 rounded-full flex items-center gap-2 hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-300 shadow-md"
              aria-label="Edit disclaimers"
              disabled={isSubmitting}
            >
              <Edit size={18} /> Edit Disclaimers
            </button>
            <div className="relative w-72">
              <input
                type="text"
                placeholder="Search disclaimers..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 shadow-sm text-sm"
                aria-label="Search disclaimers"
                disabled={isSubmitting}
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-800 to-black text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Content</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDisclaimers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      No disclaimers match your search.
                    </td>
                  </tr>
                ) : (
                  filteredDisclaimers.map(([type, content], index) => (
                    <tr key={type} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{type}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {content.substring(0, 50)}
                        {content.length > 50 ? "..." : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-3">
                        {index === 0 && (
                          <>
                            <button
                              onClick={handleEdit}
                              disabled={isSubmitting}
                              className="text-gray-600 hover:text-gray-900 hover:scale-110 transition-all duration-200 disabled:opacity-50"
                              aria-label="Edit disclaimers"
                              title="Edit Disclaimers"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={handleDelete}
                              disabled={isSubmitting}
                              className="text-gray-600 hover:text-red-600 hover:scale-110 transition-all duration-200 disabled:opacity-50"
                              aria-label="Delete all disclaimers"
                              title="Delete All Disclaimers"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Disclaimer Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {isEditing ? "Edit Disclaimers" : "Add Disclaimers"}
            </h3>
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="text-gray-500 hover:text-gray-700 hover:scale-105 transition-all duration-200 disabled:opacity-50"
              aria-label="Close disclaimer form"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <label htmlFor="site_disclaimer" className="block text-sm font-medium text-gray-700 mb-1">
                Site Disclaimer
              </label>
              <textarea
                id="site_disclaimer"
                value={form.site_disclaimer}
                onChange={(e) => dispatch(setFormData({ site_disclaimer: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50 text-sm resize-y disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter site disclaimer"
                rows="4"
                disabled={isSubmitting}
                aria-label="Site disclaimer"
              />
            </div>
            <div>
              <label htmlFor="product_disclaimer" className="block text-sm font-medium text-gray-700 mb-1">
                Product Disclaimer
              </label>
              <textarea
                id="product_disclaimer"
                value={form.product_disclaimer}
                onChange={(e) => dispatch(setFormData({ product_disclaimer: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50 text-sm resize-y disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter product disclaimer"
                rows="4"
                disabled={isSubmitting}
                aria-label="Product disclaimer"
              />
            </div>
            <div>
              <label htmlFor="income_disclaimer" className="block text-sm font-medium text-gray-700 mb-1">
                Income Disclaimer
              </label>
              <textarea
                id="income_disclaimer"
                value={form.income_disclaimer}
                onChange={(e) => dispatch(setFormData({ income_disclaimer: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50 text-sm resize-y disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter income disclaimer"
                rows="4"
                disabled={isSubmitting}
                aria-label="Income disclaimer"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Cancel disclaimer form"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || !tenantId}
              className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isEditing ? "Update disclaimers" : "Save disclaimers"}
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

export default FooterEditor;