import {
  createBrowserRouter,
  Navigate,
  useNavigate,
} from "react-router-dom";
import React, { Suspense, lazy, useEffect, useState } from "react";
import useTenantApi from "@/hooks/useTenantApi";
import TenantTrainingList from "@/components/backoffice/pages/TenantTrainingList";

// Custom loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      <p className="mt-4 text-gray-700 font-medium">Loading...</p>
    </div>
  </div>
);

// Lazy load components
const Layout = lazy(() => import("../components/landing/Layout"));
const AdminLayout = lazy(() => import("../components/superadmin/Layout"));
const BackofficeLayout = lazy(() =>
  import("@/components/backoffice/layout/BackofficeLayout")
);
const MainLayout = lazy(() =>
  import("../templates/Template1/layouts/MainLayout")
);
const MainLayout2 = lazy(() =>
  import("../templates/Template2/layouts/MainLayout")
);
const Template2 = lazy(() => import("@/templates/Template2"));
const Template3 = lazy(() => import("@/templates/Template3"));

// Admin pages
const Dashboard = lazy(() =>
  import("../components/superadmin/pages/Dashboard")
);
const Agents = lazy(() => import("../components/superadmin/pages/Agents"));
const ManageTraining = lazy(() =>
  import("../components/superadmin/pages/ManageTraining")
);
const Settings = lazy(() => import("../components/superadmin/pages/Settings"));
const CreateUser = lazy(() =>
  import("@/components/superadmin/pages/CreateUser")
);
const ResetUserPassword = lazy(() =>
  import("@/components/superadmin/pages/ResetUserPassword")
);
const SendTenantNotification = lazy(() =>
  import("@/components/superadmin/pages/SendTenantNotification")
);
const SuperAdminLogin = lazy(() =>
  import("@/components/superadmin/pages/SuperAdminLogin")
);

// Backoffice pages
const BackofficeLogin = lazy(() =>
  import("@/components/backoffice/pages/BackofficeLogin")
);
const BackofficeDashboard = lazy(() =>
  import("@/components/backoffice/pages/Dashboard")
);
const SliderBanner = lazy(() =>
  import("@/components/backoffice/pages/SliderBanner")
);
const WelcomeMessage = lazy(() =>
  import("@/components/backoffice/pages/WelcomeMessage")
);
const HomePageIntroduction = lazy(() =>
  import("@/components/backoffice/pages/HomePageIntroduction")
);
const HomepageAboutCompany = lazy(() =>
  import("@/components/backoffice/pages/HomepageAboutCompany")
);
const ProductPage = lazy(() =>
  import("@/components/backoffice/pages/ProductPage")
);
const CategoryEditor = lazy(() =>
  import("@/components/backoffice/pages/CategoryEditor")
);
const ProductEditor = lazy(() =>
  import("@/components/backoffice/pages/ProductEditor")
);
const OpportunityOverviewPageBanner = lazy(() =>
  import("@/components/backoffice/pages/OpportunityOverviewPageBanner")
);
const OpportunityOverviewPageContent = lazy(() =>
  import("@/components/backoffice/pages/OpportunityOverviewPageContent")
);
const OpportunityOverviewVideoSection = lazy(() =>
  import("@/components/backoffice/pages/OpportunityOverviewVideoSection")
);
const OpportunityOverviewCompensationPlan = lazy(() =>
  import("@/components/backoffice/pages/OpportunityOverviewCompensationPlan")
);
const PageBannerEditor = lazy(() =>
  import("@/components/backoffice/pages/PageBannerEditor")
);
const PageContentEditor = lazy(() =>
  import("@/components/backoffice/pages/PageContentEditor")
);
const ContactUsEditor = lazy(() =>
  import("@/components/backoffice/pages/ContactUsEditor")
);
const BlogEditor = lazy(() =>
  import("@/components/backoffice/pages/BlogEditor")
);
const SocialMediaEditor = lazy(() =>
  import("@/components/backoffice/pages/SocialMediaEditor")
);
const FooterEditor = lazy(() =>
  import("@/components/backoffice/pages/FooterEditor")
);
const TenantSettings = lazy(() =>
  import("@/components/backoffice/pages/TenantSettings")
);
const BackofficeSignup = lazy(() =>
  import("@/components/backoffice/pages/BackofficeSignup")
);
const HomepageOpportunityVideo = lazy(() =>
  import("@/components/backoffice/pages/HomepageOpportunityVideo")
);
const HomepageSupportMessage = lazy(() =>
  import("@/components/backoffice/pages/HomepageSupportMessage")
);
const HomepageWhyNetworkMarketing = lazy(() =>
  import("@/components/backoffice/pages/HomepageWhyNetworkMarketing")
);
const SuperadminNotificationList = lazy(() =>
  import("@/components/backoffice/pages/SuperadminNotificationList")
);
const SubscriberMessagePlaceholder = lazy(() =>
  import("@/components/backoffice/pages/SubscriberMessagePlaceholder")
);

