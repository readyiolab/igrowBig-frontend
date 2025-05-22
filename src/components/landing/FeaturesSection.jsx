import React from 'react';
import { 
  Globe, Code, Palette, Smartphone, ShoppingBag, MapPin, Settings, 
  Share2, Mail, FileText, BookOpen, Server, Users, Gift 
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      title: "No Hosting or Tech Needed",
      description: "Forget server issues. We host everything for you. Just activate your site and go live.",
      icon: <Globe size={24} />
    },
    {
      title: "No Code or Design Skills Required",
      description: "Get a professionally designed site — ready to use. No scripts. No plugins. No drag & drop needed.",
      icon: <Code size={24} />
    },
    {
      title: "Custom Branding + Your Own Domain",
      description: "Build authority with your colors, images, and .com identity — or use our beautiful subdomain.",
      icon: <Palette size={24} />
    },
    {
      title: "Mobile Responsive",
      description: "Your website works beautifully on any device — optimized for desktop, tablet, and mobile.",
      icon: <Smartphone size={24} />
    },
    {
      title: "Product Ready",
      description: "All NHTGlobal products preloaded by region. Just connect your distributor link to start earning.",
      icon: <ShoppingBag size={24} />
    },
    {
      title: "Smart Product Engine by Country",
      description: "Visitors see the right NHTGlobal products with local pricing and region-specific visibility. One site works everywhere.",
      icon: <MapPin size={24} />
    },
    {
      title: "Customize Everything",
      description: "Add/edit pages, update videos, and manage your products. Tailor your message and visuals to suit your personal brand.",
      icon: <Settings size={24} />
    },
    {
      title: "Plug-and-Play Social Connect",
      description: "Integrate Facebook, Instagram, YouTube in seconds. Let your network follow, engage, and trust you across channels.",
      icon: <Share2 size={24} />
    },
    {
      title: "Capture Leads + Autoresponders",
      description: "Built-in lead capture form with automated follow-up emails. Engage instantly or customize your own.",
      icon: <Mail size={24} />
    },
    {
      title: "Built-in Blog",
      description: "Write about your journey, showcase success stories, or educate visitors — improve your SEO and connection.",
      icon: <FileText size={24} />
    },
    {
      title: "Training Feed",
      description: "Auto-updated library of presentations, videos, and tools — to keep you and your team growing.",
      icon: <BookOpen size={24} />
    },
    {
      title: "Back Office Access",
      description: "Manage contacts, leads, blog posts, and campaigns from your personal dashboard.",
      icon: <Users size={24} />
    },
    {
      title: "99.99% Uptime & Speed",
      description: "Fast-loading pages and global access. Never miss a visitor or a prospect due to tech delays.",
      icon: <Server size={24} />
    },
    {
      title: "Special Bonus for Our Team",
      description: "Join NHTGlobal under our team and get 3 extra months free (15 months total) with onboarding help.",
      icon: <Gift size={24} />
    }
  ];

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-900 mb-6">
          More Than Just Features — It’s Your Digital Business Partner
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Designed for modern network marketers who want to move fast, stay independent, and make a global impact. iGrowBig isn’t a website builder — it’s your personal marketing engine, team trainer, and conversion booster in one.
        </p>
        
        <div className="space-y-12">
          {/* Generate pairs of features */}
          {Array.from({ length: Math.ceil(features.length / 2) }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex flex-col md:flex-row gap-8">
              {/* Left feature */}
              <div className="w-full md:w-1/2">
                <div className={`p-6 rounded-lg bg-white shadow-sm  ${rowIndex * 2 === features.length - 1 ? '' : 'border-gray-200'} h-full `}>
                  <div className="flex items-start mb-4">
                    <div className={`rounded p-2 mr-4 flex-shrink-0 ${rowIndex * 2 === features.length - 1 ? ' text-white' : 'bg-black text-white'}`}>
                      {features[rowIndex * 2].icon}
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">
                      {features[rowIndex * 2].title}
                    </h3>
                  </div>
                  <p className="text-gray-600 ml-12">
                    {features[rowIndex * 2].description}
                  </p>
                </div>
              </div>
              
              {/* Right feature */}
              {rowIndex * 2 + 1 < features.length && (
                <div className="w-full md:w-1/2">
                  <div className={`p-6 rounded-lg bg-white shadow-sm ${rowIndex * 2 + 1 === features.length - 1 ? 'bg-black' : 'border-gray-200'} h-full `}>
                    <div className="flex items-start mb-4">
                      <div className={`rounded p-2 mr-4 flex-shrink-0 ${rowIndex * 2 + 1 === features.length - 1 ? 'bg-black text-white' : 'bg-black text-white'}`}>
                        {features[rowIndex * 2 + 1].icon}
                      </div>
                      <h3 className="text-xl font-medium text-gray-900">
                        {features[rowIndex * 2 + 1].title}
                      </h3>
                    </div>
                    <p className="text-gray-600 ml-12">
                      {features[rowIndex * 2 + 1].description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;