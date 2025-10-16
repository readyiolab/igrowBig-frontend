import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Grid3X3, LayoutList, Search } from "lucide-react";

const CategoryProducts = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { getAll } = useTenantApi();
  const [siteData, setSiteData] = useState(null);
  const [productPageData, setProductPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAll("/site/data");
        setSiteData(response.site_data);
        
        // Fetch product page data from tbl_product_page
        const productPageResponse = await getAll("/product-page");
        setProductPageData(productPageResponse.data || {});
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Loading products...</p>
        </div>
      </div>
    );
  }

  const categories = siteData?.categories || [];
  const products = siteData?.products || [];
  const productPageBanner = productPageData?.banner_image_url || null;
  const productPageBannerContent = productPageData?.banner_content || null;
  const productPageAboutDescription = productPageData?.about_description || null;
  const productPageVideoLink = productPageData?.video_section_link || null;

  const selectedCat = categories.find((c) => c.name.toLowerCase() === category?.toLowerCase());
  const filteredProducts = selectedCat
    ? products.filter(
        (p) =>
          p.category_id === selectedCat.id &&
          (searchTerm === "" ||
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  if (!selectedCat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <p className="text-xl text-gray-700 mb-4">Category not found</p>
        <Button onClick={() => navigate("/products")} variant="outline">
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Banner */}
      {productPage.banner_image_url && (
        <div className="relative h-64 md:h-80 overflow-hidden bg-black">
          <img
            src={productPage.banner_image_url}
            alt={selectedCat.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white">{selectedCat.name}</h1>
          </div>
        </div>
      )}

      {/* About Description */}
      {productPage.about_description && (
        <div className="py-8 px-4 bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto text-center text-gray-700">
            <div dangerouslySetInnerHTML={{ __html: productPage.about_description }} />
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header with Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <Button
              variant="outline"
              onClick={() => navigate("/products")}
              className="flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </Button>
            <h2 className="text-2xl font-bold text-black">
              {selectedCat.name} ({filteredProducts.length})
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* View Toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-none ${viewMode === "grid" ? "bg-gray-200" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-none ${viewMode === "list" ? "bg-gray-200" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <LayoutList className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
                  onClick={() => navigate(`/products/${category}/${product.id}`)}
                >
                  <CardContent className="p-0">
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={product.image_url || "https://via.placeholder.com/300x200"}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-black mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {product.description ? (
                          <div dangerouslySetInnerHTML={{ __html: product.description.substring(0, 100) + "..." }} />
                        ) : (
                          "No description"
                        )}
                      </p>
                      {product.price && (
                        <p className="text-lg font-bold text-black mb-4">₹{product.price}</p>
                      )}
                      <Button className="w-full bg-black hover:bg-gray-800 text-white">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300"
                  onClick={() => navigate(`/products/${category}/${product.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.image_url || "https://via.placeholder.com/100x100"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-black mb-1">{product.name}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                          {product.description ? (
                            <div dangerouslySetInnerHTML={{ __html: product.description.substring(0, 100) }} />
                          ) : (
                            "No description"
                          )}
                        </p>
                        {product.price && (
                          <p className="font-bold text-black">₹{product.price}</p>
                        )}
                      </div>
                      <Button className="bg-black hover:bg-gray-800 text-white">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;