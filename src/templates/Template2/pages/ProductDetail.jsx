import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { ArrowBigLeft } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#f7e5d9' }}>
        <div className="text-center py-12 text-xl font-semibold" style={{ color: '#822b00' }}>
          Product not found
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate(`/template2/products?category=${product.category}`);
  };

  return (
    <div className="pt-6 pb-14" style={{ backgroundColor: '#f7e5d9' }}>
      <section className="relative h-60 sm:h-72 md:h-88 lg:h-[480px] overflow-hidden rounded-xl shadow-xl mx-4 sm:mx-6 lg:mx-8">
        <img
          src={product.image || "https://via.placeholder.com/1200x400?text=Product+Banner"}
          alt={`${product.name} - NHT Global`}
          className="w-full h-full object-cover transition-transform duration-600 hover:scale-110"
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
            {product.name}
          </h1>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <button
          onClick={handleBack}
          className="flex items-center gap-3 font-semibold mb-8 rounded-lg px-4 py-2 hover:bg-[#822b00] hover:text-[#f7e5d9] transition-all duration-300 shadow-md"
          style={{ color: '#822b00' }}
        >
          <ArrowBigLeft className="w-6 h-6" />
          Back to Products
        </button>

        <div className="flex flex-col lg:flex-row gap-10 rounded-xl shadow-xl p-6 sm:p-8" style={{ backgroundColor: '#f7e5d9' }}>
          <div className="lg:w-1/2">
            <img
              src={product.image || "https://via.placeholder.com/500x500?text=Product+Image"}
              alt={`${product.name} detail`}
              className="w-full h-auto rounded-xl shadow-lg object-cover transition-transform duration-600 hover:scale-105"
            />
          </div>
          <div className="lg:w-1/2 flex flex-col justify-center">
            <h2 
              className="text-2xl sm:text-3xl font-bold mb-4"
              style={{ color: '#822b00' }}
            >
              {product.name}
            </h2>
            {product.price && (
              <p 
                className="text-xl sm:text-2xl mb-5 font-semibold"
                style={{ color: '#822b00' }}
              >
                ${product.price.toFixed(2)}
              </p>
            )}
            <p 
              className="text-base sm:text-lg mb-6 leading-relaxed"
              style={{ color: '#822b00' }}
            >
              {product.description || "This is a high-quality product designed to enhance your wellness."}
            </p>
            <div className="flex gap-4 justify-center lg:justify-start">
              <button 
                className="rounded-lg px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-400"
                style={{ backgroundColor: '#822b00', color: '#f7e5d9' }}
              >
                Buy Now
              </button>
            </div>
            <div className="mt-8">
              <h3 
                className="text-xl font-bold mb-3"
                style={{ color: '#822b00' }}
              >
                Product Details
              </h3>
              <ul className="list-disc pl-6 text-base" style={{ color: '#822b00' }}>
                <li>Category: {product.category.toUpperCase()}</li>
                <li>SKU: {product.id}</li>
                <li>Availability: In Stock</li>
              </ul>
            </div>
          </div>
        </div>

        <section className="mt-12 rounded-xl shadow-xl p-6 sm:p-8" style={{ backgroundColor: '#f7e5d9' }}>
          <h3 
            className="text-xl sm:text-2xl font-bold mb-4 text-center"
            style={{ color: '#822b00' }}
          >
            About {product.name}
          </h3>
          <p 
            className="text-base sm:text-lg leading-relaxed text-center max-w-3xl mx-auto"
            style={{ color: '#822b00' }}
          >
            Experience the power of {product.name} from NHT Global. Crafted with premium ingredients to elevate your {product.category} journey.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;