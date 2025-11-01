// src/hooks/useOpportunityFormSubmit.js
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { updateOpportunityPage, fetchOpportunityPage } from '@/store/slices/opportunityPageSlice';
import { setSubmitting, selectIsSubmitting } from '@/store/slices/uiSlice';
import { selectTenantId } from '@/store/slices/authSlice';

export const useOpportunityFormSubmit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const tenantId = useSelector(selectTenantId);
  const isSubmitting = useSelector(selectIsSubmitting);

  const submitForm = async (formData, options = {}) => {
    const {
      successMessage = 'Saved successfully!',
      errorMessage = 'Failed to save',
      onSuccess,
      onError,
    } = options;

    if (!tenantId) {
      toast.error('Tenant ID not found. Please log in again.');
      navigate('/backoffice-login');
      return false;
    }

    dispatch(setSubmitting(true));

    try {
      await toast.promise(
        dispatch(updateOpportunityPage({ tenantId, formData })).unwrap(),
        {
          loading: 'Saving...',
          success: successMessage,
          error: (err) => `${errorMessage}: ${err.message || 'Unknown error'}`,
        }
      );

      // Refresh data
      await dispatch(fetchOpportunityPage(tenantId));

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }

      return true;
    } catch (err) {
      console.error('Save error:', err);

      if (err.status === 401) {
        toast.error('Session expired. Logging out...');
        navigate('/backoffice-login');
      }

      // Call error callback
      if (onError) {
        onError(err);
      }

      return false;
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  return {
    submitForm,
    isSubmitting,
    tenantId,
  };
};