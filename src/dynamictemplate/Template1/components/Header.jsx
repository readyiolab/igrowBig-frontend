import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import useTenantApi from '@/hooks/useTenantApi';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { getAll } = useTenantApi(); // Hook to fetch tenant data
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch site data for the logo
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAll("/site/data");
        setSiteData(response.site_data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAll]);

  // Navigation items array without dynamic slug prefix (uses absolute paths)
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/opportunity', label: 'Opportunity' },
    { path: '/join-us', label: 'Join Us' },
    { path: '/contact', label: 'Contact' },
    { path: '/blog', label: 'Blog' },
  ];

  // Handle navigation click
  const handleNavClick = () => {
    setIsOpen(false); // Close sheet after navigation
  };

  // Get the logo URL from siteData
  const logoUrl = siteData?.tenant_setting?.site_logo_url || './1.png'; // Fallback to default logo if not available

  return (
    <header className="sticky top-0 shadow-lg py-5 bg-gradient-to-r from-[#2e7d32] to-[#388e3c] text-white z-50 transition-all duration-300">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-4 group">
          {loading ? (
            <div className="w-14 h-14 bg-white/20 animate-pulse rounded-full"></div> // Enhanced placeholder with rounded and subtle bg
          ) : error ? (
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-xs font-semibold">Logo</div> // Placeholder on error
          ) : (
            <img
              src={logoUrl}
              alt="Site Logo"
              className="w-14 h-14 rounded-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-md" // Added rounded, hover effects, shadow
            />
          )}
          <div className="hidden sm:block">
            <p className="text-sm md:text-base font-semibold tracking-wide">
              An Independent
            </p>
            <p className="text-xs md:text-sm font-light text-white/80">
              Distributor of NHT Global
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex gap-8">
            {navItems.map((item) => (
              <li key={item.path} className="relative group">
                <Button
                  asChild
                  variant="ghost"
                  className="text-base font-medium text-white hover:text-white/80 transition-colors duration-200 px-4 py-2"
                >
                  <Link to={item.path}>{item.label}</Link>
                </Button>
                {/* Hover underline effect */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
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
              className="lg:hidden text-white hover:bg-white/10 transition-colors"
              onClick={() => setIsOpen(true)}
            >
              <Menu className="h-7 w-7" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-gradient-to-b from-[#388e3c] to-[#2e7d32] text-white border-l-0">
            <div className="mt-10 px-4">
              {/* Optional: Add logo in mobile sheet */}
              <div className="flex items-center gap-3 mb-8">
                <img
                  src={logoUrl}
                  alt="Site Logo"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold">An Independent</p>
                  <p className="text-xs font-light text-white/80">Distributor of NHT Global</p>
                </div>
              </div>
              <nav>
                <ul className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <li key={item.path} className="group">
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start text-lg font-medium text-white hover:bg-white/10 transition-colors px-4 py-3 rounded-lg"
                        onClick={handleNavClick}
                      >
                        <Link to={item.path}>{item.label}</Link>
                      </Button>
                      {/* Subtle divider */}
                      <hr className="border-white/10 group-last:hidden" />
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default Header;