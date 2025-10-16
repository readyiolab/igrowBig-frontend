import React, { useEffect, useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { getDomainInfo } from "@/utils/domain";
import LoadingFallback from "@/components/common/LoadingFallback";
import DynamicMainLayout from "@/dynamictemplate/Template1/layouts/MainLayout";
import Template2 from "@/templates/Template2";
import Template3 from "@/templates/Template3";

const DynamicTemplateLoader = ({ children }) => {
  const { getAll } = useTenantApi();
  const [templateId, setTemplateId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const { hostname, isMain } = getDomainInfo();
        if (isMain) {
          navigate("/", { replace: true });
          return;
        }

        const response = await getAll("/site/by-domain");
        if (response?.tenant?.template_id) {
          setTemplateId(response.tenant.template_id);
        } else {
          setError("Store not found. This subdomain may not be configured yet.");
        }
      } catch (err) {
        setError(err.message || "Unable to load store data");
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [getAll, navigate]);

  if (loading) return <LoadingFallback />;
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Store Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = "https://igrowbig.com"}
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
    case 1: TemplateLayout = DynamicMainLayout; break;
    case 2: TemplateLayout = Template2; break;
    case 3: TemplateLayout = Template3; break;
    default:
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Invalid Template</h1>
            <p className="text-gray-600 mb-6">Template ID {templateId} is not supported.</p>
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