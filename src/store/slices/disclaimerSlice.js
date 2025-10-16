// src/store/slices/disclaimerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/apiClient';

const initialState = {
  disclaimer: {
    id: null,
    site_disclaimer: '',
    product_disclaimer: '',
    income_disclaimer: '',
  },
  form: {
    site_disclaimer: '',
    product_disclaimer: '',
    income_disclaimer: '',
  },
  loading: false,
  error: null,
};

// Async Thunks
export const fetchDisclaimer = createAsyncThunk(
  'disclaimer/fetch',
  async (tenantId, { rejectWithValue }) => {
    try {
      const response = await apiRequest('get', `/tenants/${tenantId}/footer/disclaimers`);
      return response || {};
    } catch (error) {
      if (error.response?.status === 404) {
        return {}; // Handle not found gracefully
      }
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createDisclaimer = createAsyncThunk(
  'disclaimer/create',
  async ({ tenantId, formData }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('post', `/tenants/${tenantId}/footer/disclaimers`, formData, true);
      // Return the data from the response
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateDisclaimer = createAsyncThunk(
  'disclaimer/update',
  async ({ tenantId, formData }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('put', `/tenants/${tenantId}/footer/disclaimers`, formData, true);
      // Return the data from the response
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteDisclaimer = createAsyncThunk(
  'disclaimer/delete',
  async (tenantId, { rejectWithValue }) => {
    try {
      await apiRequest('delete', `/tenants/${tenantId}/footer/disclaimers`);
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const disclaimerSlice = createSlice({
  name: 'disclaimer',
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.form = { ...state.form, ...action.payload };
    },
    
    resetForm: (state) => {
      state.form = initialState.form;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Disclaimer
      .addCase(fetchDisclaimer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDisclaimer.fulfilled, (state, action) => {
        state.loading = false;
        state.disclaimer = {
          id: action.payload.id || null,
          site_disclaimer: action.payload.site_disclaimer || '',
          product_disclaimer: action.payload.product_disclaimer || '',
          income_disclaimer: action.payload.income_disclaimer || '',
        };
      })
      .addCase(fetchDisclaimer.rejected, (state, action) => {
        state.loading = false;
        state.disclaimer = initialState.disclaimer;
        if (action.payload?.message !== 'DISCLAIMERS_NOT_FOUND') {
          state.error = action.payload;
        }
      })
      
      // Create Disclaimer
      .addCase(createDisclaimer.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDisclaimer.fulfilled, (state, action) => {
        state.loading = false;
        // Update the disclaimer state with the returned data
        state.disclaimer = {
          id: action.payload.id || null,
          site_disclaimer: action.payload.site_disclaimer || '',
          product_disclaimer: action.payload.product_disclaimer || '',
          income_disclaimer: action.payload.income_disclaimer || '',
        };
        // Reset the form
        state.form = initialState.form;
      })
      .addCase(createDisclaimer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Disclaimer
      .addCase(updateDisclaimer.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDisclaimer.fulfilled, (state, action) => {
        state.loading = false;
        // Update the disclaimer state with the returned data
        state.disclaimer = {
          id: action.payload.id || state.disclaimer.id,
          site_disclaimer: action.payload.site_disclaimer || '',
          product_disclaimer: action.payload.product_disclaimer || '',
          income_disclaimer: action.payload.income_disclaimer || '',
        };
        // Reset the form
        state.form = initialState.form;
      })
      .addCase(updateDisclaimer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Disclaimer
      .addCase(deleteDisclaimer.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDisclaimer.fulfilled, (state) => {
        state.loading = false;
        state.disclaimer = initialState.disclaimer;
        state.form = initialState.form;
      })
      .addCase(deleteDisclaimer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFormData, resetForm, clearError } = disclaimerSlice.actions;
export default disclaimerSlice.reducer;

// Selectors
export const selectDisclaimer = (state) => state.disclaimer.disclaimer;
export const selectDisclaimerForm = (state) => state.disclaimer.form;
export const selectDisclaimerLoading = (state) => state.disclaimer.loading;
export const selectDisclaimerError = (state) => state.disclaimer.error;