import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, TrendingUp, Users, Award } from 'lucide-react';

const OpportunityPage = () => {
  const navigate = useNavigate();
  const [opportunityData, setOpportunityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const tenantId = 1;

  // Color palette - matching products page
  const colors = {
    first: "#d3d6db",
    second: "#3a4750",
    third: "#303841",
    accent: "#be3144",
  };

  useEffect(() => {
    loadOpportunityData();
  }, []);

  const renderContent = (htmlContent) => {
    return { __html: htmlContent || "" };
  };

  const loadOpportunityData = async () => {
    try {
      // Uncomment when API is ready
      // const response = await fetch(`/api/${tenantId}/opportunity-page`);
      // const data = await response.json();
      // setOpportunityData(data);

      // MOCK DATA - Matching tbl_opportunity_page structure
      const mockOpportunityData = {
        id: 1,
        tenant_id: 1,
        hero_section_content: "A lifetime opportunity ",
        description_section_content: "<p><strong>Unleashing the power of people and it's potential!</strong></p><p>NHT Global allows you to achieve better health, a countless income opportunity and free time to spend with your loved ones.</p>",
        door_section_title: "Open the Door of Opportunity",
        door_section_content: "<ul><li>Take that next step to changing your destiny</li><li>Choose the opportunity that offers you a proven formula to build your own future</li><li>Change your focus to building a healthy lifestyle</li><li>Open your mind to developing a wellness tradition across the globe</li><li>Share this opportunity with others</li><li>Open the door to NHT Global… <strong>Top Network Marketing Company Globally</strong></li></ul>",
        door_section_image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop",
        marketing_section_title: "Why Network Marketing",
        marketing_section_content: "<ul><li>Direct selling industry is more than 50 years old</li><li>More than $110 billion global industry and growing</li><li>Doing business in more than 172 countries worldwide</li><li>People of all ages, races, and backgrounds are involved</li><li>Has empowered millions of people around the world</li><li>High income potential</li><li>Be your own boss</li><li>No employees, no payroll, no storefront and low overhead</li><li>Major tax advantages</li><li>Best chance for the average person to succeed and create a life that is more than average</li><li>Global opportunity with no limits</li></ul><p><strong>Lets Meet World of Opportunity!</strong></p><p>A global company which gives you <strong>True Potential…</strong></p>",
        marketing_section_image_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
        business_model_section_title: "NHT Global has a PROVEN Business Model",
        business_model_section_content: "<ul><li>Offices worldwide and distribution within more than 50 countries</li><li>More than $1.5 billion in sales and growing</li><li>Member of the Direct Selling Association</li><li>Subsidiary of 23-year-old publicly traded company, Natural Health Trends Corp. (trading symbol: NHTC)</li><li>Experienced executive team and global leaders to support you at each step towards your success</li></ul>",
        business_model_section_image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
        overview_section_title: "NHT Global Opportunity Overview by Found Members",
        overview_section_youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        overview_section_video_url: null,
        compensation_plan_section_title: "What is Compensation Plan",
        compensation_plan_section_content: "<p>To know compensation and earning potential better it is important to following terms:</p><h3>Bonus Volume (BV):</h3><p>The NHT Global Compensation Plan is built around the retailability of our products. In order to keep the products competitively priced at the retail level and to ensure a profitable wholesale to retail margin for our distributor base, we assign a point value (called Bonus Volume or BV) to each of our products, and the compensation program is based on the accumulation of these points. NHT Global gives each product the maximum points possible to create the ideal balance between significant retail profits and substantial override income for our distributor.</p><h3>Personal Volume (PV):</h3><p>Your personal purchase or sales volume and refers to the product orders that are processed through your Distributor ID#.</p><h3>Personal Group Volume (PGV):</h3><p>Product purchased by you and your directly sponsored members. Your Personal Group consists of your personally-sponsored Distributors, regardless of their placement in the genealogy tree. Your Personal Group BV is the combined total of all the wholesale product orders that are processed through your Personal Group Distributors.</p><h3>Active Status:</h3><p>Become active to receive commission/income when you personally sponsor just 2 people in both legs (details in 'Compensation Plan' page)</p><h3>Distributor Level:</h3><p>There are 3 levels of distributor level. Bronze, Silver and Gold. The discounts on products and commission varies as per level. You can directly become Gold distributor thru purchasing specially designed Gold or Platinum package for people who can not wait and want to go full speed from first day.</p><p>Discounts on products for Bronze is 3%, Silver is 11% and Gold is 34%.</p><h3>Product Packages:</h3><p>There are different package similar to Distributor levels. Gold package is for getting maximum discount and maximum commission. Silver package to become Silver member and for becoming Bronze, buy Bronze package or you can buy simply 90 BV worth of products.</p><p>Platinum package is specially designed promotional package to give you value for your money and give you power of all the products for your self use or for selling. For Gold and Platinum package purchase, your distributor level is Gold which is maximum level for Discounts and Commissions/Earnings.</p><p>Gold package gives you free back office access for 1 year and Platinum gives you lifetime free back office access to see you business growth, ecommerce site to sell product directly in all countries where NHT Global is operational. For Silver and Bronze package, there is charge of USD 50 and renew annually.</p><h3>Investment</h3><p>You may choose any package to start. However we recommend Platinum or Gold package for serious people. It will help you getting maximum discount and earning commission from day 1.</p><ul><li><strong>Platinum package</strong> costs around USD 2000 (equivalent to your respective country currency) which includes almost all the products which NHT Global offers and one of the right kits to start your business with all the products.</li><li><strong>Gold package</strong> costs approximately USD 1000. There are various packages to select from as per your need.</li><li><strong>Silver package</strong> costs around approximately USD 500</li><li>For <strong>Bronze level</strong> you need to 90 BV (Bonus Volume) worth of products and Business Builder package. 90 BV of product costs you approximately 250 USD and USD 50 for Business Builder Package (Back office Access). There are some Bronze packages also to start with.</li></ul><p><em>Please note that there is nominal delivery charges and might be some additional state tax as per government rules in your country or state. Costing may little vary from country to country</em></p>",
        compensation_plan_document_url: null,
      };

      setOpportunityData(mockOpportunityData);
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

  return (
    <div className="min-h-screen" style={{ background: colors.first }}>
      {/* Hero Banner Section */}
     {/* Hero Banner Section – Same layout as your example */}
{opportunityData && (
  <section aria-label="Hero Section" className="relative">
    <div className="flex flex-col lg:flex-row min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
      {/* LEFT – Text + Gradient Overlay */}
      <div
        className="lg:w-1/2 flex items-center justify-center bg-gradient-to-r from-[rgba(34,40,49,0.95)] via-[rgba(34,40,49,0.7)] to-[rgba(34,40,49,0.3)] lg:to-transparent py-12 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: colors.third }} /* fallback solid color */
      >
        <div className="max-w-2xl text-center lg:text-left">
          <h1
            className="text-3xl sm:text-3xl md:text-4xl lg:text-6xl font-semibold mb-6 leading-tight tracking-tight"
            style={{
              color: '#ffffff',               // white text (you can use colors.primary if defined)
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {opportunityData.hero_section_content}
          </h1>

          <div
            className="text-lg sm:text-xl max-w-none font-medium"
            style={{
              color: '#ffffff',
              textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
            }}
            dangerouslySetInnerHTML={renderContent(
              opportunityData.description_section_content
            )}
          />

          {/* CTA Button */}
          <button
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
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
          alt="Opportunity Banner"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
    </div>
  </section>
)}

      {/* Door of Opportunity Section */}
      {opportunityData && (
        <section className="py-20 px-4" style={{ background: "#ffffff" }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <img
                  src={opportunityData.door_section_image_url}
                  alt="Open the Door"
                  className="w-full h-[400px] object-cover rounded-lg shadow-xl"
                />
              </div>
              <div>
                <h2
                  className="text-3xl md:text-4xl font-semibold mb-6"
                  style={{ color: colors.second }}
                >
                  {opportunityData.door_section_title}
                </h2>
                <div
                  className="prose prose-lg max-w-none leading-relaxed mb-6"
                  style={{ color: colors.third }}
                  dangerouslySetInnerHTML={renderContent(
                    opportunityData.door_section_content
                  )}
                />
                <button
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
      {opportunityData && (
        <section className="py-20 px-4" style={{ background: colors.first }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2
                  className="text-3xl md:text-4xl font-semibold mb-6"
                  style={{ color: colors.second }}
                >
                  {opportunityData.marketing_section_title}
                </h2>
                <div
                  className="prose prose-lg max-w-none leading-relaxed mb-6"
                  style={{ color: colors.third }}
                  dangerouslySetInnerHTML={renderContent(
                    opportunityData.marketing_section_content
                  )}
                />
                <button
                  className="px-8 py-3 rounded-lg shadow-lg cursor-pointer font-semibold text-white hover:shadow-xl transition-all duration-300"
                  style={{ background: colors.accent }}
                >
                  Get Started
                </button>
              </div>
              <div className="relative order-1 md:order-2">
                <img
                  src={opportunityData.marketing_section_image_url}
                  alt="Network Marketing"
                  className="w-full h-[400px] object-cover rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Business Model Section */}
      {opportunityData && (
        <section className="py-20 px-4" style={{ background: "#ffffff" }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <img
                  src={opportunityData.business_model_section_image_url}
                  alt="Business Model"
                  className="w-full h-[400px] object-cover rounded-lg shadow-xl"
                />
              </div>
              <div>
                <h2
                  className="text-3xl md:text-4xl font-semibold mb-6"
                  style={{ color: colors.second }}
                >
                  {opportunityData.business_model_section_title}
                </h2>
                <div
                  className="prose prose-lg max-w-none leading-relaxed mb-6"
                  style={{ color: colors.third }}
                  dangerouslySetInnerHTML={renderContent(
                    opportunityData.business_model_section_content
                  )}
                />
                <button
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
      {opportunityData && (
        <section className="py-20 px-4" style={{ background: colors.first }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-semibold mb-6"
                style={{ color: colors.second }}
              >
                {opportunityData.overview_section_title}
              </h2>
            </div>
            {opportunityData.overview_section_youtube_url ? (
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={opportunityData.overview_section_youtube_url}
                    title="NHT Global Opportunity Overview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ) : opportunityData.overview_section_video_url ? (
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <video
                  width="100%"
                  height="auto"
                  controls
                  className="w-full h-auto"
                >
                  <source
                    src={opportunityData.overview_section_video_url}
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
      {opportunityData && (
        <section className="py-20 px-4" style={{ background: "#ffffff" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-semibold mb-6"
                style={{ color: colors.second }}
              >
                {opportunityData.compensation_plan_section_title}
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
                opportunityData.compensation_plan_section_content
              )}
            />
            {opportunityData.compensation_plan_document_url && (
              <div className="text-center mt-8">
                <a
                  href={opportunityData.compensation_plan_document_url}
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
            Join thousands of successful entrepreneurs who have changed their lives with NHT Global.
          </p>
          <button
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

export default OpportunityPage;