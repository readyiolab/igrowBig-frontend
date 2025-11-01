import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

function Footer() {
  return (
    <footer 
      className="py-8 md:py-10 shadow-inner relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)'
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Navigation Links */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4 tracking-wide text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-300 rounded"></span>
              Explore
            </h3>
            <ul className="space-y-2 text-sm md:text-base">
              <li>
                <Link 
                  to="/template2/products" 
                  className="text-blue-100 hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-md px-3 py-2 inline-block transform hover:translate-x-1"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/template2/opportunity" 
                  className="text-blue-100 hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-md px-3 py-2 inline-block transform hover:translate-x-1"
                >
                  Opportunity
                </Link>
              </li>
              <li>
                <Link 
                  to="/template2/join-us" 
                  className="text-blue-100 hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-md px-3 py-2 inline-block transform hover:translate-x-1"
                >
                  Join Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/template2/contact" 
                  className="text-blue-100 hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-md px-3 py-2 inline-block transform hover:translate-x-1"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/template2/blog" 
                  className="text-blue-100 hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-md px-3 py-2 inline-block transform hover:translate-x-1"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4 tracking-wide text-white flex items-center gap-2">
            
              Stay Connected
            </h3>
            <p className="text-sm md:text-base mb-4 text-blue-100">
              Subscribe for exclusive NHT Global updates.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-2 rounded-lg border-2 border-white/30 bg-white/10 text-white placeholder-blue-200 focus:ring-2 focus:ring-white focus:outline-none focus:bg-white/20 backdrop-blur-sm transition-all duration-300"
              />
              <Button
                className="rounded-lg px-4 py-2 font-semibold shadow-md hover:shadow-lg transition-all duration-300 bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 transform"
              >
                <Mail className="w-4 h-4 mr-2 inline" />
                Subscribe
              </Button>
            </form>

            {/* Social Media Links */}
            <div className="mt-6">
              <p className="text-xs text-blue-200 mb-3">Follow Us:</p>
              <div className="flex gap-3">
                <a 
                  href="#" 
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white flex items-center justify-center text-white hover:text-blue-600 transition-all duration-300 hover:scale-110 transform"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white flex items-center justify-center text-white hover:text-blue-600 transition-all duration-300 hover:scale-110 transform"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white flex items-center justify-center text-white hover:text-blue-600 transition-all duration-300 hover:scale-110 transform"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white flex items-center justify-center text-white hover:text-blue-600 transition-all duration-300 hover:scale-110 transform"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Disclaimers */}
          <div className="md:col-span-2 text-sm md:text-base space-y-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-blue-400/30 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <p className="text-blue-100">
                <strong className="text-white">📢 Site Notice:</strong> Independent Distributor site, not affiliated with NHT Global directly.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-blue-400/30 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <p className="text-blue-100">
                <strong className="text-white">⚕️ Product Advisory:</strong> Products not FDA-evaluated; not for diagnosis, treatment, or cure. Consult a professional.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-blue-400/30 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <p className="text-blue-100">
                <strong className="text-white">💰 Earnings Note:</strong> Income varies by effort and skill. No guarantees provided.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 text-center border-t border-blue-400/50 pt-5">
          <p className="text-sm md:text-base font-medium tracking-wide text-white mb-3">
            © 2025 HealthZila. All Rights Reserved
          </p>
          <p className="flex flex-wrap justify-center items-center gap-4 mb-4">
            <Link 
              to="/template2/income-disclaimer" 
              className="text-blue-100 hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-md px-3 py-1 text-sm"
            >
              Income Disclaimer
            </Link>
            <span className="text-blue-300">•</span>
            <Link 
              to="/template2/privacy-policy" 
              className="text-blue-100 hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-md px-3 py-1 text-sm"
            >
              Privacy Policy
            </Link>
            <span className="text-blue-300">•</span>
            <Link 
              to="/template2/terms" 
              className="text-blue-100 hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-md px-3 py-1 text-sm"
            >
              Terms of Service
            </Link>
          </p>
          
          
        </div>
      </div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg className="w-full h-12 opacity-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor" className="text-blue-800"></path>
        </svg>
      </div>
    </footer>
  );
}

export default Footer;