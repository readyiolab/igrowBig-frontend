import React from 'react';
import { BookOpen, UserPlus, Globe, Edit, Share2, BarChart2 } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      title: "Learn About the Business",
      description: "Visit GetDreamLife.com to explore the NHTGlobal opportunity, products, and compensation plan.",
      icon: <BookOpen size={20} />
    },
    {
      title: "Join as a Distributor",
      description: "Register officially through GetDreamLife. Choose your country and preferred product package.",
      icon: <UserPlus size={20} />
    },
    {
      title: "Activate Your Website",
      description: "Subscribe to the iGrowBig system ($149/year). We'll set up your distributor website in 24 hours.",
      icon: <Globe size={20} />
    },
    {
      title: "Personalize and Publish",
      description: "Add your profile, website name/brand, and NHT distributor info, then publish your plug & play site.",
      icon: <Edit size={20} />
    },
    {
      title: "Promote and Duplicate",
      description: "Share your website link on social media, WhatsApp, Instagram, and print. Invite your team to use the system.",
      icon: <Share2 size={20} />
    },
    {
      title: "Track and Train",
      description: "Use your dashboard to track leads and access the content feed to keep learning and improving.",
      icon: <BarChart2 size={20} />
    }
  ];

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-center mb-4 text-black">
           Step-by-Step   :  From Curious to Business-Ready
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {steps.map((step, index) => (
            <div key={index} className="w-full">
              <div className="bg-gray-50 p-6 h-full shadow-sm">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="bg-black text-white p-4 rounded-full mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-medium text-black">
                    {step.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 text-center">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;