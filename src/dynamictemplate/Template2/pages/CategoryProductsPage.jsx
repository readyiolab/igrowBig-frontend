import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, ArrowRight, Package, Play } from 'lucide-react';
import { api } from '@/utils/api';

const CategoryProductsPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('US');

  // Color palette to match ProductsPage
  const colors = {
    first: '#d3d6db',
    second: '#3a4750',
    third: '#303841',
    accent: '#be3144',
  };

  useEffect(() => {
    loadCategoryProducts();
  }, [categorySlug, selectedCountry]);

  const loadCategoryProducts = async () => {
    try {
      setLoading(true);

      // Get category name from navigation state or derive from slug
      const categoryName = location.state?.categoryName || categorySlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Fetch products from API using categoryName
      const productsData = await api.getProducts(selectedCountry, categoryName);
      
      // Map backend data to frontend format
      const mappedProducts = productsData.map(product => ({
        id: product.id,
        category_id: product.categoryId,
        name: product.productName,
        title: product.productName,
        your_price: product.yourPrice,
        base_price: product.basePrice,
        preferred_customer_price: product.preferredCustomerPrice,
        description: product.description,
        image_url: product.productImage,
        availability: 'in_stock',
        status: 'active',
        category_name: product.categoryName,
        currency: product.currency,
        currencySymbol: product.currencySymbol
      }));

      setProducts(mappedProducts);

      // Set category info (mock for now as we don't have category detail API)
      const mockCategory = {
        id: 1,
        name: categoryName,
        description: `Products to support ${categoryName.toLowerCase()}.`,
        category_description: `Welcome to our ${categoryName} collection! Discover science-backed supplements designed to support your wellness journey.`,
        category_image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop',
        banner_section_content: `Explore ${categoryName} Solutions`,
        about_section_title: `Discover ${categoryName} Products`,
        about_section_content: `Explore our curated range of supplements designed to support ${categoryName.toLowerCase()}.`,
        video_section_title: `Learn About Our ${categoryName} Products`,
        video_section_youtube_url: null,
      };

      setCategoryInfo(mockCategory);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  };

  const createProductSlug = (product) => {
    const name = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `${product.id}-${name}`;
  };

  const handleBackToCategories = () => {
    navigate('/template2/products');
  };

  const handleProductClick = (product) => {
    const productSlug = createProductSlug(product);
    navigate(`/template2/products/${categorySlug}/${productSlug}`, {
      state: { country: selectedCountry }
    });
  };

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

  return (
    <div>
      {/* Banner Section */}
      {categoryInfo && (
        <section className=" px-4 sm:px-6 lg:px-8 py-16  relative z-10 overflow-hidden">
          <img
            src={categoryInfo.category_image_url || 'https://via.placeholder.com/1200x600'}
            alt={categoryInfo.name}
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
                {categoryInfo.banner_section_content || categoryInfo.name}
              </h1>
              <p className="text-lg md:text-xl text-gray-100">{categoryInfo.description}</p>
            </div>
          </div>
        </section>
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <button
            onClick={handleBackToCategories}
            className="font-bold flex items-center gap-1  transition-colors"
            
          >
            <ArrowLeft className="w-4 h-4" />
            All Categories
          </button>
          <span className="text-gray-400">/</span>
          <span className="font-medium " >
            {categoryInfo?.name}
          </span>
        </div>
      </div>

      {/* About Section */}
      {categoryInfo && (
        <section className="py-20 px-4" style={{ background: colors.first }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2
                  className="text-3xl md:text-4xl font-semibold mb-4"
                  style={{ color: colors.second }}
                >
                  {categoryInfo.about_section_title || `About ${categoryInfo.name}`}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  {categoryInfo.about_section_content || categoryInfo.category_description}
                </p>
                <button
                  onClick={() => window.scrollTo({ top: document.getElementById('products').offsetTop, behavior: 'smooth' })}
                  className="px-8 py-3 rounded-2xl shadow-lg cursor-pointer font-semibold text-white hover:shadow-xl transition-all duration-300 bg-[#06b6d4]"
                  
                >
                  Explore Products
                </button>
              </div>
              <div>
                <img
                  src={categoryInfo.category_image_url || 'https://via.placeholder.com/600x400'}
                  alt={categoryInfo.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Video Section */}
      {categoryInfo && categoryInfo.video_section_youtube_url && (
        <section className="py-20 px-4" style={{ background: colors.first }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-semibold mb-4"
                style={{ color: colors.second }}
              >
                {categoryInfo.video_section_title || `Learn About ${categoryInfo.name}`}
              </h2>
              <p className="text-lg text-gray-600">
                Discover the benefits of our {categoryInfo.name} products through this video.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={categoryInfo.video_section_youtube_url}
                  title={`${categoryInfo.name} Product Video`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
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
            
            >
              Featured Products
            </h2>
            <p className="text-lg text-gray-600">
              Handpicked solutions to support your {categoryInfo?.name.toLowerCase()} journey
            </p>
          </div>

          {products.length === 0 ? (
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
                onClick={handleBackToCategories}
                className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300"
                style={{ background: colors.accent }}
              >
                Browse Other Categories
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="group bg-white cursor-pointer"
                >
                  <div className="aspect-square overflow-hidden bg-gray-100 relative">
                    <img
                      src={product.image_url || 'https://via.placeholder.com/500x300'}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3
                      className="text-xl font-medium mb-2 group-hover:text-accent text-center transition-colors line-clamp-1"
                      style={{ color: colors.second }}
                    >
                      {product.name}
                    </h3>
                    
                    <div
                      className="group rounded-2xl flex bg-[#06b6d4] items-center justify-center gap-2 px-6 py-3 cursor-pointer border transition-all duration-300 hover:shadow-xl mt-4 text-white"
                      
                    >
                      <span className="font-medium tracking-wide transition-colors duration-300 group-hover:text-white">
                        View Details
                      </span>
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:stroke-white" />
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
        className="py-20 px-4 m-10 rounded-2xl shadow-lg text-center bg-[#06b6d4]"

      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white">
            Start Your {categoryInfo?.name} Journey Today
          </h2>
          <p className="text-lg text-gray-100 mb-8">
            Discover the perfect products to enhance your health and well-being.
            Take the first step now!
          </p>
          <button
            onClick={() => window.scrollTo({ top: document.getElementById('products').offsetTop, behavior: 'smooth' })}
            className="px-8 py-4 rounded-lg shadow-lg font-medium cursor-pointer text-black bg-white hover:bg-gray-100 hover:shadow-xl transition-all duration-300"
          >
            Shop {categoryInfo?.name} Products
          </button>
        </div>
      </section>
    </div>
  );
};

export default CategoryProductsPage;