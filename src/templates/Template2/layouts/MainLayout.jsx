import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';

function MainLayout() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();


  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 250) { 
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scrolling
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f7e5d9]" style={{ backgroundColor: '#f7e5d9' }}>
      <Header />
      <main 
        className="flex-grow container mx-auto px-4 sm:px-6 py-8" 
        id="main-content"
      >
        <Outlet />
      </main>
      <Footer />

      {/* Scroll to Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-400 z-50"
          style={{ backgroundColor: '#822b00', color: '#f7e5d9' }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={28} />
        </button>
      )}
    </div>
  );
}

export default MainLayout;