// Home.jsx
import React, { useEffect, useState } from "react";
import { BookOpen, CircleEllipsis, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useTenantApi from "@/hooks/useTenantApi";

function Home() {
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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAll]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  if (error && !siteData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Card className="max-w-md border border-gray-300 shadow-lg">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-black mb-2">Error Occurred</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-black hover:bg-gray-800 text-white"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const homeData = siteData?.homePage || {};
  const sliderBanners = siteData?.sliders || [];

  // Dummy data for fallback
  const dummyBanners = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      description: "Discover a world of wellness and opportunity.",
      ctaText: "Shop Now",
      ctaLink: "/products",
    },
  ];

  const banners = sliderBanners.length ? sliderBanners : dummyBanners;
  const currentBanner = banners[0];

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Hero Carousel */}
      <div className="relative w-full h-80 md:h-[500px] overflow-hidden bg-black group">
        <img
          src={currentBanner?.image}
          alt="Hero Banner"
          className="w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in">
              {currentBanner?.description || "Welcome to NHT Global"}
            </h1>
            <Button className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-3 font-semibold shadow-lg transition-all duration-300 hover:scale-105">
              {currentBanner?.ctaText || "Shop Now"}
            </Button>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <section className="py-16 md:py-24 px-4 sm:px-8 lg:px-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-8">
            Welcome to Our World of Opportunities
          </h2>
          
          {homeData.welcome_description ? (
            <div
              className="pb-8 max-w-4xl mx-auto text-gray-700 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: homeData.welcome_description }}
            />
          ) : (
            <div className="pb-8 max-w-4xl mx-auto text-gray-500 leading-relaxed text-lg italic">
              <p>Join our thriving community and unlock your potential. We offer world-class products, exceptional support, and unlimited earning opportunities. Whether you're looking to supplement your income or build a full-time business, we're here to help you succeed.</p>
            </div>
          )}
          
          <Button className="bg-black hover:bg-gray-800 text-white text-lg px-8 py-4 font-semibold shadow-lg transition-all duration-300 hover:scale-105">
            <User className="w-5 h-5 mr-2 animate-pulse" />
            Join Us Today
          </Button>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 md:py-24 px-4 sm:px-8 lg:px-12 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-12">
            A Message from John Ray
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              {homeData.introduction_content ? (
                <div
                  className="text-lg text-gray-700 leading-relaxed mb-8"
                  dangerouslySetInnerHTML={{ __html: homeData.introduction_content }}
                />
              ) : (
                <div className="text-lg text-gray-600 leading-relaxed mb-8">
                  <p className="mb-4">Hi, I'm John Ray, an independent distributor with NHT Global. Over the years, I've witnessed firsthand how our products and business opportunity have transformed lives.</p>
                  <p className="mb-4">What started as a personal journey has become a mission to help others achieve their dreams. Whether it's financial freedom, better health, or personal growth, I'm here to support you every step of the way.</p>
                  <p>Together, we can build something remarkable.</p>
                </div>
              )}
              <Button className="bg-black hover:bg-gray-800 text-white text-lg px-8 py-4 font-semibold shadow-lg transition-all duration-300 hover:scale-105">
                <CircleEllipsis className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative h-72 sm:h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <img
                  src={
                    homeData.introduction_image_url ||
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  }
                  alt="John Ray Introduction"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About NHT Global Section */}
      <section className="py-16 md:py-24 px-4 sm:px-8 lg:px-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-12">
            {homeData.about_company_title || "About NHT Global"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
            <div className="order-2 md:order-1">
              {homeData.about_company_content_1 ? (
                <div
                  className="text-lg text-gray-700 leading-relaxed mb-8"
                  dangerouslySetInnerHTML={{ __html: homeData.about_company_content_1 }}
                />
              ) : (
                <div className="text-lg text-gray-600 leading-relaxed mb-8">
                  <ul className="list-disc list-inside space-y-3">
                    <li>Proven company established in 2001</li>
                    <li>Global presence in over 90 countries</li>
                    <li>Premium wellness and nutritional products</li>
                    <li>Industry-leading compensation plan</li>
                    <li>24/7 customer and distributor support</li>
                  </ul>
                </div>
              )}
              <Button className="bg-black hover:bg-gray-800 text-white text-lg px-8 py-4 font-semibold shadow-lg transition-all duration-300 hover:scale-105">
                <CircleEllipsis className="w-5 h-5 mr-2" />
                Discover More
              </Button>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative h-72 sm:h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <img
                  src={
                    homeData.about_company_image_url ||
                    "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  }
                  alt="About NHT Global"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          
          <Card className="border border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
            <CardContent className="p-8 md:p-12">
              {homeData.about_company_content_2 ? (
                <div
                  className="text-lg md:text-xl italic text-gray-700 text-center"
                  dangerouslySetInnerHTML={{ __html: homeData.about_company_content_2 }}
                />
              ) : (
                <p className="text-lg md:text-xl italic text-gray-700 text-center">
                  NHT Global's mission is to enhance your life by providing world-class products and a business opportunity that empowers you to achieve financial independence and personal fulfillment.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Network Marketing Section */}
      <section className="py-16 md:py-24 px-4 sm:px-8 lg:px-12 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-12">
            {homeData.why_network_marketing_title || "Why Network Marketing"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="relative h-72 sm:h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                  alt="Network Marketing Opportunity"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              {homeData.why_network_marketing_content ? (
                <div
                  className="text-lg text-gray-700 leading-relaxed mb-8"
                  dangerouslySetInnerHTML={{ __html: homeData.why_network_marketing_content }}
                />
              ) : (
                <div className="text-lg text-gray-600 leading-relaxed mb-8">
                  <ul className="list-disc list-inside space-y-3">
                    <li>A global industry worth billions annually</li>
                    <li>Low startup costs with high earning potential</li>
                    <li>Work at your own pace and schedule</li>
                    <li>Build passive income streams</li>
                    <li>Join a supportive community of entrepreneurs</li>
                  </ul>
                </div>
              )}
              <Button className="bg-black hover:bg-gray-800 text-white text-lg px-8 py-4 font-semibold shadow-lg transition-all duration-300 hover:scale-105">
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunity Video Section */}
      {homeData.opportunity_video_url && (
        <section className="py-16 md:py-24 px-4 sm:px-8 lg:px-12 bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-12">
              {homeData.opportunity_video_header_title || "Opportunity Overview"}
            </h2>
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <video
                src={homeData.opportunity_video_url}
                controls
                className="w-full h-full bg-black"
                poster="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=60"
              />
            </div>
          </div>
        </section>
      )}

      {/* Support Section */}
      <section className="py-16 md:py-24 px-4 sm:px-8 lg:px-12 bg-black text-white border-b border-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Our Commitment to Your Success
          </h2>
          
          {homeData.support_content ? (
            <div
              className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10 max-w-3xl mx-auto"
              dangerouslySetInnerHTML={{ __html: homeData.support_content }}
            />
          ) : (
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10 max-w-3xl mx-auto">
              We're committed to your success at every step. Our dedicated support team provides training, mentoring, and resources to help you achieve your goals. From product knowledge to business strategies, we're here for you.
            </p>
          )}
          
          <Button className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-4 font-semibold shadow-lg transition-all duration-300 hover:scale-105">
            <ArrowRight className="w-5 h-5 mr-2 animate-pulse" />
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Home;