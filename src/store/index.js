// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import blogReducer from "./slices/blogSlice";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import contactUsReducer from "./slices/contactUsSlice";
import dashboardReducer from "./slices/dashboardSlice";
import homePageReducer from "./slices/homePageSlice";
import opportunityPageReducer from "./slices/opportunityPageSlice";
import productPageReducer from "./slices/productPageSlice";
import socialMediaReducer from "./slices/socialMediaSlice";

import subscriberReducer from "./slices/subscriberSlice";
import disclaimerReducer from "./slices/disclaimerSlice";
import tenantSettingsReducer from "./slices/tenantSettingsSlice";
import adminNotificationReducer from "./slices/adminNotificationSlice";
import adminAuthReducer from "./slices/adminAuthSlice";
import agentsReducer from "./slices/agentsSlice";
import createUserReducer from "./slices/createUserSlice";
import trainingReducer from "./slices/trainingSlice";
import resetUserPasswordReducer from "./slices/resetUserPasswordSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
    blogs: blogReducer,
    auth: authReducer,
    ui: uiReducer,
    contactUs: contactUsReducer,
    dashboard: dashboardReducer,
    homePage: homePageReducer,
    opportunityPage: opportunityPageReducer,
    productPage: productPageReducer,
    socialMedia: socialMediaReducer,
    subscribers: subscriberReducer,
    disclaimer: disclaimerReducer,
    tenantSettings: tenantSettingsReducer,
    adminNotification: adminNotificationReducer,
    adminAuth: adminAuthReducer,
    agents: agentsReducer,
    createUser: createUserReducer,
    training: trainingReducer,
    resetUserPassword: resetUserPasswordReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "products/setFormData",
          "blogs/setFormData",
          "categories/setFormData",
          "opportunityPage/setData",
          "productPage/setData",
          "contactUs/setData",
          "homePage/setData",
          "socialMedia/setData",
          "training/setTrainings",
          "subscribers/clearError",
        ],
        ignoredPaths: [
          "products.form",
          "blogs.form",
          "categories.form",
          "opportunityPage.data",
          "productPage.data",
          "contactUs.data",
          "homePage.data",
          "socialMedia.data",
          "training.trainings",
          "subscribers.items",
        ],
      },
    }),
});

export default store;