// Dynamic template pages
const DynamicMainLayout = lazy(() =>
  import("../dynamictemplate/Template1/layouts/MainLayout")
);
const DynamicHome = lazy(() =>
  import("../dynamictemplate/Template1/pages/Home")
);
const DynamicProducts = lazy(() =>
  import("../dynamictemplate/Template1/pages/Products")
);
const DynamicProductDetail = lazy(() =>
  import("../dynamictemplate/Template1/pages/ProductDetail")
);
const DynamicOpportunity = lazy(() =>
  import("../dynamictemplate/Template1/pages/Opportunity")
);
const DynamicJoinUs = lazy(() =>
  import("../dynamictemplate/Template1/pages/JoinUs")
);
const DynamicContact = lazy(() =>
  import("../dynamictemplate/Template1/pages/Contact")
);
const DynamicBlog = lazy(() =>
  import("../dynamictemplate/Template1/pages/Blog")
);
const DynamicBlogPost = lazy(() =>
  import("../dynamictemplate/Template1/pages/BlogPost")
);

// Ecommerce pages (for template1 demo)
const EcommerceHome = lazy(() => import("../templates/Template1/pages/Home"));
const EcommerceProducts = lazy(() =>
  import("../templates/Template1/pages/Products")
);
const EcommerceProductDetail = lazy(() =>
  import("../templates/Template1/pages/ProductDetail")
);
const EcommerceOpportunity = lazy(() =>
  import("../templates/Template1/pages/Opportunity")
);
const EcommerceJoinUs = lazy(() =>
  import("../templates/Template1/pages/JoinUs")
);
const EcommerceContact = lazy(() =>
  import("../templates/Template1/pages/Contact")
);
const EcommerceBlog = lazy(() => import("../templates/Template1/pages/Blog"));
const EcommerceBlogPost = lazy(() =>
  import("../templates/Template1/pages/BlogPost")
);

// Ecommerce pages (for template2 demo)
const EcommerceHome2 = lazy(() => import("../templates/Template2/pages/Home"));
const EcommerceProducts2 = lazy(() =>
  import("../templates/Template2/pages/Products")
);
const EcommerceProductDetail2 = lazy(() =>
  import("../templates/Template2/pages/ProductDetail")
);
const EcommerceOpportunity2 = lazy(() =>
  import("../templates/Template2/pages/Opportunity")
);
const EcommerceJoinUs2 = lazy(() =>
  import("../templates/Template2/pages/JoinUs")
);
const EcommerceContact2 = lazy(() =>
  import("../templates/Template2/pages/Contact")
);
const EcommerceBlog2 = lazy(() => import("../templates/Template2/pages/Blog"));
const EcommerceBlogPost2 = lazy(() =>
  import("../templates/Template2/pages/BlogPost")
);

/**
 * ✅ SMART ROUTER - Detects main domain vs subdomain
 */
const SmartRouter = ({ children }) => {
  const navigate = useNavigate();
  const [isMainDomain, setIsMainDomain] = useState(null);

  useEffect(() => {
    const hostname = window.location.hostname.toLowerCase();
    const baseDomain = process.env.REACT_APP_BASE_DOMAIN || "igrowbig.com";

    const mainDomainCheck = [
      baseDomain,
      `www.${baseDomain}`,
      "localhost",
    ].includes(hostname);

    console.log("🔍 SmartRouter - Hostname:", hostname);
    console.log("🔍 SmartRouter - Is Main Domain:", mainDomainCheck);

    setIsMainDomain(mainDomainCheck);
  }, []);

  if (isMainDomain === null) {
    return <LoadingFallback />;
  }

  return children;
};

