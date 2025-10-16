// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/apiClient';

const initialState = {
  tenantId: localStorage.getItem('tenant_id') || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  user: null,

  // New: For async flows (login, forgot, reset)
  loading: false,
  error: null,
  message: null, // Success messages (e.g., "Reset link sent")
};

// Async Thunks for Password Reset (integrated here)
export const forgotPasswordAsync = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiRequest('post', '/users/forgot-password', { email });
      return response; // Expect { message: 'If exists, link sent' }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const resetPasswordAsync = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, email, newPassword }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('post', '/users/reset-password', {
        token,
        email,
        newPassword,
      });
      return response; // Expect { message: 'Password reset successfully' }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, tenantId, user } = action.payload;
      state.token = token;
      state.tenantId = tenantId;
      state.user = user;
      state.isAuthenticated = true;
      
      if (token) localStorage.setItem('token', token);
      if (tenantId) localStorage.setItem('tenant_id', tenantId);
      // Clear any temp messages/errors
      state.loading = false;
      state.error = null;
      state.message = null;
    },
    
    logout: (state) => {
      state.token = null;
      state.tenantId = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.message = null;
      localStorage.clear();
    },
    
    updateTenantId: (state, action) => {
      state.tenantId = action.payload;
      localStorage.setItem('tenant_id', action.payload);
    },

    // New: Clear helpers for password flows
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    resetAuthState: () => initialState, // Full reset if needed
  },
  extraReducers: (builder) => {
    // Forgot Password
    builder
      .addCase(forgotPasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(forgotPasswordAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || 'If the email exists, a reset link has been sent.';
      })
      .addCase(forgotPasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Reset Password
    builder
      .addCase(resetPasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPasswordAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || 'Password reset successfully.';
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setCredentials, 
  logout, 
  updateTenantId,
  clearError,
  clearMessage,
  resetAuthState 
} = authSlice.actions;
export default authSlice.reducer;

// Selectors (extended)
export const selectAuth = (state) => state.auth;
export const selectTenantId = (state) => state.auth.tenantId;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;

// New selectors for password flows
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthMessage = (state) => state.auth.message;