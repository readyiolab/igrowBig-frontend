// src/store/slices/opportunityPageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/apiClient';

const initialState = {
  data: {},
  loading: false,
  error: null,
};

// Async Thunks
export const fetchOpportunityPage = createAsyncThunk(
  'opportunityPage/fetch',
  async (tenantId, { rejectWithValue }) => {
    try {
      const response = await apiRequest('get', `/tenants/${tenantId}/opportunity-page`);
      return response || {};
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateOpportunityPage = createAsyncThunk(
  'opportunityPage/update',
  async ({ tenantId, formData }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('put', `/tenants/${tenantId}/opportunity-page`, formData, true);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createOpportunityPage = createAsyncThunk(
  'opportunityPage/create',
  async ({ tenantId, formData }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('post', `/tenants/${tenantId}/opportunity-page`, formData, true);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteOpportunityPage = createAsyncThunk(
  'opportunityPage/delete',
  async (tenantId, { rejectWithValue }) => {
    try {
      await apiRequest('delete', `/tenants/${tenantId}/opportunity-page`);
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const opportunityPageSlice = createSlice({
  name: 'opportunityPage',
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
      // Fetch OpportunityPage
      .addCase(fetchOpportunityPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpportunityPage.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchOpportunityPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update OpportunityPage
      .addCase(updateOpportunityPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOpportunityPage.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateOpportunityPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create OpportunityPage
      .addCase(createOpportunityPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOpportunityPage.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createOpportunityPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete OpportunityPage
      .addCase(deleteOpportunityPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOpportunityPage.fulfilled, (state) => {
        state.loading = false;
        state.data = {};
      })
      .addCase(deleteOpportunityPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setData, resetData, clearError } = opportunityPageSlice.actions;
export default opportunityPageSlice.reducer;

// Selectors
export const selectOpportunityPageData = (state) => state.opportunityPage.data;
export const selectOpportunityPageLoading = (state) => state.opportunityPage.loading;
export const selectOpportunityPageError = (state) => state.opportunityPage.error;