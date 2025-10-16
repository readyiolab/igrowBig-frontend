// src/store/slices/notificationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/apiClient';

const initialState = {
  messages: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchMessages = createAsyncThunk(
  'notification/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('get', '/admin/messages');
      return response.messages || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const sendNotification = createAsyncThunk(
  'notification/sendNotification',
  async ({ title, message }, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiRequest('post', '/admin/notifications', { title, message });
      // Refetch messages after send
      dispatch(fetchMessages());
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetNotificationState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send Notification
      .addCase(sendNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendNotification.fulfilled, (state, action) => {
        state.loading = false;
        // Messages refetched in thunk
      })
      .addCase(sendNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetNotificationState } = notificationSlice.actions;
export default notificationSlice.reducer;

// Selectors
export const selectMessages = (state) => state.notification.messages;
export const selectNotificationLoading = (state) => state.notification.loading;
export const selectNotificationError = (state) => state.notification.error;