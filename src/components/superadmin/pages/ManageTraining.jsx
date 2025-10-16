import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTrainings,
  fetchCategories,
  createTraining,
  updateTraining,
  deleteTraining,
  createCategory,
  updateCategory,
  deleteCategory,
  selectTrainings,
  selectCategories,
  selectTrainingLoading,
  selectTrainingError,
  clearError,
} from "@/store/slices/trainingSlice";
import {
  openForm,
  closeForm,
  setSubmitting,
  selectShowForm,
  selectIsEditing,
  selectEditId,
  selectIsSubmitting,
  // Assuming you extend uiSlice with formType
  // Add to uiSlice: formType: null, and in openForm: state.formType = action.payload.formType;
  // For this code, we'll use a local state for formType to avoid modifying uiSlice further
} from "@/store/slices/uiSlice";
import toast, { Toaster } from "react-hot-toast";

// Extend uiSlice mentally for formType or use local
// For full integration without modifying uiSlice, we'll use local flags for form visibility/type

const ManageTraining = () => {
  const dispatch = useDispatch();
  const trainings = useSelector(selectTrainings);
  const categories = useSelector(selectCategories);
  const isLoading = useSelector(selectTrainingLoading);
  const error = useSelector(selectTrainingError);
  const isSubmitting = useSelector(selectIsSubmitting);

  // Local states for form visibility (since uiSlice not extended for type)
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [isEditingTraining, setIsEditingTraining] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editTrainingId, setEditTrainingId] = useState(null);
  const [editCategoryId, setEditCategoryId] = useState(null);

  // Form data local
  const [newTraining, setNewTraining] = useState({
    title: "",
    category_id: "",
    training_url: "",
    document: null,
    status: "ACTIVE",
  });

  const [newCategory, setNewCategory] = useState({ name: "" });

  useEffect(() => {
    dispatch(fetchTrainings());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Training Handlers
  const handleAddNewTraining = () => {
    setShowTrainingForm(true);
    setIsEditingTraining(false);
    setEditTrainingId(null);
    setNewTraining({ title: "", category_id: "", training_url: "", document: null, status: "ACTIVE" });
  };

  const handleEditTraining = (training) => {
    setShowTrainingForm(true);
    setIsEditingTraining(true);
    setEditTrainingId(training.id);
    setNewTraining({
      title: training.title,
      category_id: training.category_id,
      training_url: training.training_url || "",
      document: null,
      status: training.status,
    });
  };

  const handleSaveTraining = async () => {
    if (!newTraining.title.trim()) {
      toast.error("Training title is required.");
      return;
    }
    if (!newTraining.category_id) {
      toast.error("Valid category ID is required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newTraining.title);
    formData.append("category_id", newTraining.category_id);
    if (newTraining.training_url) formData.append("training_url", newTraining.training_url);
    if (newTraining.document) formData.append("document", newTraining.document);
    formData.append("status", newTraining.status);

    dispatch(setSubmitting(true));
    try {
      if (isEditingTraining) {
        await dispatch(updateTraining({ id: editTrainingId, formData })).unwrap();
        toast.success("Training updated successfully");
      } else {
        await dispatch(createTraining(formData)).unwrap();
        toast.success("Training created successfully");
      }
      dispatch(fetchTrainings()); // Refetch to update list
      handleCancel();
    } catch (err) {
      toast.error(err.message || "Failed to save training");
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const handleDeleteTraining = async (id) => {
    if (!confirm("Are you sure you want to delete this training?")) return;
    dispatch(setSubmitting(true));
    try {
      await dispatch(deleteTraining(id)).unwrap();
      toast.success("Training deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete training");
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error("Document must be less than 4MB.");
        return;
      }
      setNewTraining({ ...newTraining, document: file });
      toast.success("Document selected successfully!");
    }
  };

  // Category Handlers
  const handleAddNewCategory = () => {
    setShowCategoryForm(true);
    setIsEditingCategory(false);
    setEditCategoryId(null);
    setNewCategory({ name: "" });
  };

  const handleEditCategory = (category) => {
    setShowCategoryForm(true);
    setIsEditingCategory(true);
    setEditCategoryId(category.id);
    setNewCategory({ name: category.name });
  };

  const handleSaveCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    dispatch(setSubmitting(true));
    try {
      if (isEditingCategory) {
        await dispatch(updateCategory({ id: editCategoryId, data: { name: newCategory.name } })).unwrap();
        toast.success("Category updated successfully");
      } else {
        await dispatch(createCategory({ name: newCategory.name })).unwrap();
        toast.success("Category created successfully");
      }
      dispatch(fetchCategories());
      handleCancel();
    } catch (err) {
      toast.error(err.message || "Failed to save category");
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category? Related trainings will have their category set to null.")) return;
    dispatch(setSubmitting(true));
    try {
      await dispatch(deleteCategory(id)).unwrap();
      toast.success("Category deleted successfully");
      dispatch(fetchTrainings()); // Refetch trainings as categories affect them
    } catch (err) {
      toast.error(err.message || "Failed to delete category");
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const handleCancel = () => {
    setShowTrainingForm(false);
    setShowCategoryForm(false);
    setIsEditingTraining(false);
    setIsEditingCategory(false);
    setEditTrainingId(null);
    setEditCategoryId(null);
    setNewTraining({ title: "", category_id: "", training_url: "", document: null, status: "ACTIVE" });
    setNewCategory({ name: "" });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: "#000", color: "#fff", borderRadius: "8px", padding: "12px" },
        }}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        {!showTrainingForm && !showCategoryForm && (
          <div className="flex gap-4 ">
            <button
              onClick={handleAddNewTraining}
              className="bg-black text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg font-medium"
              disabled={isSubmitting}
            >
              <Plus size={18} /> Add Training
            </button>
            <button
              onClick={handleAddNewCategory}
              className="bg-black text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg font-medium"
              disabled={isSubmitting}
            >
              <Plus size={18} /> Add Category
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black mx-auto"></div>
          <span className="text-gray-700 text-lg mt-4 block animate-pulse font-medium">Loading data...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-white text-center bg-black p-4 rounded-lg shadow-md mb-10 animate-fade-in">
          {error.message || "An error occurred while loading data."}
        </div>
      )}

      {/* Training List */}
      {!isLoading && !error && !showTrainingForm && !showCategoryForm && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-black mb-6">Training List</h2>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Created On</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {trainings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-6 text-center text-gray-500 font-medium">
                      No trainings found. Click "Add Training" to create one!
                    </td>
                  </tr>
                ) : (
                  trainings.map((training, index) => (
                    <tr key={training.id} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{training.category_name || "None"}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{training.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {new Date(training.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${training.status === "ACTIVE"
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                            }`}
                        >
                          {training.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 flex items-center gap-4">
                        <button
                          onClick={() => handleEditTraining(training)}
                          className="text-gray-600 hover:text-black hover:scale-110 transition-all duration-200"
                          title="Edit Training"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteTraining(training.id)}
                          className="text-gray-600 hover:text-black hover:scale-110 transition-all duration-200"
                          title="Delete Training"
                        >
                          <Trash2 size={18} color="red" />
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

      {/* Category List */}
      {!isLoading && !error && !showTrainingForm && !showCategoryForm && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-black mb-6">Category List</h2>
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-6 text-center text-gray-500 font-medium">
                      No categories found. Click "Add Category" to create one!
                    </td>
                  </tr>
                ) : (
                  categories.map((category, index) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{category.name}</td>
                      <td className="px-6 py-4 flex items-center gap-4">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-gray-600 hover:text-black hover:scale-110 transition-all duration-200"
                          title="Edit Category"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-gray-600 hover:text-black hover:scale-110 transition-all duration-200"
                          title="Delete Category"
                        >
                          <Trash2 size={18} color="red" />
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

      {/* Training Form */}
      {showTrainingForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-black">
              {isEditingTraining ? "Edit Training" : "Create New Training"}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-600 hover:text-black hover:scale-105 transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Training Title <span className="text-black">*</span>
              </label>
              <input
                type="text"
                value={newTraining.title}
                onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm transition-all duration-200 disabled:opacity-50 bg-white"
                placeholder="Enter training title"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Section <span className="text-black">*</span>
              </label>
              <select
                value={newTraining.category_id}
                onChange={(e) => setNewTraining({ ...newTraining, category_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm transition-all duration-200 disabled:opacity-50 bg-white"
                disabled={isSubmitting}
              >
                <option value="">Select a section</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Training URL</label>
              <input
                type="text"
                value={newTraining.training_url}
                onChange={(e) => setNewTraining({ ...newTraining, training_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm transition-all duration-200 disabled:opacity-50 bg-white"
                placeholder="e.g., https://youtube.com/..."
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Document (Max 4MB)</label>
              <input
                type="file"
                onChange={handleDocumentUpload}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-black hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                disabled={isSubmitting}
              />
              {newTraining.document && (
                <div className="mt-3 relative">
                  <span className="text-sm text-gray-600">{newTraining.document.name}</span>
                  <button
                    onClick={() => setNewTraining({ ...newTraining, document: null })}
                    className="absolute top-1 right-1 bg-black text-white p-1 rounded-full hover:bg-gray-800 transition-all duration-200"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Status</label>
              <select
                value={newTraining.status}
                onChange={(e) => setNewTraining({ ...newTraining, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm transition-all duration-200 disabled:opacity-50 bg-white"
                disabled={isSubmitting}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 text-sm font-medium disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveTraining}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 hover:scale-105 transition-all duration-200 text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              )}
              {isSubmitting ? "Saving..." : isEditingTraining ? "Update Training" : "Save Training"}
            </button>
          </div>
        </div>
      )}

      {/* Category Form */}
      {showCategoryForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-black">
              {isEditingCategory ? "Edit Category" : "Create New Category"}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-600 hover:text-black hover:scale-105 transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Category Name <span className="text-black">*</span>
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm transition-all duration-200 disabled:opacity-50 bg-white"
                placeholder="Enter category name"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 text-sm font-medium disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCategory}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 hover:scale-105 transition-all duration-200 text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              )}
              {isSubmitting ? "Saving..." : isEditingCategory ? "Update Category" : "Save Category"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTraining;