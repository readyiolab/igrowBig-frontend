import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useTenantApi from "@/hooks/useTenantApi";
import parse from "html-react-parser";

function Footer() {
  const { getAll } = useTenantApi();
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAll("/site/data");
        console.log("Footer data received:", response); // DEBUG
        setFooterData(response);
      } catch (err) {
        console.error("Footer fetch error:", err); // DEBUG
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAll]);

  if (loading) {
    return (
      <footer className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-6 md:py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              <div className="h-32 bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-700 rounded"></div>
              <div className="md:col-span-2 h-32 bg-gray-700 rounded"></div>
            </div>
            <div className="mt-6 h-10 bg-gray-700 rounded"></div>
          </div>
        </div>
      </footer>
    );
  }

  if (error) {
    return (
      <footer className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-6 md:py-8">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-red-300 text-sm">Error loading footer: {error}</p>
        </div>
      </footer>
    );
  }

  // FIXED: Handle disclaimers array properly
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

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Placeholder for subscription logic
    console.log("Subscribing email:", email);
    setEmail("");
    alert("Thank you for subscribing!");
  };

  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-6 md:py-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Navigation Links */}
          <div>
            <h3 className="text-base sm:text-lg font-medium mb-3">Quick Links</h3>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li><Link to="/products" className="hover:underline transition-colors">Products</Link></li>
              <li><Link to="/opportunity" className="hover:underline transition-colors">Global Opportunity</Link></li>
              <li><Link to="/join-us" className="hover:underline transition-colors">Join Us</Link></li>
              <li><Link to="/contact" className="hover:underline transition-colors">Contact</Link></li>
              <li><Link to="/blog" className="hover:underline transition-colors">Blog</Link></li>
              <li><Link to="/leaders" className="hover:underline transition-colors">Leaders</Link></li>
              <li><Link to="/newsletters" className="hover:underline transition-colors">Newsletters</Link></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-base sm:text-lg font-medium mb-3">Stay Updated</h3>
            <p className="text-xs sm:text-sm mb-3">Get the latest updates in your inbox.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-1.5 sm:p-2 rounded-md border border-gray-300 bg-transparent text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none"
              />
              <Button type="submit" className="bg-white text-black hover:bg-gray-200 px-3 sm:px-4 transition-colors">
                Subscribe
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base sm:text-lg font-medium mb-3">Contact Us</h3>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              {siteSettings.site_phone && (
                <li className="flex items-center gap-2">
                  <span>Phone:</span> {siteSettings.site_phone}
                </li>
              )}
              {siteSettings.site_email && (
                <li className="flex items-center gap-2">
                  <span>Email:</span> {siteSettings.site_email}
                </li>
              )}
              {siteSettings.site_address && (
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0">Address:</span> 
                  <span>{parse(siteSettings.site_address)}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Disclaimers */}
          <div className="md:col-span-1 text-xs sm:text-sm space-y-3">
            <div>
              <strong>Site Disclaimer:</strong>
              <p className="mt-1">{parse(disclaimers.site_disclaimer)}</p>
            </div>
            <div>
              <strong>Product Disclaimer:</strong>
              <p className="mt-1">{parse(disclaimers.product_disclaimer)}</p>
            </div>
            <div>
              <strong>Income Disclaimer:</strong>
              <p className="mt-1">{parse(disclaimers.income_disclaimer)}</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm border-t border-gray-700 pt-4">
          <p className="tracking-normal">Copyright ©{currentYear} {companyName}. All Rights Reserved</p>
          <p className="mt-2 flex flex-wrap justify-center items-center gap-2 sm:gap-4">
            <Link to="/income-disclaimer" className="hover:underline transition-colors">Income Disclaimer</Link>
            <span className="hidden sm:inline">|</span>
            <Link to="/privacy-policy" className="hover:underline transition-colors">Privacy Policy</Link>
            <span className="hidden sm:inline">|</span>
            <Link to="/terms-of-use" className="hover:underline transition-colors">Terms of Use</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;