/**
 * ✅ DYNAMIC TEMPLATE LOADER - For subdomains only
 */
const DynamicTemplateLoader = ({ children }) => {
  const { getAll } = useTenantApi();
  const [templateId, setTemplateId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const hostname = window.location.hostname.toLowerCase();
        const baseDomain = process.env.REACT_APP_BASE_DOMAIN || "igrowbig.com";

        console.log("🔍 DynamicTemplateLoader: Hostname:", hostname);

        // ========== CHECK: Is this the main domain? ==========
        const isMainDomain = [
          baseDomain,
          `www.${baseDomain}`,
          "localhost",
        ].includes(hostname);

        if (isMainDomain) {
          console.log("⚠️ Main domain detected - should not be here");
          navigate("/", { replace: true });
          setLoading(false);
          return;
        }

        // ========== FETCH: Tenant by domain ==========
        console.log("🔍 Fetching tenant for subdomain:", hostname);

        const response = await getAll("/site/by-domain");
        console.log("✅ API Response:", response);

        if (response?.tenant?.template_id) {
          console.log("✅ Setting template_id:", response.tenant.template_id);
          setTemplateId(response.tenant.template_id);
        } else {
          console.log("❌ No valid tenant found in response");
          setError("Store not found. This subdomain may not be configured yet.");
        }
      } catch (err) {
        console.error("❌ DynamicTemplateLoader Error:", err);
        setError(err.message || "Unable to load store data");
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [getAll, navigate]);

  // ========== LOADING STATE ==========
  if (loading) {
    console.log("⏳ DynamicTemplateLoader: Loading...");
    return <LoadingFallback />;
  }

  // ========== ERROR STATE ==========
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Store Not Found
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              const baseDomain =  "igrowbig.com";
              window.location.href = `https://${baseDomain}`;
            }}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Go to Main Site
          </button>
        </div>
      </div>
    );
  }

  let TemplateLayout;
  switch (templateId) {
    case 1:
      TemplateLayout = DynamicMainLayout;
      break;
    case 2:
      TemplateLayout = Template2;
      break;
    case 3:
      TemplateLayout = Template3;
      break;
    default:
      console.log("❌ Invalid templateId:", templateId);
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Invalid Template
            </h1>
            <p className="text-gray-600 mb-6">
              Template ID {templateId} is not supported.
            </p>
          </div>
        </div>
      );
  }

  console.log("✅ Rendering template:", templateId);
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TemplateLayout>{children}</TemplateLayout>
    </Suspense>
  );
};

const AdminProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.log("No token, redirecting to superadmin-login");
      localStorage.clear();
      navigate("/superadmin-login", { replace: true });
    }
  }, [token, navigate]);

  if (!token) return null;
  return children;
};

// Backoffice ProtectedRoute
const ProtectedRoute = ({ children }) => {
  const { error, getAll } = useTenantApi();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const tenantId = localStorage.getItem("tenant_id");

  useEffect(() => {
    if (!token) {
      console.log("No token, redirecting to backoffice-login");
      localStorage.clear();
      navigate("/backoffice-login", { replace: true });
      return;
    }

    if (tenantId) {
      getAll(`/users/${tenantId}`)
        .then(() => {
          console.log("Backoffice token validated");
        })
        .catch((err) => {
          console.error("Backoffice auth check failed:", err);
          if (
            err.message === "No authentication token found" ||
            err.status === 401
          ) {
            localStorage.clear();
            navigate("/backoffice-login", { replace: true });
          }
        });
    }
  }, [token, tenantId, getAll, navigate]);

  if (!token || error?.message === "No authentication token found") return null;
  return children;
};

// Error Boundary Component
function ErrorBoundary() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl text-gray-900">Something went wrong</h1>
      <p className="mt-2 text-gray-600">Please try refreshing the page.</p>
    </div>
  );
}

// Wrap component with Suspense
const withSuspense = (Component) => {
  return (props) => (
    <Suspense fallback={<LoadingFallback />}>
      <Component {...props} />
    </Suspense>
  );
};

/**
 * ✅ ROOT HANDLER - Decides between Landing Page or Dynamic Template
 */
