// src/hooks/index.js

// Import all custom hooks first
import { useHomepageData } from './useHomepageData';
import { useOpportunityData } from './useOpportunityData'; // Added new hook
import { useDebounce, useDebouncedCallback } from './useDebounce';
import { useImageValidation } from './useImageValidation';
import { useVideoValidation } from './useVideoValidation';
import { useFormSubmit } from './useFormSubmit'
import { useOpportunityFormSubmit } from './useOpportunityFormSubmit';
import { usePreserveHomePageFields } from './usePreserveHomePageFields';

// Re-export all hooks individually
export {
  useHomepageData,
  useOpportunityData, 
  useDebounce,
  useDebouncedCallback,
  useImageValidation,
  useVideoValidation,
  useFormSubmit,
  useOpportunityFormSubmit,
  usePreserveHomePageFields,
};

// Export hook groups for easier imports
export const dataHooks = {
  useHomepageData,
  useOpportunityData,
  usePreserveHomePageFields,
};

export const validationHooks = {
  useImageValidation,
  useVideoValidation,
};

export const utilityHooks = {
  useDebounce,
  useDebouncedCallback,
  useFormSubmit,
  useOpportunityFormSubmit,
};


const allHooks = {
  useHomepageData,
  useOpportunityData, 
  useDebounce,
  useDebouncedCallback,
  useImageValidation,
  useVideoValidation,
  useFormSubmit,
  useOpportunityFormSubmit,
  usePreserveHomePageFields,
  dataHooks,
  validationHooks,
  utilityHooks,
};

export default allHooks;