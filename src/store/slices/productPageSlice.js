// src/store/slices/productPageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/apiClient';

const initialState = {
  data: {},
  loading: false,
  error: null,
};

// Async Thunks
export const fetchProductPage = createAsyncThunk(
  'productPage/fetch',
  async (tenantId, { rejectWithValue }) => {
    try {
      const response = await apiRequest('get', `/tenants/${tenantId}/product-page`);
      return response || {};
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateProductPage = createAsyncThunk(
  'productPage/update',
  async ({ tenantId, formData }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('put', `/tenants/${tenantId}/product-page`, formData, true);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createProductPage = createAsyncThunk(
  'productPage/create',
  async ({ tenantId, formData }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('post', `/tenants/${tenantId}/product-page`, formData, true);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const productPageSlice = createSlice({
  name: 'productPage',
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
      // Fetch ProductPage
      .addCase(fetchProductPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductPage.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProductPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update ProductPage
      .addCase(updateProductPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProductPage.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateProductPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create ProductPage
      .addCase(createProductPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProductPage.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createProductPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setData, resetData, clearError } = productPageSlice.actions;
export default productPageSlice.reducer;

// Selectors
export const selectProductPageData = (state) => state.productPage.data;
export const selectProductPageLoading = (state) => state.productPage.loading;
export const selectProductPageError = (state) => state.productPage.error;