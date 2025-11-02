import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, CircleEllipsis, User } from "lucide-react";
import useTenantApi from "@/hooks/useTenantApi";

function Home() {
  const { getAll } = useTenantApi();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Color palette
  const colors = {
    primary: "#d3d6db",
    secondary: "#3a4750",
    tertiary: "#303841",
    accent: "#be3144",
  };

  // ✅ Default values matching backend structure
  const defaultData = {
    hero_section_title: "Do you know what it means to have Dream Life?",
    hero_section_content: "<p>Living the Best Life means <strong>Excellent Health</strong>, Better Financial Potential, Enriching Personal Relationships and the freedom to spend YOUR time enjoying what makes you happy... we call that a <strong>Dream Life</strong>!</p>",
    hero_banner_image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=500&fit=crop",
    
    welcome_section_title: "Welcome to Get Dream Life",
    welcome_section_content: "<p>Get Dream Life (GDL) welcomes to the world of opportunity and infinite potential for a great life. Yes, we mean it, '<strong>Infinite Human Potential</strong>'. If you're worried about job security, interested in extra income opportunities or looking for a change in your professional career, your worries stop here. You are at the right place.</p>",
    welcome_section_image_url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
    
    about_section_title: "About NHT Global",
    about_section_content: "<p>NHT Global mission is to improve the way you feel- about yourself and about work. Providing effective, quality-of-life products for our customers and possibly the most lucrative compensation plan ever for the members and committed to the wellness of people across the globe.</p>",
    about_section_image_url: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&h=400&fit=crop",
    
    history_section_title: "History of NHT Global",
    history_section_content: "<p><strong>Started in 2001</strong>, global headquarters in Los Angeles, California</p>",
    history_section_image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
    
    video_section_title: "Watch NHT Global Video",
    video_section_youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    video_section_file_url: null,
    
    help_section_title: "How Get Dream Life Can Help",
    help_section_content: "<p>We are team of professional believe in your success is our success. Will provide you all possible support like:</p>",
    help_section_image_url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop",
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.primary }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.accent }}></div>
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
    <div className="min-h-screen" style={{ background: colors.primary }}>
      {/* Hero Section */}
      <section aria-label="Hero Section" className="relative">
        <div className="flex flex-col lg:flex-row min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
          <div className="lg:w-1/2 flex items-center justify-center bg-gradient-to-r from-[rgba(34,40,49,0.95)] via-[rgba(34,40,49,0.7)] to-[rgba(34,40,49,0.3)] lg:to-transparent py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl text-center lg:text-left">
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-tight tracking-tight"
                style={{
                  color: colors.primary,
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                }}
              >
                {pageData?.hero_section_title}
              </h1>
              <div
                className="text-lg sm:text-xl max-w-none font-medium"
                style={{
                  color: colors.primary,
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
                }}
                dangerouslySetInnerHTML={renderContent(pageData?.hero_section_content)}
              />
              <Button
                size="lg"
                className="mt-10 px-10 py-5 text-xl duration-300 text-white font-medium cursor-pointer"
                style={{ background: colors.accent }}
              >
                Get Started Today
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 h-[300px] lg:h-auto overflow-hidden">
            <img
              src={pageData?.hero_banner_image_url}
              alt="Hero Banner"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8" style={{ background: "#ffffff" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6" style={{ color: colors.tertiary }}>
                {pageData?.welcome_section_title}
              </h2>
              <div
                className="prose prose-lg max-w-none leading-relaxed"
                style={{ color: colors.secondary }}
                dangerouslySetInnerHTML={renderContent(pageData?.welcome_section_content)}
              />
              <Button className="mt-8 px-6 py-3 shadow-lg flex items-center gap-2 text-white font-semibold" style={{ background: colors.accent }}>
                Join Our Community <User className="w-5 h-5" />
              </Button>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="relative transform transition-transform duration-500">
                <img src={pageData?.welcome_section_image_url} alt="Welcome" className="w-full h-[400px] object-cover" loading="lazy" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(190, 49, 68, 0.2), transparent)" }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8" style={{ background: colors.primary }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4" style={{ color: colors.tertiary }}>
              {pageData?.about_section_title}
            </h2>
            <div className="w-24 h-1 mx-auto" style={{ background: colors.accent }}></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img src={pageData?.about_section_image_url} alt="About Us" className="w-full h-[400px] object-cover" loading="lazy" />
            </div>
            <div>
              <div
                className="prose prose-lg max-w-none leading-relaxed"
                style={{ color: colors.secondary }}
                dangerouslySetInnerHTML={renderContent(pageData?.about_section_content)}
              />
              <Button className="mt-8 px-6 py-3 shadow-lg flex items-center gap-2 text-white font-semibold" style={{ background: colors.accent }}>
                Learn More <CircleEllipsis className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8" style={{ background: "#ffffff" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6" style={{ color: colors.tertiary }}>
                {pageData?.history_section_title}
              </h2>
              <div
                className="prose prose-lg max-w-none leading-relaxed"
                style={{ color: colors.secondary }}
                dangerouslySetInnerHTML={renderContent(pageData?.history_section_content)}
              />
            </div>
            <div className="relative">
              <img src={pageData?.history_section_image_url} alt="Our History" className="w-full h-[400px] object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      {(pageData?.video_section_youtube_url || pageData?.video_section_file_url) && (
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8" style={{ background: colors.tertiary }}>
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4" style={{ color: colors.primary }}>
              {pageData?.video_section_title}
            </h2>
            <div className="w-24 h-1 mx-auto mb-12" style={{ background: colors.accent }}></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-black">
              {pageData?.video_section_youtube_url ? (
                <iframe
                  src={pageData.video_section_youtube_url}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video src={pageData?.video_section_file_url} controls className="w-full h-full">
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Help Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8" style={{ background: colors.primary }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4" style={{ color: colors.tertiary }}>
              {pageData?.help_section_title}
            </h2>
            <div className="w-24 h-1 mx-auto" style={{ background: colors.accent }}></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div
                className="prose prose-lg max-w-none leading-relaxed"
                style={{ color: colors.secondary }}
                dangerouslySetInnerHTML={renderContent(pageData?.help_section_content)}
              />
              <Button className="mt-8 px-6 py-3 flex items-center gap-2 text-white font-semibold" style={{ background: colors.accent }}>
                Explore Resources <BookOpen className="w-5 h-5" />
              </Button>
            </div>
            <div className="order-1 lg:order-2 relative">
              <img src={pageData?.help_section_image_url} alt="How We Help" className="w-full h-[400px] object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 m-10 rounded-2xl" style={{ background: colors.secondary }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6 text-white">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-white">Join thousands of successful entrepreneurs today</p>
          <Button className="px-8 py-6 text-lg shadow-xl transform transition-all duration-300 text-white font-medium" style={{ background: colors.accent }}>
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Custom Styles */}
      <style>{`
        .prose h3 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 1rem; color: ${colors.tertiary}; }
        .prose ul, .prose ol { margin-top: 1rem; margin-bottom: 1rem; padding-left: 1.5rem; }
        .prose li { margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .prose ul li { list-style-type: disc; }
        .prose ol li { list-style-type: decimal; }
        .prose strong { font-weight: 700; color: ${colors.accent}; }
        .prose em { font-style: italic; }
        .prose p { margin-top: 1rem; margin-bottom: 1rem; line-height: 1.8; }
        [aria-label="Hero Section"] strong { font-weight: 700; color: ${colors.primary}; }
        [aria-label="Hero Section"] p { margin-top: 0.5rem; margin-bottom: 0.5rem; line-height: 1.8; }
      `}</style>
    </div>
  );
}

export default Home;