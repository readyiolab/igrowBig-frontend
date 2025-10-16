import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";
import SmartRouter from "./SmartRouter";
import AdminProtectedRoute from "@/auth/AdminProtectedRoute";
import BackofficeProtectedRoute from "@/auth/BackofficeProtectedRoute";
import { protect } from "@/auth/protectRoute.jsx";  // or keep without extension if your alias resolves it
import { withSuspense } from "@/auth/withSuspense";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import DynamicTemplateLoader from "./DynamicTemplateLoader";

/* Lazy Imports - Grouped */
const AdminLayout = lazy(() => import("@/components/superadmin/Layout"));
const Dashboard = lazy(() => import("@/components/superadmin/pages/Dashboard"));
const Agents = lazy(() => import("@/components/superadmin/pages/Agents"));
const ManageTraining = lazy(() => import("@/components/superadmin/pages/ManageTraining"));
const Settings = lazy(() => import("@/components/superadmin/pages/Settings"));
const CreateUser = lazy(() => import("@/components/superadmin/pages/CreateUser"));
const ResetUserPassword = lazy(() => import("@/components/superadmin/pages/ResetUserPassword"));
const SendTenantNotification = lazy(() => import("@/components/superadmin/pages/SendTenantNotification"));
const SuperAdminLogin = lazy(() => import("@/components/superadmin/pages/SuperAdminLogin"));

// New Auth Pages (add these components or create placeholders)
const ForgotPasswordPage = lazy(() => import("@/components/backoffice/pages/ForgotPassword")); // Create this: form for email input
const ResetPasswordPage = lazy(() => import("@/components/backoffice/pages/ResetPassword")); // Create this: form for token, email, newPassword

const BackofficeLayout = lazy(() => import("@/components/backoffice/layout/BackofficeLayout"));
const BackofficeLogin = lazy(() => import("@/components/backoffice/pages/BackofficeLogin"));
const BackofficeDashboard = lazy(() => import("@/components/backoffice/pages/Dashboard"));
const SliderBanner = lazy(() => import("@/components/backoffice/pages/SliderBanner"));
const WelcomeMessage = lazy(() => import("@/components/backoffice/pages/WelcomeMessage"));
const HomePageIntroduction = lazy(() => import("@/components/backoffice/pages/HomePageIntroduction"));
const HomepageAboutCompany = lazy(() => import("@/components/backoffice/pages/HomepageAboutCompany"));
const ProductPage = lazy(() => import("@/components/backoffice/pages/ProductPage"));
const CategoryEditor = lazy(() => import("@/components/backoffice/pages/CategoryEditor"));
const ProductEditor = lazy(() => import("@/components/backoffice/pages/ProductEditor"));
const OpportunityOverviewPageBanner = lazy(() => import("@/components/backoffice/pages/OpportunityOverviewPageBanner"));
const OpportunityOverviewPageContent = lazy(() => import("@/components/backoffice/pages/OpportunityOverviewPageContent"));
const OpportunityOverviewVideoSection = lazy(() => import("@/components/backoffice/pages/OpportunityOverviewVideoSection"));
const OpportunityOverviewCompensationPlan = lazy(() => import("@/components/backoffice/pages/OpportunityOverviewCompensationPlan"));
const PageBannerEditor = lazy(() => import("@/components/backoffice/pages/PageBannerEditor"));
const PageContentEditor = lazy(() => import("@/components/backoffice/pages/PageContentEditor"));
const ContactUsEditor = lazy(() => import("@/components/backoffice/pages/ContactUsEditor"));
const BlogEditor = lazy(() => import("@/components/backoffice/pages/BlogEditor"));
const SocialMediaEditor = lazy(() => import("@/components/backoffice/pages/SocialMediaEditor"));
const FooterEditor = lazy(() => import("@/components/backoffice/pages/FooterEditor"));
const TenantSettings = lazy(() => import("@/components/backoffice/pages/TenantSettings"));
const BackofficeSignup = lazy(() => import("@/components/backoffice/pages/BackofficeSignup"));
const HomepageOpportunityVideo = lazy(() => import("@/components/backoffice/pages/HomepageOpportunityVideo"));
const HomepageSupportMessage = lazy(() => import("@/components/backoffice/pages/HomepageSupportMessage"));
const HomepageWhyNetworkMarketing = lazy(() => import("@/components/backoffice/pages/HomepageWhyNetworkMarketing"));
const SuperadminNotificationList = lazy(() => import("@/components/backoffice/pages/SuperadminNotificationList"));
const SubscriberMessagePlaceholder = lazy(() => import("@/components/backoffice/pages/SubscriberMessagePlaceholder"));
const TenantTrainingList = lazy(() => import("@/components/backoffice/pages/TenantTrainingList"));

