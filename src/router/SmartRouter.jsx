import React, { useEffect, useState } from "react";
import { getDomainInfo } from "@/utils/domain";
import LoadingFallback from "@/components/common/LoadingFallback";
import Layout from "@/components/landing/Layout";
import DynamicTemplateLoader from "./DynamicTemplateLoader";
import { withSuspense } from "@/auth/withSuspense";
import DynamicHome1 from "@/dynamictemplate/Template1/pages/Home";
import DynamicHome2 from "@/dynamictemplate/Template2/pages/Home";
import useTenantApi from "@/hooks/useTenantApi";

const SmartRouter = () => {
  const { getAll } = useTenantApi();
  const [domainInfo, setDomainInfo] = useState(null);
  const [templateId, setTemplateId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const info = getDomainInfo();
      setDomainInfo(info);

      console.log("[SR] Domain Info:", info);

      if (info.isMain) {
        console.log("[SR] Main Domain → Serving Landing Home");
        setLoading(false);
        return;
      }

      try {
        console.log("[SR] Fetching tenant template...");
        const response = await getAll("/site/by-domain");
        console.log("[SR] Tenant Response:", response);

        const tid = response?.tenant?.template_id;

        if (tid) {
          setTemplateId(Number(tid)); // 🔥 FIX
        }
      } catch (e) {
        console.error("[SR] Error:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <LoadingFallback />;

  if (domainInfo.isMain) {
    return withSuspense(Layout)();
  }

  const HomeComponent = templateId === 2 ? DynamicHome2 : DynamicHome1;

  return <DynamicTemplateLoader>{withSuspense(HomeComponent)()}</DynamicTemplateLoader>;
};

export default SmartRouter;
