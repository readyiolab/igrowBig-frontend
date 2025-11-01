import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowUp, Palette } from 'lucide-react';
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
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <Header />
      
      {/* Demo Site Badge - Floating Top Banner */}
      <div 
        className="sticky top-0 z-40 py-2 shadow-md backdrop-blur-sm"
        style={{ 
          background: 'linear-gradient(90deg, rgba(37, 99, 235, 0.95) 0%, rgba(59, 130, 246, 0.95) 100%)'
        }}
      >
        <div className="container mx-auto px-4 flex items-center justify-center gap-2">
          <Palette className="w-4 h-4 text-white" />
          <p className="text-white text-sm font-semibold">
            ✨ This is a Demo Tenant Site - Customize it to make it yours!
          </p>
        </div>
      </div>

      <main 
        className="flex-grow container mx-auto px-4 sm:px-6 py-8" 
        id="main-content"
      >
        <Outlet />
      </main>
      
      <Footer />

     

     
      <style>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default MainLayout;