import React, { useState } from "react";
import { AlertCircle, X, ZoomIn } from "lucide-react";

const registrationSteps = [
  {
    title: "Go to Sign Up Page",
    description: "Click on the registration link and follow the guided steps. Your sponsor will be 'Get Dream Life' (GDL Team) ensuring you get the best support from day one.",
    action: "Start Registration Process",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Select Your Country",
    description: "Choose your country from the dropdown menu. Special procedures apply for pre-launch countries and new markets. We'll guide you through country-specific requirements.",
    image: "/step_b.png",
    note: "USA shown as example - requirements may vary by country",
    color: "from-green-500 to-green-600",
  },
  {
    title: "Choose Your Package",
    description: "Select the distributorship package that aligns with your business goals and investment capacity. Each level offers different benefits and earning potential.",
    image: "/step_c.png",
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "Personal & Billing Info",
    description: "Provide accurate personal and billing information. This ensures smooth processing of your application and future transactions.",
    image: "/step_d.png",
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "Complete Payment",
    description: "Secure payment processing to activate your distributorship. Upon completion, you'll receive immediate access to your back office and distributor materials.",
    image: "/step_e.png",
    color: "from-red-500 to-red-600",
  },
];

export default function RegistrationStepsWithModal() {
  const [selectedImage, setSelectedImage] = useState(null);

  const openImageModal = (image, title) => {
    setSelectedImage({ image, title });
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8">
        {registrationSteps.map((stepData, index) => (
          <div
            key={index}
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center ${
              index % 2 === 1 ? "md:grid-flow-dense" : ""
            }`}
          >
            <div
              className={`space-y-3 sm:space-y-4 ${index % 2 === 1 ? "md:col-start-2" : ""}`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-base sm:text-xl font-bold text-white bg-gray-800 rounded-full w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center">
                  {index + 1}
                </span>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                  {stepData.title}
                </h3>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {stepData.description}
              </p>
              {stepData.note && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-2 sm:p-3 rounded-r-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm sm:text-base text-blue-800 font-medium">{stepData.note}</p>
                  </div>
                </div>
              )}
            </div>

            <div
              className={`relative ${index % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""}`}
            >
              <div
                className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() =>
                  openImageModal(
                    stepData.image,
                    `Step ${index + 1}: ${stepData.title}`
                  )
                }
              >
                <img
                  src={stepData.image}
                  alt={`Step ${index + 1}: ${stepData.title}`}
                  className="w-full h-48 sm:h-64 md:h-72 object-contain bg-white"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="relative max-w-3xl w-full">
            <button
              onClick={closeImageModal}
              className="absolute -top-8 sm:-top-10 right-0 bg-white/20 hover:bg-white/30 rounded-full p-1 sm:p-1.5 transition-colors"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </button>
            <div className="bg-white rounded-xl overflow-hidden shadow-xl">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[70vh] sm:max-h-[80vh] object-contain"
              />
              <div className="p-3 sm:p-4 bg-gray-50">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {selectedImage.title}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}