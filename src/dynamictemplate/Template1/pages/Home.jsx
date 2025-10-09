import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";


import HomeSkeleton from "@/components/loaders/HomeSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  CircleEllipsis,
  User,
  ArrowRight,
} from "lucide-react";

function Home() {
  const { slug } = useParams();
  const { getAll } = useTenantApi();
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAll(`/site/${slug}`);
        setSiteData(response.site_data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, getAll]);

  if (loading) {
    return <HomeSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-accent">
        <div className="text-red-600 text-xl font-semibold">
          <h2>Error Occurred</h2>
          <p>{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const homeData = siteData?.home || {};
  const sliderBanners = siteData?.slider_banners || [];

  // Banners from slider_banners with fallback
  const banners = sliderBanners.length
    ? sliderBanners.map((banner) => ({
        id: banner.id,
        image: banner.image_url,
        description: banner.description,
        ctaText: "Shop Now",
        ctaLink: `/${slug}/products`,
      }))
    : [
        {
          id: 1,
          image: "https://via.placeholder.com/1200x400?text=Welcome+to+NHT+Global",
          description: "Discover a world of wellness and opportunity.",
          ctaText: "Shop Now",
          ctaLink: `/${slug}/products`,
        },
      ];

  return (
    <div className="min-h-screen bg-accent font-inter">
      {/* Hero Carousel */}
     

      {/* Welcome Section */}
      <section
        aria-label="Welcome to NHT Global"
        className="py-16 md:py-24 px-4 sm:px-8 lg:px-12 bg-gradient-to-b from-accent to-white"
      >
        <div className="max-w-7xl mx-auto text-center">
          
          
          <div
            className="pb-8 max-w-4xl mx-auto text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html:
                homeData.welcome_description ||
                "<p>Welcome to our website and world of opportunities.</p>",
            }}
          />
          
          <Button
            asChild
            className="bg-primary text-white text-lg px-8 py-4 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/90"
          >
            <Link to={`/${slug}/join-us`} className="flex items-center gap-3">
              Join Us Today <User className="w-6 h-6 ml-2 animate-pulse" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Introduction Section */}
      <section
        aria-label="Message from John Ray"
        className="py-16 md:py-24 px-4 sm:px-8 lg:px-12 bg-white"
      >
        <div className="max-w-7xl mx-auto">
     
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div
                className="text-lg text-gray-700 leading-relaxed prose prose-lg prose-gray max-w-none"
                dangerouslySetInnerHTML={{
                  __html:
                    homeData.introduction_content ||
                    "<p>Hi, I'm John Ray, an independent distributor...</p>",
                }}
              />
              <Button
                asChild
                className="mt-8 bg-primary text-white text-lg px-8 py-4 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/90"
              >
                <Link to={`/${slug}/about`} className="flex items-center gap-3">
                  Learn More <CircleEllipsis className="w-6 h-6 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="order-1 md:order-2 relative h-72 sm:h-96 md:h-[500px] overflow-hidden rounded-xl shadow-xl">
              <img
                src={
                  homeData.introduction_image_url ||
                  "https://via.placeholder.com/600x400?text=John+Ray"
                }
                alt="John Ray Introduction"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About NHT Global Section */}
      <section
        aria-label="About NHT Global"
        className="py-16 md:py-24 px-4 sm:px-8 lg:px-12 bg-gradient-to-r from-accent to-white"
      >
        <div className="max-w-7xl mx-auto">
         
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div
                className="text-lg text-gray-700 leading-relaxed prose prose-lg prose-gray max-w-none mb-8"
                dangerouslySetInnerHTML={{
                  __html:
                    homeData.about_company_content_1 ||
                    "<ul><li>Proven company since 2001</li></ul>",
                }}
              />
              <Button
                asChild
                className="bg-primary text-white text-lg px-8 py-4 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/90"
              >
                <Link to={`/${slug}/about`} className="flex items-center gap-3">
                  Discover More <CircleEllipsis className="w-6 h-6 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="order-1 md:order-2 relative h-72 sm:h-96 md:h-[500px] overflow-hidden rounded-xl shadow-xl">
              <img
                src={
                  homeData.about_company_image_url ||
                  "https://via.placeholder.com/600x400?text=About+NHT"
                }
                alt="About NHT Global"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                loading="lazy"
              />
            </div>
          </div>
          <Card className="mt-12 bg-white border-none shadow-xl rounded-2xl transform transition-transform duration-300 hover:shadow-2xl">
            <CardContent className="p-8">
              <div
                className="text-lg md:text-xl italic text-gray-700 text-center prose prose-lg prose-gray max-w-4xl mx-auto"
                dangerouslySetInnerHTML={{
                  __html:
                    homeData.about_company_content_2 ||
                    "<p>NHT Global's mission is to enhance your life...</p>",
                }}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Network Marketing Section */}
      <section
        aria-label="Why Network Marketing"
        className="py-16 md:py-24 px-4 sm:px-8 lg:px-12 bg-white"
      >
        <div className="max-w-7xl mx-auto">
         
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative h-72 sm:h-96 md:h-[500px] overflow-hidden rounded-xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                alt="Network Marketing Opportunity"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                loading="lazy"
              />
            </div>
            <div className="order-1 md:order-2">
              <div
                className="text-lg text-gray-700 leading-relaxed prose prose-lg prose-gray max-w-none mb-8"
                dangerouslySetInnerHTML={{
                  __html:
                    homeData.why_network_marketing_content ||
                    "<ul><li>A global industry worth billions</li></ul>",
                }}
              />
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-4 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Link to={`/${slug}/network-marketing`} className="flex items-center gap-3">
                  Explore Now <BookOpen className="w-6 h-6 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunity Video Section */}
      {homeData.opportunity_video_url && (
        <section
          aria-label="Opportunity Video"
          className="py-16 md:py-24 px-4 sm:px-8 lg:px-12 bg-gradient-to-b from-accent to-white"
        >
          <div className="max-w-5xl mx-auto">
            
            
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl transform transition-transform duration-300 hover:shadow-2xl">
              <video
                src={homeData.opportunity_video_url}
                controls
                className="w-full h-full"
                poster="https://via.placeholder.com/1200x600?text=Video+Preview"
              />
            </div>
          </div>
        </section>
      )}

      {/* Support Section */}
      <section
        aria-label="Our Support"
        className="py-16 md:py-24 px-4 sm:px-8 lg:px-12 bg-white"
      >
        <div className="max-w-5xl mx-auto">
          
          
          <div
            className="text-lg md:text-xl text-gray-700 leading-relaxed prose prose-lg prose-gray max-w-4xl mx-auto mb-10 text-center"
            dangerouslySetInnerHTML={{
              __html:
                homeData.support_content ||
                "<p>We're here to support your success.</p>",
            }}
          />
          <div className="text-center">
            <Button
              asChild
              className="bg-primary text-white text-lg px-8 py-4 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/90"
            >
              <Link to={`/${slug}/join-us`} className="flex items-center gap-3">
                Get Started <ArrowRight className="w-6 h-6 ml-2 animate-pulse" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;