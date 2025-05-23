import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useTenantApi from "@/hooks/useTenantApi";
import parse from "html-react-parser"; // Import html-react-parser

function Footer() {
  const { slug } = useParams();
  const { getAll } = useTenantApi();
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Footer: Fetching for slug:", slug);
        const response = await getAll(`/site/${slug}`);
        console.log("Footer: Response:", response);
        setFooterData(response.site_data);
      } catch (err) {
        console.error("Footer: Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, getAll]);

  // Fallback disclaimers in case data is not available
  const disclaimers = footerData?.footer_disclaimers?.[0] || {
    site_disclaimer: "This is an Independent Distributor Website and not an NHT Global website.",
    product_disclaimer:
      "Product statements are not FDA-evaluated and not intended to diagnose, treat, cure, or prevent diseases. Results may vary. Consult a healthcare professional before use.",
    income_disclaimer:
      "Income references are indicative only. Earnings depend on individual effort, skill, and ability. No income is guaranteed.",
  };

  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-6 md:py-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Navigation Links */}
          <div>
            <h3 className="text-base sm:text-lg font-medium mb-3">Quick Links</h3>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li><Link to="/products" className="hover:underline">Products</Link></li>
              <li><Link to="/global-opportunity" className="hover:underline">Global Opportunity</Link></li>
              <li><Link to="/join" className="hover:underline">Join Us</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
              <li><Link to="/blog" className="hover:underline">Blog</Link></li>
              <li><Link to="/leaders" className="hover:underline">Leaders</Link></li>
              <li><Link to="/newsletters" className="hover:underline">Newsletters</Link></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-base sm:text-lg font-medium mb-3">Stay Updated</h3>
            <p className="text-xs sm:text-sm mb-3">Get the latest updates in your inbox.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-1.5 sm:p-2 rounded-md border border-gray-300 bg-transparent text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none"
              />
              <Button className="bg-white text-black hover:bg-gray-200 px-3 sm:px-4">
                Subscribe
              </Button>
            </form>
          </div>

          {/* Disclaimers */}
          <div className="md:col-span-2 text-xs sm:text-sm space-y-3 prose prose-sm prose-invert">
            <p>
              <strong>Site Disclaimer:</strong> {parse(disclaimers.site_disclaimer)}
            </p>
            <p>
              <strong>Product Disclaimer:</strong> {parse(disclaimers.product_disclaimer)}
            </p>
            <p>
              <strong>Income Disclaimer:</strong> {parse(disclaimers.income_disclaimer)}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm border-t border-gray-700 pt-4">
          <p className="tracking-normal">Copyright ©2025 HealthZila. All Rights Reserved</p>
          <p className="mt-2 flex flex-wrap justify-center items-center gap-2 sm:gap-4">
            <Link to="/income-disclaimer" className="hover:underline">Income Disclaimer</Link>
            <span className="hidden sm:inline">|</span>
            <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;