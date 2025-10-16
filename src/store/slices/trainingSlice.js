// src/store/slices/trainingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/apiClient';

const initialState = {
  trainings: [],
  categories: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchTrainings = createAsyncThunk(
  'training/fetchTrainings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('get', '/admin/training');
      return response.trainings || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'training/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('get', '/admin/training/categories');
      return response.categories || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createTraining = createAsyncThunk(
  'training/createTraining',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await apiRequest('post', '/admin/training', formData, true); // true for multipart
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateTraining = createAsyncThunk(
  'training/updateTraining',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('put', `/admin/training/${id}`, formData, true);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteTraining = createAsyncThunk(
  'training/deleteTraining',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiRequest('delete', `/admin/training/${id}`);
      return { id, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createCategory = createAsyncThunk(
  'training/createCategory',
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiRequest('post', '/admin/training/categories', data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateCategory = createAsyncThunk(
  'training/updateCategory',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('put', `/admin/training/categories/${id}`, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'training/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiRequest('delete', `/admin/training/categories/${id}`);
      return { id, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetTrainingState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Trainings
      .addCase(fetchTrainings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainings.fulfilled, (state, action) => {
        state.loading = false;
        state.trainings = action.payload;
      })
      .addCase(fetchTrainings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Training
      .addCase(createTraining.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTraining.fulfilled, (state, action) => {
        state.loading = false;
        state.trainings.push(action.payload.training || action.payload); // Adjust based on response structure
      })
      .addCase(createTraining.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Training
      .addCase(updateTraining.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTraining.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTraining = action.payload.training || action.payload;
        const index = state.trainings.findIndex(t => t.id === updatedTraining.id);
        if (index !== -1) state.trainings[index] = updatedTraining;
      })
      .addCase(updateTraining.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Training
      .addCase(deleteTraining.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTraining.fulfilled, (state, action) => {
        state.loading = false;
        state.trainings = state.trainings.filter(t => t.id !== action.payload.id);
      })
      .addCase(deleteTraining.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload.category || action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCategory = action.payload.category || action.payload;
        const index = state.categories.findIndex(c => c.id === updatedCategory.id);
        if (index !== -1) state.categories[index] = updatedCategory;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(c => c.id !== action.payload.id);
        // Update trainings: set category to null if deleted
        state.trainings = state.trainings.map(t => 
          t.category_id === action.payload.id 
            ? { ...t, category_id: null, category_name: null } 
            : t
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetTrainingState } = trainingSlice.actions;
export default trainingSlice.reducer;

// Selectors
export const selectTrainings = (state) => state.training.trainings;
export const selectCategories = (state) => state.training.categories;
export const selectTrainingLoading = (state) => state.training.loading;
export const selectTrainingError = (state) => state.training.error;