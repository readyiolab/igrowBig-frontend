// src/store/slices/blogSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/apiClient';

const initialState = {
  items: [], // array of blogs with nested banners
  blogForm: {
    title: '',
    content: '',
    image: null,
    is_visible: true,
  },
  bannerForm: {
    image: null,
    image_content: '',
    currentImage: null,
  },
  loading: false,
  error: null,
};

// Async Thunks
export const fetchBlogs = createAsyncThunk(
  'blogs/fetchAll',
  async (tenantId, { rejectWithValue }) => {
    try {
      const response = await apiRequest('get', `/tenants/${tenantId}/blogs`);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createBlog = createAsyncThunk(
  'blogs/create',
  async ({ tenantId, formData }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('post', `/tenants/${tenantId}/blogs`, formData, true);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateBlog = createAsyncThunk(
  'blogs/update',
  async ({ tenantId, blogId, formData }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('put', `/tenants/${tenantId}/blogs/${blogId}`, formData, true);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blogs/delete',
  async ({ tenantId, blogId }, { rejectWithValue }) => {
    try {
      await apiRequest('delete', `/tenants/${tenantId}/blogs/${blogId}`);
      return { blogId };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createBanner = createAsyncThunk(
  'blogs/createBanner',
  async ({ tenantId, blogId, formData }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('post', `/tenants/${tenantId}/blogs/${blogId}/banners`, formData, true);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateBanner = createAsyncThunk(
  'blogs/updateBanner',
  async ({ tenantId, blogId, bannerId, formData }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('put', `/tenants/${tenantId}/blogs/${blogId}/banners/${bannerId}`, formData, true);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteBanner = createAsyncThunk(
  'blogs/deleteBanner',
  async ({ tenantId, blogId, bannerId }, { rejectWithValue }) => {
    try {
      await apiRequest('delete', `/tenants/${tenantId}/blogs/${blogId}/banners/${bannerId}`);
      return { blogId, bannerId };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogFormData: (state, action) => {
      state.blogForm = { ...state.blogForm, ...action.payload };
    },
    resetBlogForm: (state) => {
      state.blogForm = initialState.blogForm;
    },
    setBannerFormData: (state, action) => {
      state.bannerForm = { ...state.bannerForm, ...action.payload };
    },
    resetBannerForm: (state) => {
      state.bannerForm = initialState.bannerForm;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Blog
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Blog
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Blog
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        const { blogId } = action.payload;
        state.items = state.items.filter(item => item.id !== blogId);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Banner
      .addCase(createBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loading = false;
        const { blogId } = action.meta.arg;
        const blogIndex = state.items.findIndex(blog => blog.id === blogId);
        if (blogIndex !== -1) {
          state.items[blogIndex].banners.push(action.payload);
        }
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Banner
      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loading = false;
        const { blogId, bannerId } = action.meta.arg;
        const blogIndex = state.items.findIndex(blog => blog.id === blogId);
        if (blogIndex !== -1) {
          const bannerIndex = state.items[blogIndex].banners.findIndex(banner => banner.id === bannerId);
          if (bannerIndex !== -1) {
            state.items[blogIndex].banners[bannerIndex] = action.payload;
          }
        }
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Banner
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loading = false;
        const { blogId, bannerId } = action.payload;
        const blogIndex = state.items.findIndex(blog => blog.id === blogId);
        if (blogIndex !== -1) {
          state.items[blogIndex].banners = state.items[blogIndex].banners.filter(banner => banner.id !== bannerId);
        }
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setBlogFormData, resetBlogForm, setBannerFormData, resetBannerForm, clearError } = blogSlice.actions;
export default blogSlice.reducer;

// Selectors
export const selectBlogs = (state) => state.blogs.items;
export const selectBlogForm = (state) => state.blogs.blogForm;
export const selectBannerForm = (state) => state.blogs.bannerForm;
export const selectBlogLoading = (state) => state.blogs.loading;
export const selectBlogError = (state) => state.blogs.error;