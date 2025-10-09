import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Navigation items array with /template2 prefix
  const navItems = [
    { path: '/template2', label: 'Home' },
    { path: '/template2/products', label: 'Products' },
    { path: '/template2/opportunity', label: 'Opportunity' },
    { path: '/template2/join-us', label: 'Join Us' },
    { path: '/template2/contact', label: 'Contact' },
    { path: '/template2/blog', label: 'Blog' },
  ];

  // Handle navigation click
  const handleNavClick = () => {
    setIsOpen(false); // Close sheet after navigation
  };

  return (
    <header 
      className="py-5 bg-[#f7e5d9] shadow-xl relative z-10"
      style={{ backgroundColor: '#f7e5d9' }}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div 
            className="w-14 h-14 rounded-lg shadow-md transform hover:scale-110 transition-transform duration-400"
            style={{ backgroundColor: '#822b00' }}
          >
            <img
              src="./1.png"
              alt="NHT Global Logo"
              className="w-full h-full rounded-lg object-cover"
            />
          </div>
          <p 
            className="text-base font-bold hidden sm:block"
            style={{ color: '#822b00' }}
          >
            NHT Global Elite
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
                  className="text-base font-bold px-5 py-2 rounded-lg hover:bg-[#822b00] hover:text-[#f7e5d9] transition-all duration-300"
                  style={{ color: '#822b00' }}
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
              className="lg:hidden rounded-lg"
              style={{ color: '#822b00' }}
              onClick={() => setIsOpen(true)}
            >
              <Menu className="h-7 w-7" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="right" 
            className="w-[300px] sm:w-[400px] bg-[#f7e5d9]"
            style={{ backgroundColor: '#f7e5d9' }}
          >
            <nav className="mt-12">
              <ul className="flex flex-col gap-5">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start text-lg font-bold rounded-lg px-6 py-3 hover:bg-[#822b00] hover:text-[#f7e5d9] transition-all duration-300"
                      style={{ color: '#822b00' }}
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