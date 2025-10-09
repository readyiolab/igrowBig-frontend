import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Grid3X3, LayoutList, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import CategoryGrid from "@/components/sections/CategoryGrid";
import ProductGrid from "@/components/sections/ProductGrid";
import SectionHeader from "@/components/sections/SectionHeader";
import BannerCarousel from "@/components/sections/BannerCarousel";
import CategorySkeleton from "@/components/loaders/CategorySkeleton";
import ProductSkeleton from "@/components/loaders/ProductSkeleton";
import parse from "html-react-parser";

const EcommerceProducts = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getAll } = useTenantApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const selectedCategory = searchParams.get("category")?.toLowerCase() || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAll(`/site/${slug}`);
        setData(response.site_data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, getAll]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden bg-gray-200 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-12">
          {!selectedCategory ? (
            <>
              <div className="text-center mb-8">
                <div className="h-10 w-1/3 mx-auto bg-gray-200 animate-pulse rounded-md mb-4" />
                <div className="h-5 w-1/2 mx-auto bg-gray-200 animate-pulse rounded-md mb-8" />
              </div>
              <CategorySkeleton count={8} />
            </>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="hidden lg:block lg:w-1/4">
                <Card className="animate-pulse bg-gray-100">
                  <CardHeader>
                    <div className="h-6 w-24 bg-gray-200 rounded-md" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-gray-200" />
                          <div className="h-4 w-24 bg-gray-200 rounded-md" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="w-full lg:w-3/4 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-32 bg-gray-200 rounded-md" />
                  <div className="h-8 w-48 bg-gray-200 rounded-md" />
                </div>
                <ProductSkeleton count={6} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-600 text-xl font-semibold">
          <h2>Error Occurred</h2>
          <p>{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const productPage = data?.product_page || {};
  const categories = data?.categories || [];
  const products = data?.products || [];

  // Filter products based on category and search term
  const filteredProducts = selectedCategory
    ? products.filter(
        (p) => {
          const matchCategory = categories.find(
            (c) => c.name.toLowerCase() === selectedCategory
          )?.id === p.category_id;
          
          const matchSearch = searchTerm === "" || 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
          
          return matchCategory && matchSearch;
        }
      )
    : [];

  const handleCategorySelect = (categoryName) => {
    setSearchParams({ category: categoryName.toLowerCase() });
    setSearchTerm(""); // Reset search when changing category
  };

  const clearCategory = () => {
    setSearchParams({});
    setSearchTerm("");
  };

  const handleProductClick = (productId) => {
    navigate(`/${slug}/product/${productId}`);
  };

  // Banner for product page
  const banner = [{
    id: 1,
    image: productPage.banner_image_url || "https://via.placeholder.com/1200x400?text=Product+Banner",
    description: productPage.banner_content || "Discover Our Products"
  }];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Product Banner */}
      <BannerCarousel 
        banners={banner} 
        height="h-64 sm:h-80 md:h-96" 
        showControls={false}
      />

      {/* About Description */}
      {productPage.about_description && (
        <div className="p-7 text-center leading-8 text-gray-700 text-sm sm:text-base md:text-lg prose prose-gray mx-auto max-w-6xl">
          {parse(productPage.about_description)}
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        {!selectedCategory ? (
          <>
            {/* Categories Section */}
            <section>
              <SectionHeader
                title="Shop by Category"
                subtitle="Find the perfect products tailored to your wellness needs."
                centered={true}
                className="mb-10"
              />
              
              <CategoryGrid 
                categories={categories} 
                onSelectCategory={handleCategorySelect} 
              />
            </section>
          </>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar (Desktop) */}
            <aside className="hidden lg:block lg:w-1/4">
              <Card className="sticky top-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li
                        key={category.id}
                        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all duration-200 ${
                          selectedCategory === category.name.toLowerCase()
                            ? "bg-primary text-white"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => handleCategorySelect(category.name)}
                      >
                        <img
                          src={category.image_url || "https://via.placeholder.com/40x40?text=No+Image"}
                          alt={category.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <span className="text-sm font-medium">{category.name}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </aside>

            {/* Products Section */}
            <div className="w-full lg:w-3/4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <Button
                  variant="outline"
                  onClick={clearCategory}
                  className="flex items-center gap-2 hover:bg-gray-100 transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Categories
                </Button>
                
                <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
                  {/* Mobile Category Dropdown */}
                  <div className="lg:hidden w-full">
                    <Select
                      value={selectedCategory}
                      onValueChange={handleCategorySelect}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name.toLowerCase()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Search Input */}
                  <div className="relative w-full sm:w-60">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-8 w-full"
                    />
                    <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  
                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex border rounded-md overflow-hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`rounded-none ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`rounded-none ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                      onClick={() => setViewMode('list')}
                    >
                      <LayoutList className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-800">
                  {selectedCategory.toUpperCase()} ({filteredProducts.length} items)
                </h2>
              </div>
              
              {viewMode === 'grid' ? (
                <ProductGrid 
                  products={filteredProducts} 
                  onProductClick={handleProductClick}
                  buttonText="Learn More & Buy"
                />
              ) : (
                <div className="space-y-4">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <Card
                        key={product.id}
                        className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
                        onClick={() => handleProductClick(product.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="sm:w-1/4">
                              <img
                                src={product.image_url || "https://via.placeholder.com/300x200?text=No+Image"}
                                alt={product.name}
                                className="w-full h-40 object-cover rounded-lg"
                                loading="lazy"
                              />
                            </div>
                            <div className="sm:w-3/4 flex flex-col">
                              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {product.name}
                              </h3>
                              <div className="text-sm text-gray-600 line-clamp-2 mb-4">
                                {product.description ? (
                                  parse(product.description.substring(0, 120) + '...')
                                ) : (
                                  "No description available"
                                )}
                              </div>
                              <Button
                                className="mt-auto self-start"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleProductClick(product.id);
                                }}
                              >
                                Learn More & Buy
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-gray-600 py-8">
                      No products found in this category.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcommerceProducts;