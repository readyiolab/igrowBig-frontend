// Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import useTenantApi from "@/hooks/useTenantApi";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { getAll } = useTenantApi();
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch site data for the logo
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAll("/site/data");
        setSiteData(response);
      } catch (err) {
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
    { path: "/contact", label: "Contact", isButton: true },
  ];

  const handleNavClick = () => setIsOpen(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get the logo URL from siteData
  const logoUrl = siteData?.settings?.site_logo_url || "./1.png";

  return (
    <header
      className={`sticky top-0 z-50 py-4 transition-all duration-300 ease-in-out ${
        isScrolled
          ? "bg-white shadow-lg"
          : "bg-gradient-to-b from-indigo-100 to-white"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-28 md:w-36 h-10 bg-gray-200 animate-pulse rounded"></div>
          ) : error ? (
            <div className="w-28 md:w-36 h-10 bg-gray-200 rounded flex items-center justify-center text-xs font-semibold">
              Logo
            </div>
          ) : (
            <img
              src={logoUrl}
              alt="Site Logo"
              className="w-28 md:w-36 h-auto object-contain"
            />
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex gap-2.5">
            {navItems.map((item) => (
              <li key={item.path}>
                {item.isButton ? (
                  <Button
                    asChild
                    className={`text-sm font-medium bg-[#be3144] hover:bg-[#a02a3b] text-white rounded-xl px-5 py-2 transition-colors duration-200 ${
                      location.pathname === item.path
                        ? "ring-2 ring-[#be3144]"
                        : ""
                    }`}
                  >
                    <Link to={item.path}>{item.label}</Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="ghost"
                    className={`text-sm font-normal transition-colors duration-200 ${
                      location.pathname === item.path
                        ? "text-[#be3144]"
                        : "text-gray-700 hover:text-[#be3144]"
                    }`}
                  >
                    <Link to={item.path}>{item.label}</Link>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-700 hover:text-indigo-500"
              onClick={() => setIsOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[300px] sm:w-[400px] bg-white"
          >
            <nav className="mt-8">
              <ul className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <li key={item.path}>
                    {item.isButton ? (
                      <Button
                        asChild
                        className="w-full bg-[#be3144] hover:bg-[#a02a3b] text-white text-base font-medium rounded-xl py-2 transition-colors duration-200"
                        onClick={handleNavClick}
                      >
                        <Link to={item.path}>{item.label}</Link>
                      </Button>
                    ) : (
                      <Button
                        asChild
                        variant="ghost"
                        className={`w-full justify-start text-base font-medium transition-colors duration-200 ${
                          location.pathname === item.path
                            ? "text-[#be3144] underline underline-offset-4"
                            : "text-gray-700 hover:text-[#be3144]"
                        }`}
                        onClick={handleNavClick}
                      >
                        <Link to={item.path}>{item.label}</Link>
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default Header;