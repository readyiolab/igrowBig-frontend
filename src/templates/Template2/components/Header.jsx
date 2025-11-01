import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, Sparkles } from 'lucide-react';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/template2', label: 'Home' },
    { path: '/template2/products', label: 'Products' },
    { path: '/template2/opportunity', label: 'Opportunity' },
    { path: '/template2/join-us', label: 'Join Us' },
    { path: '/template2/contact', label: 'Contact' },
    { path: '/template2/blog', label: 'Blog' },
  ];

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'py-3 shadow-2xl backdrop-blur-sm' 
          : 'py-5 shadow-xl'
      }`}
      style={{ 
        background: scrolled 
          ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.98) 0%, rgba(29, 78, 216, 0.98) 100%)'
          : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      }}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/template2" className="flex items-center gap-3 group">
          <div 
            className="w-14 h-14 rounded-xl  relative overflow-hidden bg-white"
          >
            <img
              src="./1.png"
              alt="NHT Global Logo"
              className="w-full h-full rounded-xl object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-blue-200 opacity-0 group-hover:opacity-30 transition-opacity duration-400"></div>
          </div>
          <div className="hidden sm:block">
            <p className="text-base font-bold tracking-wide flex items-center gap-2 text-white">
              NHT Global Elite
              <Sparkles className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity text-yellow-300" />
            </p>
            <p className="text-xs text-blue-100">
              Your Demo Site
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex gap-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Button
                  asChild
                  variant="ghost"
                  className="text-base font-semibold px-5 py-2 rounded-xl text-white hover:bg-white hover:text-blue-600 hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                >
                  <Link to={item.path}>
                    <span className="relative z-10">{item.label}</span>
                    <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </Link>
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
              className="lg:hidden rounded-xl text-white hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              <Menu className="h-7 w-7" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="right" 
            className="w-[300px] sm:w-[400px] border-l-4 border-blue-600 bg-white"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-blue-600">
                Navigation
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="rounded-lg text-blue-600 hover:bg-blue-50"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav>
              <ul className="flex flex-col gap-3">
                {navItems.map((item, index) => (
                  <li 
                    key={item.path}
                    style={{ 
                      animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
                    }}
                  >
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start text-lg font-bold rounded-xl px-6 py-4 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:text-white hover:translate-x-2 transition-all duration-300"
                      onClick={handleNavClick}
                    >
                      <Link to={item.path}>{item.label}</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Demo Site Badge */}
            <div 
              className="mt-8 p-4 rounded-xl text-center bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-600"
            >
              <p className="text-sm font-semibold text-blue-600">
                🎨 Demo Site Preview
              </p>
              <p className="text-xs mt-1 text-blue-500">
                Customize and make it yours!
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </header>
  );
}

export default Header;