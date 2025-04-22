import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Download } from "lucide-react";

const ProductDetail = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const { getAll } = useTenantApi();
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAll(`/site/${slug}`);
        setSiteData(response.site_data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, getAll]);

  // Helper functions
  const getCategoryName = (categoryId) => {
    const category = siteData?.categories.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  const handleBack = () => {
    navigate(`/${slug}/products?category=${getCategoryName(product.category_id).toLowerCase()}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-800 text-xl font-semibold animate-pulse">Loading...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-600 text-xl font-semibold">Error: {error}</div>
      </div>
    );
  }

  // Find product
  const product = siteData?.products.find((p) => p.id === parseInt(id));
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-800 text-xl font-semibold">Product not found</div>
      </div>
    );
  }

  // Banner data
  const banners = [
    {
      id: 1,
      text: product.title || product.name || "Explore This Product",
      image:
        product.banner_image_url ||
        "https://via.placeholder.com/1200x400?text=Product+Banner",
    },
  ];

  // Gallery images
  const images = [
    product.image_url || "https://via.placeholder.com/500x500?text=Product+Image",
    product.banner_image_url || "https://via.placeholder.com/500x500?text=Banner+Image",
  ].filter(Boolean);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Product Banner */}
      <section aria-label="Product Banner" className="relative w-full">
        <Carousel className="w-full">
          <CarouselContent>
            {banners.map((banner) => (
              <CarouselItem key={banner.id}>
                <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
                  <img
                    src={banner.image}
                    alt={`${banner.text} - Product Banner`}
                    className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-8 left-4 sm:left-6 md:left-8 text-white ">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wider">
                      {banner.text}
                    </h1>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 sm:left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="right-2 sm:right-4 top-1/2 -translate-y-1/2" />
        </Carousel>
      </section>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <nav className="flex items-center text-md font-semibold text-gray-600  space-x-2">
          <Button
            variant="ghost"
            onClick={() => navigate(`/${slug}`)}
            className="p-0 hover:text-blue-600"
          >
            Home
          </Button>
          <span>/</span>
          <Button
            variant="ghost"
            onClick={handleBack}
            className="p-0 hover:text-blue-600"
          >
            {getCategoryName(product.category_id).toUpperCase()}
          </Button>
          <span>/</span>
          <span className="text-gray-800 truncate">{product.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Product Gallery */}
          <div className="lg:w-1/2">
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((img, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={img}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-64 sm:h-80 md:h-96 object-contain border-1 rounded-2xl shadow-sm"
                      loading="lazy"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2">
            <div className=" p-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl  text-gray-800 mb-4">
                {product.name}
              </h1>
              <div className="space-y-10">
                {product.price && (
                  <div>
                    <p className="text-xl md:text-2xl  ">
                      ${product.price.toFixed(2)}
                    </p>
                    
                      <p className="text-sm tracking-wider  mt-4">{product.price_description}</p>
                  
                  </div>
                )}
                
                {/* <Badge
                  variant={
                    product.availability?.toLowerCase() === "in_stock" ? "success" : "destructive"
                  }
                  className="text-sm"
                >
                  {product.availability || "In Stock"}
                </Badge> */}
                <div className="flex flex-wrap gap-3">
                  <a href={product.buy_link || "#"} target="_blank" rel="noopener noreferrer">
                    <Button
                      className="bg-[#ff9f00] text-white hover:bg-[#ff9f00] cursor-pointer"
                      size="lg"
                    >
                      Buy Now
                    </Button>
                  </a>
                  {product.guide_pdf_url && ( 
                    <a href={product.guide_pdf_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="lg" className="cursor-pointer">
                        <Download className="w-4 h-4 mr-2" />
                        Guide
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
           
          </div>
        </div>

        {/* Description and Instructions */}
        <div className="mt-6 border-t-2  p-6 ">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Description :</h3>
          <div >
            <div
              className="text-gray-700 leading-relaxed text-sm md:text-base"
              dangerouslySetInnerHTML={{
                __html:
                  product.description ||
                  "This is a high-quality product designed to enhance your wellness.",
              }}
            />
          </div>
          {product.instructions && (
            <>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mt-6 mb-4">
                Instructions
              </h3>
              <div >
                <div
                  className="text-gray-700 leading-relaxed text-sm md:text-base"
                  dangerouslySetInnerHTML={{ __html: product.instructions }}
                />
              </div>
            </>
          )}
        </div>

        {/* Video Section */}
        {product.video_url && (
          <div className="  p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 text-center" >
              Watch {product.name}
            </h3>
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
              <iframe
                src={product.video_url}
                title={`${product.name} video`}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;