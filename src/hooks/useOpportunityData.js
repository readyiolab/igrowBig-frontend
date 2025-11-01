// src/hooks/useOpportunityData.js
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  fetchOpportunityPage,
  selectOpportunityPageData,
  selectOpportunityPageLoading,
  selectOpportunityPageError,
} from '@/store/slices/opportunityPageSlice';
import { selectTenantId } from '@/store/slices/authSlice';

const MAX_RETRIES = 3;

export const useOpportunityData = (successMessage = 'Opportunity data loaded!') => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const data = useSelector(selectOpportunityPageData);
  const loading = useSelector(selectOpportunityPageLoading);
  const error = useSelector(selectOpportunityPageError);
  const tenantId = useSelector(selectTenantId);

  const [retryCount, setRetryCount] = useState(0);
  const maxRetriesReached = retryCount >= MAX_RETRIES;

  // Fetch data
  useEffect(() => {
    if (!tenantId) {
      const stored = localStorage.getItem('tenant_id');
      if (!stored) {
        toast.error('Please log in to continue.');
        navigate('/backoffice-login');
      }
      return;
    }

    dispatch(fetchOpportunityPage(tenantId))
      .unwrap()
      .then(() => {
        toast.success(successMessage);
        setRetryCount(0);
      })
      .catch(() => {
        if (retryCount < MAX_RETRIES) {
          setTimeout(() => setRetryCount(c => c + 1), 2000);
        } else {
          toast.error('Unable to load data – you can start adding content.');
        }
      });
  }, [tenantId, retryCount, dispatch, navigate, successMessage]);

  // Manual refresh function for post-save
  const refresh = useCallback(() => {
    if (tenantId) {
      dispatch(fetchOpportunityPage(tenantId))
        .unwrap()
        .then(() => {
          toast.success('Data refreshed!');
        })
        .catch(() => {
          toast.error('Failed to refresh data.');
        });
    }
  }, [tenantId, dispatch]);

  const handleRetry = () => {
    setRetryCount(0);
    dispatch(fetchOpportunityPage(tenantId));
  };

  return {
    opportunityData: data,
    loading,
    error,
    tenantId,
    maxRetriesReached,
    handleRetry,
    refresh, // Expose refresh function
  };
};