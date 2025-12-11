import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDomainInfo } from "@/utils/domain";
import LoadingFallback from "@/components/common/LoadingFallback";
import Layout from "@/components/landing/Layout"; // Main domain landing
import DynamicTemplateLoader from "./DynamicTemplateLoader";
import { withSuspense } from "@/auth/withSuspense";
import DynamicHome1 from "@/dynamictemplate/Template1/pages/Home";
import DynamicHome2 from "@/dynamictemplate/Template2/pages/Home";
import useTenantApi from "@/hooks/useTenantApi";

const SmartRouter = () => {
  const navigate = useNavigate();
  const { getAll } = useTenantApi();
  const [domainInfo, setDomainInfo] = useState(null);
  const [templateId, setTemplateId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const info = getDomainInfo();
      setDomainInfo(info);

      if (info.isMain) {
        console.log("Main domain detected");
        setLoading(false);
      } else {
        console.log("Subdomain/Custom domain detected");
        try {
          const response = await getAll("/site/by-domain");
          if (response?.tenant?.template_id) {
            setTemplateId(response.tenant.template_id);
          }
        } catch (err) {
          console.error("Error fetching tenant data:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [getAll]);

  if (loading) return <LoadingFallback />;

  // Main domain - show landing page
  if (domainInfo.isMain) {
    return withSuspense(Layout)();
  }

  // Subdomain - show appropriate home page based on template
  const HomeComponent = templateId === 2 ? DynamicHome2 : DynamicHome1;

  return (
    <DynamicTemplateLoader>
      {withSuspense(HomeComponent)()}
    </DynamicTemplateLoader>
  );
};

export default SmartRouter;