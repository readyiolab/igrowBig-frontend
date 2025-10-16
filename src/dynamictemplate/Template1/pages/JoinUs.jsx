// JoinUs.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, UserPlus, Phone, CheckCircle, HelpCircle } from "lucide-react";

const JoinUs = () => {
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
        setError(err.message || "Failed to load information");
        setSiteData({}); // Show fallback content
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
        <Skeleton className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px]" />
        
        {/* Content Skeleton */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="mb-12">
            <Skeleton className="w-full h-64 rounded-2xl" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const joinUsPage = siteData?.joinUsPage || {};

  // Fallback content if empty
  const bannerImage = joinUsPage.joinus_image_banner_url || "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80";
  const bannerContent = joinUsPage.image_banner_content || "Start Your Journey with NHT Global";
  const section1 = joinUsPage.section_content_1 || "<p>You're just steps away from starting your own business and achieving success. We're here to support you every step of the way.</p>";
  const section2 = joinUsPage.section_content_2 || "<p>Click <strong>Enrollment</strong> below and follow the simple steps. Our team is here to assist you.</p>";
  const section3 = joinUsPage.section_content_3 || "<p>Have questions? Reach out to our support team. We're here to help you succeed.</p>";

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden bg-black">
        <img
          src={bannerImage}
          alt="Join Us Banner"
          className="w-full h-full object-cover opacity-70 hover:opacity-80 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center drop-shadow-lg">
            {bannerContent}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* Top Section - Full Width */}
        <div className="mb-12 md:mb-16">
          <div className="border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-black to-gray-800 text-white px-6 sm:px-8 md:px-12 py-10 md:py-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
                Join Us Today
              </h2>
            </div>
            <div className="px-6 sm:px-8 md:px-12 py-10 md:py-12">
              <div className="w-16 h-1 bg-black mx-auto mb-8"></div>
              <div
                className="text-base sm:text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto"
                dangerouslySetInnerHTML={{ __html: section1 }}
              />
            </div>
          </div>
        </div>

        {/* Three Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          
          {/* How to Get Started */}
          <div className="border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
            <div className="bg-gray-50 border-b border-gray-200 px-6 sm:px-8 py-8">
              <div className="flex justify-center mb-4">
                <div className="bg-black rounded-full p-3">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-black text-center">
                How to Get Started
              </h3>
            </div>
            <div className="px-6 sm:px-8 py-8 flex-grow">
              <div
                className="text-base text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: section2 }}
              />
            </div>
            <div className="bg-gray-50 border-t border-gray-200 px-6 sm:px-8 py-6 flex justify-center">
              <Button
                
                className="bg-black hover:bg-gray-800 text-white px-8 py-3 font-semibold transition-all duration-300 hover:scale-105 flex items-center"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Enroll Now
              </Button>
            </div>
          </div>

          {/* Need Help */}
          <div className="border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
            <div className="bg-gray-50 border-b border-gray-200 px-6 sm:px-8 py-8">
              <div className="flex justify-center mb-4">
                <div className="bg-black rounded-full p-3">
                  <HelpCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-black text-center">
                Need Help?
              </h3>
            </div>
            <div className="px-6 sm:px-8 py-8 flex-grow">
              <div
                className="text-base text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: section3 }}
              />
            </div>
            <div className="bg-gray-50 border-t border-gray-200 px-6 sm:px-8 py-6 flex justify-center">
              <Button
                onClick={() => navigate("/contact")}
                className="bg-black hover:bg-gray-800 text-white px-8 py-3 font-semibold transition-all duration-300 hover:scale-105 flex items-center"
              >
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </Button>
            </div>
          </div>

          {/* Ready to Join */}
          <div className="border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
            <div className="bg-gray-50 border-b border-gray-200 px-6 sm:px-8 py-8">
              <div className="flex justify-center mb-4">
                <div className="bg-black rounded-full p-3">
                  <ArrowRight className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-black text-center">
                Ready to Join?
              </h3>
            </div>
            <div className="px-6 sm:px-8 py-8 flex-grow">
              <div className="text-base text-gray-700 leading-relaxed space-y-4">
                <p>Take your first step toward success with NHT Global. Our enrollment process is simple and straightforward.</p>
                <p>Begin your journey today and become part of our global community of successful entrepreneurs.</p>
              </div>
            </div>
            <div className="bg-gray-50 border-t border-gray-200 px-6 sm:px-8 py-6 flex justify-center">
              <Button
                onClick={() => navigate("/opportunity")}
                className="bg-black hover:bg-gray-800 text-white px-8 py-3 font-semibold transition-all duration-300 hover:scale-105 flex items-center"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

        </div>

        {/* Bottom CTA Section */}
        <div className="border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-black to-gray-800 px-6 sm:px-8 md:px-12 py-12 md:py-16 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Life?
            </h2>
            <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of successful entrepreneurs who have already started their journey with NHT Global
            </p>
            <Button
              onClick={() => navigate("/enrollment")}
              className="bg-white hover:bg-gray-100 text-black px-8 py-3 font-bold text-lg transition-all duration-300 hover:scale-105 inline-flex items-center"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default JoinUs;