const RootHandler = () => {
  const [isMainDomain, setIsMainDomain] = useState(null);

  useEffect(() => {
    const hostname = window.location.hostname.toLowerCase();
    const baseDomain = "igrowbig.com";

    const mainDomainCheck = [
      baseDomain,
      `www.${baseDomain}`,
      "localhost",
    ].includes(hostname);

    console.log("🔍 RootHandler - Hostname:", hostname);
    console.log("🔍 RootHandler - Is Main Domain:", mainDomainCheck);

    // Check if it's a subdomain
    const isSubdomain = hostname.endsWith(`.${baseDomain}`) && hostname !== `www.${baseDomain}`;
    
    // If not main domain and not subdomain, it's a custom domain
    const customDomain = !mainDomainCheck && !isSubdomain;

    console.log("🔍 RootHandler - Is Subdomain:", isSubdomain);
    console.log("🔍 RootHandler - Is Custom Domain:", customDomain);

    setIsMainDomain(mainDomainCheck);
  }, []);

  if (isMainDomain === null) {
    return <LoadingFallback />;
  }

  // Main domain - show landing page
  if (isMainDomain) {
    console.log("✅ Showing landing page for main domain");
    return withSuspense(Layout)();
  }

  // Subdomain OR Custom Domain - show dynamic template
  console.log("✅ Loading dynamic template for subdomain/custom domain");
  return (
    <DynamicTemplateLoader>
      <Suspense fallback={<LoadingFallback />}>
        <DynamicHome />
      </Suspense>
    </DynamicTemplateLoader>
  );
};
const router = createBrowserRouter([
  // ========== ROOT - Smart routing ==========
  {
    path: "/",
    element: <RootHandler />,
    errorElement: <ErrorBoundary />,
  },

  // ========== ADMIN ROUTES ==========
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>{withSuspense(AdminLayout)()}</AdminProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", element: withSuspense(Dashboard)() },
      { path: "agents", element: withSuspense(Agents)() },
      {
        path: "training",
        children: [
          {
            index: true,
            element: <Navigate to="/admin/training/manage" replace />,
          },
          { path: "manage", element: withSuspense(ManageTraining)() },
        ],
      },
      { path: "settings", element: withSuspense(Settings)() },
      { path: "create-user", element: withSuspense(CreateUser)() },
      { path: "reset-pass", element: withSuspense(ResetUserPassword)() },
      {
        path: "send-notification",
        element: withSuspense(SendTenantNotification)(),
      },
    ],
  },

  // ========== BACKOFFICE ROUTES ==========
  {
    path: "/backoffice",
    element: (
      <ProtectedRoute>{withSuspense(BackofficeLayout)()}</ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: withSuspense(BackofficeDashboard)() },
      { path: "slider-banners", element: withSuspense(SliderBanner)() },
      { path: "welcome-message", element: withSuspense(WelcomeMessage)() },
      { path: "introduction", element: withSuspense(HomePageIntroduction)() },
      { path: "about-company", element: withSuspense(HomepageAboutCompany)() },
      {
        path: "why-network-marketing",
        element: withSuspense(HomepageWhyNetworkMarketing)(),
      },
      {
        path: "opportunity-video",
        element: withSuspense(HomepageOpportunityVideo)(),
      },
      {
        path: "support-message",
        element: withSuspense(HomepageSupportMessage)(),
      },
      { path: "about-page", element: withSuspense(ProductPage)() },
      { path: "categories", element: withSuspense(CategoryEditor)() },
      { path: "products-list", element: withSuspense(ProductEditor)() },
      {
        path: "opportunity",
        children: [
          {
            index: true,
            element: withSuspense(OpportunityOverviewPageBanner)(),
          },
          {
            path: "page-banner",
            element: withSuspense(OpportunityOverviewPageBanner)(),
          },
          {
            path: "page-content",
            element: withSuspense(OpportunityOverviewPageContent)(),
          },
          {
            path: "video-section",
            element: withSuspense(OpportunityOverviewVideoSection)(),
          },
          {
            path: "compensation-plan",
            element: withSuspense(OpportunityOverviewCompensationPlan)(),
          },
        ],
      },
      {
        path: "join-us",
        children: [
          { index: true, element: withSuspense(PageBannerEditor)() },
          { path: "page-banner", element: withSuspense(PageBannerEditor)() },
          { path: "page-content", element: withSuspense(PageContentEditor)() },
        ],
      },
      { path: "contact-us", element: withSuspense(ContactUsEditor)() },
      { path: "blogs", element: withSuspense(BlogEditor)() },
      { path: "social-media", element: withSuspense(SocialMediaEditor)() },
      { path: "footer-disclaimer", element: withSuspense(FooterEditor)() },
      {
        path: "subscriber-message",
        element: withSuspense(SubscriberMessagePlaceholder)(),
      },
      { path: "settings", element: withSuspense(TenantSettings)() },
      {
        path: "notifications",
        element: withSuspense(SuperadminNotificationList)(),
      },
      { path: "training", element: withSuspense(TenantTrainingList)() },
    ],
  },

  // ========== AUTH ROUTES ==========
  {
    path: "backoffice-login",
    element: withSuspense(BackofficeLogin)(),
  },
  {
    path: "/backoffice-signup",
    element: withSuspense(BackofficeSignup)(),
  },
  {
    path: "/superadmin-login",
    element: withSuspense(SuperAdminLogin)(),
  },

  // ========== DEMO TEMPLATE ROUTES ==========
  {
    path: "/template1",
    element: withSuspense(MainLayout)(),
    children: [
      { path: "", element: withSuspense(EcommerceHome)() },
      { path: "products", element: withSuspense(EcommerceProducts)() },
      { path: "product/:id", element: withSuspense(EcommerceProductDetail)() },
      { path: "opportunity", element: withSuspense(EcommerceOpportunity)() },
      { path: "join-us", element: withSuspense(EcommerceJoinUs)() },
      { path: "contact", element: withSuspense(EcommerceContact)() },
      { path: "blog", element: withSuspense(EcommerceBlog)() },
      { path: "blog/:id", element: withSuspense(EcommerceBlogPost)() },
    ],
  },
  {
    path: "/template2",
    element: withSuspense(MainLayout2)(),
    children: [
      { path: "", element: withSuspense(EcommerceHome2)() },
      { path: "products", element: withSuspense(EcommerceProducts2)() },
      { path: "product/:id", element: withSuspense(EcommerceProductDetail2)() },
      { path: "opportunity", element: withSuspense(EcommerceOpportunity2)() },
      { path: "join-us", element: withSuspense(EcommerceJoinUs2)() },
      { path: "contact", element: withSuspense(EcommerceContact2)() },
      { path: "blog", element: withSuspense(EcommerceBlog2)() },
      { path: "blog/:id", element: withSuspense(EcommerceBlogPost2)() },
    ],
  },

  // ========== SUBDOMAIN DYNAMIC ROUTES ==========
  {
    path: "/products",
    element: (
      <DynamicTemplateLoader>
        {withSuspense(DynamicProducts)()}
      </DynamicTemplateLoader>
    ),
  },
  {
    path: "/product/:id",
    element: (
      <DynamicTemplateLoader>
        {withSuspense(DynamicProductDetail)()}
      </DynamicTemplateLoader>
    ),
  },
  {
    path: "/opportunity",
    element: (
      <DynamicTemplateLoader>
        {withSuspense(DynamicOpportunity)()}
      </DynamicTemplateLoader>
    ),
  },
  {
    path: "/join-us",
    element: (
      <DynamicTemplateLoader>
        {withSuspense(DynamicJoinUs)()}
      </DynamicTemplateLoader>
    ),
  },
  {
    path: "/contact",
    element: (
      <DynamicTemplateLoader>
        {withSuspense(DynamicContact)()}
      </DynamicTemplateLoader>
    ),
  },
  {
    path: "/blog",
    element: (
      <DynamicTemplateLoader>
        {withSuspense(DynamicBlog)()}
      </DynamicTemplateLoader>
    ),
  },
  {
    path: "/blog/:id",
    element: (
      <DynamicTemplateLoader>
        {withSuspense(DynamicBlogPost)()}
      </DynamicTemplateLoader>
    ),
  },

  // ========== CATCH ALL ==========
  {
    path: "*",
    element: <Navigate to="/" replace />,
    errorElement: <ErrorBoundary />,
  },
]);

export default router;