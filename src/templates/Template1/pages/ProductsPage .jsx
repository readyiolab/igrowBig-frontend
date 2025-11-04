import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Package, Play } from "lucide-react";
import { api } from "@/utils/api";

const ProductsPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [productPageData, setProductPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Color palette
  const colors = {
    first: "#d3d6db",
    second: "#3a4750",
    third: "#303841",
    accent: "#be3144",
  };

  useEffect(() => {
    loadProductPageData();
    loadCategories();
  }, []);

  const renderContent = (htmlContent) => {
    return { __html: htmlContent || "" };
  };

  const loadProductPageData = async () => {
    try {
      // MOCK DATA - Keep this as is since you don't have product-page API endpoint yet
      const mockProductPageData = {
        id: 1,
        banner_section_image_url:
          "https://res.cloudinary.com/dbyjiqjui/image/upload/v1762237196/022_qpg4p4.jpg",
        banner_section_content: "Welcome to Our Products",
        about_section_title: "Product is Life Line of Any Business",
        about_section_content:
          "<p>Product is life line of any business. <strong>Unique products</strong> make it very easy to do business. Product in <strong>Health & Wellness, Beauty & Anti Aging</strong> is evergreen and never going to out of business.</p><p>At NHT Global, we understand that different lifestyles call for different needs. For the modern day city dweller in particular, an urban lifestyle is often associated with stress, busy schedules, environmental toxins and pollutants, poor food choices, and work pressure. These factors affect overall quality life and can challenge our bodies in ways that require additional support. From anti-aging skincare to antioxidant rich beverages, NHT products have been designed to supplement your daily routine and help you live a healthier and better life. We target your specific needs with multi-functional, multi-benefit products that are safe, immediate impact, and easy to use and incorporate into your current lifestyle.</p>",
        about_section_image_url:
          "https://res.cloudinary.com/dbyjiqjui/image/upload/v1762237196/022_qpg4p4.jpg",
        video_section_title: "Watch NHT Global Product Video",
        video_section_content:
          "<p>NHT products fall under <strong>4 major categories: Beauty, Lifestyle, Wellness and Herbal</strong>. In few markets we have introduced a new category called '<strong>Home</strong>' where we are bringing good home products like air and water purifiers. We uphold the highest quality standards— we use leading domestic and foreign GMP certified contract manufacturers, utilize high technology, source the finest ingredients, and are fueled by market trends and the latest scientific research. Quality and satisfaction are guaranteed. Whether you want to supplement your current lifestyle or make a major lifestyle change, NHT Global offers product solutions to help you look and feel better today, and in the long-term!</p><p><strong>Your key to health, beauty, vitality, longevity, and protection lie with the targeted benefits of our premium product offering.</strong></p><p><em>Note: Availability of products may vary country to country. Get in touch with more details if you want to buy any product for personal use.</em></p>",
        video_section_youtube_url: " ",
        video_section_file_url: null,
      };

      setProductPageData(mockProductPageData);
    } catch (error) {
      console.error("Error loading product page data:", error);
    }
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      
      // Fetch dynamic categories from API
      const data = await api.getCategories();
      
      // Map backend data to frontend format
      const mappedCategories = data.map(category => ({
        id: category.categoryId,
        name: category.categoryName,
        description: category.description || "Explore our premium products.",
        image_url: category.categoryBanner || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
        status: "active"
      }));

      setCategories(mappedCategories);
      setLoading(false);
    } catch (error) {
      console.error("Error loading categories:", error);
      setLoading(false);
    }
  };

  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleCategoryClick = (category) => {
    const slug = createSlug(category.name);
    navigate(`/template1/products/${slug}`, { state: { categoryName: category.name } });
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

  return (
    <div className="min-h-screen" style={{ background: colors.first }}>
      {/* Banner Section */}
      {productPageData && (
        <section className="relative h-96 md:h-[500px] overflow-hidden">
          <img
            src={
              productPageData.banner_section_image_url ||
              "https://via.placeholder.com/1200x600"
            }
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
                {productPageData.banner_section_content ||
                  "Welcome to Our Products"}
              </h1>
              <p className="text-lg md:text-xl text-gray-100">
                Explore our complete range of wellness solutions
              </p>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      {productPageData && (
        <section className="py-20 px-4" style={{ background: "#ffffff" }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2
                  className="text-3xl md:text-4xl font-semibold mb-6"
                  style={{ color: colors.second }}
                >
                  {productPageData.about_section_title ||
                    "Discover Our Products"}
                </h2>
                <div
                  className="prose prose-lg max-w-none leading-relaxed mb-6"
                  style={{ color: colors.third }}
                  dangerouslySetInnerHTML={renderContent(
                    productPageData.about_section_content
                  )}
                />
                <button
                  className="px-8 py-3 rounded-lg shadow-lg cursor-pointer font-semibold text-white hover:shadow-xl transition-all duration-300"
                  style={{ background: colors.accent }}
                >
                  Learn More
                </button>
              </div>
              <div className="relative">
                <img
                  src={
                    productPageData.about_section_image_url ||
                    "https://via.placeholder.com/600x400"
                  }
                  alt="About"
                  className="w-full h-[400px] object-cover rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Video Section */}
      {productPageData && (
        <section className="py-20 px-4" style={{ background: colors.first }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-semibold mb-6"
                style={{ color: colors.second }}
              >
                {productPageData.video_section_title ||
                  "Watch Our Product Video"}
              </h2>
              <div
                className="prose prose-lg max-w-3xl mx-auto leading-relaxed"
                style={{ color: colors.third }}
                dangerouslySetInnerHTML={renderContent(
                  productPageData.video_section_content
                )}
              />
            </div>
            {productPageData.video_section_youtube_url ? (
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={productPageData.video_section_youtube_url}
                    title="NHT Global Product Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ) : productPageData.video_section_file_url ? (
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <video
                  width="100%"
                  height="auto"
                  controls
                  className="w-full h-auto"
                >
                  <source
                    src={productPageData.video_section_file_url}
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

      {/* Categories Introduction */}
      <section className="py-16 px-4" style={{ background: "#ffffff" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-semibold mb-6"
            style={{ color: colors.second }}
          >
            Explore NHT Products by Category
          </h2>
          <p
            className="text-lg leading-relaxed"
            style={{ color: colors.third }}
          >
            Most of the NHT Global products can be universally used by Men,
            Women, Kids and Elderly people. Explore NHT Products more in
            following categories which overall support in our goal to achieve
            better health.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-4" style={{ background: colors.first }}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="group flex flex-col justify-center items-center bg-white overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer hover:shadow-xl"
              >
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-4 sm:mb-6">
                  <img
                    src={
                      category.image_url ||
                      "https://via.placeholder.com/500x300"
                    }
                    lazy="loading"
                    alt={category.name}
                    className="w-full h-full mt-5 object-cover  transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3
                    className="text-xl font-bold mb-2 group-hover:text-accent transition-colors text-center"
                    style={{ color: colors.second }}
                  >
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  <div
                    className="group flex items-center gap-2 px-6 py-3 cursor-pointer border transition-all bg-[#be3144] text-white duration-300 hover:bg-[#be3144] hover:shadow-xl group-hover:text-white"
                    
                  >
                    <span className="font-semibold tracking-wide transition-colors duration-300 hover:">
                      Explore Products
                    </span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            className="px-8 py-4 rounded-lg shadow-lg font-medium cursor-pointer text-black bg-white hover:bg-gray-100 hover:shadow-xl transition-all duration-300"
            onClick={() => navigate("/template1/products")}
          >
            Shop All Products
          </button>
        </div>
      </section>

      {/* Custom Styles for HTML Content from Editor */}
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

export default ProductsPage;