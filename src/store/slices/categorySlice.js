// src/store/slices/categorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/apiClient';

const initialState = {
  items: [],
  form: {
    name: '',
    description: '',
    image: null,
    status: 'active',
  },
  loading: false,
  error: null,
};

// Async Thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (tenantId, { rejectWithValue }) => {
    try {
      const response = await apiRequest('get', `/tenants/${tenantId}/categories`);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/create',
  async ({ tenantId, formData }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('post', `/tenants/${tenantId}/categories`, formData, true);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ tenantId, categoryId, formData }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('put', `/tenants/${tenantId}/categories/${categoryId}`, formData, true);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async ({ tenantId, categoryId }, { rejectWithValue }) => {
    try {
      await apiRequest('delete', `/tenants/${tenantId}/categories/${categoryId}`);
      return categoryId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
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
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFormData, resetForm, clearError } = categorySlice.actions;
export default categorySlice.reducer;

// Selectors
export const selectCategories = (state) => state.categories.items;
export const selectCategoryForm = (state) => state.categories.form;
export const selectCategoryLoading = (state) => state.categories.loading;
export const selectCategoryError = (state) => state.categories.error;