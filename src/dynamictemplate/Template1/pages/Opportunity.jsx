// Opportunity.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const Opportunity = () => {
  const navigate = useNavigate();
  const { getAll } = useTenantApi();
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Color palette - matching new design
  const colors = {
    first: "#d3d6db",
    second: "#3a4750",
    third: "#303841",
    accent: "#be3144",
  };

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

  const renderContent = (htmlContent) => {
    return { __html: htmlContent || "" };
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: colors.first }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4"
            style={{ borderColor: colors.accent }}
          ></div>
          <p className="font-medium" style={{ color: colors.third }}>
            Loading opportunity...
          </p>
        </div>
      </div>
    );
  }

  const opportunityPage = siteData?.opportunityPage || {};

  return (
    <div className="min-h-screen" style={{ background: colors.first }}>
      {/* Hero Banner Section */}
      <section aria-label="Hero Section" className="relative">
        <div className="flex flex-col lg:flex-row min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
          {/* LEFT – Text + Gradient Overlay */}
          <div
            className="lg:w-1/2 flex items-center justify-center bg-gradient-to-r from-[rgba(34,40,49,0.95)] via-[rgba(34,40,49,0.7)] to-[rgba(34,40,49,0.3)] lg:to-transparent py-12 px-4 sm:px-6 lg:px-8"
            style={{ backgroundColor: colors.third }}
          >
            <div className="max-w-2xl text-center lg:text-left">
              <h1
                className="text-3xl sm:text-3xl md:text-4xl lg:text-6xl font-semibold mb-6 leading-tight tracking-tight"
                style={{
                  color: '#ffffff',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                {opportunityPage.hero_section_content || "A Lifetime Opportunity"}
              </h1>

              <div
                className="text-lg sm:text-xl max-w-none font-medium"
                style={{
                  color: '#ffffff',
                  textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
                }}
                dangerouslySetInnerHTML={renderContent(
                  opportunityPage.description_section_content || 
                  "<p>Discover the world's premier network marketing company designed to help you achieve your goals and transform your life.</p>"
                )}
              />

              {/* CTA Button */}
              <button
                onClick={() => navigate("/join-us")}
                className="mt-10 px-6 py-2 text-xl duration-300 font-medium text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                style={{ background: colors.accent }}
              >
                Get Started Today
              </button>
            </div>
          </div>

          {/* RIGHT – Image */}
          <div className="lg:w-1/2 h-[300px] lg:h-auto overflow-hidden">
            <img
              src={opportunityPage.door_section_image_url || "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"}
              alt="Opportunity Banner"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Door of Opportunity Section */}
      {opportunityPage.door_section_title && (
        <section className="py-20 px-4" style={{ background: "#ffffff" }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <img
                  src={opportunityPage.door_section_image_url || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop"}
                  alt="Open the Door"
                  className="w-full h-[400px] object-cover rounded-lg shadow-xl"
                />
              </div>
              <div>
                <h2
                  className="text-3xl md:text-4xl font-semibold mb-6"
                  style={{ color: colors.second }}
                >
                  {opportunityPage.door_section_title}
                </h2>
                <div
                  className="prose prose-lg max-w-none leading-relaxed mb-6"
                  style={{ color: colors.third }}
                  dangerouslySetInnerHTML={renderContent(opportunityPage.door_section_content)}
                />
                <button
                  onClick={() => navigate("/join-us")}
                  className="px-8 py-3 rounded-lg shadow-lg cursor-pointer font-semibold text-white hover:shadow-xl transition-all duration-300"
                  style={{ background: colors.accent }}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why Network Marketing Section */}
      {opportunityPage.marketing_section_title && (
        <section className="py-20 px-4" style={{ background: colors.first }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2
                  className="text-3xl md:text-4xl font-semibold mb-6"
                  style={{ color: colors.second }}
                >
                  {opportunityPage.marketing_section_title}
                </h2>
                <div
                  className="prose prose-lg max-w-none leading-relaxed mb-6"
                  style={{ color: colors.third }}
                  dangerouslySetInnerHTML={renderContent(
                    opportunityPage.marketing_section_content
                  )}
                />
                <button
                  onClick={() => navigate("/join-us")}
                  className="px-8 py-3 rounded-lg shadow-lg cursor-pointer font-semibold text-white hover:shadow-xl transition-all duration-300"
                  style={{ background: colors.accent }}
                >
                  Get Started
                </button>
              </div>
              <div className="relative order-1 md:order-2">
                <img
                  src={opportunityPage.marketing_section_image_url || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"}
                  alt="Network Marketing"
                  className="w-full h-[400px] object-cover rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Business Model Section */}
      {opportunityPage.business_model_section_title && (
        <section className="py-20 px-4" style={{ background: "#ffffff" }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <img
                  src={opportunityPage.business_model_section_image_url || "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"}
                  alt="Business Model"
                  className="w-full h-[400px] object-cover rounded-lg shadow-xl"
                />
              </div>
              <div>
                <h2
                  className="text-3xl md:text-4xl font-semibold mb-6"
                  style={{ color: colors.second }}
                >
                  {opportunityPage.business_model_section_title}
                </h2>
                <div
                  className="prose prose-lg max-w-none leading-relaxed mb-6"
                  style={{ color: colors.third }}
                  dangerouslySetInnerHTML={renderContent(
                    opportunityPage.business_model_section_content
                  )}
                />
                <button
                  onClick={() => navigate("/join-us")}
                  className="px-8 py-3 rounded-lg shadow-lg cursor-pointer font-semibold text-white hover:shadow-xl transition-all duration-300"
                  style={{ background: colors.accent }}
                >
                  Join Now
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Video Overview Section */}
      {(opportunityPage.overview_section_youtube_url || opportunityPage.overview_section_video_url) && (
        <section className="py-20 px-4" style={{ background: colors.first }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-semibold mb-6"
                style={{ color: colors.second }}
              >
                {opportunityPage.overview_section_title || "Opportunity Overview"}
              </h2>
            </div>
            {opportunityPage.overview_section_youtube_url ? (
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={opportunityPage.overview_section_youtube_url}
                    title="Opportunity Overview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ) : opportunityPage.overview_section_video_url ? (
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <video
                  width="100%"
                  height="auto"
                  controls
                  className="w-full h-auto"
                >
                  <source
                    src={opportunityPage.overview_section_video_url}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div
                className="rounded-xl h-96 flex items-center justify-center"
                style={{ background: colors.first }}
              >
                <div className="text-center">
                  <Play
                    className="w-16 h-16 mx-auto mb-4"
                    style={{ color: colors.second }}
                  />
                  <p style={{ color: colors.second }}>No video available</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Compensation Plan Section */}
      {opportunityPage.compensation_plan_section_title && (
        <section className="py-20 px-4" style={{ background: "#ffffff" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-semibold mb-6"
                style={{ color: colors.second }}
              >
                {opportunityPage.compensation_plan_section_title}
              </h2>
              <div
                className="w-24 h-1 mx-auto"
                style={{ background: colors.accent }}
              ></div>
            </div>
            <div
              className="prose prose-lg max-w-none leading-relaxed"
              style={{ color: colors.third }}
              dangerouslySetInnerHTML={renderContent(
                opportunityPage.compensation_plan_section_content
              )}
            />
            {opportunityPage.compensation_plan_document_url && (
              <div className="text-center mt-8">
                <a
                  href={opportunityPage.compensation_plan_document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 rounded-lg shadow-lg cursor-pointer font-semibold text-white hover:shadow-xl transition-all duration-300 inline-block"
                  style={{ background: colors.accent }}
                >
                  Download Compensation Plan PDF
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section
        className="py-20 px-4 m-10 rounded-2xl shadow-lg text-center"
        style={{ background: colors.accent }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white">
            Ready to Transform Your Life?
          </h2>
          <p className="text-lg text-gray-100 mb-8">
            Join thousands of successful entrepreneurs who have changed their lives with us.
          </p>
          <button
            onClick={() => navigate("/join-us")}
            className="px-8 py-4 rounded-lg shadow-lg font-medium cursor-pointer text-black bg-white hover:bg-gray-100 hover:shadow-xl transition-all duration-300"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Custom Styles for HTML Content from Editor */}
      <style>{`
        .prose h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: ${colors.second};
        }
        .prose h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: ${colors.second};
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
          color: ${colors.accent};
        }
        .prose em {
          font-style: italic;
          color: ${colors.third};
        }
        .prose p {
          margin-top: 1rem;
          margin-bottom: 1rem;
          line-height: 1.8;
        }
      `}</style>
    </div>
  );
};

export default Opportunity;