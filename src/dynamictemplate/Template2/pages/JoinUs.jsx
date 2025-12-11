import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Globe,
  ArrowRight,
  Users,
  Phone,
  ExternalLink,
  Star,
  Shield,
  ChevronRight,
  Download,
  Rocket,
  BookOpen,
  DollarSign,
} from "lucide-react";
import RegistrationStepsWithModal from "./RegistrationStepsWithModal";

const JoinUs = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Modern color palette - matching Home and Opportunity pages
  const colors = {
    primary: "#0f172a", // Deep slate
    secondary: "#8b5cf6", // Vibrant purple
    tertiary: "#06b6d4", // Cyan/teal
    accent: "#be3144", // Red accent
    light: "#f8fafc", // Off white
    lightGray: "#e2e8f0", // Light gray
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const preLaunchCountries = [
    "Australia",
    "Dubai",
    "Taiwan",
    "Vietnam",
    "New Zealand",
  ];

  const contactCountries = [
    "Thailand",
    "Brazil",
    "Africa",
    "Nigeria",
    "Mongolia",
    "Philippines",
  ];

  const benefits = [
    {
      icon: <Rocket className="h-6 sm:h-8 lg:h-10 w-6 sm:w-8 lg:w-10" />,
      description: "Immediate distributor status activation",
    },
    {
      icon: <Globe className="h-6 sm:h-8 lg:h-10 w-6 sm:w-8 lg:w-10" />,
      description: "Personal website and management tools",
    },
    {
      icon: <BookOpen className="h-6 sm:h-8 lg:h-10 w-6 sm:w-8 lg:w-10" />,
      description: "Access to comprehensive training materials",
    },
    {
      icon: <Users className="h-6 sm:h-8 lg:h-10 w-6 sm:w-8 lg:w-10" />,
      description: "Direct support from GDL team leaders",
    },
    {
      icon: <DollarSign className="h-6 sm:h-8 lg:h-10 w-6 sm:w-8 lg:w-10" />,
      description: "Global compensation plan benefits",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden pt-10"
        style={{
          background: `radial-gradient(circle, ${colors.primary}, ${colors.tertiary})`,
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6"
              style={{ background: colors.light }}
            >
              <Star className="h-4 w-4 sm:h-5 sm:w-5" />
              <span
                className="font-medium text-xs sm:text-sm"
                style={{ color: colors.primary }}
              >
                Join Thousands of Successful Distributors
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-4 sm:mb-6 text-white leading-tight">
              Become an NHT Global
              <span className="block">Independent Distributor</span>
            </h1>

            <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-white opacity-90 max-w-3xl mx-auto leading-relaxed">
              Follow our step-by-step registration process and start your journey to
              financial freedom with Get Dream Life support
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <button
                className="group bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 sm:gap-3 cursor-pointer"
                
              >
                Start Registration Now
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                className="group bg-white/10 backdrop-blur-sm border-2 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2 sm:gap-3 cursor-pointer"
                style={{ borderColor: "white" }}
              >
                Download Guide
                <Download className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Steps Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 border px-3 py-2 rounded-full mb-6"
              style={{ background: `${colors.secondary}10`, borderColor: `${colors.secondary}40` }}
            >
              <Shield className="h-5 w-5" style={{ color: colors.secondary }} />
              <span className="font-medium text-sm" style={{ color: colors.primary }}>
                Secure Registration Process
              </span>
            </div>

            <h2
              className="text-4xl md:text-5xl font-semibold mb-6"
              style={{ color: colors.primary }}
            >
              Registration Steps
            </h2>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto">
              Follow these simple steps to become an NHT Global Independent
              Distributor with Get Dream Life team support
            </p>
          </div>

          {/* Placeholder for RegistrationStepsWithModal */}
          <RegistrationStepsWithModal />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: colors.lightGray }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 border px-4 py-2 rounded-full mb-6"
              style={{ background: `${colors.tertiary}10`, borderColor: `${colors.tertiary}40` }}
            >
              <CheckCircle className="h-5 w-5" style={{ color: colors.tertiary }} />
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: colors.primary }}
              >
                Distributor Benefits
              </span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-semibold mb-6"
              style={{ color: colors.primary }}
            >
              What You Get After Registration
            </h2>
            <h3 className="text-2xl font-semibold"style={{ color: colors.primary }} >
              Unlock Your Success
            </h3>
          </div>

          <p className="text-lg mb-12 text-center max-w-4xl mx-auto text-gray-700">
            After making the payment, you will immediately become a distributor of
            NHT Global. You will receive an email with details. Log in with your
            distributor ID and password to access your back office, where you can
            check the delivery of your package/product and monitor all your growing
            business details.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between h-full"
                style={{ background: `${colors.primary}10` }}
              >
                <div
                  className="p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto"
                  style={{ background: colors.light }}
                >
                  {benefit.icon}
                </div>
                <p className="text-base text-gray-700 leading-relaxed flex-grow text-center">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Countries Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-semibold mb-6"
              style={{ color: colors.primary }}
            >
              Special Country Guidelines
            </h2>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto">
              Different procedures for countries in pre-launch phase and new markets
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pre-Launch Countries */}
            <div className="rounded-2xl p-6" style={{ background: colors.lightGray }}>
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="p-3 w-12 h-12 flex items-center justify-center rounded-full"
                  style={{ background: colors.light }}
                >
                  <Globe className="h-6 w-6" style={{ color: colors.tertiary }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: colors.primary }}>
                    Pre-Launch Countries
                  </h3>
                  <p className="text-base text-gray-700 font-medium">
                    Special Registration Process
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-2" style={{ color: colors.primary }}>
                  Countries:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {preLaunchCountries.map((country, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ background: `${colors.secondary}20`, color: colors.primary }}
                    >
                      {country}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {[
                  "Select 'Hong Kong' as country and proceed",
                  "Select 'Overseas' in 'Province for bonus checks' field",
                  "Select your actual country and follow steps B to E",
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: colors.tertiary }}
                    >
                      <span className="text-white text-xs font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-base text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Required Countries */}
            <div className="rounded-2xl p-6" style={{ background: colors.light }}>
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="p-3 rounded-full w-12 h-12 flex items-center justify-center"
                  style={{ background: colors.lightGray }}
                >
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: colors.primary }}>
                    Contact Required
                  </h3>
                  <p className="text-base text-gray-700 font-medium">
                    Personal Assistance Needed
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-2" style={{ color: colors.primary }}>
                  Countries:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {contactCountries.map((country, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm font-medium"
                     
                    >
                      {country}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl p-6" style={{ background: colors.lightGray }}>
                <p className="text-base text-gray-700 font-medium mb-4">
                  For these countries, please contact us directly for personalized
                  registration assistance.
                </p>
                <button
                  className="w-full text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 hover:opacity-90 transition cursor-pointer"
                  style={{ background: colors.primary }}
                >
                  <Phone className="h-5 w-5" />
                  Contact Us Now
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Pioneer Section */}
          <div
            className="mt-12 shadow-2xl rounded-2xl p-6 text-center"
            style={{ background: colors.lightGray }}
          >
            <h3 className="text-2xl font-semibold mb-4" style={{ color: colors.primary }}>
              Country Not Listed? Become a Pioneer!
            </h3>

            <p className="text-base text-gray-700 mb-8 max-w-3xl mx-auto">
              If your country isn't listed, there's an amazing opportunity to
              become a pioneer and open new markets with NHT Global.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="text-white bg-blue-500 px-8 py-3 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:opacity-90 transition cursor-pointer"
               
              >
                <ExternalLink className="h-5 w-5" />
                Pioneer Registration Steps
              </button>

              <button
                className="px-8 py-3 rounded-2xl font-semibold border-2 flex items-center justify-center gap-3 hover:opacity-90 transition cursor-pointer"
                style={{
                  background: colors.light,
                  borderColor: colors.lightGray,
                  color: colors.primary,
                }}
              >
                <Phone className="h-5 w-5" />
                Contact for Details
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        className="py-24 px-4 sm:px-6 lg:px-8 m-10 rounded-2xl shadow-2xl relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${colors.tertiary}, ${colors.secondary})` }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 px-4 py-2 rounded-full mb-8">
            <Rocket className="h-5 w-5 text-white" />
            <span className="text-white font-medium text-xs uppercase tracking-wide">
              Launch Your Future
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-white">
            Start Your NHT Global Journey Today
          </h2>

          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8 text-white opacity-90">
            Take the first step towards financial freedom and a global business
            opportunity. Become an NHT Global Independent Distributor or connect
            with our team for personalized guidance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center">
            <button
              className="group bg-white font-semibold py-4 px-8 rounded-2xl shadow-xl text-lg flex items-center justify-center gap-3 cursor-pointer hover:shadow-2xl transition-all"
              style={{ color: colors.primary }}
            >
              Get Started Now
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="group bg-transparent border-2 border-white text-white font-semibold py-4 px-8 rounded-2xl hover:bg-white/20 shadow-xl text-lg flex items-center justify-center gap-3 cursor-pointer transition-all">
              Contact Us
              <Phone className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JoinUs;