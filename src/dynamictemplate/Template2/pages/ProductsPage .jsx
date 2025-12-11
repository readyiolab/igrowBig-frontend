import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Package, Play } from "lucide-react";
import { api } from "@/utils/api";


// ==================== THEME CONFIGURATION ====================
const theme = {
  colors: {
    primary: "#0f172a",    // Deep slate
    secondary: "#8b5cf6",  // Vibrant purple
    tertiary: "#06b6d4",   // Cyan/teal
    accent: "#f59e0b",     // Amber accent
    light: "#f8fafc",      // Off white
    lightGray: "#e2e8f0",  // Light gray
    white: "#ffffff",
    textPrimary: "#0f172a",
    textSecondary: "#475569",
  }
};

// ==================== UTILITY FUNCTIONS ====================
const utils = {
  createSlug: (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  },
  
  renderHTML: (htmlContent) => {
    return { __html: htmlContent || "" };
  }
};

// ==================== MOCK DATA ====================
const mockData = {
  productPage: {
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
  }
};

// ==================== COMPONENTS ====================

// Loading Spinner Component
const LoadingSpinner = () => (
  <div
    className="min-h-screen flex items-center justify-center"
    style={{ background: theme.colors.light }}
  >
    <div className="text-center">
      <div
        className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4"
        style={{ borderColor: theme.colors.tertiary }}
      />
      <p className="font-medium" style={{ color: theme.colors.textPrimary }}>
        Loading categories...
      </p>
    </div>
  </div>
);

