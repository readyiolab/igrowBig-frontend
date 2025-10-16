// src/store/slices/tenantSettingsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "@/utils/apiClient";

const initialFormData = {
  domain_type: "sub_domain",
  custom_domain: "",
  first_name: "",
  last_name: "",
  email_id: "",
  mobile: "",
  address: "",
  skype: "",
  site_name: "",
  site_logo_name: "",
  nht_website_link: "",
  nht_store_link: "",
  nht_joining_link: "",
  dns_status: "pending",
  custom_domain_status: "pending",
  publish_on_site: false,
};

const initialState = {
  settings: null,
  form: initialFormData,
  loading: false,
  error: null,
  showForm: false,
  websiteStep: 0,
  validationErrors: [],
  verificationData: null,
  showDNSInstructions: false,
  dnsLoading: false,
};

// Async Thunks
export const fetchTenantSettings = createAsyncThunk(
  "tenantSettings/fetch",
  async (tenantId, { rejectWithValue }) => {
    try {
      const response = await apiRequest("get", `/tenants/${tenantId}/settings`);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const updateTenantSettings = createAsyncThunk(
  "tenantSettings/update",
  async ({ tenantId, formData }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(
        "put",
        `/tenants/${tenantId}/settings`,
        formData,
        true
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const refreshDNSStatus = createAsyncThunk(
  "tenantSettings/refreshDNS",
  async (tenantId, { rejectWithValue }) => {
    try {
      const response = await apiRequest("get", `/tenants/${tenantId}/settings`);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

const tenantSettingsSlice = createSlice({
  name: "tenantSettings",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.form = { ...state.form, ...action.payload };
    },
    setFormField: (state, action) => {
      const { name, value, type, checked } = action.payload;
      
      if (name === 'site_logo') {
        return;
      }
      
      state.form[name] = type === "checkbox" ? checked : value;
    },
    setLogoFileName: (state, action) => {
      state.form.site_logo_name = action.payload;
    },
    setWebsiteStep: (state, action) => {
      state.websiteStep = action.payload;
    },
    setValidationErrors: (state, action) => {
      state.validationErrors = action.payload;
    },
    setVerificationData: (state, action) => {
      state.verificationData = action.payload;
    },
    setShowDNSInstructions: (state, action) => {
      state.showDNSInstructions = action.payload;
    },
    openForm: (state) => {
      state.showForm = true;
      state.websiteStep = 0;
      state.validationErrors = [];
    },
    closeForm: (state) => {
      state.showForm = false;
      state.websiteStep = 0;
      state.validationErrors = [];
      // Don't clear verification data if domain is still pending
      if (state.settings?.custom_domain_status !== "pending") {
        state.verificationData = null;
        state.showDNSInstructions = false;
      }
      // Reset form to current settings instead of initial data
      if (state.settings) {
        state.form = {
          domain_type: state.settings.domain_type || "sub_domain",
          custom_domain: state.settings.custom_domain || "",
          first_name: state.settings.first_name || "",
          last_name: state.settings.last_name || "",
          email_id: state.settings.email_id || "",
          mobile: state.settings.mobile || "",
          address: state.settings.address || "",
          skype: state.settings.skype || "",
          site_name: state.settings.site_name || "",
          site_logo_name: "",
          nht_website_link: state.settings.nht_website_link || "",
          nht_store_link: state.settings.nht_store_link || "",
          nht_joining_link: state.settings.nht_joining_link || "",
          dns_status: state.settings.dns_status || "pending",
          custom_domain_status: state.settings.custom_domain_status || "pending",
          publish_on_site: !!state.settings.publish_on_site,
        };
      }
    },
    resetForm: (state) => {
      state.form = initialFormData;
      state.validationErrors = [];
      state.websiteStep = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tenant Settings
      .addCase(fetchTenantSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenantSettings.fulfilled, (state, action) => {
        state.loading = false;
        const settingsData = action.payload.settings || {};
        const verification = action.payload.verification || null;
        
        state.settings = settingsData;
        state.form = {
          domain_type: settingsData.domain_type || "sub_domain",
          custom_domain: settingsData.custom_domain || "",
          first_name: settingsData.first_name || "",
          last_name: settingsData.last_name || "",
          email_id: settingsData.email_id || "",
          mobile: settingsData.mobile || "",
          address: settingsData.address || "",
          skype: settingsData.skype || "",
          site_name: settingsData.site_name || "",
          site_logo_name: "",
          nht_website_link: settingsData.nht_website_link || "",
          nht_store_link: settingsData.nht_store_link || "",
          nht_joining_link: settingsData.nht_joining_link || "",
          dns_status: settingsData.dns_status || "pending",
          custom_domain_status: settingsData.custom_domain_status || "pending",
          publish_on_site: !!settingsData.publish_on_site,
        };

        // Show DNS instructions only if domain is pending and verification exists
        if (settingsData.custom_domain && settingsData.custom_domain_status === "pending") {
          if (verification) {
            state.verificationData = verification;
          }
          state.showDNSInstructions = true;
        } else {
          state.verificationData = null;
          state.showDNSInstructions = false;
        }
      })
      .addCase(fetchTenantSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.settings = {};
      })

      // Update Tenant Settings
      .addCase(updateTenantSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTenantSettings.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload;
        const settingsData = response.settings || {};

        state.settings = settingsData;

        // Update form with new settings
        state.form = {
          ...state.form,
          domain_type: settingsData.domain_type || state.form.domain_type,
          custom_domain: settingsData.custom_domain || "",
          first_name: settingsData.first_name || state.form.first_name,
          last_name: settingsData.last_name || state.form.last_name,
          email_id: settingsData.email_id || state.form.email_id,
          mobile: settingsData.mobile || state.form.mobile,
          address: settingsData.address || state.form.address,
          skype: settingsData.skype || state.form.skype,
          site_name: settingsData.site_name || state.form.site_name,
          site_logo_name: "",
          nht_website_link: settingsData.nht_website_link || state.form.nht_website_link,
          nht_store_link: settingsData.nht_store_link || state.form.nht_store_link,
          nht_joining_link: settingsData.nht_joining_link || state.form.nht_joining_link,
          dns_status: settingsData.dns_status || "pending",
          custom_domain_status: settingsData.custom_domain_status || "pending",
          publish_on_site: !!settingsData.publish_on_site,
        };

        // Handle verification data
        if (response.verification) {
          state.verificationData = response.verification;

          // Show DNS instructions only if status is pending
          if (response.verification.status === "pending" || 
              settingsData.custom_domain_status === "pending") {
            state.showDNSInstructions = true;
            state.websiteStep = 0;
          }

          // Hide instructions if verified
          if (response.verification.status === "verified" || 
              settingsData.custom_domain_status === "verified") {
            state.showDNSInstructions = false;
            state.verificationData = null;
          }
        } else if (settingsData.custom_domain_status === "verified") {
          // No verification data but domain is verified
          state.showDNSInstructions = false;
          state.verificationData = null;
        }
      })
      .addCase(updateTenantSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Refresh DNS Status
      .addCase(refreshDNSStatus.pending, (state) => {
        state.dnsLoading = true;
        state.error = null;
      })
      .addCase(refreshDNSStatus.fulfilled, (state, action) => {
        state.dnsLoading = false;
        const settingsData = action.payload.settings || {};
        const verification = action.payload.verification || null;

        state.settings = {
          ...state.settings,
          ...settingsData,
        };

        state.form = {
          ...state.form,
          dns_status: settingsData.dns_status || state.form.dns_status,
          custom_domain_status: settingsData.custom_domain_status || state.form.custom_domain_status,
        };

        // Handle DNS verification status
        if (settingsData.custom_domain_status === "verified") {
          state.showDNSInstructions = false;
          state.verificationData = null;
        } else if (settingsData.custom_domain && settingsData.custom_domain_status === "pending") {
          if (verification) {
            state.verificationData = verification;
          }
          state.showDNSInstructions = true;
        }
      })
      .addCase(refreshDNSStatus.rejected, (state, action) => {
        state.dnsLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFormData,
  setFormField,
  setLogoFileName,
  setWebsiteStep,
  setValidationErrors,
  setVerificationData,
  setShowDNSInstructions,
  openForm,
  closeForm,
  resetForm,
  clearError,
} = tenantSettingsSlice.actions;

export default tenantSettingsSlice.reducer;

// Selectors
export const selectTenantSettings = (state) => state.tenantSettings.settings;
export const selectTenantForm = (state) => state.tenantSettings.form;
export const selectTenantLoading = (state) => state.tenantSettings.loading;
export const selectTenantError = (state) => state.tenantSettings.error;
export const selectShowForm = (state) => state.tenantSettings.showForm;
export const selectWebsiteStep = (state) => state.tenantSettings.websiteStep;
export const selectValidationErrors = (state) =>
  state.tenantSettings.validationErrors;
export const selectVerificationData = (state) =>
  state.tenantSettings.verificationData;
export const selectShowDNSInstructions = (state) =>
  state.tenantSettings.showDNSInstructions;
export const selectDNSLoading = (state) => state.tenantSettings.dnsLoading;