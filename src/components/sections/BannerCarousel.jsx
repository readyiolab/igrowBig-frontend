import React, { useState, useEffect } from "react";

const banners = [
  {
    id: 1,
    image: "https://via.placeholder.com/1200x400?text=Banner+1",
    title: "Grow With Knowledge",
    subtitle: "Empower your learning with iGrowBig",
  },
  {
    id: 2,
    image: "https://via.placeholder.com/1200x400?text=Banner+2",
    title: "Unlock Your Potential",
    subtitle: "Learn, build, and achieve more every day",
  },
  {
    id: 3,
    image: "https://via.placeholder.com/1200x400?text=Banner+3",
    title: "Inspire. Learn. Excel.",
    subtitle: "Discover courses that make you unstoppable",
  },
];

const BannerCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-black text-white rounded-2xl">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-80 object-cover opacity-70"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-bold mb-2">{banner.title}</h2>
            <p className="text-lg">{banner.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BannerCarousel;
