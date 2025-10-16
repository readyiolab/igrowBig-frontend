// src/store/slices/homePageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/apiClient';

const initialState = {
  data: {},
  loading: false,
  error: null,
};

// Async Thunks
export const fetchHomePage = createAsyncThunk(
  'homePage/fetch',
  async (tenantId, { rejectWithValue }) => {
    try {
      const response = await apiRequest('get', `/tenants/${tenantId}/home-page`);
      return response || {};
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateHomePage = createAsyncThunk(
  'homePage/update',
  async ({ tenantId, formData }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('put', `/tenants/${tenantId}/home-page`, formData, true);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const homePageSlice = createSlice({
  name: 'homePage',
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
      // Fetch HomePage
      .addCase(fetchHomePage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomePage.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchHomePage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update HomePage - MERGE instead of REPLACE
      .addCase(updateHomePage.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateHomePage.fulfilled, (state, action) => {
        state.loading = false;
        // Merge the updated data with existing data instead of replacing
        state.data = { ...state.data, ...action.payload.data };
      })
      .addCase(updateHomePage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setData, resetData, clearError } = homePageSlice.actions;
export default homePageSlice.reducer;

// Selectors
export const selectHomePageData = (state) => state.homePage.data;
export const selectHomePageLoading = (state) => state.homePage.loading;
export const selectHomePageError = (state) => state.homePage.error;