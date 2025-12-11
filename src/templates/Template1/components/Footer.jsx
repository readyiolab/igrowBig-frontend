import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import parse from "html-react-parser";

function Footer() {
  const [email, setEmail] = useState("");

  const colors = {
    primary: "#d3d6db",
    secondary: "#3a4750",
    tertiary: "#303841",
    accent: "#be3144",
  };

  const disclaimers = {
    site_disclaimer:
      "This is an Independent Distributor Website and not an NHT Global website.",
    product_disclaimer:
      "Product statements are not FDA-evaluated and not intended to diagnose, treat, cure, or prevent diseases.",
    income_disclaimer:
      "Income references are indicative only. No income is guaranteed.",
  };

  const siteSettings = {
    site_name: "HealthZila",
    site_phone: "+91 12345 67890",
    site_email: "support@healthzila.com",
    site_address:
      "123 Wellness Street,<br/>New Delhi, India - 110001",
    show_leaders: true,
    show_newsletters: true,
  };

  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    setEmail("");
    alert("Thank you for subscribing!");
  };

  return (
    <footer className="text-white py-6 md:py-8"
      style={{ background: `linear-gradient(to right, ${colors.tertiary}, ${colors.secondary})` }}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-medium mb-3" style={{ color: colors.primary }}>
              Quick Links
            </h3>
            <ul className="space-y-1.5 text-sm" style={{ color: colors.primary }}>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/opportunity">Opportunity</Link></li>
              <li><Link to="/join-us">Join Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              {siteSettings.show_leaders && <li><Link to="/leaders">Leaders</Link></li>}
              {siteSettings.show_newsletters && <li><Link to="/newsletters">Newsletters</Link></li>}
            </ul>
          </div>

          {/* Newsletter Form */}
          <div>
            <h3 className="text-lg font-medium mb-3" style={{ color: colors.primary }}>
              Stay Updated
            </h3>
            <p className="text-sm mb-3" style={{ color: colors.primary }}>
              Get the latest updates in your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 rounded-md bg-transparent text-white border placeholder-gray-400"
                style={{ borderColor: colors.primary }}
              />
              <Button type="submit" className="text-white px-4"
                style={{ background: colors.accent }}>
                Subscribe
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-medium mb-3" style={{ color: colors.primary }}>
              Contact Us
            </h3>
            <ul className="space-y-1.5 text-sm" style={{ color: colors.primary }}>
              <li><strong>Phone:</strong> {siteSettings.site_phone}</li>
              <li><strong>Email:</strong> {siteSettings.site_email}</li>
              <li><strong>Address:</strong> {parse(siteSettings.site_address)}</li>
            </ul>
          </div>

          {/* Disclaimers */}
          <div className="text-sm space-y-3" style={{ color: colors.primary }}>
            <p>
              <strong style={{ color: colors.accent }}>Site Disclaimer:</strong> 
              {parse(disclaimers.site_disclaimer)}
            </p>
            <p>
              <strong style={{ color: colors.accent }}>Product Disclaimer:</strong> 
              {parse(disclaimers.product_disclaimer)}
            </p>
            <p>
              <strong style={{ color: colors.accent }}>Income Disclaimer:</strong> 
              {parse(disclaimers.income_disclaimer)}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-sm border-t pt-4"
          style={{ color: colors.primary, borderColor: colors.secondary }}>
          <p>© {currentYear} {siteSettings.site_name}. All Rights Reserved</p>
          <p className="mt-2 flex justify-center gap-4">
            <Link to="/income-disclaimer">Income Disclaimer</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-use">Terms of Use</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
