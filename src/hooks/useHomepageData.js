import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  fetchHomePage,
  selectHomePageData,
  selectHomePageLoading,
  selectHomePageError,
} from '@/store/slices/homePageSlice';
import { selectTenantId } from '@/store/slices/authSlice';

const MAX_RETRIES = 3;

export const useHomepageData = (successMessage = "Data loaded successfully!") => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const homePageData = useSelector(selectHomePageData);
  const loading = useSelector(selectHomePageLoading);
  const error = useSelector(selectHomePageError);
  const tenantId = useSelector(selectTenantId);

  // Local state
  const [retryCount, setRetryCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // Calculate maxRetriesReached inside the hook
  const maxRetriesReached = retryCount >= MAX_RETRIES;

  // Fetch homepage data
  useEffect(() => {
    if (!tenantId) {
      const storedTenantId = localStorage.getItem('tenant_id');
      if (!storedTenantId) {
        toast.error('Please log in to continue.');
        navigate('/backoffice-login');
      }
      return;
    }

    dispatch(fetchHomePage(tenantId))
      .unwrap()
      .then(() => {
        toast.success(successMessage);
        setRetryCount(0);
        setIsEditing(true);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        if (retryCount < MAX_RETRIES) {
          setTimeout(() => setRetryCount(retryCount + 1), 2000);
        } else {
          toast.error('Unable to load data. Start adding content.');
          setIsEditing(false);
        }
      });
  }, [tenantId, retryCount, dispatch, navigate, successMessage]);

  // Start editing (for empty states)
  const handleStartEditing = (defaultData = {}) => {
    setIsEditing(true);
    return defaultData;
  };

  // Retry loading data
  const handleRetry = () => {
    setRetryCount(0);
    dispatch(fetchHomePage(tenantId));
  };

  return {
    homePageData,
    loading,
    error,
    tenantId,
    retryCount,
    isEditing,
    setIsEditing,
    handleStartEditing,
    handleRetry,
    maxRetries: MAX_RETRIES,
    maxRetriesReached, // Now this is defined inside the hook
  };
};