// ProductDetail.jsx - FIXED WITH UNIFIED SLUG LOGIC
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Download, ShoppingCart, Heart, Share2, ArrowLeft } from "lucide-react";

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

  // UNIFIED generateSlug - Handles '&', spaces, hyphens in product names
  const generateSlug = (name) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .replace(/&/g, 'and')           // Replace '&' with 'and'
      .replace(/[^a-z0-9\s-]/g, '')   // Remove special chars except hyphen and space
      .replace(/\s+/g, '-')           // Spaces to hyphens
      .replace(/-+/g, '-')            // Collapse multiple hyphens
      .replace(/^-+|-+$/g, '')        // Trim hyphens from start/end
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

  // DEBUG LOGS (Remove in production)
  console.log('URL Category Slug:', categorySlug);
  console.log('URL Product Slug:', productSlug);
  console.log('Generated Category Slugs:', categories.map(c => ({ name: c.name, slug: generateSlug(c.name) })));
  console.log('Generated Product Slugs:', products.map(p => ({ name: p.name, slug: generateSlug(p.name), catId: p.category_id })));
  console.log('Selected Category:', selectedCat);
  console.log('Found Product:', product);

  if (!product || !selectedCat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Button variant="link" onClick={() => navigate("/")} className="p-0">
            Home
          </Button>
          <span>/</span>
          <Button variant="link" onClick={() => navigate("/products")} className="p-0">
            Products
          </Button>
          <span>/</span>
          <Button variant="link" onClick={() => navigate(`/products/${catSlugForNav}`)} className="p-0">
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
          className="flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {selectedCat.name}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg p-6">
            <img
              src={product.image_url || "https://via.placeholder.com/500x500"}
              alt={product.name}
              className="w-full h-auto max-h-[500px] object-contain"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-black mb-4">{product.name}</h1>
              {product.availability && (
                <Badge
                  variant={product.availability === "in_stock" ? "default" : "destructive"}
                  className="mb-4"
                >
                  {product.availability === "in_stock" ? "In Stock" : product.availability}
                </Badge>
              )}
            </div>

            {product.price && (
              <div>
                <p className="text-3xl font-bold text-black">₹{product.price}</p>
                {product.price_description && (
                  <p className="text-sm text-gray-600 mt-2">{product.price_description}</p>
                )}
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              {product.buy_link && (
                <a href={product.buy_link} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white text-lg py-6">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Buy Now
                  </Button>
                </a>
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
          </div>
        </div>

        {/* Product Details Sections */}
        <div className="space-y-8 mt-12">
          {/* Description */}
          {product.description && (
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-black mb-4">Description</h2>
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </CardContent>
            </Card>
          )}

          {/* Full Description */}
          {product.fullDescription && (
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-black mb-4">Full Details</h2>
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.fullDescription }}
                />
              </CardContent>
            </Card>
          )}

          {/* Key Ingredients */}
          {product.keyIngredients && (
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-black mb-4">Key Ingredients</h2>
                <div className="text-gray-700 leading-relaxed">
                  {typeof product.keyIngredients === 'string' ? (
                    <div dangerouslySetInnerHTML={{ __html: product.keyIngredients }} />
                  ) : Array.isArray(product.keyIngredients) ? (
                    <ul className="list-disc list-inside space-y-2">
                      {product.keyIngredients.map((ingredient, idx) => (
                        <li key={idx}>{ingredient}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Benefits */}
          {product.keyBenefits && (
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-black mb-4">Key Benefits</h2>
                <div className="text-gray-700 leading-relaxed">
                  {typeof product.keyBenefits === 'string' ? (
                    <div dangerouslySetInnerHTML={{ __html: product.keyBenefits }} />
                  ) : Array.isArray(product.keyBenefits) ? (
                    <ul className="list-disc list-inside space-y-2">
                      {product.keyBenefits.map((benefit, idx) => (
                        <li key={idx}>{benefit}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
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
                  dangerouslySetInnerHTML={{ __html: product.directionsForUse }}
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
                  dangerouslySetInnerHTML={{ __html: product.instructions }}
                />
              </CardContent>
            </Card>
          )}

          {/* Free Of */}
          {product.freeOf && (
            <Card className="border border-gray-200">
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
            <Card className="border border-gray-200 border-yellow-300 bg-yellow-50">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-black mb-4">Allergy Information</h2>
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.allergyInfo }}
                />
              </CardContent>
            </Card>
          )}

          {/* Cautions */}
          {product.cautions && (
            <Card className="border border-gray-200 border-red-300 bg-red-50">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-black mb-4">Cautions</h2>
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.cautions }}
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
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                  <iframe
                    src={product.video_url}
                    title="Product video"
                    className="w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Related Products */}
        {siteData?.products && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-black mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteData.products
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
                            src={relatedProduct.image_url || "https://via.placeholder.com/300x200"}
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-black mb-2">{relatedProduct.name}</h3>
                          {relatedProduct.your_price && (
                            <p className="text-lg font-bold text-black mb-4">₹{relatedProduct.your_price}</p>
                          )}
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
