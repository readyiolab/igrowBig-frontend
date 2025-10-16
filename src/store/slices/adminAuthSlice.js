// src/store/slices/adminAuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/apiClient';

// Async thunk for admin login
export const adminLogin = createAsyncThunk(
  'adminAuth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('POST', '/admin/login', {
        email,
        password,
      });

      if (!response?.token || !response?.admin) {
        throw new Error('Invalid response from server');
      }

      // Store all necessary data in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('admin_id', response.admin.id);
      localStorage.setItem('admin_name', response.admin.name);
      localStorage.setItem('admin_email', response.admin.email);

      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Login failed';
      const errorCode = error.response?.data?.error;
      
      return rejectWithValue({
        message: errorMsg,
        code: errorCode,
      });
    }
  }
);

// Async thunk for admin logout
export const adminLogout = createAsyncThunk(
  'adminAuth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('admin_id');
      localStorage.removeItem('admin_name');
      localStorage.removeItem('admin_email');
      
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    admin: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('token'),
  },
  reducers: {
    clearAdminAuthError: (state) => {
      state.error = null;
    },
    setAdminFromStorage: (state) => {
      const token = localStorage.getItem('token');
      const adminId = localStorage.getItem('admin_id');
      const adminName = localStorage.getItem('admin_name');
      const adminEmail = localStorage.getItem('admin_email');

      if (token && adminId) {
        state.token = token;
        state.isAuthenticated = true;
        state.admin = {
          id: adminId,
          name: adminName,
          email: adminEmail,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.admin = action.payload.admin;
        state.error = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.admin = null;
        state.error = action.payload;
      })
      // Logout cases
      .addCase(adminLogout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.admin = null;
        state.error = null;
      });
  },
});

export const { clearAdminAuthError, setAdminFromStorage } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;