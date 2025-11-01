// ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Shield, Truck, Play, ArrowRight, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

// Helper: Convert any possible backend format to array of strings
const toArray = (value) => {
  if (!value) return [];

  // 1. Already array
  if (Array.isArray(value)) {
    return value.map(s => String(s).trim()).filter(Boolean);
  }

  // 2. JSON string
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map(s => String(s).trim()).filter(Boolean);
      }
    } catch (e) {
      // ignore
    }
  }

  // 3. Semicolon or newline separated
  if (typeof value === "string") {
    const split = value
      .split(/;|\n/)
      .map(s => s.trim())
      .filter(Boolean);
    if (split.length > 0) return split;
  }

  // 4. Fallback: single item
  return [String(value).trim()];
};

// Reusable List Section Component
const ListSection = ({ title, items, icon, bullet = true }) => {
  const list = toArray(items);
  if (!list.length) return null;

  return (
    <div className="p-4 sm:p-6">
      <h3
        className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 flex items-center"
        style={{ color: "#3a4750" }}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </h3>

      {list.length === 1 ? (
        <p className="text-sm sm:text-base text-gray-600">{list[0]}</p>
      ) : bullet ? (
        <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-600">
          {list.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
          {list.map((item, i) => (
            <li key={i} className="flex items-start gap-2 sm:gap-3">
              <CheckCircle
                className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0"
                style={{ color: "#be3144" }}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Media Carousel Component
const MediaCarousel = ({ images, videoUrl, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Combine images and video into media items
  const mediaItems = [];
  
  if (images && images.length > 0) {
    images.forEach(img => {
      mediaItems.push({ type: 'image', url: img });
    });
  }
  
  if (videoUrl) {
    mediaItems.push({ type: 'video', url: videoUrl });
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
    setIsVideoPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
    setIsVideoPlaying(false);
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    setIsVideoPlaying(false);
  };

  if (mediaItems.length === 0) {
    return (
      <div className="w-full h-48 sm:h-64 lg:h-96 bg-gradient-to-br from-gray-100 to-blue-100 flex items-center justify-center rounded-lg">
        <div className="text-gray-400 text-center">
          <div className="w-8 sm:w-12 h-8 sm:h-12 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
            <Play className="w-4 sm:w-6 h-4 sm:h-6" />
          </div>
          <p className="text-xs sm:text-sm font-medium">No Media Available</p>
        </div>
      </div>
    );
  }

  const currentItem = mediaItems[currentIndex];

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Display Area */}
      <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative w-full h-48 sm:h-64 lg:h-96 flex items-center justify-center bg-gray-50">
          {currentItem.type === 'image' ? (
            <img
              src={currentItem.url}
              alt={productName}
              className="w-full h-full object-contain p-4 sm:p-6"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full relative">
              {!isVideoPlaying ? (
                <div 
                  className="w-full h-full flex items-center justify-center bg-black cursor-pointer"
                  onClick={() => setIsVideoPlaying(true)}
                >
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform">
                      <Play className="w-8 sm:w-10 h-8 sm:h-10 text-red-600 ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <img
                    src={images?.[0] || 'https://via.placeholder.com/500x500'}
                    alt="Video thumbnail"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <iframe
                  src={currentItem.url}
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title={`${productName} video`}
                />
              )}
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        {mediaItems.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-all"
              aria-label="Previous media"
            >
              <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6 text-gray-800" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-all"
              aria-label="Next media"
            >
              <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6 text-gray-800" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {mediaItems.length > 1 && (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
          {mediaItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-16 sm:w-20 h-16 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === index
                  ? 'border-red-600 shadow-md'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center relative">
                  <Play className="w-6 sm:w-8 h-6 sm:h-8 text-white" fill="white" />
                  <span className="absolute bottom-0.5 right-0.5 text-[8px] sm:text-xs text-white bg-black/70 px-1 rounded">
                    VIDEO
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductDetail = () => {
  const { category: categorySlug, id: productSlug } = useParams();
  const navigate = useNavigate();
  const { getAll } = useTenantApi();
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const colors = {
    first: "#d3d6db",
    second: "#3a4750",
    third: "#303841",
    Fourth: "#be3144",
  };

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

  // UNIFIED generateSlug
  const generateSlug = (name) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-400">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-8 sm:h-12 w-8 sm:w-12 border-b-2 mx-auto mb-3 sm:mb-4"
            style={{ borderColor: colors.Fourth }}
          ></div>
          <p className="text-base sm:text-xl font-semibold" style={{ color: colors.second }}>
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-400">
        <p className="text-xl text-gray-700 mb-4">Error loading product</p>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  const categories = siteData?.categories || [];
  const products = siteData?.products || [];

  // Find category by slug
  const selectedCat = categories.find((c) => generateSlug(c.name) === categorySlug);

  // Find product by slug and category match
  const product = products.find((p) => 
    generateSlug(p.name) === productSlug && p.category_id === selectedCat?.id
  );

  if (!product || !selectedCat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-400">
        <p className="text-xl text-gray-700 mb-4">Product not found</p>
        <Button onClick={() => navigate("/products")} variant="outline">
          Back to Products
        </Button>
      </div>
    );
  }

  const catSlugForNav = generateSlug(selectedCat.name);

  // Parse product images
  const productImages = product.image_url 
    ? (typeof product.image_url === 'string' 
        ? product.image_url.split(',').map(img => img.trim())
        : [product.image_url])
    : [];

  const priceOptions = [
    { key: "your", label: "Your Price", price: product.your_price },
    { key: "base", label: "Base Price", price: product.base_price },
    { key: "member", label: "Member Price", price: product.preferred_customer_price },
  ].filter(option => option.price);

  const discount = product.base_price && product.your_price 
    ? Math.round(((product.base_price - product.your_price) / product.base_price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-400">
      {/* Banner */}
      {product.banner_image_url && (
        <section className="relative overflow-hidden mb-6 sm:mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="relative overflow-hidden">
              <img
                src={product.banner_image_url}
                alt={`${product.name} banner`}
                className="w-full h-40 sm:h-56 lg:h-80 object-cover rounded-2xl shadow-lg"
                loading="lazy"
              />
              <div
                className="absolute inset-0 flex items-end p-4 sm:p-6"
                style={{ background: `linear-gradient(to top, ${colors.third}cc, transparent)` }}
              >
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-md">
                  {product.name}
                </h2>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(`/products/${catSlugForNav}`)}
              className="text-sm sm:text-base"
              style={{ color: colors.Fourth, backgroundColor: "transparent" }}
            >
              <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5 mr-1" />
              Back to {selectedCat.name}
            </Button>
            <div>
              <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ color: colors.second }}>
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm mt-1 sm:mt-2" style={{ color: colors.second }}>
                {selectedCat.name}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12">
          {/* Left: Media Carousel + Price */}
          <div className="lg:w-1/2 lg:sticky lg:top-24 self-start">
            <div className="space-y-4 sm:space-y-6">
              <div className="relative">
                <MediaCarousel 
                  images={productImages}
                  videoUrl={product.video_url}
                  productName={product.name}
                />
                {discount > 0 && (
                  <div
                    className="absolute top-3 sm:top-4 left-3 sm:left-4 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md z-10"
                    style={{ background: colors.Fourth }}
                  >
                    {discount}% OFF
                  </div>
                )}
              </div>

              {priceOptions.length > 0 && (
                <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
                  <div className="space-y-2 sm:space-y-3">
                    {priceOptions.map((option) => (
                      <div key={option.key} className="flex items-center justify-between p-3 sm:p-4">
                        <span className="text-sm sm:text-base font-medium" style={{ color: colors.second }}>
                          {option.label}
                        </span>
                        <span className="text-lg sm:text-xl font-bold" style={{ color: colors.Fourth }}>
                          ₹{option.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:w-1/2 space-y-4 sm:space-y-6">
            {product.description && (
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ color: colors.second }}>
                  Description
                </h3>
                <div 
                  className="text-sm sm:text-base text-gray-600"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {product.fullDescription && (
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ color: colors.second }}>
                  Full Description
                </h3>
                <div 
                  className="text-sm sm:text-base text-gray-600"
                  dangerouslySetInnerHTML={{ __html: product.fullDescription }}
                />
              </div>
            )}

            <ListSection title="Key Ingredients" items={product.keyIngredients} />
            <ListSection title="Key Benefits" items={product.keyBenefits} bullet={false} />
            <ListSection title="Directions for Use" items={product.directionsForUse} />
            <ListSection title="Cautions" items={product.cautions} />
            <ListSection title="Patents & Certifications" items={product.patentsAndCertifications} icon={<Shield className="w-5 h-5" />} />

            {product.fdaDisclaimer && (
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ color: colors.second }}>
                  FDA Disclaimer
                </h3>
                <p className="text-sm sm:text-base text-gray-600 italic">{product.fdaDisclaimer}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders over ₹50 nationwide" },
              { icon: Package, title: "Quality Guaranteed", desc: "Premium ingredients & testing" },
              { icon: Shield, title: "Secure & Safe", desc: "Certified quality products" },
            ].map((item, i) => (
              <div key={i} className="text-center p-4 sm:p-6">
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <item.icon className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2" style={{ color: colors.second }}>
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 m-4 sm:m-6 lg:m-10 rounded-2xl"
        style={{ background: colors.Fourth }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 backdrop-blur-lg border border-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-6 sm:mb-8">
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white" style={{ color: colors.first }} />
            <span className="text-white font-semibold text-xs uppercase tracking-wide" style={{ color: colors.first }}>
              Get in Touch
            </span>
          </div>

          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 sm:mb-4 text-white">
            Interested in {product.name}?
          </h2>

          <p className="text-xs xs:text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 text-gray-100">
            Connect with us for more information about {product.name} and how it can enhance your wellness journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center">
            <Button
              className="bg-transparent border-2 border-white font-medium py-2.5 xs:py-3 sm:py-4 md:py-5 px-5 sm:px-6 md:px-8 rounded-full hover:bg-white/20 text-xs xs:text-sm sm:text-base md:text-lg"
              onClick={() => navigate('/contact')}
            >
              <span className="flex items-center gap-2 sm:gap-3">
                Contact Us
                <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5" />
              </span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;