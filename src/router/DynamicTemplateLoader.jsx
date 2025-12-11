import React, { useEffect, useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { getDomainInfo } from "@/utils/domain";
import LoadingFallback from "@/components/common/LoadingFallback";

import DynamicMainLayout1 from "@/dynamictemplate/Template1/layouts/MainLayout";
import DynamicMainLayout2 from "@/dynamictemplate/Template2/layouts/MainLayout";
import Template3 from "@/templates/Template3";

const DynamicTemplateLoader = ({ children, template }) => {
  const { getAll } = useTenantApi();
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
          setTemplateId(Number(tid)); // 🔥 FIX
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

  console.log("[DTL] Final Template ID:", templateId);

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

  return (
    <Suspense fallback={<LoadingFallback />}>
      <TemplateLayout>{children}</TemplateLayout>
    </Suspense>
  );
};

export default DynamicTemplateLoader;