const MainLayout = lazy(() => import("@/templates/Template1/layouts/MainLayout"));
const MainLayout2 = lazy(() => import("@/templates/Template2/layouts/MainLayout"));
const EcommerceHome = lazy(() => import("@/templates/Template1/pages/Home"));
const EcommerceProducts = lazy(() => import("@/templates/Template1/pages/Products"));
const EcommerceProductDetail = lazy(() => import("@/templates/Template1/pages/ProductDetail"));
const EcommerceOpportunity = lazy(() => import("@/templates/Template1/pages/Opportunity"));
const EcommerceJoinUs = lazy(() => import("@/templates/Template1/pages/JoinUs"));
const EcommerceContact = lazy(() => import("@/templates/Template1/pages/Contact"));
const EcommerceBlog = lazy(() => import("@/templates/Template1/pages/Blog"));
const EcommerceBlogPost = lazy(() => import("@/templates/Template1/pages/BlogPost"));
const EcommerceHome2 = lazy(() => import("@/templates/Template2/pages/Home"));
const EcommerceProducts2 = lazy(() => import("@/templates/Template2/pages/Products"));
const EcommerceProductDetail2 = lazy(() => import("@/templates/Template2/pages/ProductDetail"));
const EcommerceOpportunity2 = lazy(() => import("@/templates/Template2/pages/Opportunity"));
const EcommerceJoinUs2 = lazy(() => import("@/templates/Template2/pages/JoinUs"));
const EcommerceContact2 = lazy(() => import("@/templates/Template2/pages/Contact"));
const EcommerceBlog2 = lazy(() => import("@/templates/Template2/pages/Blog"));
const EcommerceBlogPost2 = lazy(() => import("@/templates/Template2/pages/BlogPost"));

const ProductsListing = lazy(() => import("@/dynamictemplate/Template1/pages/ProductsListing"));
const CategoryProducts = lazy(() => import("@/dynamictemplate/Template1/pages/CategoryProducts"));
const ProductDetail = lazy(() => import("@/dynamictemplate/Template1/pages/ProductDetail"));
const DynamicOpportunity = lazy(() => import("@/dynamictemplate/Template1/pages/Opportunity"));
const DynamicJoinUs = lazy(() => import("@/dynamictemplate/Template1/pages/JoinUs"));
const DynamicContact = lazy(() => import("@/dynamictemplate/Template1/pages/Contact"));
const DynamicBlog = lazy(() => import("@/dynamictemplate/Template1/pages/Blog"));
const DynamicBlogPost = lazy(() => import("@/dynamictemplate/Template1/pages/BlogPost"));

/* Helper */
const wrap = (Comp) => withSuspense(Comp);

