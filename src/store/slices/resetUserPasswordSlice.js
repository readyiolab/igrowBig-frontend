// src/store/slices/resetUserPasswordSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/apiClient';

const initialState = {
  users: [],
  userStats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
};

// Async Thunks
export const fetchTenantUsers = createAsyncThunk(
  'resetUserPassword/fetchTenantUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('get', '/admin/tenant-users');
      return response; // Expect { users: [...], userStats: {...} }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  'resetUserPassword/resetUserPassword',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiRequest('post', '/admin/reset-user-password', payload);
      // Refetch users after reset
      dispatch(fetchTenantUsers());
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const resetUserPasswordSlice = createSlice({
  name: 'resetUserPassword',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tenant Users
      .addCase(fetchTenantUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenantUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users || [];
        state.userStats = action.payload.userStats || { total: 0, active: 0, inactive: 0 };
      })
      .addCase(fetchTenantUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reset Password
      .addCase(resetUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        state.loading = false;
        // Users already refetched in thunk
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetState } = resetUserPasswordSlice.actions;
export default resetUserPasswordSlice.reducer;

// Selectors
export const selectTenantUsers = (state) => state.resetUserPassword?.users || [];
export const selectUserStats = (state) => state.resetUserPassword?.userStats || { total: 0, active: 0, inactive: 0 };
export const selectResetPasswordLoading = (state) => state.resetUserPassword?.loading || false;
export const selectResetPasswordError = (state) => state.resetUserPassword?.error || null;