// OpportunityOverviewCompensationPlan.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Search, X } from "react-feather";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import {
  fetchOpportunityPage,
  updateOpportunityPage,
  createOpportunityPage,
  deleteOpportunityPage,
  selectOpportunityPageData,
  selectOpportunityPageLoading,
  selectOpportunityPageError,
} from "@/store/slices/opportunityPageSlice";
import {
  openForm,
  closeForm,
  setSubmitting,
  setSearchTerm,
  selectShowForm,
  selectIsEditing,
  selectIsSubmitting,
  selectSearchTerm,
} from "@/store/slices/uiSlice";

const OpportunityOverviewCompensationPlan = () => {
  const { tenantId: paramTenantId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const data = useSelector(selectOpportunityPageData);
  const loading = useSelector(selectOpportunityPageLoading);
  const error = useSelector(selectOpportunityPageError);
  const showForm = useSelector(selectShowForm);
  const isEditing = useSelector(selectIsEditing);
  const searchTerm = useSelector(selectSearchTerm);
  const isSubmitting = useSelector(selectIsSubmitting);

  const [tenantId, setTenantId] = useState(null);
  const [newPlan, setNewPlan] = useState({ plan_document: null });
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

  const plans = data.plan_document_url ? [{ id: data.id, plan_document_url: data.plan_document_url }] : [];

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
  }, [paramTenantId, tenantId, navigate]);

  useEffect(() => {
    if (tenantId) {
      dispatch(fetchOpportunityPage(tenantId));
    }
  }, [tenantId, dispatch]);

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

  const handleAddNew = () => {
    dispatch(openForm({ isEditing: false }));
    setNewPlan({ plan_document: null });
  };

  const handleEdit = (plan) => {
    dispatch(openForm({ isEditing: true, editId: plan.id }));
    setNewPlan({ plan_document: null });
  };

  const handleCancel = () => {
    dispatch(closeForm());
    setNewPlan({ plan_document: null });
  };

  const validateFile = (file) => {
    if (!file) return true; // File is optional for editing
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file only.");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 50MB limit.");
      return false;
    }
    return true;
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setNewPlan({ ...newPlan, plan_document: file });
    }
  };

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.");
      navigate("/backoffice-login");
      return;
    }

    if (!isEditing && !newPlan.plan_document) {
      toast.error("Please upload a PDF document.");
      return;
    }

    if (newPlan.plan_document && !validateFile(newPlan.plan_document)) {
      return;
    }

    const formData = new FormData();
    if (newPlan.plan_document) {
      formData.append("plan_document", newPlan.plan_document);
    }
    formData.append("update_type", "plan_document_only");

    dispatch(setSubmitting(true));
    try {
      const existingPage = data;
      const promise = existingPage && existingPage.id
        ? dispatch(updateOpportunityPage({ tenantId, formData })).unwrap()
        : dispatch(createOpportunityPage({ tenantId, formData })).unwrap();

      await toast.promise(promise, {
        loading: "Saving plan document...",
        success: "Plan document saved successfully!",
        error: (err) => `Failed to save: ${err.message || "Unknown error"}`,
      });
      dispatch(fetchOpportunityPage(tenantId));
      handleCancel();
    } catch (err) {
      console.error("Error saving opportunity page plan:", err);
      if (err.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/backoffice-login");
      }
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const handleDelete = async () => {
    if (!tenantId || plans.length === 0) {
      toast.error("No plan document to delete.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this plan document?")) {
      dispatch(setSubmitting(true));
      try {
        await toast.promise(
          dispatch(deleteOpportunityPage(tenantId)).unwrap(),
          {
            loading: "Deleting plan document...",
            success: "Plan document deleted successfully!",
            error: (err) => `Failed to delete: ${err.message || "Unknown error"}`,
          }
        );
      } catch (err) {
        console.error("Error deleting opportunity page plan:", err);
        if (err.status === 401) {
          toast.error("Session expired. Please log in again.");
          navigate("/backoffice-login");
        }
      } finally {
        dispatch(setSubmitting(false));
      }
    }
  };

  const handleRetry = () => {
    dispatch(fetchOpportunityPage(tenantId));
  };

  const filteredPlans = plans.filter((plan) =>
    (plan.plan_document_url || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <div className="flex justify-between items-center mb-6">
        {!showForm && (
          <>
            <h2 className="text-2xl font-semibold text-gray-800">Compensation Plans</h2>
            <div className="flex items-center gap-4">
              <div className="relative w-72">
                <input
                  type="text"
                  placeholder="Search plans..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 shadow-sm text-sm"
                  aria-label="Search compensation plans"
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button
                onClick={handleAddNew}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md"
                aria-label="Add new compensation plan"
              >
                <Plus size={16} className="mr-2" /> Add New
              </button>
            </div>
          </>
        )}
      </div>

      {loading && (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading compensation plans...</span>
        </div>
      )}

      {error && !loading && (
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
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load Compensation Plan</h3>
          <p className="text-gray-500 mb-6">
            {error.message || "An error occurred while loading the plan. You can start adding a plan or try again."}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleAddNew}
              className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
              aria-label="Add new compensation plan"
            >
              Add Plan
            </button>
            <button
              onClick={handleRetry}
              className="border border-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
              aria-label="Retry loading compensation plan"
            >
              Retry
            </button>
          </div>
        </div>
      )}

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

      {!loading && !error && !showForm && tenantId && (
        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-800 to-black text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Sr.No.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Plan Document</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                    No plan document found.{" "}
                    <button
                      onClick={handleAddNew}
                      className="text-blue-600 hover:underline"
                      aria-label="Add new compensation plan"
                    >
                      Add one now
                    </button>.
                  </td>
                </tr>
              ) : (
                filteredPlans.map((plan, index) => (
                  <tr key={plan.id} className="hover:bg-gray-50 transition-all duration-200">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{index + 1}</td>
                    <td className="px-4 py-4 text-sm text-gray-800">
                      <a
                        href={plan.plan_document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                        aria-label="View compensation plan PDF"
                      >
                        View PDF
                      </a>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(plan)}
                        disabled={isSubmitting}
                        className="text-gray-600 hover:text-black transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                        aria-label="Edit compensation plan"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={isSubmitting}
                        className="text-gray-600 hover:text-red-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                        aria-label="Delete compensation plan"
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
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {isEditing ? "Edit Plan Document" : "Create New Plan Document"}
            </h3>
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="text-gray-500 hover:text-gray-700 hover:scale-105 transition-all duration-200 disabled:opacity-50"
              aria-label="Close compensation plan form"
            >
              <X size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="plan_document" className="block text-sm font-medium text-gray-700 mb-1">
                  Compensation Plan Document (PDF only, Max 50MB) <span className="text-red-500">{isEditing ? "" : "*"}</span>
                </label>
                <input
                  id="plan_document"
                  type="file"
                  accept="application/pdf"
                  onChange={handleDocumentUpload}
                  disabled={isSubmitting}
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                  aria-label="Upload compensation plan PDF"
                />
                {newPlan.plan_document && (
                  <div className="mt-2 relative">
                    <p className="text-xs text-gray-500">Selected: {newPlan.plan_document.name}</p>
                    <button
                      onClick={() => setNewPlan({ ...newPlan, plan_document: null })}
                      disabled={isSubmitting}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
                      aria-label="Remove selected PDF"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                {isEditing && plans[0]?.plan_document_url && !newPlan.plan_document && (
                  <p className="text-xs text-gray-500 mt-1">
                    Current:{" "}
                    <a
                      href={plans[0].plan_document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View PDF
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Cancel compensation plan form"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || (!isEditing && !newPlan.plan_document)}
              className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isEditing ? "Update compensation plan" : "Save compensation plan"}
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

export default OpportunityOverviewCompensationPlan;