// Opportunity.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Download } from "lucide-react";

const Opportunity = () => {
  const navigate = useNavigate();
  const { getAll } = useTenantApi();
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAll("/site/data");
        setSiteData(response);
      } catch (err) {
        setError(err.message);
        setSiteData({});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAll]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        {/* Banner Skeleton */}
        <Skeleton className="w-full h-64 sm:h-80 md:h-96 lg:h-[450px]" />
        
        {/* Content Skeleton */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <Skeleton className="w-full h-48 rounded-2xl mb-12" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Skeleton className="h-80 rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const opportunityPage = siteData?.opportunityPage || {};

  // Fallback content
  const bannerImage = opportunityPage.banner_image_url || "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80";
  const bannerContent = opportunityPage.banner_content || "Discover Your Opportunity";
  const welcomeMessage = opportunityPage.welcome_message || "<p>Welcome to NHT Global. Discover the world's premier network marketing company designed to help you achieve your goals and transform your life.</p>";
  const pageContent = opportunityPage.page_content || "<p>Join NHT Global to build your future and promote wellness. Our compensation plan is designed to reward your efforts and support your success.</p>";
  const headerTitle = opportunityPage.header_title || "Open the Door of Opportunity";
  const pageImage = opportunityPage.page_image_url || "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[450px] overflow-hidden bg-black">
        <img
          src={bannerImage}
          alt="Opportunity Banner"
          className="w-full h-full object-cover opacity-70 hover:opacity-80 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute inset-0 flex items-end justify-center pb-8 px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center drop-shadow-lg">
            {bannerContent}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* Welcome Section */}
        <section className="mb-12 md:mb-16">
          <div className="border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-black to-gray-800 text-white px-6 sm:px-8 md:px-12 py-10 md:py-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
                Welcome to the NHT Global Opportunity
              </h2>
            </div>
            <div className="px-6 sm:px-8 md:px-12 py-10 md:py-12">
              <div className="w-16 h-1 bg-black mx-auto mb-8"></div>
              <div
                className="text-base sm:text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto"
                dangerouslySetInnerHTML={{ __html: welcomeMessage }}
              />
            </div>
          </div>
        </section>

        {/* Opportunity Section - Two Column */}
        <section className="mb-12 md:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image */}
            <div className="order-2 md:order-1">
              <div className="relative h-64 sm:h-72 md:h-96 lg:h-[450px] overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src={pageImage}
                  alt="Opportunity"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Content */}
            <div className="order-1 md:order-2 flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6">
                {headerTitle}
              </h2>
              
              <div
                className="text-base sm:text-lg text-gray-700 leading-relaxed mb-8 space-y-4"
                dangerouslySetInnerHTML={{ __html: pageContent }}
              />
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate("/join-us")}
                  className="bg-black hover:bg-gray-800 text-white px-8 py-3 font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center sm:justify-start"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                {opportunityPage.plan_document_url && (
                  <a href={opportunityPage.plan_document_url} target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      className="border-black text-black hover:bg-black hover:text-white px-8 py-3 font-semibold transition-all duration-300 hover:scale-105 w-full sm:w-auto flex items-center justify-center"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Compensation Plan
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Video Section */}
        {opportunityPage.video_section_link && (
          <section className="mb-12 md:mb-16">
            <div className="border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 sm:px-8 md:px-12 py-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">
                  Explore Our Opportunity
                </h2>
              </div>
              <div className="px-6 sm:px-8 md:px-12 py-8">
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                  <video
                    src={opportunityPage.video_section_link}
                    controls
                    className="w-full h-full bg-black"
                    title="NHT Global Opportunity Video"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Overview Section */}
        <section className="mb-12 md:mb-16">
          <div className="border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-6 sm:px-8 md:px-12 py-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">
                Opportunity Overview
              </h2>
            </div>
            <div className="px-6 sm:px-8 md:px-12 py-10">
              <div
                className="text-base sm:text-lg text-gray-700 leading-relaxed max-h-96 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: welcomeMessage }}
              />
            </div>
          </div>
        </section>

        {/* Plan Details Section */}
        <section className="mb-12 md:mb-16">
          <div className="border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-6 sm:px-8 md:px-12 py-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">
                Plan Details & Earning Potential
              </h2>
            </div>
            <div className="px-6 sm:px-8 md:px-12 py-10">
              <div
                className="text-base sm:text-lg text-gray-700 leading-relaxed mb-8"
                dangerouslySetInnerHTML={{ __html: pageContent }}
              />
              {opportunityPage.plan_document_url && (
                <a href={opportunityPage.plan_document_url} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 font-semibold flex items-center">
                    <Download className="mr-2 h-5 w-5" />
                    Download Full Compensation Plan
                  </Button>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-black to-gray-800 px-6 sm:px-8 md:px-12 py-12 md:py-16 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of successful entrepreneurs building their businesses with NHT Global
            </p>
            <Button
              onClick={() => navigate("/join-us")}
              className="bg-white hover:bg-gray-100 text-black px-8 py-3 font-bold text-lg transition-all duration-300 hover:scale-105 inline-flex items-center"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Opportunity;