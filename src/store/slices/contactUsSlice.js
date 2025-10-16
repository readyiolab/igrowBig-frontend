// src/store/slices/contactUsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/apiClient';

const initialState = {
  items: [],
  form: {
    text: '',
    currentImage: null, // Only store URL string, not File object
  },
  loading: false,
  error: null,
};

// Async Thunks
export const fetchContactUs = createAsyncThunk(
  'contactUs/fetchAll',
  async (tenantId, { rejectWithValue }) => {
    try {
      const response = await apiRequest('get', `/tenants/${tenantId}/contactus`);
      return Array.isArray(response) ? response.map((page) => ({
        id: page.id,
        image: page.contactus_image || '',
        text: page.contactus_text || '',
        created_at: page.created_at ? page.created_at.split("T")[0] : '',
      })) : [];
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createContactUs = createAsyncThunk(
  'contactUs/create',
  async ({ tenantId, formData }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('post', `/tenants/${tenantId}/contactus`, formData, true);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateContactUs = createAsyncThunk(
  'contactUs/update',
  async ({ tenantId, pageId, formData }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('put', `/tenants/${tenantId}/contactus/${pageId}`, formData, true);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteContactUs = createAsyncThunk(
  'contactUs/delete',
  async ({ tenantId, pageId }, { rejectWithValue }) => {
    try {
      await apiRequest('delete', `/tenants/${tenantId}/contactus/${pageId}`);
      return pageId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const contactUsSlice = createSlice({
  name: 'contactUs',
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
      // Fetch ContactUs
      .addCase(fetchContactUs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactUs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchContactUs.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (payload && payload.error === 'CONTACTUS_NOT_FOUND') {
          // Treat "not found" as empty list, not an error
          state.items = [];
          state.error = null;
        } else {
          state.error = payload;
        }
      })
      
      // Create ContactUs
      .addCase(createContactUs.pending, (state) => {
        state.loading = true;
      })
      .addCase(createContactUs.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push({
          id: action.payload.id,
          image: action.payload.contactus_image,
          text: action.payload.contactus_text,
          created_at: action.payload.created_at ? action.payload.created_at.split("T")[0] : '',
        });
      })
      .addCase(createContactUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update ContactUs
      .addCase(updateContactUs.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateContactUs.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = {
            id: action.payload.id,
            image: action.payload.contactus_image,
            text: action.payload.contactus_text,
            created_at: action.payload.created_at ? action.payload.created_at.split("T")[0] : '',
          };
        }
      })
      .addCase(updateContactUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete ContactUs
      .addCase(deleteContactUs.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteContactUs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteContactUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFormData, resetForm, clearError } = contactUsSlice.actions;
export default contactUsSlice.reducer;

// Selectors
export const selectContactUs = (state) => state.contactUs.items;
export const selectContactUsForm = (state) => state.contactUs.form;
export const selectContactUsLoading = (state) => state.contactUs.loading;
export const selectContactUsError = (state) => state.contactUs.error;