import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'react-feather';
import toast, { Toaster } from 'react-hot-toast';

// Reusable Components
import {
  LoadingSpinner,
  TextInput,
} from "@/components/common";

// Custom Hook
import useTenantApi from '@/hooks/useTenantApi';

const SliderBanner = () => {
  const { data: bannersData, loading, error, getAll, post, put, apiRequest } = useTenantApi();
  
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [tenantId, setTenantId] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [newSlider, setNewSlider] = useState({
    image: null,
    imageUrl: '',
    text: '',
  });
  const [imageSource, setImageSource] = useState('file');
  const [formError, setFormError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get tenant ID from localStorage
  useEffect(() => {
    const storedTenantId = localStorage.getItem('tenant_id');
    if (storedTenantId && tenantId !== storedTenantId) {
      setTenantId(storedTenantId);
    }
  }, [tenantId]);

  // Fetch banners on mount
  useEffect(() => {
    if (tenantId && !hasFetched && !loading) {
      toast.promise(
        getAll(`/tenants/${tenantId}/slider-banners`).then(() => setHasFetched(true)),
        {
          loading: 'Fetching banners...',
          success: 'Banners loaded successfully!',
          error: 'Failed to load banners.',
        }
      );
    }
  }, [tenantId, getAll, hasFetched, loading]);

  // Transform banner data
  useEffect(() => {
    if (bannersData) {
      if (Array.isArray(bannersData)) {
        setSliders(
          bannersData.map((banner) => ({
            id: banner.id,
            image: banner.image_url,
            content: banner.text,
            uploadedOn: new Date(banner.created_at || Date.now()).toISOString().split('T')[0],
          }))
        );
      } else {
        setSliders([]);
      }
    }
  }, [bannersData]);

  const handleAddNew = () => {
    setShowForm(true);
    setIsEditing(false);
    setNewSlider({ image: null, imageUrl: '', text: '' });
    setImageSource('file');
    setFormError(null);
  };

  const handleEdit = (slider) => {
    setShowForm(true);
    setIsEditing(true);
    setEditId(slider.id);
    setNewSlider({
      image: null,
      imageUrl: slider.image,
      text: slider.content,
    });
    setImageSource('url');
    setFormError(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
    setNewSlider({ image: null, imageUrl: '', text: '' });
    setFormError(null);
  };

  const validateForm = () => {
    const hasImageFile = newSlider.image !== null;
    const hasImageUrl = typeof newSlider.imageUrl === 'string' && newSlider.imageUrl.trim() !== '';
    
    if (!isEditing && !hasImageFile && !hasImageUrl) {
      setFormError('Please provide either an image file or an image URL');
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    
    if (imageSource === 'file' && newSlider.image) {
      formData.append('image', newSlider.image);
    } else if (newSlider.imageUrl.trim()) {
      formData.append('image_url', newSlider.imageUrl);
    }
    
    formData.append('text', newSlider.text);

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await toast.promise(
          put(`/tenants/${tenantId}/slider-banners/${editId}`, formData, true),
          {
            loading: 'Updating banner...',
            success: 'Banner updated successfully!',
            error: 'Failed to update banner.',
          }
        );
      } else {
        await toast.promise(
          post(`/tenants/${tenantId}/slider-banners`, formData, true),
          {
            loading: 'Adding banner...',
            success: 'Banner added successfully!',
            error: 'Failed to add banner.',
          }
        );
      }
      setHasFetched(false);
      await getAll(`/tenants/${tenantId}/slider-banners`);
      handleCancel();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (bannerId) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    setIsSubmitting(true);
    try {
      await toast.promise(
        apiRequest('delete', `/tenants/${tenantId}/slider-banners/${bannerId}`),
        {
          loading: 'Deleting banner...',
          success: 'Banner deleted successfully!',
          error: 'Failed to delete banner.',
        }
      );
      setHasFetched(false);
      await getAll(`/tenants/${tenantId}/slider-banners`);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to delete banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading State
  if (loading && !hasFetched) {
    return (
      <div className="container mx-auto p-4">
        <Toaster position="top-right" />
        <LoadingSpinner message="Loading banners..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />

      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Slider Banners</h2>
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="bg-black text-white px-6 py-2 rounded-full flex items-center gap-2 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Plus size={18} /> Add New Banner
          </button>
        )}
      </div>

      {/* List View */}
      {!showForm && (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 transition-all duration-300">
          {error ? (
            <div className="p-6 text-center">
              <p className="text-red-500 text-lg font-medium">{error.message}</p>
              <button
                onClick={() => getAll(`/tenants/${tenantId}/slider-banners`)}
                className="mt-4 text-black hover:underline"
              >
                Retry
              </button>
            </div>
          ) : sliders.length === 0 ? (
            <EmptyState onAddNew={handleAddNew} />
          ) : (
            <BannerTable 
              sliders={sliders} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      )}

      {/* Form View */}
      {showForm && (
        <BannerForm
          isEditing={isEditing}
          newSlider={newSlider}
          setNewSlider={setNewSlider}
          imageSource={imageSource}
          setImageSource={setImageSource}
          formError={formError}
          isSubmitting={isSubmitting}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

// Empty State Component
const EmptyState = ({ onAddNew }) => (
  <div className="p-12 text-center">
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
    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Banners Yet</h3>
    <p className="text-gray-500 mb-6">
      Get started by adding your first slider banner!
    </p>
    <button
      onClick={onAddNew}
      className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
    >
      Add Your First Banner
    </button>
  </div>
);

// Banner Table Component
const BannerTable = ({ sliders, onEdit, onDelete, isSubmitting }) => (
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-black text-white">
      <tr>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Sr.No.</th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Content</th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Uploaded On</th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      {sliders.map((slider, index) => (
        <tr key={slider.id} className="hover:bg-gray-50 transition-all duration-200">
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
            {index + 1}
          </td>
          <td className="px-6 py-4">
            <img
              src={slider.image}
              alt="Slider Banner"
              className="h-16 w-auto object-cover rounded-lg shadow-sm"
              onError={(e) => (e.target.src = '/placeholder-image.jpg')}
            />
          </td>
          <td className="px-6 py-4 text-sm text-gray-800">
            {slider.content || 'N/A'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
            {slider.uploadedOn}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-4">
            <button
              onClick={() => onEdit(slider)}
              disabled={isSubmitting}
              className="text-black transform hover:scale-105 transition-all duration-200 flex items-center gap-1 disabled:opacity-50"
            >
              <Edit size={16} /> Edit
            </button>
            <button
              onClick={() => onDelete(slider.id)}
              disabled={isSubmitting}
              className="text-red-600 hover:text-red-800 transform hover:scale-105 transition-all duration-200 flex items-center gap-1 disabled:opacity-50"
            >
              <Trash2 size={16} /> Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

// Banner Form Component
const BannerForm = ({
  isEditing,
  newSlider,
  setNewSlider,
  imageSource,
  setImageSource,
  formError,
  isSubmitting,
  onSave,
  onCancel,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transition-all duration-300">
    <h3 className="text-2xl font-semibold text-gray-800 mb-6">
      {isEditing ? 'Edit Slider Banner' : 'Add New Slider Banner'}
    </h3>

    {formError && (
      <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
        {formError}
      </div>
    )}

    {/* Image Source Selector */}
    <div className="mb-6">
      <p className="block text-sm font-medium text-gray-700 mb-2">Image Source</p>
      <div className="flex space-x-6">
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio text-black focus:ring-black"
            name="imageSource"
            value="file"
            checked={imageSource === 'file'}
            onChange={() => setImageSource('file')}
            disabled={isSubmitting}
          />
          <span className="ml-2 text-gray-700">Upload File</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio text-black focus:ring-black"
            name="imageSource"
            value="url"
            checked={imageSource === 'url'}
            onChange={() => setImageSource('url')}
            disabled={isSubmitting}
          />
          <span className="ml-2 text-gray-700">Image URL</span>
        </label>
      </div>
    </div>

    <div className="space-y-6">
      {/* File Upload */}
      {imageSource === 'file' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Banner Image (1349px × 420px) {isEditing ? '(Optional)' : '(Required)'}
          </label>
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800 transition-all duration-200 disabled:opacity-50"
            onChange={(e) => setNewSlider({ ...newSlider, image: e.target.files[0] })}
            disabled={isSubmitting}
          />
          {isEditing && newSlider.imageUrl && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Current:</p>
              <img
                src={newSlider.imageUrl}
                alt="Current Banner"
                className="h-16 w-auto object-cover rounded-lg shadow-sm"
                onError={(e) => (e.target.src = '/placeholder-image.jpg')}
              />
            </div>
          )}
        </div>
      )}

      {/* URL Input */}
      {imageSource === 'url' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL {isEditing ? '(Optional)' : '(Required)'}
          </label>
          <input
            type="url"
            value={newSlider.imageUrl}
            onChange={(e) => setNewSlider({ ...newSlider, imageUrl: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="https://example.com/image.jpg"
            disabled={isSubmitting}
          />
          {newSlider.imageUrl && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Preview:</p>
              <img
                src={newSlider.imageUrl}
                alt="URL Preview"
                className="h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                onError={(e) => (e.target.src = '/placeholder-image.jpg')}
              />
            </div>
          )}
        </div>
      )}

      {/* Text Input */}
      <TextInput
        id="sliderText"
        label="Slider Text"
        value={newSlider.text}
        onChange={(e) => setNewSlider({ ...newSlider, text: e.target.value })}
        placeholder="Enter slider text (optional)"
        disabled={isSubmitting}
      />

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-6 py-2.5 bg-black text-white rounded-full hover:scale-105 transition-all duration-200 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
          )}
          {isEditing ? 'Update' : 'Save'}
        </button>
      </div>
    </div>
  </div>
);

export default SliderBanner;