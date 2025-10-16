// src/store/slices/subscriberSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/apiClient';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchSubscribers = createAsyncThunk(
  'subscribers/fetchAll',
  async (tenantId, { rejectWithValue }) => {
    try {
      const response = await apiRequest('get', `/tenants/${tenantId}/subscribers`);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const subscriberSlice = createSlice({
  name: 'subscribers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Subscribers
      .addCase(fetchSubscribers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSubscribers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = subscriberSlice.actions;
export default subscriberSlice.reducer;

// Selectors
export const selectSubscribers = (state) => state.subscribers.items;
export const selectSubscriberLoading = (state) => state.subscribers.loading;
export const selectSubscriberError = (state) => state.subscribers.error;