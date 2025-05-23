import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import useTenantApi from '@/hooks/useTenantApi';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { slug } = useParams(); // Get the dynamic slug from the URL
  const { getAll } = useTenantApi(); // Hook to fetch tenant data
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch site data for the logo
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAll(`/site/${slug}`);
        setSiteData(response.site_data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, getAll]);

  // Navigation items array with dynamic slug prefix
  const navItems = [
    { path: `/${slug || ''}`, label: 'Home' },
    { path: `/${slug}/products`, label: 'Products' },
    { path: `/${slug}/opportunity`, label: 'Opportunity' },
    { path: `/${slug}/join-us`, label: 'Join Us' },
    { path: `/${slug}/contact`, label: 'Contact' },
    { path: `/${slug}/blog`, label: 'Blog' },
  ];

  // Handle navigation click
  const handleNavClick = () => {
    setIsOpen(false); // Close sheet after navigation
  };

  // Get the logo URL from siteData
  const logoUrl = siteData?.tenant_Setting?.[0]?.site_logo_url || './1.png'; // Fallback to default logo if not available

  return (
    <header className="sticky top-0 shadow-xl py-4 bg-[#388e3c] text-white z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div>Loading...</div> // Optional: Show a loading state
          ) : error ? (
            <div>Error loading logo</div> // Optional: Show error state
          ) : (
            <img
              src={logoUrl}
              alt="Site Logo"
              className="w-13  transition-transform duration-300 "
            />
          )}
          <p className="text-xs md:text-sm font-light hidden sm:block">
            An Independent <br /> Distributor of NHT Global
          </p>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex gap-6">
            {navItems.map((item) => (
              <li key={item.path}>
                <Button
                  asChild
                  variant="ghost"
                  className="text-sm font-medium"
                >
                  <Link to={item.path}>{item.label}</Link>
                </Button>
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
              className="lg:hidden"
              onClick={() => setIsOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="mt-8">
              <ul className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start text-base font-medium"
                      onClick={handleNavClick}
                    >
                      <Link to={item.path}>{item.label}</Link>
                    </Button>
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