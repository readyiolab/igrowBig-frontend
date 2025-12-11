import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";
import useTenantApi from "@/hooks/useTenantApi";
import parse from "html-react-parser";

function Footer() {
  const { getAll } = useTenantApi();
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");

  const colors = {
    primary: "#0f172a",
    secondary: "#8b5cf6",
    tertiary: "#06b6d4",
    accent: "#f59e0b",
    light: "#f8fafc",
    lightGray: "#e2e8f0",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAll("/site/data");
        console.log("Footer data received:", response);
        setFooterData(response);
      } catch (err) {
        console.error("Footer fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAll]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    setEmail("");
    alert("Thank you for subscribing!");
  };

  if (loading) {
    return (
      <footer
        className="py-8 md:py-10 shadow-inner relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.tertiary})` }}
      >
        <div className="container mx-auto px-6 relative z-10">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div className="h-32 bg-white bg-opacity-10 rounded-xl"></div>
              <div className="h-32 bg-white bg-opacity-10 rounded-xl"></div>
              <div className="md:col-span-2 h-32 bg-white bg-opacity-10 rounded-xl"></div>
            </div>
            <div className="mt-8 h-10 bg-white bg-opacity-10 rounded"></div>
          </div>
        </div>
      </footer>
    );
  }

  if (error) {
    return (
      <footer
        className="py-8 md:py-10 shadow-inner relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.tertiary})` }}
      >
        <div className="container mx-auto px-6 text-center">
          <p className="text-red-300 text-sm">Error loading footer: {error}</p>
        </div>
      </footer>
    );
  }

  const disclaimersArray = footerData?.disclaimers || [];
  const disclaimers = disclaimersArray.length > 0 ? disclaimersArray[0] : {
    site_disclaimer: "This is an Independent Distributor Website and not an NHT Global website.",
    product_disclaimer:
      "Product statements are not FDA-evaluated and not intended to diagnose, treat, cure, or prevent diseases. Results may vary. Consult a healthcare professional before use.",
    income_disclaimer:
      "Income references are indicative only. Earnings depend on individual effort, skill, and ability. No income is guaranteed.",
  };

  const siteSettings = footerData?.settings || {};
  const companyName = siteSettings.site_name || "HealthZila";
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="py-8 md:py-10 shadow-inner relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.tertiary})` }}
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Navigation Links */}
          <div>
            <h3 className="text-lg md:text-xl font-medium mb-4 tracking-wide text-white flex items-center gap-2">
              Explore
            </h3>
            <ul className="space-y-2 text-sm md:text-base">
              <li>
                <Link
                  to="/products"
                  className="transition-all duration-300 rounded-md inline-block transform hover:translate-x-1"
                  style={{ color: "#faf5e4" }}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/opportunity"
                  className="transition-all duration-300 rounded-md inline-block transform hover:translate-x-1"
                  style={{ color: "#faf5e4" }}
                >
                  Global Opportunity
                </Link>
              </li>
              <li>
                <Link
                  to="/join-us"
                  className="transition-all duration-300 rounded-md inline-block transform hover:translate-x-1"
                  style={{ color: "#faf5e4" }}
                >
                  Join Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="transition-all duration-300 rounded-md inline-block transform hover:translate-x-1"
                  style={{ color: "#faf5e4" }}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="transition-all duration-300 rounded-md inline-block transform hover:translate-x-1"
                  style={{ color: "#faf5e4" }}
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg md:text-xl font-medium mb-4 tracking-wide text-white flex items-center gap-2">
              Stay Connected
            </h3>
            <p className="text-sm md:text-base mb-4" style={{ color: "#faf5e4" }}>
              Get the latest updates in your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 rounded-lg border-2 border-white border-opacity-30 bg-white bg-opacity-10 text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:outline-none backdrop-blur-sm transition-all duration-300"
              />
              <Button
                type="submit"
                className="rounded-lg px-4 py-2 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                style={{ background: colors.light, color: colors.primary }}
              >
                <Mail className="w-4 h-4 mr-2 inline" />
                Subscribe
              </Button>
            </form>

            {/* Social Media Links */}
            {(siteSettings.facebook_url || siteSettings.twitter_url || 
              siteSettings.instagram_url || siteSettings.linkedin_url) && (
              <div className="mt-6">
                <p className="text-xs mb-3" style={{ color: "#faf5e4" }}>
                  Follow Us:
                </p>
                <div className="flex gap-3">
                  {siteSettings.facebook_url && (
                    <a
                      href={siteSettings.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 transform"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                      aria-label="Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {siteSettings.twitter_url && (
                    <a
                      href={siteSettings.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 transform"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                      aria-label="Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {siteSettings.instagram_url && (
                    <a
                      href={siteSettings.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 transform"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                      aria-label="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {siteSettings.linkedin_url && (
                    <a
                      href={siteSettings.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 transform"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Disclaimers */}
          <div className="md:col-span-2 text-sm md:text-base space-y-4">
            <div className="backdrop-blur-sm bg-white bg-opacity-10 p-4 rounded-xl transition-all duration-300 transform hover:bg-opacity-15">
              <p style={{ color: "#faf5e4" }}>
                <strong className="text-white font-medium">Site Notice:</strong>{" "}
                {parse(disclaimers.site_disclaimer)}
              </p>
            </div>
            <div className="backdrop-blur-sm bg-white bg-opacity-10 p-4 rounded-xl transition-all duration-300 transform hover:bg-opacity-15">
              <p style={{ color: "#faf5e4" }}>
                <strong className="text-white font-medium">Product Advisory:</strong>{" "}
                {parse(disclaimers.product_disclaimer)}
              </p>
            </div>
            <div className="backdrop-blur-sm bg-white bg-opacity-10 p-4 rounded-xl transition-all duration-300 transform hover:bg-opacity-15">
              <p style={{ color: "#faf5e4" }}>
                <strong className="text-white font-medium">Earnings Note:</strong>{" "}
                {parse(disclaimers.income_disclaimer)}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div
          className="mt-8 text-center border-t pt-5"
          style={{ borderColor: "rgba(248, 180, 0, 0.5)" }}
        >
          <p className="text-sm md:text-base font-normal tracking-wide text-white mb-3">
            © {currentYear} {companyName}. All Rights Reserved
          </p>
          <p className="flex flex-wrap justify-center items-center gap-4 mb-4">
            <Link
              to="/income-disclaimer"
              className="transition-all duration-300 rounded-md px-3 py-1 text-sm hover:bg-white hover:bg-opacity-10"
              style={{ color: "#faf5e4" }}
            >
              Income Disclaimer
            </Link>
            <span style={{ color: "#f8b400" }}>•</span>
            <Link
              to="/privacy-policy"
              className="transition-all duration-300 rounded-md px-3 py-1 text-sm hover:bg-white hover:bg-opacity-10"
              style={{ color: "#faf5e4" }}
            >
              Privacy Policy
            </Link>
            <span style={{ color: "#f8b400" }}>•</span>
            <Link
              to="/terms-of-use"
              className="transition-all duration-300 rounded-md px-3 py-1 text-sm hover:bg-white hover:bg-opacity-10"
              style={{ color: "#faf5e4" }}
            >
              Terms of Use
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;