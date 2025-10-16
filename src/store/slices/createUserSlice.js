// src/store/slices/createUserSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/apiClient';

const initialState = {
  templates: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchTemplates = createAsyncThunk(
  'createUser/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('get', '/templates');
      return Array.isArray(response) ? response.filter(t => t.id && t.name && t.description && t.image) : [];
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createUser = createAsyncThunk(
  'createUser/create',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiRequest('post', '/admin/create-user', payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const createUserSlice = createSlice({
  name: 'createUser',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCreateUserState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Templates
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally handle success data if needed
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetCreateUserState } = createUserSlice.actions;
export default createUserSlice.reducer;

// Selectors
export const selectTemplates = (state) => state.createUser.templates;
export const selectCreateUserLoading = (state) => state.createUser.loading;
export const selectCreateUserError = (state) => state.createUser.error;