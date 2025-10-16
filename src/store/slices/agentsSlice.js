// src/store/slices/agentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/apiClient';

// Initial State
const initialState = {
  agents: [],
  selectedAgent: null,
  settings: null,
  verificationInstructions: null,
  loading: false,
  error: null,
  validationErrors: [],
  searchTerm: '',
  entriesPerPage: 10,
  showProfile: false,
  websiteStep: 0,
  websiteFormData: {
    domain_type: 'sub_domain',
    primary_domain_name: '',
    website_link: '',
    first_name: '',
    last_name: '',
    email_id: '',
    mobile: '',
    address: '',
    skype: '',
    site_name: '',
    site_logo: null,
    nht_website_link: '',
    nht_store_link: '',
    nht_joining_link: '',
    dns_status: 'pending',
    custom_domain: '',
  },
};

// Async Thunks
export const fetchAgents = createAsyncThunk(
  'agents/fetchAgents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('GET', '/admin/tenant-users');
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAgentSettings = createAsyncThunk(
  'agents/fetchAgentSettings',
  async (tenantId, { rejectWithValue }) => {
    try {
      const response = await apiRequest('GET', `/admin/settings/${tenantId}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateAgentSettings = createAsyncThunk(
  'agents/updateAgentSettings',
  async ({ tenantId, formData }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('PUT', `/admin/settings/${tenantId}`, formData, true);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const toggleAgentStatus = createAsyncThunk(
  'agents/toggleAgentStatus',
  async ({ userId, newStatus }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('PUT', '/admin/user-status', {
        user_id: userId,
        subscription_status: newStatus,
      });
      return { userId, newStatus, message: response.message };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    
    setEntriesPerPage: (state, action) => {
      state.entriesPerPage = action.payload;
    },
    
    setShowProfile: (state, action) => {
      state.showProfile = action.payload;
    },
    
    setSelectedAgent: (state, action) => {
      state.selectedAgent = action.payload;
    },
    
    setWebsiteStep: (state, action) => {
      state.websiteStep = action.payload;
    },
    
    updateWebsiteFormData: (state, action) => {
      state.websiteFormData = {
        ...state.websiteFormData,
        ...action.payload,
      };
    },
    
    setWebsiteFormData: (state, action) => {
      state.websiteFormData = action.payload;
    },
    
    setValidationErrors: (state, action) => {
      state.validationErrors = action.payload;
    },
    
    clearValidationErrors: (state) => {
      state.validationErrors = [];
    },
    
    nextWebsiteStep: (state) => {
      if (state.websiteStep < 4) {
        state.websiteStep += 1;
      }
    },
    
    previousWebsiteStep: (state) => {
      if (state.websiteStep > 0) {
        state.websiteStep -= 1;
      }
    },
    
    openAgentProfile: (state, action) => {
      state.selectedAgent = action.payload;
      state.showProfile = true;
      state.websiteStep = 0;
      state.validationErrors = [];
      state.verificationInstructions = null;
    },
    
    closeAgentProfile: (state) => {
      state.showProfile = false;
      state.selectedAgent = null;
      state.websiteStep = 0;
      state.settings = null;
      state.validationErrors = [];
      state.verificationInstructions = null;
      state.websiteFormData = initialState.websiteFormData;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    resetAgentsState: () => initialState,
  },
  
  extraReducers: (builder) => {
    // Fetch Agents
    builder
      .addCase(fetchAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.loading = false;
        const users = action.payload.users || [];
        state.agents = users.map((user) => ({
          id: user.id,
          first_name: user.name.split(' ')[0] || user.name,
          last_name: user.name.split(' ')[1] || '',
          email_id: user.email,
          website_link: user.website_link || '',
          subscription_status: user.status || 'active',
          tenant_id: user.tenant_id,
          plan: user.plan || 'none',
          dns_status: user.dns_status || 'pending',
        }));
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.agents = [];
      });
    
    // Fetch Agent Settings
    builder
      .addCase(fetchAgentSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentSettings.fulfilled, (state, action) => {
        state.loading = false;
        const settingsData = action.payload.settings || {};
        state.settings = settingsData;
        
        // Update website form data with fetched settings
        state.websiteFormData = {
          domain_type: settingsData.domain_type || 'sub_domain',
          primary_domain_name: settingsData.primary_domain_name || 'igrowbig.com',
          website_link: settingsData.website_link || '',
          first_name: settingsData.first_name || state.selectedAgent?.first_name || '',
          last_name: settingsData.last_name || state.selectedAgent?.last_name || '',
          email_id: settingsData.email_id || state.selectedAgent?.email_id || '',
          mobile: settingsData.mobile || '',
          address: settingsData.address || 'Not set',
          skype: settingsData.skype || '',
          site_name: settingsData.site_name || 'Default Site',
          site_logo: null,
          nht_website_link: settingsData.nht_website_link || '',
          nht_store_link: settingsData.nht_store_link || '',
          nht_joining_link: settingsData.nht_joining_link || '',
          dns_status: settingsData.dns_status || 'pending',
          custom_domain: settingsData.custom_domain || '',
        };
      })
      .addCase(fetchAgentSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.settings = {};
      });
    
    // Update Agent Settings
    builder
      .addCase(updateAgentSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = [];
      })
      .addCase(updateAgentSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload.settings;
        
        if (action.payload.verification) {
          state.verificationInstructions = action.payload.verification;
        }
        
        // Update the agent in the list
        const agentIndex = state.agents.findIndex(
          (agent) => agent.tenant_id === state.selectedAgent?.tenant_id
        );
        if (agentIndex !== -1) {
          state.agents[agentIndex] = {
            ...state.agents[agentIndex],
            website_link: action.payload.settings.website_link,
            dns_status: action.payload.settings.dns_status,
          };
        }
      })
      .addCase(updateAgentSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
        // Handle validation errors
        if (action.payload?.errors) {
          state.validationErrors = action.payload.errors;
        } else {
          state.validationErrors = [{ msg: action.payload?.message || 'Failed to update settings' }];
        }
      });
    
    // Toggle Agent Status
    builder
      .addCase(toggleAgentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleAgentStatus.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update agent in list
        const agentIndex = state.agents.findIndex((agent) => agent.id === action.payload.userId);
        if (agentIndex !== -1) {
          state.agents[agentIndex].subscription_status = action.payload.newStatus;
        }
        
        // Update selected agent if it's the same one
        if (state.selectedAgent?.id === action.payload.userId) {
          state.selectedAgent.subscription_status = action.payload.newStatus;
        }
      })
      .addCase(toggleAgentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Actions
export const {
  setSearchTerm,
  setEntriesPerPage,
  setShowProfile,
  setSelectedAgent,
  setWebsiteStep,
  updateWebsiteFormData,
  setWebsiteFormData,
  setValidationErrors,
  clearValidationErrors,
  nextWebsiteStep,
  previousWebsiteStep,
  openAgentProfile,
  closeAgentProfile,
  clearError,
  resetAgentsState,
} = agentsSlice.actions;

// Selectors
export const selectAgents = (state) => state.agents.agents;
export const selectFilteredAgents = (state) => {
  const { agents, searchTerm } = state.agents;
  if (!searchTerm) return agents;
  
  return agents.filter(
    (agent) =>
      `${agent.first_name} ${agent.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email_id.toLowerCase().includes(searchTerm.toLowerCase())
  );
};
export const selectDisplayedAgents = (state) => {
  const filtered = selectFilteredAgents(state);
  return filtered.slice(0, state.agents.entriesPerPage);
};
export const selectSelectedAgent = (state) => state.agents.selectedAgent;
export const selectAgentSettings = (state) => state.agents.settings;
export const selectVerificationInstructions = (state) => state.agents.verificationInstructions;
export const selectAgentsLoading = (state) => state.agents.loading;
export const selectAgentsError = (state) => state.agents.error;
export const selectValidationErrors = (state) => state.agents.validationErrors;
export const selectSearchTerm = (state) => state.agents.searchTerm;
export const selectEntriesPerPage = (state) => state.agents.entriesPerPage;
export const selectShowProfile = (state) => state.agents.showProfile;
export const selectWebsiteStep = (state) => state.agents.websiteStep;
export const selectWebsiteFormData = (state) => state.agents.websiteFormData;

export default agentsSlice.reducer;