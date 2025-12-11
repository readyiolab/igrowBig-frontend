import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

function Footer() {


   const colors = {
    primary: "#0f172a", // Deep slate
    secondary: "#8b5cf6", // Vibrant purple
    tertiary: "#06b6d4", // Cyan/teal
    accent: "#f59e0b", // Amber accent
    light: "#f8fafc", // Off white
    lightGray: "#e2e8f0", // Light gray
  };

  return (
    <footer 
      className="py-8 md:py-10 shadow-inner relative overflow-hidden"
  style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.tertiary})` }}
    
    >
      {/* Decorative Elements */}
      
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Navigation Links */}
          <div>
            <h3 className="text-lg md:text-xl font-medium mb-4 tracking-wide text-white flex items-center gap-2">
            
              Explore
            </h3>
            <ul className="space-y-2 text-sm md:text-base">
              <li>
                <Link 
                  to="/template2/products" 
                  className="transition-all duration-300 rounded-md inline-block transform "
                  style={{ color: '#faf5e4' }}
                  
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/template2/opportunity" 
                  className="transition-all duration-300 rounded-md  inline-block transform "
                  style={{ color: '#faf5e4' }}
                  
                >
                  Opportunity
                </Link>
              </li>
              <li>
                <Link 
                  to="/template2/join-us" 
                  className="transition-all duration-300 rounded-md  inline-block transform "
                  style={{ color: '#faf5e4' }}
                  
                >
                  Join Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/template2/contact" 
                  className="transition-all duration-300 rounded-md  inline-block transform "
                  style={{ color: '#faf5e4' }}
                  
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/template2/blog" 
                  className="transition-all duration-300 rounded-md  inline-block transform "
                  style={{ color: '#faf5e4' }}
                  
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg md:text-xl font-medium mb-4 tracking-wide text-white flex items-center gap-2">
              Stay Connected
            </h3>
            <p className="text-sm md:text-base mb-4" style={{ color: '#faf5e4' }}>
              Subscribe for exclusive NHT Global updates.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-2 rounded-lg border-2 text-white placeholder-opacity-70 focus:ring-2 focus:outline-none backdrop-blur-sm transition-all duration-300"
                
              />
              <Button
                className="rounded-lg px-4 py-2 font-semibold shadow-md hover:shadow-lg transition-all duration-300 "
                style={{ background: colors.light, color: colors.primary }}
                
              >
                <Mail className="w-4 h-4 mr-2 inline" />
                Subscribe
              </Button>
            </form>

            {/* Social Media Links */}
            <div className="mt-6">
              <p className="text-xs mb-3" style={{ color: '#faf5e4' }}>Follow Us:</p>
              <div className="flex gap-3">
                <a 
                  href="#" 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 transform"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 transform"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                 
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 transform"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 transform"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                 
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Disclaimers */}
          <div className="md:col-span-2 text-sm md:text-base space-y-4">
            <div 
              className="backdrop-blur-sm p-4 rounded-xl  transition-all duration-300 transform "
              
            >
              <p style={{ color: '#faf5e4' }}>
                <strong className="text-white font-medium"> Site Notice:</strong> Independent Distributor site, not affiliated with NHT Global directly.
              </p>
            </div>
            <div 
              className="backdrop-blur-sm p-4 rounded-xl transition-all duration-300 transform "
              
            >
              <p style={{ color: '#faf5e4' }}>
                <strong className="text-white font-medium"> Product Advisory:</strong> Products not FDA-evaluated; not for diagnosis, treatment, or cure. Consult a professional.
              </p>
            </div>
            <div 
              className="backdrop-blur-sm p-4 rounded-xl  transition-all duration-300 transform "
             
            >
              <p style={{ color: '#faf5e4' }}>
                <strong className="text-white font-medium"> Earnings Note:</strong> Income varies by effort and skill. No guarantees provided.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div 
          className="mt-8 text-center border-t pt-5"
          style={{ borderColor: 'rgba(248, 180, 0, 0.5)' }}
        >
          <p className="text-sm md:text-base font-normal tracking-wide text-white mb-3">
            © 2025 HealthZila. All Rights Reserved
          </p>
          <p className="flex flex-wrap justify-center items-center gap-4 mb-4">
            <Link 
              to="/template2/income-disclaimer" 
              className="transition-all duration-300 rounded-md px-3 py-1 text-sm"
              style={{ color: '#faf5e4' }}
              
            >
              Income Disclaimer
            </Link>
            <span style={{ color: '#f8b400' }}>•</span>
            <Link 
              to="/template2/privacy-policy" 
              className="transition-all duration-300 rounded-md px-3 py-1 text-sm"
              style={{ color: '#faf5e4' }}
              
            >
              Privacy Policy
            </Link>
            <span style={{ color: '#f8b400' }}>•</span>
            <Link 
              to="/template2/terms" 
              className="transition-all duration-300 rounded-md px-3 py-1 text-sm"
              style={{ color: '#faf5e4' }}
              
            >
              Terms of Service
            </Link>
          </p>
        </div>
      </div>

     
    </footer>
  );
}

export default Footer;