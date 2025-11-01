import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Package } from "lucide-react";

const CategoryProducts = () => {
  const { category } = useParams(); // This is the slug now
  const navigate = useNavigate();
  const { getAll } = useTenantApi();
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Color palette to match new design
  const colors = {
    first: '#d3d6db',
    second: '#3a4750',
    third: '#303841',
    accent: '#be3144',
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.first }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: colors.accent }}></div>
          <p style={{ color: colors.second }} className="font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: colors.first }}>
        <Card className="max-w-md border shadow-lg" style={{ borderColor: colors.second }}>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2" style={{ color: colors.second }}>Error Occurred</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="text-white transition-all duration-300"
              style={{ background: colors.accent }}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categories = siteData?.categories || [];
  const products = siteData?.products || [];
  const productPage = siteData?.productPage || {};

  // Helper to generate slug (consistent across app)
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/\s+&\s+/g, '-and-')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .trim();
  };

  // Find category by slug
  const categorySlug = decodeURIComponent(category || "").trim();
  const selectedCat = categories.find((c) => generateSlug(c.name) === categorySlug);

  const filteredProducts = selectedCat
    ? products.filter((p) => p.category_id === selectedCat.id)
    : [];

  if (!selectedCat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: colors.first }}>
        <p className="text-xl text-gray-700 mb-4">Category not found</p>
        <Button onClick={() => navigate("/products")} variant="outline">
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: colors.first }}>
      {/* Banner Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={productPage?.banner_image_url || 'https://via.placeholder.com/1200x600'}
          alt={selectedCat.name}
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
              style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
            >
              {selectedCat.name}
            </h1>
            {selectedCat.description && (
              <p className="text-lg md:text-xl text-gray-100">{selectedCat.description}</p>
            )}
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white border-b py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <button
            onClick={() => navigate("/products")}
            className="font-medium flex items-center gap-1 transition-colors"
            style={{ color: colors.accent }}
          >
            <ArrowLeft className="w-4 h-4" />
            All Categories
          </button>
          <span className="text-gray-400">/</span>
          <span className="font-medium" style={{ color: colors.second }}>
            {selectedCat.name}
          </span>
        </div>
      </div>

      {/* About Section */}
      {productPage?.about_description && (
        <section className="py-20 px-4" style={{ background: colors.first }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2
                  className="text-3xl md:text-4xl font-semibold mb-4"
                  style={{ color: colors.second }}
                >
                  About {selectedCat.name}
                </h2>
                <div 
                  className="text-lg text-gray-600 leading-relaxed mb-6"
                  dangerouslySetInnerHTML={{ __html: productPage.about_description }}
                />
                <button
                  onClick={() => window.scrollTo({ top: document.getElementById('products').offsetTop, behavior: 'smooth' })}
                  className="px-8 py-3 rounded-lg shadow-lg cursor-pointer font-semibold text-white hover:shadow-xl transition-all duration-300"
                  style={{ background: colors.accent }}
                >
                  Explore Products
                </button>
              </div>
              <div>
                <img
                  src={productPage?.banner_image_url || 'https://via.placeholder.com/600x400'}
                  alt={selectedCat.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Video Section */}
      {productPage?.video_section_link && (
        <section className="py-20 px-4" style={{ background: colors.first }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-semibold mb-4"
                style={{ color: colors.second }}
              >
                Learn About {selectedCat.name}
              </h2>
              <p className="text-lg text-gray-600">
                Discover the benefits of our {selectedCat.name} products through this video.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <div className="aspect-video">
                <video
                  src={productPage.video_section_link}
                  controls
                  className="w-full h-full bg-black"
                  poster="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=60"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section id="products" className="py-16 px-4" style={{ background: colors.first }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-semibold mb-4"
              style={{ color: colors.second }}
            >
              Featured Products
            </h2>
            <p className="text-lg text-gray-600">
              Handpicked solutions to support your {selectedCat.name.toLowerCase()} journey
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: colors.second }}
              >
                No Products Found
              </h3>
              <p className="text-gray-600 mb-6">This category doesn't have any products yet.</p>
              <button
                onClick={() => navigate("/products")}
                className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300"
                style={{ background: colors.accent }}
              >
                Browse Other Categories
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const productSlug = generateSlug(product.name);
                return (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/products/${categorySlug}/${productSlug}`)}
                    className="group bg-white cursor-pointer"
                  >
                    <div className="aspect-square overflow-hidden bg-gray-100 relative">
                      <img
                        src={product.image_url || 'https://via.placeholder.com/500x300'}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <h3
                        className="text-xl font-medium mb-2 group-hover:text-accent text-center transition-colors line-clamp-1"
                        style={{ color: colors.second }}
                      >
                        {product.name}
                      </h3>
                      
                      {product.price && (
                        <p className="text-center text-lg font-bold mb-4" style={{ color: colors.second }}>
                          ₹{product.price}
                        </p>
                      )}

                      <div
                        className="group flex items-center justify-center gap-2 px-6 py-3 cursor-pointer border transition-all duration-300 hover:shadow-xl text-white"
                        style={{ borderColor: colors.accent, background: colors.accent }}
                      >
                        <span className="font-medium tracking-wide transition-colors duration-300 group-hover:text-white">
                          View Details
                        </span>
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:stroke-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
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
            Start Your {selectedCat.name} Journey Today
          </h2>
          <p className="text-lg text-gray-100 mb-8">
            Discover the perfect products to enhance your health and well-being.
            Take the first step now!
          </p>
          <button
            onClick={() => window.scrollTo({ top: document.getElementById('products').offsetTop, behavior: 'smooth' })}
            className="px-8 py-4 rounded-lg shadow-lg font-medium cursor-pointer text-black bg-white hover:bg-gray-100 hover:shadow-xl transition-all duration-300"
          >
            Shop {selectedCat.name} Products
          </button>
        </div>
      </section>
    </div>
  );
};

export default CategoryProducts;