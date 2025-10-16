// src/store/slices/adminNotificationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/apiClient';

// Async thunk for sending notification
export const sendAdminNotification = createAsyncThunk(
  'adminNotification/sendNotification',
  async ({ title, message }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.adminAuth.token || localStorage.getItem('token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await apiRequest(
        'POST',
        '/admin/notifications',
        { title, message }
      );

      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'An error occurred';
      const errorCode = error.response?.data?.error;
      
      return rejectWithValue({
        message: errorMsg,
        error: errorCode || 'NOTIFICATION_ERROR',
      });
    }
  }
);

// Async thunk for fetching all notifications (optional)
export const fetchAdminNotifications = createAsyncThunk(
  'adminNotification/fetchNotifications',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.adminAuth.token || localStorage.getItem('token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await apiRequest('GET', '/admin/notifications');
      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch notifications';
      return rejectWithValue({
        message: errorMsg,
        error: error.response?.data?.error || 'FETCH_ERROR',
      });
    }
  }
);

const adminNotificationSlice = createSlice({
  name: 'adminNotification',
  initialState: {
    loading: false,
    success: null,
    error: null,
    lastNotification: null,
    notifications: [],
    fetchLoading: false,
  },
  reducers: {
    clearAdminNotificationStatus: (state) => {
      state.success = null;
      state.error = null;
    },
    resetAdminNotificationState: (state) => {
      state.loading = false;
      state.success = null;
      state.error = null;
      state.lastNotification = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send notification cases
      .addCase(sendAdminNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(sendAdminNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || 'Notification sent successfully';
        state.lastNotification = action.payload;
        
        // Add to notifications list if it exists
        if (state.notifications && action.payload.notification_id) {
          state.notifications.unshift(action.payload);
        }
      })
      .addCase(sendAdminNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch notifications cases
      .addCase(fetchAdminNotifications.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchAdminNotifications.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.notifications = action.payload.notifications || action.payload;
      })
      .addCase(fetchAdminNotifications.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminNotificationStatus, resetAdminNotificationState } =
  adminNotificationSlice.actions;

export default adminNotificationSlice.reducer;