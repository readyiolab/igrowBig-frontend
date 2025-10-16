// src/store/slices/socialMediaSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/apiClient';

const initialState = {
  data: {},
  loading: false,
  error: null,
};

// Async Thunks
export const fetchSocialMediaLinks = createAsyncThunk(
  'socialMedia/fetch',
  async (tenantId, { rejectWithValue }) => {
    try {
      const response = await apiRequest('get', `/tenants/${tenantId}/footer/social-links`);
      return response || {};
    } catch (error) {
      if (error.response?.status === 404) {
        return {};
      }
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createSocialMediaLinks = createAsyncThunk(
  'socialMedia/create',
  async ({ tenantId, payload }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('post', `/tenants/${tenantId}/footer/social-links`, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateSocialMediaLinks = createAsyncThunk(
  'socialMedia/update',
  async ({ tenantId, payload }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('put', `/tenants/${tenantId}/footer/social-links`, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteSocialMediaLinks = createAsyncThunk(
  'socialMedia/delete',
  async (tenantId, { rejectWithValue }) => {
    try {
      await apiRequest('delete', `/tenants/${tenantId}/footer/social-links`);
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const socialMediaSlice = createSlice({
  name: 'socialMedia',
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
    resetData: (state) => {
      state.data = initialState.data;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch SocialMedia
      .addCase(fetchSocialMediaLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSocialMediaLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSocialMediaLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create SocialMedia
      .addCase(createSocialMediaLinks.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSocialMediaLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createSocialMediaLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update SocialMedia
      .addCase(updateSocialMediaLinks.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSocialMediaLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateSocialMediaLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete SocialMedia
      .addCase(deleteSocialMediaLinks.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSocialMediaLinks.fulfilled, (state) => {
        state.loading = false;
        state.data = {};
      })
      .addCase(deleteSocialMediaLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setData, resetData, clearError } = socialMediaSlice.actions;
export default socialMediaSlice.reducer;

// Selectors
export const selectSocialMediaData = (state) => state.socialMedia.data;
export const selectSocialMediaLoading = (state) => state.socialMedia.loading;
export const selectSocialMediaError = (state) => state.socialMedia.error;