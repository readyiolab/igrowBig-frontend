import React from "react";

const categories = [
  { id: 1, name: "Science", image: "https://via.placeholder.com/200x150?text=Science" },
  { id: 2, name: "Mathematics", image: "https://via.placeholder.com/200x150?text=Maths" },
  { id: 3, name: "Technology", image: "https://via.placeholder.com/200x150?text=Tech" },
  { id: 4, name: "Languages", image: "https://via.placeholder.com/200x150?text=Languages" },
];

const CategoryGrid = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 my-10">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="bg-white text-black border border-gray-200 rounded-xl shadow hover:shadow-lg transition-all cursor-pointer"
        >
          <img
            src={cat.image}
            alt={cat.name}
            className="rounded-t-xl w-full h-32 object-cover"
          />
          <h3 className="text-center font-semibold py-3">{cat.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;