// Banner Section Component
const BannerSection = ({ data }) => (
  <section className=" min-h-screen  overflow-hidden px-4 sm:px-6 lg:px-8 py-20  relative z-10">
    <img
      src={data.banner_section_image_url || "https://via.placeholder.com/1200x600"}
      alt="Banner"
      className="w-full h-full object-cover"
    />
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(to right, ${theme.colors.primary}cc, ${theme.colors.primary}99, transparent)`,
      }}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center text-white px-4 max-w-4xl">
        <h1
          className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
          style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
        >
          {data.banner_section_content || "Welcome to Our Products"}
        </h1>
        <p className="text-lg md:text-xl text-gray-100">
          Explore our complete range of wellness solutions
        </p>
      </div>
    </div>
  </section>
);

// About Section Component
const AboutSection = ({ data }) => (
  <section className="py-20 px-4" style={{ background: theme.colors.white }}>
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2
            className="text-3xl md:text-4xl font-semibold mb-6"
            style={{ color: theme.colors.primary }}
          >
            {data.about_section_title || "Discover Our Products"}
          </h2>
          <div
            className="prose prose-lg max-w-none leading-relaxed mb-6"
            style={{ color: theme.colors.textSecondary }}
            dangerouslySetInnerHTML={utils.renderHTML(data.about_section_content)}
          />
          <button
            className="px-8 py-3 rounded-lg shadow-lg font-semibold text-white hover:shadow-xl hover:scale-105 transition-all duration-300"
            style={{ background: theme.colors.tertiary }}
          >
            Learn More
          </button>
        </div>
        <div className="relative">
          <img
            src={data.about_section_image_url || "https://via.placeholder.com/600x400"}
            alt="About"
            className="w-full h-[400px] object-cover rounded-lg shadow-xl"
          />
        </div>
      </div>
    </div>
  </section>
);

// Video Section Component
const VideoSection = ({ data }) => {
  const renderVideo = () => {
    if (data.video_section_youtube_url?.trim()) {
      return (
        <div className="rounded-xl overflow-hidden shadow-2xl">
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={data.video_section_youtube_url}
              title="NHT Global Product Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      );
    }
    
    if (data.video_section_file_url) {
      return (
        <div className="rounded-xl overflow-hidden shadow-2xl">
          <video width="100%" height="auto" controls className="w-full h-auto">
            <source src={data.video_section_file_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
    
    return (
      <div
        className="rounded-xl h-96 flex items-center justify-center"
        style={{ background: theme.colors.lightGray }}
      >
        <div className="text-center">
          <Play
            className="w-16 h-16 mx-auto mb-4"
            style={{ color: theme.colors.textSecondary }}
          />
          <p style={{ color: theme.colors.textSecondary }}>No video available</p>
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 px-4" style={{ background: theme.colors.light }}>
      <div >
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-semibold mb-6"
            style={{ color: theme.colors.primary }}
          >
            {data.video_section_title || "Watch Our Product Video"}
          </h2>
          <div
            className="prose prose-lg  leading-relaxed"
            style={{ color: theme.colors.textSecondary }}
            dangerouslySetInnerHTML={utils.renderHTML(data.video_section_content)}
          />
        </div>
        {renderVideo()}
      </div>
    </section>
  );
};

// Category Card Component
const CategoryCard = ({ category, onClick }) => (
  <div
    onClick={() => onClick(category)}
    className="group flex flex-col justify-center items-center bg-white overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer hover:shadow-2xl hover:-translate-y-2"
    style={{ border: `2px solid ${theme.colors.lightGray}` }}
  >
    <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-4 sm:mb-6 mt-6">
      <img
        src={category.image_url || "https://via.placeholder.com/500x300"}
        loading="lazy"
        alt={category.name}
        className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
      />
    </div>
    <div className="p-6 text-center">
      <h3
        className="text-xl font-bold mb-2 transition-colors"
        style={{ color: theme.colors.primary }}
      >
        {category.name}
      </h3>
      <p className="text-sm mb-4 line-clamp-2" style={{ color: theme.colors.textSecondary }}>
        {category.description}
      </p>
      <div
        className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-xl"
        style={{ 
          background: theme.colors.tertiary,
          color: theme.colors.white 
        }}
      >
        <span className="font-semibold tracking-wide">
          Explore Products
        </span>
        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </div>
  </div>
);

// Categories Grid Section Component
const CategoriesSection = ({ categories, onCategoryClick }) => (
  <>
    <section className="py-16 px-4" style={{ background: theme.colors.white }}>
      <div className="max-w-4xl mx-auto text-center pb-10">
        <h2
          className="text-3xl md:text-4xl font-semibold mb-6"
          style={{ color: theme.colors.primary }}
        >
          Explore NHT Products by Category
        </h2>
        <p className="text-lg leading-relaxed" style={{ color: theme.colors.textSecondary }}>
          Most of the NHT Global products can be universally used by Men,
          Women, Kids and Elderly people. Explore NHT Products more in
          following categories which overall support in our goal to achieve
          better health.
        </p>
      </div>
       <div >
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={onCategoryClick}
            />
          ))}
        </div>
      </div>
    </section>

    
  </>
);

// CTA Section Component
const CTASection = ({ onShopClick }) => (
  <section
    className="py-20 px-4 m-10 rounded-2xl shadow-lg text-center"
    style={{ background: theme.colors.tertiary }}
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
        className="px-8 py-4 rounded-lg shadow-lg font-medium cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105"
        style={{ 
          background: theme.colors.white,
          color: theme.colors.primary 
        }}
        onClick={onShopClick}
      >
        Shop All Products
      </button>
    </div>
  </section>
);

// ==================== MAIN COMPONENT ====================
const ProductsPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [productPageData, setProductPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProductPageData();
    loadCategories();
  }, []);

  const loadProductPageData = async () => {
    try {
      setProductPageData(mockData.productPage);
    } catch (error) {
      console.error("Error loading product page data:", error);
    }
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await api.getCategories();
      
      const mappedCategories = data.map(category => ({
        id: category.categoryId,
        name: category.categoryName,
        description: category.description || "Explore our premium products.",
        image_url: category.categoryBanner || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
        status: "active"
      }));

      setCategories(mappedCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    const slug = utils.createSlug(category.name);
    navigate(`/template2/products/${slug}`, { 
      state: { categoryName: category.name } 
    });
  };

  const handleShopClick = () => {
    navigate("/template2/products");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen " style={{ background: theme.colors.light }}>
      {productPageData && (
        <>
          <BannerSection data={productPageData} />
          <AboutSection data={productPageData} />
          <VideoSection data={productPageData} />
        </>
      )}
      
      <CategoriesSection 
        categories={categories} 
        onCategoryClick={handleCategoryClick} 
      />
      
      <CTASection onShopClick={handleShopClick} />

      {/* Custom Styles for HTML Content */}
      <style>{`
        .prose h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: ${theme.colors.primary};
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
          color: ${theme.colors.secondary};
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