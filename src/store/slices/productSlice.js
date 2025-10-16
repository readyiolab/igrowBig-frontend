// src/store/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/apiClient';

const initialState = {
  items: [],
  form: {
    category_id: '',
    name: '',
    title: '',
    your_price: '',
    base_price: '',
    preferred_customer_price: '',
    availability: 'in_stock',
    status: 'active',
    image: null,
    banner_image: null,
    guide_pdf: null,
    video: null,
    video_url: '',
    instructions: '',
    description: '',
    buy_link: '',
  },
  loading: false,
  error: null,
};

// Async Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (tenantId, { rejectWithValue }) => {
    try {
      const response = await apiRequest('get', `/tenants/${tenantId}/products`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async ({ tenantId, formData }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('post', `/tenants/${tenantId}/products`, formData, true);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ tenantId, productId, formData }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('put', `/tenants/${tenantId}/products/${productId}`, formData, true);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async ({ tenantId, productId }, { rejectWithValue }) => {
    try {
      await apiRequest('delete', `/tenants/${tenantId}/products/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const productSlice = createSlice({
  name: 'products',
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
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFormData, resetForm, clearError } = productSlice.actions;
export default productSlice.reducer;

// Selectors
export const selectProducts = (state) => state.products.items;
export const selectProductForm = (state) => state.products.form;
export const selectProductLoading = (state) => state.products.loading;
export const selectProductError = (state) => state.products.error;