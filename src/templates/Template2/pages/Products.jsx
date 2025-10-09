import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { products, categories } from '../data/products'; // Adjust path if needed
import {
  Heart, Baby, Home, Leaf, Stethoscope, User2, Scale, Sparkles, Shield, Zap, Users, User, ArrowBigLeft,
} from 'lucide-react';
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from '@/components/ui/carousel';

const EcommerceProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || null);
  const navigate = useNavigate();

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : [];

  const categoryIcons = {
    beauty: Sparkles,
    cardiac: Heart,
    child: Baby,
    home: Home,
    detox: Leaf,
    digestive: Stethoscope,
    elderly: User2,
    energy: Zap,
    immunity: Shield,
    men: User,
    weight: Scale,
    women: Users,
  };

  const carouselItems = [
    {
      id: 1,
      text: 'Elevate Your Wellness',
      image: 'https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 2,
      text: 'Thrive Every Day',
      image: 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?q=80&w=1935&auto=format&fit=crop',
    },
    {
      id: 3,
      text: 'Premium Quality Awaits',
      image: 'https://plus.unsplash.com/premium_photo-1718913936342-eaafff98834b?q=80&w=2072&auto=format&fit=crop',
    },
  ];

  useEffect(() => {
    if (selectedCategory) {
      setSearchParams({ category: selectedCategory });
    } else {
      setSearchParams({});
    }
  }, [selectedCategory, setSearchParams]);

  const ProductCard = ({ product }) => (
    <div 
      className="rounded-xl shadow-xl overflow-hidden transition-transform duration-400 hover:scale-105 border border-[#822b00]/20"
      style={{ backgroundColor: '#f7e5d9' }}
    >
      <img
        src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={product.name}
        className="w-full h-36 sm:h-44 md:h-48 object-cover"
      />
      <div className="p-4">
        <h3 
          className="text-sm sm:text-base font-bold text-center mb-2 line-clamp-2"
          style={{ color: '#822b00' }}
        >
          {product.name}
        </h3>
        {product.price && (
          <p 
            className="text-center text-sm mb-3 font-semibold"
            style={{ color: '#822b00' }}
          >
            ${product.price.toFixed(2)}
          </p>
        )}
        <button
          onClick={() => navigate(`/template2/product/${product.id}`)}
          className="w-full rounded-lg px-4 py-2 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-400"
          style={{ backgroundColor: '#822b00', color: '#f7e5d9' }}
        >
          Learn More & Buy
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f7e5d9' }} className="min-h-screen">
      {/* Carousel */}
      <section aria-label="Featured Wellness Products" className="relative w-full">
        <Carousel className="w-full">
          <CarouselContent>
            {carouselItems.map((banner) => (
              <CarouselItem key={banner.id}>
                <div className="relative h-60 sm:h-72 md:h-88 lg:h-[520px] overflow-hidden">
                  <img
                    src={banner.image}
                    alt={`${banner.text} - NHT Global`}
                    className="w-full h-full object-cover transition-transform duration-600 hover:scale-110"
                    loading="lazy"
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-[#822b00]/70 to-transparent" 
                    style={{ background: 'linear-gradient(to right, #822b00 70%, transparent)' }}
                  />
                  <div className="absolute top-1/2 left-6 sm:left-8 lg:left-12 transform -translate-y-1/2 text-center max-w-2xl">
                    <h1 
                      className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold drop-shadow-lg"
                      style={{ color: '#f7e5d9' }}
                    >
                      {banner.text}
                    </h1>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 rounded-lg" style={{ color: '#822b00', borderColor: '#822b00' }} />
          <CarouselNext className="right-4 top-1/2 -translate-y-1/2 rounded-lg" style={{ color: '#822b00', borderColor: '#822b00' }} />
        </Carousel>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {!selectedCategory ? (
          <>
            <section className="mb-12 text-center">
              <h1 
                className="text-3xl sm:text-4xl font-bold mb-5 tracking-wide"
                style={{ color: '#822b00' }}
              >
                Explore Our Wellness Products
              </h1>
              <p 
                className="text-base sm:text-lg leading-relaxed max-w-3xl mx-auto"
                style={{ color: '#822b00' }}
              >
                Discover NHT Global’s premium range, crafted to support your health and thrive in today’s world.
              </p>
            </section>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {categories.map((category) => {
                const Icon = categoryIcons[category.id] || Sparkles;
                return (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex flex-col items-center cursor-pointer group transition-all duration-400"
                  >
                    <div 
                      className="w-20 h-20 rounded-full shadow-lg flex items-center justify-center group-hover:bg-[#822b00] transition-all duration-300"
                      style={{ backgroundColor: '#f7e5d9' }}
                    >
                      <Icon className="w-10 h-10 group-hover:text-[#f7e5d9]" style={{ color: '#822b00' }} />
                    </div>
                    <span 
                      className="mt-3 text-sm font-semibold text-center group-hover:text-[#822b00]"
                      style={{ color: '#822b00' }}
                    >
                      {category.name.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Header Section */}
            <div 
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl shadow-xl p-6 border border-[#822b00]/20"
              style={{ backgroundColor: '#f7e5d9' }}
            >
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-3 font-semibold mb-4 sm:mb-0 rounded-lg px-4 py-2 hover:bg-[#822b00] hover:text-[#f7e5d9] transition-all duration-300 shadow-md"
                style={{ color: '#822b00' }}
              >
                <ArrowBigLeft className="w-6 h-6" />
                Back to Categories
              </button>
              <h2 
                className="text-xl sm:text-2xl font-bold text-center sm:text-right"
                style={{ color: '#822b00' }}
              >
                {selectedCategory.toUpperCase()} ({filteredProducts.length} items)
              </h2>
            </div>

            {/* Categories Sidebar (Mobile Dropdown) */}
            <div className="lg:hidden">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 rounded-lg border-2 text-sm font-semibold focus:outline-none focus:ring-2 shadow-md"
                style={{ borderColor: '#822b00', color: '#822b00', backgroundColor: '#f7e5d9' }}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Main Content with Sidebar */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar (Desktop Only) */}
              <aside 
                className="hidden lg:block lg:w-1/4 rounded-xl shadow-xl p-6 sticky top-6 max-h-[calc(100vh-6rem)] overflow-y-auto border border-[#822b00]/20"
                style={{ backgroundColor: '#f7e5d9' }}
              >
                <h2 
                  className="text-xl font-bold mb-6"
                  style={{ color: '#822b00' }}
                >
                  Categories
                </h2>
                <ul className="space-y-4">
                  {categories.map((category) => {
                    const Icon = categoryIcons[category.id] || Sparkles;
                    return (
                      <li
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                          selectedCategory === category.id
                            ? 'bg-[#822b00] text-[#f7e5d9] font-semibold'
                            : 'hover:bg-[#822b00]/10 text-[#822b00]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-semibold">{category.name.toUpperCase()}</span>
                      </li>
                    );
                  })}
                </ul>
              </aside>

              {/* Products Grid */}
              <div className="w-full lg:w-3/4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  ) : (
                    <p 
                      className="text-center col-span-full py-10 text-base"
                      style={{ color: '#822b00' }}
                    >
                      No products found in this category.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcommerceProducts;