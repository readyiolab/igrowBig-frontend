import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useTenantApi from "@/hooks/useTenantApi";
import {
  BookOpen,
  CircleEllipsis,
  User,
  Play,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
} from "lucide-react";

// Mock API data - Replace with actual API call
const defaultData = {
  hero_section_title: "Do you know what it means to have Dream Life?",
  hero_section_content:
    "<p>Living the Best Life means <strong>Excellent Health</strong>, Better Financial Potential, Enriching Personal Relationships and the freedom to spend YOUR time enjoying what makes you happy... we call that a <strong>Dream Life</strong>!</p>",
  hero_banner_image_url:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=500&fit=crop",

  welcome_section_title: "Welcome to Get Dream Life",
  welcome_section_content:
    "<p>Get Dream Life (GDL) welcomes to the world of opportunity and infinite potential for a great life. Yes, we mean it, '<strong>Infinite Human Potential</strong>'. If you're worried about job security, interested in extra income opportunities or looking for a change in your professional career, your worries stop here. You are at the right place.</p><p>This is the time to start your own business, be your own boss, choose your time of working and <strong>Live Your Dream Life</strong>. Get what you deserve, more than you expect. GDL is promoting a great network marketing opportunity which is making entrepreneurs around the world over last 15 years.</p><p>Enjoy peace of mind and be stress free by earning a second income easily promoting products you use every day. GDL is proud to work with <strong>NHT Global</strong> as an independent distributor. Learn more about this exciting opportunity on our site. And Yes, don't hesitate to contact us if need assistance.</p>",
  welcome_section_image_url:
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",

  about_section_title: "About NHT Global",
  about_section_content:
    "<p>NHT Global mission is to improve the way you feel- about yourself and about work. Providing effective, quality-of-life products for our customers and possibly the most lucrative compensation plan ever for the members and committed to the wellness of people across the globe.</p><ul><li>Proven company with a record breaking 15+ years history</li><li>Revolutionary e-commerce business model that is the envy of the industry</li><li>Currently operating in more than 38 countries and shipping product into more than 50</li><li>High impacting products promoting a healthy lifestyle</li><li>A balanced healthy lifestyle created through improved Physical health, Emotional health, and Financial health</li><li>Training system in place to ensure your success</li></ul>",
  about_section_image_url:
    "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&h=400&fit=crop",

  history_section_title: "History of NHT Global",
  history_section_content:
    "<p><strong>Started in 2001</strong>, global headquarters in Los Angeles, California</p><p>To date, global sales are regularly increasing and growing at a record pace. Financial stable and carrying a legacy of 15+ years old company.</p><h3>Facts about the high impacting and high quality products:</h3><ul><li>Contain nobel prize winning research</li><li>Proprietary formulas developed to satisfy your wants</li><li>Are consumable, highly marketable and priced right</li><li>Developed loyal customers who know & love NHT global</li></ul><h3>Seamless global compensation plan that has:</h3><ul><li>Developed many successful individuals</li><li>Allowed to become entrepreneurs with their efforts and company's support</li></ul>",
  history_section_image_url:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",

  video_section_title: "Watch NHT Global Video",
  video_section_youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  video_section_file_url: null,

  help_section_title: "How Get Dream Life Can Help",
  help_section_content:
    "<p>We are team of professional believe in your success is our success. Will provide you all possible support like:</p><ul><li>Training to understand the business in detail</li><li>Marketing platform and all possible tools to get success faster</li><li>Direct contact with founding members and top leaders committed to your success</li><li>All support to open new market or country where you can become pioneer</li></ul>",
  help_section_image_url:
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop",
};

function Home() {
  const { getAll } = useTenantApi();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);;

  // Modern color palette - Vibrant purple and teal theme
  const colors = {
    primary: "#0f172a", // Deep slate
    secondary: "#8b5cf6", // Vibrant purple
    tertiary: "#06b6d4", // Cyan/teal
    accent: "#f59e0b", // Amber accent
    light: "#f8fafc", // Off white
    lightGray: "#e2e8f0", // Light gray
  };

useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAll("/site/data");
        const homeData = response?.homePage || {};
        
        // ✅ NO TRANSFORMATION NEEDED - Use backend data directly with defaults as fallback
        const finalData = {
          hero_section_title: homeData.hero_section_title || defaultData.hero_section_title,
          hero_section_content: homeData.hero_section_content || defaultData.hero_section_content,
          hero_banner_image_url: homeData.hero_banner_image_url || defaultData.hero_banner_image_url,
          
          welcome_section_title: homeData.welcome_section_title || defaultData.welcome_section_title,
          welcome_section_content: homeData.welcome_section_content || defaultData.welcome_section_content,
          welcome_section_image_url: homeData.welcome_section_image_url || defaultData.welcome_section_image_url,
          
          about_section_title: homeData.about_section_title || defaultData.about_section_title,
          about_section_content: homeData.about_section_content || defaultData.about_section_content,
          about_section_image_url: homeData.about_section_image_url || defaultData.about_section_image_url,
          
          history_section_title: homeData.history_section_title || defaultData.history_section_title,
          history_section_content: homeData.history_section_content || defaultData.history_section_content,
          history_section_image_url: homeData.history_section_image_url || defaultData.history_section_image_url,
          
          video_section_title: homeData.video_section_title || defaultData.video_section_title,
          video_section_youtube_url: homeData.video_section_youtube_url || defaultData.video_section_youtube_url,
          video_section_file_url: homeData.video_section_file_url || defaultData.video_section_file_url,
          
          help_section_title: homeData.help_section_title || defaultData.help_section_title,
          help_section_content: homeData.help_section_content || defaultData.help_section_content,
          help_section_image_url: homeData.help_section_image_url || defaultData.help_section_image_url,
        };

        setPageData(finalData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
        // ✅ Use defaults on error
        setPageData(defaultData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getAll]);

  const renderContent = (htmlContent) => {
    return { __html: htmlContent || "" };
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: colors.light }}
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: colors.secondary }}
        ></div>
      </div>
    );
  }

  if (error && !pageData) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: colors.primary }}>
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.accent }}>
              Oops! Something went wrong
            </h2>
            <p className="mb-6" style={{ color: colors.secondary }}>{error}</p>
            <Button onClick={() => window.location.reload()} style={{ background: colors.accent }} className="text-white">
              Try Again
            </Button>
          </div>
        </div>
      );
    }

  return (
    <div className="min-h-screen" >
      {/* Hero Section - Full width with diagonal split */}
      <section
        className="relative overflow-hidden pt-10"
        style={{
          background: `radial-gradient(circle, ${colors.primary}, ${colors.tertiary})`,
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className=" px-4 sm:px-6 lg:px-8 py-20  relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight">
                {pageData?.hero_section_title || "Default Hero Title"}
              </h1>

              <div
                className="text-lg sm:text-xl opacity-90 leading-relaxed"
                dangerouslySetInnerHTML={renderContent(
                  pageData?.hero_section_content ||
                    "Default hero content goes here."
                )}
              />

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  style={{ background: colors.light, color: colors.primary }}
                >
                  Get Started Today
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 bg-transparent text-lg font-semibold rounded-2xl border-2 text-white  transition-all duration-300 cursor-pointer"
                  style={{ borderColor: "white" }}
                >
                  Learn More
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl opacity-50 blur-2xl"></div>
              <img
                src={
                  pageData?.hero_banner_image_url ||
                  "https://via.placeholder.com/800x600"
                }
                alt="Hero Banner"
                className="relative  w-full h-[400px] object-cover "
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section - Card style with floating effect */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image card */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 rounded-2xl overflow-hidden ">
                <img
                  src={pageData.welcome_section_image_url}
                  alt="Welcome"
                  className="w-full h-[500px] object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="inline-block"></div>

              <h2
                className="text-4xl md:text-5xl font-semibold"
                style={{ color: colors.primary }}
              >
                {pageData.welcome_section_title}
              </h2>

              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={renderContent(
                  pageData.welcome_section_content
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div
                  className="p-6 rounded-2xl text-center"
                  style={{ background: `${colors.secondary}10` }}
                >
                  <TrendingUp
                    className="w-8 h-8 mx-auto mb-3"
                    style={{ color: colors.secondary }}
                  />
                  <h3
                    className="font-semibold text-lg mb-1"
                    style={{ color: colors.primary }}
                  >
                    Growth
                  </h3>
                  <p className="text-sm text-gray-600">Unlimited potential</p>
                </div>
                <div
                  className="p-6 rounded-2xl text-center"
                  style={{ background: `${colors.tertiary}10` }}
                >
                  <Award
                    className="w-8 h-8 mx-auto mb-3"
                    style={{ color: colors.tertiary }}
                  />
                  <h3
                    className="font-semibold text-lg mb-1"
                    style={{ color: colors.primary }}
                  >
                    Excellence
                  </h3>
                  <p className="text-sm text-gray-600">Quality products</p>
                </div>
                <div
                  className="p-6 rounded-2xl text-center"
                  style={{ background: `${colors.accent}10` }}
                >
                  <User
                    className="w-8 h-8 mx-auto mb-3"
                    style={{ color: colors.accent }}
                  />
                  <h3
                    className="font-semibold text-lg mb-1"
                    style={{ color: colors.primary }}
                  >
                    Community
                  </h3>
                  <p className="text-sm text-gray-600">Global network</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Split with overlap */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{ background: colors.lightGray }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-semibold"
              style={{ color: colors.primary }}
            >
              {pageData.about_section_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={renderContent(
                  pageData.about_section_content
                )}
              />
              <Button
                className="px-8 py-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer"
                style={{ background: colors.tertiary, color: "white" }}
              >
                Learn More <CircleEllipsis className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl"
                style={{ background: colors.secondary }}
              ></div>
              <img
                src={pageData.about_section_image_url}
                alt="About Us"
                className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* History Section - Timeline style */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={pageData.history_section_image_url}
                  alt="Our History"
                  className="w-full h-[500px] object-cover"
                  loading="lazy"
                />
              </div>
              <div
                className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full opacity-20 blur-2xl"
                style={{ background: colors.accent }}
              ></div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <h2
                className="text-4xl md:text-5xl font-semibold"
                style={{ color: colors.primary }}
              >
                {pageData.history_section_title}
              </h2>

              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={renderContent(
                  pageData.history_section_content
                )}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Video Section - Centered with glow effect */}
      {(pageData.video_section_youtube_url ||
        pageData.video_section_file_url) && (
        <section
          className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${colors.tertiary} 0%, ${colors.secondary} 100%)`,
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "40px 40px",
              }}
            ></div>
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-semibold mb-12 text-white">
              {pageData.video_section_title}
            </h2>

            <div className="relative">
              <div className="absolute -inset-8 rounded-3xl opacity-50 blur-3xl"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video ">
                {pageData.video_section_youtube_url ? (
                  <iframe
                    src={pageData.video_section_youtube_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video
                    src={pageData.video_section_file_url}
                    controls
                    className="w-full h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Help Section - Feature grid */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{ background: colors.lightGray }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-semibold"
              style={{ color: colors.primary }}
            >
              {pageData.help_section_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={renderContent(
                  pageData.help_section_content
                )}
              />
              <Button
                className="px-8 py-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all  cursor-pointer "
                style={{ background: colors.tertiary, color: "white" }}
              >
                Explore Resources <BookOpen className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="relative">
              <img
                src={pageData.help_section_image_url}
                alt="How We Help"
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Bold and centered */}
      <section
        className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden m-10 rounded-2xl shadow-2xl"
        style={{ background: `linear-gradient(135deg, ${colors.tertiary}` }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-semibold mb-6 text-white">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg md:text-2xl mb-10 text-white ">
            Join thousands of successful entrepreneurs today and transform your
            life
          </p>
          <Button
            size="lg"
            className="px-12 py-8 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 bg-white text-primary cursor-pointer hover:text-black hover:bg-white"
          >
            Get Started Now <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </section>

      {/* Custom Styles */}
      <style>{`
        .prose h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: ${colors.primary};
        }
        .prose ul, .prose ol {
          margin-top: 1rem;
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .prose li {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .prose ul li {
          list-style-type: disc;
        }
        .prose ol li {
          list-style-type: decimal;
        }
        .prose strong {
          font-weight: 700;
          color: ${colors.secondary};
        }
        .prose em {
          font-style: italic;
        }
        .prose p {
          margin-top: 1rem;
          margin-bottom: 1rem;
          line-height: 1.8;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}

export default Home;
