import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, ShoppingCart, Heart, Share2, ArrowLeft } from "lucide-react";
import ProductDetailSkeleton from "@/components/loaders/ProductDetailSkeleton";
import { formatPrice } from "@/lib/utils";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAll } = useTenantApi();
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAll("/site/data");
        setSiteData(response.site_data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAll]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
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

  // Find product
  const product = siteData?.products.find((p) => p.id === parseInt(id));
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="text-gray-800 text-xl font-semibold mb-4">Product not found</div>
        <Button 
          variant="outline"
          onClick={() => navigate("/products")}
        >
          Back to Products
        </Button>
      </div>
    );
  }

  // Helper functions
  const getCategoryName = (categoryId) => {
    const category = siteData?.categories.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  const handleBack = () => {
    navigate(`/products?category=${getCategoryName(product.category_id).toLowerCase()}`);
  };

  // Gallery images
  const images = [
    product.image_url || "https://via.placeholder.com/500x500?text=Product+Image",
    product.banner_image_url || "https://via.placeholder.com/500x500?text=Banner+Image",
  ].filter(Boolean);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 animate-fadeIn">
        <nav className="flex items-center text-md font-medium text-gray-500 space-x-2">
          <Button
            variant="link"
            onClick={() => navigate("/")}
            className="p-0 text-primary hover:text-primary/80"
          >
            Home
          </Button>
          <span>/</span>
          <Button
            variant="link"
            onClick={() => navigate("/products")}
            className="p-0 text-primary hover:text-primary/80"
          >
            Products
          </Button>
          <span>/</span>
          <Button
            variant="link"
            onClick={handleBack}
            className="p-0 text-primary hover:text-primary/80"
          >
            {getCategoryName(product.category_id)}
          </Button>
          <span>/</span>
          <span className="text-gray-800 truncate font-semibold">{product.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 animate-fadeIn">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Gallery */}
          <div className="lg:w-1/2 space-y-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2 mb-4 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {getCategoryName(product.category_id)}
            </Button>
            
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((img, index) => (
                    <CarouselItem key={index}>
                      <div 
                        className="h-64 sm:h-80 md:h-96 bg-white rounded-xl flex items-center justify-center overflow-hidden"
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <img
                          src={img}
                          alt={`${product.name} - ${index + 1}`}
                          className="max-w-full max-h-full object-contain transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-2 bg-white/80 hover:bg-white" />
                    <CarouselNext className="right-2 bg-white/80 hover:bg-white" />
                  </>
                )}
              </Carousel>
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-2">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                      activeImageIndex === index
                        ? "border-primary"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
                {product.name}
              </h1>
              
              <div className="space-y-6">
                {product.price && (
                  <div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl md:text-3xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </p>
                      {product.original_price && product.original_price > product.price && (
                        <p className="text-lg text-gray-500 line-through">
                          {formatPrice(product.original_price)}
                        </p>
                      )}
                    </div>
                    
                    {product.price_description && (
                      <p className="text-sm text-gray-600 mt-2">{product.price_description}</p>
                    )}
                  </div>
                )}
                
                {product.availability && (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        product.availability?.toLowerCase() === "in_stock" 
                          ? "success" 
                          : "destructive"
                      }
                      className="text-sm py-1 px-3"
                    >
                      {product.availability === "in_stock" ? "In Stock" : product.availability}
                    </Badge>
                  </div>
                )}
                
                <div className="pt-4 flex flex-wrap gap-3">
                  <a 
                    href={product.buy_link || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-grow sm:flex-grow-0"
                  >
                    <Button
                      className="bg-[#ff9f00] text-white hover:bg-[#ff9f00]/90 cursor-pointer w-full sm:w-auto"
                      size="lg"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Buy Now
                    </Button>
                  </a>
                  
                  {product.guide_pdf_url && (
                    <a 
                      href={product.guide_pdf_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-grow sm:flex-grow-0"
                    >
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="cursor-pointer w-full sm:w-auto"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download Guide
                      </Button>
                    </a>
                  )}
                </div>
                
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary">
                    <Heart className="w-5 h-5 mr-1" />
                    <span className="text-sm">Save</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary">
                    <Share2 className="w-5 h-5 mr-1" />
                    <span className="text-sm">Share</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description and Details Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full mb-6 bg-white rounded-lg">
              <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
              {product.instructions && (
                <TabsTrigger value="instructions" className="flex-1">Instructions</TabsTrigger>
              )}
              {product.video_url && (
                <TabsTrigger value="video" className="flex-1">Video</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="description" className="mt-0">
              <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div
                    className="text-gray-700 leading-relaxed text-md"
                    dangerouslySetInnerHTML={{
                      __html:
                        product.description ||
                        "This is a high-quality product designed to enhance your wellness.",
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            {product.instructions && (
              <TabsContent value="instructions" className="mt-0">
                <Card className="border-none shadow-sm">
                  <CardContent className="p-6">
                    <div
                      className="text-gray-700 leading-relaxed text-md"
                      dangerouslySetInnerHTML={{ __html: product.instructions }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            
            {product.video_url && (
              <TabsContent value="video" className="mt-0">
                <Card className="border-none shadow-sm">
                  <CardContent className="p-6">
                    <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                      <iframe
                        src={product.video_url}
                        title={`${product.name} video`}
                        className="w-full h-full"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;