// src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSubmitting: false,
  showForm: false,
  isEditing: false,
  editId: null,
  searchTerm: '',
  retryCount: 0,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    
    openForm: (state, action) => {
      state.showForm = true;
      state.isEditing = action.payload?.isEditing || false;
      state.editId = action.payload?.editId || null;
    },
    
    closeForm: (state) => {
      state.showForm = false;
      state.isEditing = false;
      state.editId = null;
    },
    
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    
    incrementRetry: (state) => {
      state.retryCount += 1;
    },
    
    resetRetry: (state) => {
      state.retryCount = 0;
    },
    
    resetUiState: () => initialState,
  },
});

export const {
  setSubmitting,
  openForm,
  closeForm,
  setSearchTerm,
  incrementRetry,
  resetRetry,
  resetUiState,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectUi = (state) => state.ui;
export const selectIsSubmitting = (state) => state.ui.isSubmitting;
export const selectShowForm = (state) => state.ui.showForm;
export const selectIsEditing = (state) => state.ui.isEditing;
export const selectEditId = (state) => state.ui.editId;
export const selectSearchTerm = (state) => state.ui.searchTerm;
export const selectRetryCount = (state) => state.ui.retryCount;