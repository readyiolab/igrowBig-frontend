import React from "react";

const SectionHeader = ({ title, subtitle, align = "center" }) => {
  return (
    <div className={`text-${align} mb-8`}>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        {title || "Section Title"}
      </h2>
      {subtitle && (
        <p className="text-gray-600 text-base max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="w-20 h-1 bg-black mx-auto mt-4 rounded"></div>
    </div>
  );
};

export default SectionHeader;
