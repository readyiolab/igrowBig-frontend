import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Navigation items array
  const navItems = [
    { path: '/template1', label: 'Home' },
    { path: '/template1/products', label: 'Products' },
    { path: '/template1/opportunity', label: 'Opportunity' },
    { path: '/template1/opportunity-overview', label: 'Compensation Plan' },
    { path: '/template1/join-us', label: 'Join Us' },
    { path: '/template1/blog', label: 'Blog' },
    { path: '/template1/contact', label: 'Contact', isButton: true },
  ];

  const handleNavClick = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 py-4 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-white shadow-lg'
          : 'bg-gradient-to-b from-indigo-100 to-white'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="https://unitedstates.nhtglobal.com/wp-content/uploads/sites/55/2013/08/logo.png"
            alt="NHT Global Logo"
            className="w-28 md:w-36 h-auto object-contain"
          />
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
                      location.pathname === item.path ? 'ring-2 ring-[#be3144]' : ''
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
                        ? 'text-[#be3144]'
                        : 'text-gray-700 hover:text-[#be3144]'
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

          <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white">
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
                            ? 'text-[#be3144] underline underline-offset-4'
                            : 'text-gray-700 hover:text-[#be3144]'
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
