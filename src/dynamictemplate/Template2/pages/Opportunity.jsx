import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Play,
  TrendingUp,
  Users,
  Award,
  ArrowRight,
  CircleEllipsis,
  Sparkles,
  Target,
  Globe,
  Zap,
} from "lucide-react";
import useTenantApi from "@/hooks/useTenantApi";

const OpportunityPage = () => {
  
  const [loading, setLoading] = useState(true);
  const { getAll } = useTenantApi();
  const [siteData, setSiteData] = useState(null);
  const [error, setError] = useState(null);

  // Modern color palette - matching Home page
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
          const response = await getAll("/site/data");
          console.log("Opportunity Page Data:", response); // DEBUG
          setSiteData(response);
        } catch (err) {
          console.error("Fetch error:", err); // DEBUG
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

  const loadsiteData = async () => {
    try {
      const mocksiteData = {
        id: 1,
        tenant_id: 1,
        hero_section_content: "A lifetime opportunity",
        description_section_content:
          "<p><strong>Unleashing the power of people and it's potential!</strong></p><p>NHT Global allows you to achieve better health, a countless income opportunity and free time to spend with your loved ones.</p>",
        door_section_title: "Open the Door of Opportunity",
        door_section_content:
          "<ul><li>Take that next step to changing your destiny</li><li>Choose the opportunity that offers you a proven formula to build your own future</li><li>Change your focus to building a healthy lifestyle</li><li>Open your mind to developing a wellness tradition across the globe</li><li>Share this opportunity with others</li><li>Open the door to NHT Global… <strong>Top Network Marketing Company Globally</strong></li></ul>",
        door_section_image_url:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop",
        marketing_section_title: "Why Network Marketing",
        marketing_section_content:
          "<ul><li>Direct selling industry is more than 50 years old</li><li>More than $110 billion global industry and growing</li><li>Doing business in more than 172 countries worldwide</li><li>People of all ages, races, and backgrounds are involved</li><li>Has empowered millions of people around the world</li><li>High income potential</li><li>Be your own boss</li><li>No employees, no payroll, no storefront and low overhead</li><li>Major tax advantages</li><li>Best chance for the average person to succeed and create a life that is more than average</li><li>Global opportunity with no limits</li></ul><p><strong>Lets Meet World of Opportunity!</strong></p><p>A global company which gives you <strong>True Potential…</strong></p>",
        marketing_section_image_url:
          "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
        business_model_section_title: "NHT Global has a PROVEN Business Model",
        business_model_section_content:
          "<ul><li>Offices worldwide and distribution within more than 50 countries</li><li>More than $1.5 billion in sales and growing</li><li>Member of the Direct Selling Association</li><li>Subsidiary of 23-year-old publicly traded company, Natural Health Trends Corp. (trading symbol: NHTC)</li><li>Experienced executive team and global leaders to support you at each step towards your success</li></ul>",
        business_model_section_image_url:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
        overview_section_title:
          "NHT Global Opportunity Overview by Found Members",
        overview_section_youtube_url:
          "https://www.youtube.com/embed/dQw4w9WgXcQ",
        overview_section_video_url: null,
        compensation_plan_section_title: "What is Compensation Plan",
        compensation_plan_section_content:
          "<p>To know compensation and earning potential better it is important to following terms:</p><h3>Bonus Volume (BV):</h3><p>The NHT Global Compensation Plan is built around the retailability of our products. In order to keep the products competitively priced at the retail level and to ensure a profitable wholesale to retail margin for our distributor base, we assign a point value (called Bonus Volume or BV) to each of our products, and the compensation program is based on the accumulation of these points. NHT Global gives each product the maximum points possible to create the ideal balance between significant retail profits and substantial override income for our distributor.</p><h3>Personal Volume (PV):</h3><p>Your personal purchase or sales volume and refers to the product orders that are processed through your Distributor ID#.</p><h3>Personal Group Volume (PGV):</h3><p>Product purchased by you and your directly sponsored members. Your Personal Group consists of your personally-sponsored Distributors, regardless of their placement in the genealogy tree. Your Personal Group BV is the combined total of all the wholesale product orders that are processed through your Personal Group Distributors.</p><h3>Active Status:</h3><p>Become active to receive commission/income when you personally sponsor just 2 people in both legs (details in 'Compensation Plan' page)</p><h3>Distributor Level:</h3><p>There are 3 levels of distributor level. Bronze, Silver and Gold. The discounts on products and commission varies as per level. You can directly become Gold distributor thru purchasing specially designed Gold or Platinum package for people who can not wait and want to go full speed from first day.</p><p>Discounts on products for Bronze is 3%, Silver is 11% and Gold is 34%.</p><h3>Product Packages:</h3><p>There are different package similar to Distributor levels. Gold package is for getting maximum discount and maximum commission. Silver package to become Silver member and for becoming Bronze, buy Bronze package or you can buy simply 90 BV worth of products.</p><p>Platinum package is specially designed promotional package to give you value for your money and give you power of all the products for your self use or for selling. For Gold and Platinum package purchase, your distributor level is Gold which is maximum level for Discounts and Commissions/Earnings.</p><p>Gold package gives you free back office access for 1 year and Platinum gives you lifetime free back office access to see you business growth, ecommerce site to sell product directly in all countries where NHT Global is operational. For Silver and Bronze package, there is charge of USD 50 and renew annually.</p><h3>Investment</h3><p>You may choose any package to start. However we recommend Platinum or Gold package for serious people. It will help you getting maximum discount and earning commission from day 1.</p><ul><li><strong>Platinum package</strong> costs around USD 2000 (equivalent to your respective country currency) which includes almost all the products which NHT Global offers and one of the right kits to start your business with all the products.</li><li><strong>Gold package</strong> costs approximately USD 1000. There are various packages to select from as per your need.</li><li><strong>Silver package</strong> costs around approximately USD 500</li><li>For <strong>Bronze level</strong> you need to 90 BV (Bonus Volume) worth of products and Business Builder package. 90 BV of product costs you approximately 250 USD and USD 50 for Business Builder Package (Back office Access). There are some Bronze packages also to start with.</li></ul><p><em>Please note that there is nominal delivery charges and might be some additional state tax as per government rules in your country or state. Costing may little vary from country to country</em></p>",
        compensation_plan_document_url: null,
      };

      setSiteData(mocksiteData);
      setLoading(false);
    } catch (error) {
      console.error("Error loading opportunity data:", error);
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen">
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

        <div className="px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight">
                {siteData?.hero_section_content || "A Lifetime Opportunity"}
              </h1>

              <div
                className="text-lg sm:text-xl opacity-90 leading-relaxed"
                dangerouslySetInnerHTML={renderContent(
                  siteData?.description_section_content
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
                  className="px-8 py-6 bg-transparent text-lg font-semibold rounded-2xl border-2 text-white transition-all duration-300 cursor-pointer"
                  style={{ borderColor: "white" }}
                >
                  Learn More
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl opacity-50 blur-2xl"></div>
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                alt="Opportunity Banner"
                className="relative w-full h-[400px] object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Door of Opportunity Section - Card style */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image card */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 rounded-2xl overflow-hidden">
                <img
                  src={siteData.door_section_image_url}
                  alt="Open the Door"
                  className="w-full h-[500px] object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-2 space-y-6">
              <h2
                className="text-4xl md:text-5xl font-semibold"
                style={{ color: colors.primary }}
              >
                {siteData.door_section_title}
              </h2>

              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={renderContent(
                  siteData.door_section_content
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div
                  className="p-6 rounded-2xl text-center"
                  style={{ background: `${colors.secondary}10` }}
                >
                  <Target
                    className="w-8 h-8 mx-auto mb-3"
                    style={{ color: colors.secondary }}
                  />
                  <h3
                    className="font-semibold text-lg mb-1"
                    style={{ color: colors.primary }}
                  >
                    Your Future
                  </h3>
                  <p className="text-sm text-gray-600">Build your destiny</p>
                </div>
                <div
                  className="p-6 rounded-2xl text-center"
                  style={{ background: `${colors.tertiary}10` }}
                >
                  <Globe
                    className="w-8 h-8 mx-auto mb-3"
                    style={{ color: colors.tertiary }}
                  />
                  <h3
                    className="font-semibold text-lg mb-1"
                    style={{ color: colors.primary }}
                  >
                    Global Reach
                  </h3>
                  <p className="text-sm text-gray-600">Worldwide network</p>
                </div>
                <div
                  className="p-6 rounded-2xl text-center"
                  style={{ background: `${colors.accent}10` }}
                >
                  <Sparkles
                    className="w-8 h-8 mx-auto mb-3"
                    style={{ color: colors.accent }}
                  />
                  <h3
                    className="font-semibold text-lg mb-1"
                    style={{ color: colors.primary }}
                  >
                    Innovation
                  </h3>
                  <p className="text-sm text-gray-600">Proven success</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Network Marketing - Split with overlap */}
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
              {siteData.marketing_section_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={renderContent(
                  siteData.marketing_section_content
                )}
              />
              <Button
                className="px-8 py-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer"
                style={{ background: colors.tertiary, color: "white" }}
              >
                Get Started <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl"
                style={{ background: colors.secondary }}
              ></div>
              <img
                src={siteData.marketing_section_image_url}
                alt="Network Marketing"
                className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Business Model Section - Timeline style */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={siteData.business_model_section_image_url}
                  alt="Business Model"
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
                {siteData.business_model_section_title}
              </h2>

              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={renderContent(
                  siteData.business_model_section_content
                )}
              />

              <Button
                className="px-8 py-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer"
                style={{ background: colors.secondary, color: "white" }}
              >
                Join Now <Zap className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section - Centered with glow effect */}
      {(siteData.overview_section_youtube_url ||
        siteData.overview_section_video_url) && (
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
              {siteData.overview_section_title}
            </h2>

            <div className="relative">
              <div className="absolute -inset-8 rounded-3xl opacity-50 blur-3xl"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video">
                {siteData.overview_section_youtube_url ? (
                  <iframe
                    src={siteData.overview_section_youtube_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video
                    src={siteData.overview_section_video_url}
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

      {/* Compensation Plan Section */}
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
              {siteData.compensation_plan_section_title}
            </h2>
          </div>

          <div className="space-y-6">
            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={renderContent(
                siteData.compensation_plan_section_content
              )}
            />
            {siteData.compensation_plan_document_url && (
              <div className="text-center pt-6">
                <Button
                  className="px-8 py-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  style={{ background: colors.tertiary, color: "white" }}
                >
                  Download Compensation Plan PDF
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section - Bold and centered */}
      <section
        className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden m-10 rounded-2xl shadow-2xl"
        style={{ background: `linear-gradient(135deg, ${colors.tertiary}, ${colors.secondary})` }}
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
            Ready to Transform Your Life?
          </h2>
          <p className="text-lg md:text-2xl mb-10 text-white">
            Join thousands of successful entrepreneurs who have changed their
            lives with NHT Global
          </p>
          <Button
            size="lg"
            className="px-12 py-8 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 bg-white cursor-pointer hover:bg-white"
            style={{ color: colors.primary }}
          >
            Get Started Now <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </section>

      {/* Custom Styles */}
      <style>{`
        .prose h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: ${colors.primary};
        }
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
};

export default OpportunityPage;