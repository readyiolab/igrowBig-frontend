import React, { useEffect, useState, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '.././components/Header';
import Footer from '.././components/Footer';
import { ArrowUp } from 'lucide-react';

function MainLayout({ children }) {  // ✅ ADD children prop
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  // Auto scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  // Log pathname changes
  useEffect(() => {
    console.log("Current path:", location.pathname);
  }, [location.pathname]);

  // Handle scroll visibility for button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Button scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Meta tags
  useEffect(() => {
    if (!document.querySelector('html').getAttribute('lang')) {
      document.querySelector('html').setAttribute('lang', 'en');
    }

    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0';
      document.head.appendChild(viewport);
    }

    if (!document.querySelector('meta[name="theme-color"]')) {
      const themeColor = document.createElement('meta');
      themeColor.name = 'theme-color';
      themeColor.content = '#ffffff';
      document.head.appendChild(themeColor);
    }

    if (!document.querySelector('meta[name="author"]')) {
      const author = document.createElement('meta');
      author.name = 'author';
      author.content = 'NHT Global';
      document.head.appendChild(author);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow" id="main-content">
       
        <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
          {children || <Outlet />}
        </Suspense>
      </main>
      <Footer />

      {/* Scroll To Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-black text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
}

export default MainLayout;