/* Router */
const router = createBrowserRouter([
  {
    path: "/",
    element: <ErrorBoundary><SmartRouter /></ErrorBoundary>,
    errorElement: <ErrorBoundary />,
  },

  // ADMIN
  protect(
    {
      path: "/admin",
      element: wrap(AdminLayout)(),
      children: [
        { index: true, element: <Navigate to="/admin/dashboard" replace /> },
        { path: "dashboard", element: wrap(Dashboard)() },
        { path: "agents", element: wrap(Agents)() },
        {
          path: "training",
          children: [
            { index: true, element: <Navigate to="manage" replace /> },
            { path: "manage", element: wrap(ManageTraining)() },
          ],
        },
        { path: "settings", element: wrap(Settings)() },
        { path: "create-user", element: wrap(CreateUser)() },
        { path: "reset-pass", element: wrap(ResetUserPassword)() },
        { path: "send-notification", element: wrap(SendTenantNotification)() },
      ],
    },
    AdminProtectedRoute
  ),

  // BACKOFFICE - Add the rest following this pattern
  protect(
    {
      path: "/backoffice",
      element: wrap(BackofficeLayout)(),
      children: [
        { path: "dashboard", element: wrap(BackofficeDashboard)() },
        { path: "slider-banners", element: wrap(SliderBanner)() },
        { path: "welcome-message", element: wrap(WelcomeMessage)() },
        { path: "introduction", element: wrap(HomePageIntroduction)() },
        { path: "about-company", element: wrap(HomepageAboutCompany)() },
        { path: "why-network-marketing", element: wrap(HomepageWhyNetworkMarketing)() },
        { path: "opportunity-video", element: wrap(HomepageOpportunityVideo)() },
        { path: "support-message", element: wrap(HomepageSupportMessage)() },
        { path: "about-page", element: wrap(ProductPage)() },
        { path: "categories", element: wrap(CategoryEditor)() },
        { path: "products-list", element: wrap(ProductEditor)() },
        {
          path: "opportunity",
          children: [
            { index: true, element: wrap(OpportunityOverviewPageBanner)() },
            { path: "page-banner", element: wrap(OpportunityOverviewPageBanner)() },
            { path: "page-content", element: wrap(OpportunityOverviewPageContent)() },
            { path: "video-section", element: wrap(OpportunityOverviewVideoSection)() },
            { path: "compensation-plan", element: wrap(OpportunityOverviewCompensationPlan)() },
          ],
        },
        {
          path: "join-us",
          children: [
            { index: true, element: wrap(PageBannerEditor)() },
            { path: "page-banner", element: wrap(PageBannerEditor)() },
            { path: "page-content", element: wrap(PageContentEditor)() },
          ],
        },
        { path: "contact-us", element: wrap(ContactUsEditor)() },
        { path: "blogs", element: wrap(BlogEditor)() },
        { path: "social-media", element: wrap(SocialMediaEditor)() },
        { path: "footer-disclaimer", element: wrap(FooterEditor)() },
        { path: "subscriber-message", element: wrap(SubscriberMessagePlaceholder)() },
        { path: "settings", element: wrap(TenantSettings)() },
        { path: "notifications", element: wrap(SuperadminNotificationList)() },
        { path: "training", element: wrap(TenantTrainingList)() },
        // ADD MORE BACKOFFICE PAGES HERE USING wrap(Component)()
      ],
    },
    BackofficeProtectedRoute
  ),

  // AUTH
  { path: "backoffice-login", element: wrap(BackofficeLogin)() },
  { path: "/backoffice-signup", element: wrap(BackofficeSignup)() },
  { path: "/superadmin-login", element: wrap(SuperAdminLogin)() },
  { path: "/forgot-password", element: wrap(ForgotPasswordPage)() }, // New: Public forgot password page
  { path: "/reset-password", element: wrap(ResetPasswordPage)() }, // New: Public reset password page

  // DEMO TEMPLATE1
  {
    path: "/template1",
    element: wrap(MainLayout)(),
    children: [
      { path: "", element: wrap(EcommerceHome)() },
      { path: "products", element: wrap(EcommerceProducts)() },
      { path: "product/:id", element: wrap(EcommerceProductDetail)() },
      { path: "opportunity", element: wrap(EcommerceOpportunity)() },
      { path: "join-us", element: wrap(EcommerceJoinUs)() },
      { path: "contact", element: wrap(EcommerceContact)() },
      { path: "blog", element: wrap(EcommerceBlog)() },
      { path: "blog/:id", element: wrap(EcommerceBlogPost)() },
    ],
  },

  // DEMO TEMPLATE2
  {
    path: "/template2",
    element: wrap(MainLayout2)(),
    children: [
      { path: "", element: wrap(EcommerceHome2)() },
      { path: "products", element: wrap(EcommerceProducts2)() },
      { path: "product/:id", element: wrap(EcommerceProductDetail2)() },
      { path: "opportunity", element: wrap(EcommerceOpportunity2)() },
      { path: "join-us", element: wrap(EcommerceJoinUs2)() },
      { path: "contact", element: wrap(EcommerceContact2)() },
      { path: "blog", element: wrap(EcommerceBlog2)() },
      { path: "blog/:id", element: wrap(EcommerceBlogPost2)() },
    ],
  },

  // SUBDOMAIN DYNAMIC
{
  path: "/products",
  element: <DynamicTemplateLoader>{wrap(ProductsListing)()}</DynamicTemplateLoader>,
},
{
  path: "/products/:category",
  element: <DynamicTemplateLoader>{wrap(CategoryProducts)()}</DynamicTemplateLoader>,
},
{
  path: "/products/:category/:id",
  element: <DynamicTemplateLoader>{wrap(ProductDetail)()}</DynamicTemplateLoader>,
},
  {
    path: "/opportunity",
    element: <DynamicTemplateLoader>{wrap(DynamicOpportunity)()}</DynamicTemplateLoader>,
  },
  {
    path: "/join-us",
    element: <DynamicTemplateLoader>{wrap(DynamicJoinUs)()}</DynamicTemplateLoader>,
  },
  {
    path: "/contact",
    element: <DynamicTemplateLoader>{wrap(DynamicContact)()}</DynamicTemplateLoader>,
  },
  {
    path: "/blog",
    element: <DynamicTemplateLoader>{wrap(DynamicBlog)()}</DynamicTemplateLoader>,
  },
  {
    path: "/blog/:id",
    element: <DynamicTemplateLoader>{wrap(DynamicBlogPost)()}</DynamicTemplateLoader>,
  },

  // CATCH ALL
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;