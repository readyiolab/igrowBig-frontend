import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package } from "lucide-react";

const EcommerceProducts = () => {
  const navigate = useNavigate();
  const { getAll } = useTenantApi();
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.log("Site data:", response);
        setSiteData(response);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAll]);

  const renderContent = (htmlContent) => {
    return { __html: htmlContent || "" };
  };

  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/\s+&\s+/g, '-and-')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .trim();
  };

  const handleCategoryClick = (category) => {
    const slug = createSlug(category.name);
    navigate(`/products/${slug}`);
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
            Loading categories...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: colors.first }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.second }}>Error Occurred</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="text-white transition-all duration-300"
            style={{ background: colors.accent }}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const productPage = siteData?.productPage || {};
  const categories = siteData?.categories || [];

  return (
    <div className="min-h-screen" style={{ background: colors.first }}>
      {/* Banner Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={productPage.banner_section_image_url || "https://via.placeholder.com/1200x600"}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, ${colors.third}cc, ${colors.second}99, transparent)`,
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
            >
              {productPage.banner_section_title || "Welcome to Our Products"}
            </h1>
            {productPage.banner_section_content && (
              <p className="text-lg md:text-xl text-gray-100">
                {productPage.banner_section_content}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      {productPage.about_section_content && (
        <section className="py-20 px-4" style={{ background: "#ffffff" }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2
                  className="text-3xl md:text-4xl font-semibold mb-6"
                  style={{ color: colors.second }}
                >
                  {productPage.about_section_title || "Discover Our Products"}
                </h2>
                <div
                  className="prose prose-lg max-w-none leading-relaxed mb-6"
                  style={{ color: colors.third }}
                  dangerouslySetInnerHTML={renderContent(productPage.about_section_content)}
                />
                <button
                  onClick={() => {
                    const categoriesEl = document.getElementById('categories');
                    if (categoriesEl) {
                      window.scrollTo({ top: categoriesEl.offsetTop - 100, behavior: 'smooth' });
                    }
                  }}
                  className="px-8 py-3 rounded-lg shadow-lg cursor-pointer font-semibold text-white hover:shadow-xl transition-all duration-300"
                  style={{ background: colors.accent }}
                >
                  Explore Categories
                </button>
              </div>
              <div className="relative">
                <img
                  src={productPage.about_section_image_url || productPage.banner_section_image_url || "https://via.placeholder.com/600x400"}
                  alt="About"
                  className="w-full h-[400px] object-cover rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Video Section */}
      {(productPage.video_section_youtube_url || productPage.video_section_file_url) && (
        <section className="py-20 px-4" style={{ background: colors.first }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-semibold mb-6"
                style={{ color: colors.second }}
              >
                {productPage.video_section_title || "Watch Our Product Video"}
              </h2>
              {productPage.video_section_content && (
                <div
                  className="prose prose-lg max-w-3xl mx-auto leading-relaxed"
                  style={{ color: colors.third }}
                  dangerouslySetInnerHTML={renderContent(productPage.video_section_content)}
                />
              )}
            </div>
            {productPage.video_section_youtube_url ? (
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={productPage.video_section_youtube_url}
                    title="Product Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ) : productPage.video_section_file_url ? (
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <video
                  width="100%"
                  height="auto"
                  controls
                  className="w-full h-auto"
                >
                  <source src={productPage.video_section_file_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : null}
          </div>
        </section>
      )}

      {/* Categories Introduction */}
      <section className="py-16 px-4" style={{ background: "#ffffff" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-semibold mb-6"
            style={{ color: colors.second }}
          >
            Explore Products by Category
          </h2>
          <p
            className="text-lg leading-relaxed"
            style={{ color: colors.third }}
          >
            Most of our products can be universally used by Men, Women, Kids and Elderly people. 
            Explore our products in the following categories which overall support our goal to achieve better health.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="categories" className="py-16 px-4" style={{ background: colors.first }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-semibold mb-4"
              style={{ color: colors.second }}
            >
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600">
              Select a category to explore our products
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: colors.second }}
              >
                No Categories Found
              </h3>
              <p className="text-gray-600 mb-6">Categories are not available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="group flex flex-col justify-center items-center bg-white overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer hover:shadow-xl"
                >
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-4 sm:mb-6">
                    <img
                      src={category.image_url || "https://via.placeholder.com/500x300"}
                      loading="lazy"
                      alt={category.name}
                      className="w-full h-full mt-5 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3
                      className="text-xl font-bold mb-2 group-hover:text-accent transition-colors text-center"
                      style={{ color: colors.second }}
                    >
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 text-center">
                      {category.description || "Explore our premium products."}
                    </p>
                    <div
                      className="group flex items-center gap-2 px-6 py-3 cursor-pointer border transition-all bg-[#be3144] text-white duration-300 hover:bg-[#be3144] hover:shadow-xl group-hover:text-white"
                    >
                      <span className="font-semibold tracking-wide transition-colors duration-300">
                        Explore Products
                      </span>
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 px-4 m-10 rounded-2xl shadow-lg text-center"
        style={{ background: colors.accent }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white">
            Start Your Wellness Journey Today
          </h2>
          <p className="text-lg text-gray-100 mb-8">
            Discover the perfect products to enhance your health and well-being.
            Take the first step now!
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-4 rounded-lg shadow-lg font-medium cursor-pointer text-black bg-white hover:bg-gray-100 hover:shadow-xl transition-all duration-300"
          >
            Explore All Categories
          </button>
        </div>
      </section>

      {/* Custom Styles for HTML Content */}
      <style>{`
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

export default EcommerceProducts;