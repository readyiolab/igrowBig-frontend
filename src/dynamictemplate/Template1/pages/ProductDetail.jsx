// ProductDetail.jsx - UPDATED WITH FULL PRODUCT DATA SUPPORT & FIXES
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Download, ShoppingCart, Heart, Share2, ArrowLeft, CheckCircle, AlertTriangle, FileText } from "lucide-react";

const ProductDetail = () => {
  const { category: categorySlug, id: productSlug } = useParams();
  const navigate = useNavigate();
  const { getAll } = useTenantApi();
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-xl text-gray-700 mb-4">Error loading product</p>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  // UNIFIED generateSlug - Handles '&', spaces, hyphens, special chars
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <FileText className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-xl text-gray-700 mb-4">Product not found</p>
        <p className="text-sm text-gray-500 mb-4">
          Debug: Category '{categorySlug}', Product '{productSlug}'
        </p>
        <Button onClick={() => navigate("/products")} variant="outline">
          Back to Products
        </Button>
      </div>
    );
  }

  const catSlugForNav = generateSlug(selectedCat.name);

  // Helper to safely parse JSON strings (for keyBenefits, keyIngredients)
  const safeParseJSONList = (field) => {
    if (!field) return null;
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        // Handle both JSON array and HTML <ul> or plain text
        const trimmed = field.trim();
        if (trimmed.startsWith('[')) {
          return JSON.parse(trimmed);
        }
        if (trimmed.startsWith('<')) {
          // Extract text from HTML (simple approach)
          const div = document.createElement('div');
          div.innerHTML = trimmed;
          return Array.from(div.querySelectorAll('li')).map(li => li.textContent.trim());
        }
      } catch (e) {
        console.warn('Failed to parse list field:', field, e);
      }
    }
    return null;
  };

  // Helper to format price
  const formatPrice = (price, currency = 'USD', symbol = '$') => {
    if (!price) return null;
    return `${symbol}${parseFloat(price).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Button variant="link" onClick={() => navigate("/")} className="p-0 text-sm">
            Home
          </Button>
          <span>/</span>
          <Button variant="link" onClick={() => navigate("/products")} className="p-0 text-sm">
            Products
          </Button>
          <span>/</span>
          <Button variant="link" onClick={() => navigate(`/products/${catSlugForNav}`)} className="p-0 text-sm">
            {selectedCat.name}
          </Button>
          <span>/</span>
          <span className="font-semibold text-black">{product.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => navigate(`/products/${catSlugForNav}`)}
          className="flex items-center gap-2 mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {selectedCat.name}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Image & Banner */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <img
                src={product.image_url || "https://via.placeholder.com/500x500?text=No+Image"}
                alt={product.name}
                className="w-full h-auto max-h-[500px] object-contain rounded"
                loading="lazy"
              />
            </div>
            {/* Banner Image */}
            {product.banner_image_url && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <img
                  src={product.banner_image_url}
                  alt={`${product.name} Banner`}
                  className="w-full h-auto rounded"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">{product.title || product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.description}</p>
              {product.availability && (
                <Badge
                  variant={product.availability === "in_stock" ? "default" : "destructive"}
                  className="mb-4"
                >
                  {product.availability === "in_stock" ? "In Stock" : product.availability.replace(/_/g, ' ')}
                </Badge>
              )}
              {product.status && (
                <Badge variant="outline" className="ml-2">
                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </Badge>
              )}
            </div>

            {/* Pricing Section */}
            <div className="space-y-2 py-4 border-t border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Your Price:</span>
                <span className="text-2xl font-bold text-black">
                  {formatPrice(product.your_price, product.currency, product.currency_symbol)}
                </span>
              </div>
              {product.preferred_customer_price && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Preferred Price:</span>
                  <span className="text-xl font-semibold text-green-600">
                    {formatPrice(product.preferred_customer_price, product.currency, product.currency_symbol)}
                  </span>
                </div>
              )}
              {product.base_price && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Base Price:</span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.base_price, product.currency, product.currency_symbol)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3 flex-wrap">
              {product.buy_link ? (
                <a href={product.buy_link} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white text-lg py-6">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Buy Now
                  </Button>
                </a>
              ) : (
                <Button disabled className="flex-1 text-lg py-6 opacity-50">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Now (Link Unavailable)
                </Button>
              )}
              {product.guide_pdf_url && (
                <a href={product.guide_pdf_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="text-lg py-6">
                    <Download className="w-5 h-5 mr-2" />
                    Download Guide
                  </Button>
                </a>
              )}
            </div>

            <div className="flex gap-4 border-t border-gray-200 pt-4">
              <Button variant="ghost" className="text-gray-600">
                <Heart className="w-5 h-5 mr-2" />
                Save
              </Button>
              <Button variant="ghost" className="text-gray-600">
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
            </div>

            {/* Meta Info */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>Product ID: {product.global_product_id || product.id}</p>
              <p>Country: {product.country}</p>
              <p>Last Updated: {new Date(product.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Product Details Sections */}
        <div className="space-y-8 mt-12">
          {/* Full Description */}
          {product.fullDescription && (
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-black mb-4">About This Product</h2>
                <div
                  className="text-gray-700 leading-relaxed prose max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: product.fullDescription.replace(/\n/g, '<br/>') 
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Key Benefits */}
          {product.keyBenefits && (
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-black mb-4">Key Benefits</h2>
                {(() => {
                  const benefits = safeParseJSONList(product.keyBenefits);
                  return benefits ? (
                    <ul className="space-y-3">
                      {benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: product.keyBenefits }}
                    />
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* Key Ingredients */}
          {product.keyIngredients && (
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-black mb-4">Key Ingredients</h2>
                {(() => {
                  const ingredients = safeParseJSONList(product.keyIngredients);
                  return ingredients ? (
                    <ul className="space-y-2">
                      {ingredients.map((ingredient, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-gray-700">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: product.keyIngredients }}
                    />
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* Directions For Use */}
          {product.directionsForUse && (
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-black mb-4">Directions for Use</h2>
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: product.directionsForUse.replace(/\n/g, '<br/>') 
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          {product.instructions && (
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-black mb-4">Instructions</h2>
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: product.instructions.replace(/\n/g, '<br/>') 
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Free Of */}
          {product.freeOf && (
            <Card className="border border-gray-200 bg-blue-50">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-black mb-4">Free Of</h2>
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.freeOf }}
                />
              </CardContent>
            </Card>
          )}

          {/* Allergy Info */}
          {product.allergyInfo && (
            <Card className="border border-yellow-300 bg-yellow-50">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  Allergy Information
                </h2>
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.allergyInfo }}
                />
              </CardContent>
            </Card>
          )}

          {/* Cautions */}
          {product.cautions && (
            <Card className="border border-red-300 bg-red-50">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Cautions
                </h2>
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: product.cautions.replace(/\n/g, '<br/>') 
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* FDA Disclaimer */}
          {product.fdaDisclaimer && (
            <Card className="border border-gray-300 bg-gray-100">
              <CardContent className="p-6">
                <div
                  className="text-gray-600 leading-relaxed italic text-sm"
                  dangerouslySetInnerHTML={{ __html: product.fdaDisclaimer }}
                />
              </CardContent>
            </Card>
          )}

          {/* Patents & Certifications */}
          {product.patentsAndCertifications && (
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-black mb-4">Patents & Certifications</h2>
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.patentsAndCertifications }}
                />
              </CardContent>
            </Card>
          )}

          {/* Video */}
          {product.video_url && (
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-black mb-4">Product Video</h2>
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-md bg-black">
                  <iframe
                    src={product.video_url}
                    title="Product video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Related Products */}
        {products.length > 1 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-black mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((p) => p.category_id === product.category_id && p.id !== product.id)
                .slice(0, 3)
                .map((relatedProduct) => {
                  const relatedProductSlug = generateSlug(relatedProduct.name);
                  return (
                    <Card
                      key={relatedProduct.id}
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group"
                      onClick={() => navigate(`/products/${catSlugForNav}/${relatedProductSlug}`)}
                    >
                      <CardContent className="p-0">
                        <div className="h-48 bg-gray-200 overflow-hidden">
                          <img
                            src={relatedProduct.image_url || "https://via.placeholder.com/300x200?text=No+Image"}
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-black mb-2">{relatedProduct.name}</h3>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-bold text-black">
                              {formatPrice(relatedProduct.your_price, relatedProduct.currency, relatedProduct.currency_symbol)}
                            </span>
                            {relatedProduct.availability === 'in_stock' && (
                              <Badge variant="default" className="text-xs">In Stock</Badge>
                            )}
                          </div>
                          <Button className="w-full bg-black hover:bg-gray-800 text-white">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;