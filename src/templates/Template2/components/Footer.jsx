import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

function Footer() {
  return (
    <footer 
      className="py-8 md:py-10 bg-[#f7e5d9] text-[#822b00] shadow-inner"
      style={{ backgroundColor: '#f7e5d9' }}
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Navigation Links */}
          <div>
            <h3 
              className="text-lg md:text-xl font-bold mb-4 tracking-wide"
              style={{ color: '#822b00' }}
            >
              Explore
            </h3>
            <ul className="space-y-2 text-sm md:text-base">
              <li>
                <Link 
                  to="/template2/products" 
                  className="hover:bg-[#822b00] hover:text-[#f7e5d9] transition-all duration-300 rounded-md px-2 py-1 inline-block"
                  style={{ color: '#822b00' }}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/template2/opportunity" 
                  className="hover:bg-[#822b00] hover:text-[#f7e5d9] transition-all duration-300 rounded-md px-2 py-1 inline-block"
                  style={{ color: '#822b00' }}
                >
                  Opportunity
                </Link>
              </li>
              <li>
                <Link 
                  to="/template2/join-us" 
                  className="hover:bg-[#822b00] hover:text-[#f7e5d9] transition-all duration-300 rounded-md px-2 py-1 inline-block"
                  style={{ color: '#822b00' }}
                >
                  Join Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/template2/contact" 
                  className="hover:bg-[#822b00] hover:text-[#f7e5d9] transition-all duration-300 rounded-md px-2 py-1 inline-block"
                  style={{ color: '#822b00' }}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/template2/blog" 
                  className="hover:bg-[#822b00] hover:text-[#f7e5d9] transition-all duration-300 rounded-md px-2 py-1 inline-block"
                  style={{ color: '#822b00' }}
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 
              className="text-lg md:text-xl font-bold mb-4 tracking-wide"
              style={{ color: '#822b00' }}
            >
              Stay Connected
            </h3>
            <p 
              className="text-sm md:text-base mb-4"
              style={{ color: '#822b00' }}
            >
              Subscribe for exclusive NHT Global updates.
            </p>
            <form className="flex gap-3">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-2 rounded-lg border-2 bg-transparent text-[#822b00] placeholder-[#822b00] focus:ring-2 focus:ring-[#822b00] focus:outline-none"
                style={{ borderColor: '#822b00', color: '#822b00', opacity: 0.8 }}
              />
              <Button
                className="rounded-lg px-4 py-2 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                style={{ backgroundColor: '#822b00', color: '#f7e5d9' }}
              >
                Join
              </Button>
            </form>
          </div>

          {/* Disclaimers */}
          <div className="md:col-span-2 text-sm md:text-base space-y-4">
            <p style={{ color: '#822b00' }}>
              <strong>Site Notice:</strong> Independent Distributor site, not affiliated with NHT Global directly.
            </p>
            <p style={{ color: '#822b00' }}>
              <strong>Product Advisory:</strong> Products not FDA-evaluated; not for diagnosis, treatment, or cure. Consult a professional.
            </p>
            <p style={{ color: '#822b00' }}>
              <strong>Earnings Note:</strong> Income varies by effort and skill. No guarantees provided.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center border-t pt-5" style={{ borderColor: '#822b00' }}>
          <p 
            className="text-sm md:text-base font-medium tracking-wide"
            style={{ color: '#822b00' }}
          >
            © 2025 HealthZila. All Rights Reserved
          </p>
          <p className="mt-3 flex flex-wrap justify-center items-center gap-4">
            <Link 
              to="/template2/income-disclaimer" 
              className="hover:bg-[#822b00] hover:text-[#f7e5d9] transition-all duration-300 rounded-md px-2 py-1"
              style={{ color: '#822b00' }}
            >
              Income Disclaimer
            </Link>
            <span style={{ color: '#822b00' }}>|</span>
            <Link 
              to="/template2/privacy-policy" 
              className="hover:bg-[#822b00] hover:text-[#f7e5d9] transition-all duration-300 rounded-md px-2 py-1"
              style={{ color: '#822b00' }}
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;