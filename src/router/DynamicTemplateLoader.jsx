import React, { useEffect, useState, Suspense, lazy } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { getDomainInfo } from "@/utils/domain";
import LoadingFallback from "@/components/common/LoadingFallback";

import DynamicMainLayout1 from "@/dynamictemplate/Template1/layouts/MainLayout";
import DynamicMainLayout2 from "@/dynamictemplate/Template2/layouts/MainLayout";
import Template3 from "@/templates/Template3";

// Dynamic Template 1 Pages
const DynamicProducts1 = lazy(() => import("@/dynamictemplate/Template1/pages/Products"));
const DynamicCategoryProducts1 = lazy(() => import("@/dynamictemplate/Template1/pages/CategoryProducts"));
const DynamicProductDetail1 = lazy(() => import("@/dynamictemplate/Template1/pages/ProductDetail"));
const DynamicOpportunity1 = lazy(() => import("@/dynamictemplate/Template1/pages/Opportunity"));
const DynamicOpportunityOverView1 = lazy(() => import("@/dynamictemplate/Template1/pages/OpportunityOverview"));
const DynamicJoinUs1 = lazy(() => import("@/dynamictemplate/Template1/pages/JoinUs"));
const DynamicContact1 = lazy(() => import("@/dynamictemplate/Template1/pages/Contact"));
const DynamicBlog1 = lazy(() => import("@/dynamictemplate/Template1/pages/Blog"));
const DynamicBlogPost1 = lazy(() => import("@/dynamictemplate/Template1/pages/BlogPost"));

// Dynamic Template 2 Pages
const DynamicProducts2 = lazy(() => import("@/dynamictemplate/Template2/pages/ProductsPage "));
const DynamicCategoryProducts2 = lazy(() => import("@/dynamictemplate/Template2/pages/CategoryProductsPage"));
const DynamicProductDetail2 = lazy(() => import("@/dynamictemplate/Template2/pages/ProductDetailPage"));
const DynamicOpportunity2 = lazy(() => import("@/dynamictemplate/Template2/pages/Opportunity"));
const DynamicOpportunityOverView2 = lazy(() => import("@/dynamictemplate/Template2/pages/OpportunityOverview"));
const DynamicJoinUs2 = lazy(() => import("@/dynamictemplate/Template2/pages/JoinUs"));
const DynamicContact2 = lazy(() => import("@/dynamictemplate/Template2/pages/Contact"));
const DynamicBlog2 = lazy(() => import("@/dynamictemplate/Template2/pages/Blog"));
const DynamicBlogPost2 = lazy(() => import("@/dynamictemplate/Template2/pages/BlogPost"));

// Map routes to page types
const getPageType = (pathname) => {
  if (pathname === "/products") return "products";
  if (pathname.match(/^\/products\/[^/]+\/[^/]+$/)) return "product-detail";
  if (pathname.match(/^\/products\/[^/]+$/)) return "category-products";
  if (pathname === "/opportunity") return "opportunity";
  if (pathname === "/opportunity-overview") return "opportunity-overview";
  if (pathname === "/join-us") return "join-us";
  if (pathname === "/contact") return "contact";
  if (pathname === "/blog") return "blog";
  if (pathname.match(/^\/blog\/.+$/)) return "blog-post";
  return null;
};

// Component mapping by template and page type
const pageComponents = {
  1: {
    products: DynamicProducts1,
    "category-products": DynamicCategoryProducts1,
    "product-detail": DynamicProductDetail1,
    opportunity: DynamicOpportunity1,
    "opportunity-overview": DynamicOpportunityOverView1,
    "join-us": DynamicJoinUs1,
    contact: DynamicContact1,
    blog: DynamicBlog1,
    "blog-post": DynamicBlogPost1,
  },
  2: {
    products: DynamicProducts2,
    "category-products": DynamicCategoryProducts2,
    "product-detail": DynamicProductDetail2,
    opportunity: DynamicOpportunity2,
    "opportunity-overview": DynamicOpportunityOverView2,
    "join-us": DynamicJoinUs2,
    contact: DynamicContact2,
    blog: DynamicBlog2,
    "blog-post": DynamicBlogPost2,
  },
};

const DynamicTemplateLoader = ({ children, template }) => {
  const { getAll } = useTenantApi();
  const location = useLocation();
  const [templateId, setTemplateId] = useState(template ? Number(template) : null);
  const [loading, setLoading] = useState(!template);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("[DTL] Initial template prop =", template);

    if (template) {
      setTemplateId(Number(template));
      setLoading(false);
      return;
    }

    const fetchTenantData = async () => {
      try {
        const domainInfo = getDomainInfo();
        console.log("[DTL] Domain Info:", domainInfo);

        if (domainInfo.isMain) {
          console.log("[DTL] Main domain detected → redirecting to /");
          navigate("/", { replace: true });
          return;
        }

        const response = await getAll("/site/by-domain");
        console.log("[DTL] Tenant response:", response);

        const tid = response?.tenant?.template_id;

        if (tid) {
          console.log("[DTL] ✅ Setting templateId to:", tid);
          setTemplateId(Number(tid));
        } else {
          setError("Store not found for this subdomain.");
        }
      } catch (err) {
        console.error("[DTL] API error:", err);
        setError(err.message || "Unable to load template");
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [getAll, navigate, template]);

  if (loading) return <LoadingFallback />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-3xl font-bold">Store Not Found</h1>
        <p className="text-gray-600 mt-2">{error}</p>
        <button
          onClick={() => (window.location.href = "https://igrowbig.com")}
          className="mt-4 px-6 py-3 bg-black text-white rounded"
        >
          Go to Main Site
        </button>
      </div>
    );
  }

  // Select the correct layout
  let TemplateLayout;
  switch (Number(templateId)) {
    case 1:
      TemplateLayout = DynamicMainLayout1;
      break;
    case 2:
      TemplateLayout = DynamicMainLayout2;
      break;
    case 3:
      TemplateLayout = Template3;
      break;
    default:
      return (
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Invalid Template</h1>
            <p>Template ID {templateId} is not supported.</p>
          </div>
        </div>
      );
  }

  // If children is provided (from router), use it
  // Otherwise, dynamically determine the component based on route
  let content = children;
  
  if (!children) {
    const pageType = getPageType(location.pathname);
    console.log("[DTL] Page type detected:", pageType);
    console.log("[DTL] Using template:", templateId);
    
    if (pageType && pageComponents[templateId]?.[pageType]) {
      const PageComponent = pageComponents[templateId][pageType];
      content = <PageComponent />;
    } else {
      content = (
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Page Not Found</h1>
            <p>This page is not available for template {templateId}.</p>
          </div>
        </div>
      );
    }
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <TemplateLayout>{content}</TemplateLayout>
    </Suspense>
  );
};

export default DynamicTemplateLoader;