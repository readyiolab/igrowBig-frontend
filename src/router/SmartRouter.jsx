// (Handles main vs sub/custom domain at root)

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDomainInfo } from "@/utils/domain";
import LoadingFallback from "@/components/common/LoadingFallback";
import Layout from "@/components/landing/Layout"; // Main domain landing
import DynamicTemplateLoader from "./DynamicTemplateLoader";
import { withSuspense } from "@/auth/withSuspense";
import DynamicHome from "@/dynamictemplate/Template1/pages/Home";

const SmartRouter = () => {
  const navigate = useNavigate();
  const [domainInfo, setDomainInfo] = useState(null);

  useEffect(() => {
    const info = getDomainInfo();
    setDomainInfo(info);

    if (info.isMain) {
      console.log("Main domain detected");
    } else {
      console.log("Subdomain/Custom domain detected");
    }
  }, []);

  if (!domainInfo) return <LoadingFallback />;

  if (domainInfo.isMain) {
    return withSuspense(Layout)();
  }

  return (
    <DynamicTemplateLoader>
      {withSuspense(DynamicHome)()}
    </DynamicTemplateLoader>
  );
};

export default SmartRouter;