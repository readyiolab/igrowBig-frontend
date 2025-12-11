import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, ChevronRight, Sparkles } from "lucide-react";
import useTenantApi from "@/hooks/useTenantApi";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { getAll } = useTenantApi();
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modern color palette
  const colors = {
    primary: "#0f172a",
    secondary: "#8b5cf6",
    tertiary: "#06b6d4",
    accent: "#f59e0b",
    light: "#f8fafc",
  };

  // Fetch site data for the logo
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAll("/site/data");
        console.log("Header data received:", response);
        setSiteData(response);
      } catch (err) {
        console.error("Header fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAll]);

  // Navigation items array
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Products" },
    { path: "/opportunity", label: "Opportunity" },
    { path: "/opportunity-overview", label: "Compensation Plan" },
    { path: "/join-us", label: "Join Us" },
    { path: "/blog", label: "Blog" },
  ];

  const handleNavClick = () => setIsOpen(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get the logo URL from siteData
  const logoUrl = siteData?.settings?.site_logo_url || "./1.png";
  const siteName = siteData?.settings?.site_name || "Site";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "py-3 bg-white/80 backdrop-blur-md shadow-md"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className={`transition-all duration-300 ${
                isScrolled ? "scale-90" : "scale-100"
              }`}
            >
              {loading ? (
                <div className="w-32 md:w-40 h-10 bg-gray-200 animate-pulse rounded"></div>
              ) : error ? (
                <div className="w-32 md:w-40 h-10 bg-gray-200 rounded flex items-center justify-center text-xs font-semibold">
                  {siteName}
                </div>
              ) : (
                <img
                  src={logoUrl}
                  alt={`${siteName} Logo`}
                  className="w-32 md:w-40 h-auto object-contain"
                />
              )}
            </div>
          </Link>

          {/* Desktop Navigation - Modern pill design */}
          <nav className="hidden lg:block">
            <ul
              className="flex gap-2 px-3 py-2 rounded-2xl transition-all duration-300"
              style={{
                background: isScrolled
                  ? colors.light
                  : "rgba(255, 255, 255, 0.9)",
                boxShadow: isScrolled
                  ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                border: `1px solid ${
                  isScrolled
                    ? "rgba(226, 232, 240, 0.8)"
                    : "rgba(255, 255, 255, 0.3)"
                }`,
                backdropFilter: "blur(10px)",
              }}
            >
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="relative px-5 py-2.5 text-sm font-medium rounded-2xl transition-all duration-300 block group"
                      style={{
                        background: isActive
                          ? `linear-gradient(135deg, ${colors.secondary}, ${colors.tertiary})`
                          : "transparent",
                        color: isActive ? "white" : colors.primary,
                      }}
                    >
                      <span className="relative z-10">{item.label}</span>
                      {!isActive && (
                        <span
                          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ background: `${colors.secondary}10` }}
                        ></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:block">
            <Button
              asChild
              className="relative px-5 py-5 text-sm font-semibold rounded-2xl transition-all duration-300 overflow-hidden group border-2"
              style={{
                background: isScrolled
                  ? `linear-gradient(135deg, ${colors.secondary}, ${colors.tertiary})`
                  : "transparent",
                borderColor: isScrolled ? "transparent" : "white",
                color: "white",
              }}
            >
              <Link to="/contact" className="flex items-center gap-2">
                <span className="relative z-10">Contact Us</span>
                <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-full"
                style={{ color: colors.primary }}
                onClick={() => setIsOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[320px] sm:w-[400px] p-0 border-0"
              style={{ background: colors.primary }}
            >
              {/* Mobile menu header */}
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Sparkles
                    className="w-5 h-5"
                    style={{ color: colors.accent }}
                  />
                  <span className="text-lg font-bold text-white">Menu</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-white hover:bg-white/10"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Mobile navigation */}
              <nav className="p-6">
                <ul className="flex flex-col gap-2">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={handleNavClick}
                          className="flex items-center justify-between px-4 py-3 text-base font-medium rounded-2xl transition-all duration-300 group"
                          style={{
                            background: isActive
                              ? `linear-gradient(135deg, ${colors.secondary}, ${colors.tertiary})`
                              : "rgba(255, 255, 255, 0.05)",
                            color: "white",
                          }}
                        >
                          <span>{item.label}</span>
                          <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {/* Mobile CTA */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <Button
                    asChild
                    className="w-full relative px-6 py-6 text-sm font-semibold rounded-2xl transition-all duration-300 overflow-hidden group border-2"
                    style={{
                      background: `linear-gradient(135deg, ${colors.secondary}, ${colors.tertiary})`,
                      borderColor: "transparent",
                      color: "white",
                    }}
                  >
                    <Link to="/contact" className="flex items-center gap-2 justify-center">
                      <span className="relative z-10">Contact Us</span>
                      <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>

                {/* Mobile menu footer */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-sm text-white/60 text-center">
                    Ready to transform your life?
                  </p>
                  <p className="text-xs text-white/40 text-center mt-2">
                    Join thousands of successful entrepreneurs
                  </p>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;