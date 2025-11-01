import React from 'react';
import { Button } from '@/components/ui/button';

const ProductCard = ({ product, onClick }) => {
  const discount = Math.round(((product.base_price - product.your_price) / product.base_price) * 100);

  return (
    <div onClick={onClick} className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
      <div className="relative aspect-square overflow-hidden">
        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {discount}% OFF
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-teal-600 font-semibold mb-1">{product.category_name}</p>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.title}</p>

        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-teal-600">${product.your_price}</span>
            {product.base_price > product.your_price && (
              <span className="text-sm text-gray-400 line-through">${product.base_price}</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Member Price: <span className="font-semibold text-teal-600">${product.preferred_customer_price}</span>
          </p>
        </div>

        <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">View Details</Button>
      </div>
    </div>
  );
};

export default ProductCard;