import React from "react";

const products = [
  {
    id: 1,
    name: "Physics Mastery Course",
    price: "₹499",
    image: "https://via.placeholder.com/200x200?text=Physics",
  },
  {
    id: 2,
    name: "Maths Crash Course",
    price: "₹399",
    image: "https://via.placeholder.com/200x200?text=Maths",
  },
  {
    id: 3,
    name: "AI Fundamentals",
    price: "₹699",
    image: "https://via.placeholder.com/200x200?text=AI",
  },
  {
    id: 4,
    name: "Spoken English",
    price: "₹299",
    image: "https://via.placeholder.com/200x200?text=English",
  },
];

const ProductGrid = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 my-10">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 object-cover"
          />
          <div className="p-4 text-center">
            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
            <p className="text-gray-600">{product.price}</p>
            <button className="mt-3 px-4 py-1 bg-black text-white rounded-full text-sm hover:bg-gray-800">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
