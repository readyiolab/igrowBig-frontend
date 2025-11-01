import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, CircleEllipsis, User, ArrowRight } from 'lucide-react';

// Editable Banner Data
const banners = [
    {
        id: 1,
        image: 'https://dev.bitwisewebsolution.in/igb/access/uploads/1/banner_412380163041569773274.jpg',
        description: 'We Are In 38 Countries, Looking For 100 More. Open New Markets With Us.',
        ctaText: 'Shop Now',
        ctaLink: '/template2/shop/omega-3',
    },
    {
        id: 2,
        image: 'https://dev.bitwisewebsolution.in/igb/access/uploads/1/banner_311196308561569773259.jpg',
        description: 'Great Support System By Industry Top Leaders Committed To Your Success.',
        ctaText: 'Shop Now',
        ctaLink: '/template2/shop/slim-shake',
    },
    {
        id: 3,
        image: 'https://dev.bitwisewebsolution.in/igb/access/uploads/1/banner_22205257861569773244.jpg',
        description: 'True Business Opportunity to Achieve True Success',
        ctaText: 'Shop Now',
        ctaLink: '/template2/shop/immune-shield',
    },
    {
        id: 4,
        image: 'https://dev.bitwisewebsolution.in/igb/access/uploads/1/banner_115024801361569773184.jpg',
        description: 'Great Products With Great Results! Scientific And Research Based Products With Patented Technologies.',
        ctaText: 'Shop Now',
        ctaLink: '/template2/shop/immune-shield',
    },
];

function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e2e8f0' }}>
      {/* Hero Carousel */}
      <section aria-label="Featured Wellness Products" className="relative w-full">
        <Carousel className="w-full">
          <CarouselContent>
            {banners.map((banner) => (
              <CarouselItem key={banner.id}>
                <div className="relative h-48 sm:h-64 md:h-80 lg:h-[500px] overflow-hidden">
                  <img
                    src={banner.image}
                    srcSet={`${banner.image} 480w, ${banner.image} 800w, ${banner.image} 1200w`}
                    sizes="(max-width: 640px) 480px, (max-width: 1024px) 800px, 1200px"
                    alt={`NHT Global - ${banner.description}`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-[#2c5282]/70 to-transparent"
                  />
                  <div className="absolute top-1/2 left-4 sm:left-6 md:left-8 lg:left-12 transform -translate-y-1/2 max-w-[90%] sm:max-w-lg md:max-w-xl lg:max-w-2xl">
                    <p 
                      className="text-xs sm:text-sm md:text-lg lg:text-xl font-semibold drop-shadow-lg mb-4 sm:mb-6"
                      style={{ color: '#e2e8f0' }}
                    >
                      {banner.description}
                    </p>
                    <Button
                      asChild
                      className="rounded-lg px-4 py-2 sm:px-6 sm:py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                      style={{ backgroundColor: '#38a169', color: '#e2e8f0' }}
                    >
                      <Link to={banner.ctaLink} className="flex items-center gap-2">
                        {banner.ctaText} <ArrowRight size={16} className="sm:h-5 sm:w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-lg" style={{ color: '#2c5282', borderColor: '#2c5282' }} />
          <CarouselNext className="right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-lg" style={{ color: '#2c5282', borderColor: '#2c5282' }} />
        </Carousel>
      </section>

      {/* Welcome Section */}
      <section
        aria-label="Welcome to NHT Global"
        className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 min-h-[50vh]"
        style={{ backgroundColor: '#e2e8f0' }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-5 tracking-wide"
            style={{ color: '#1a202c' }}
          >
            Your Journey to Wellness & Opportunity
          </h2>
          <p 
            className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-6 sm:mb-8 max-w-3xl mx-auto"
            style={{ color: '#1a202c' }}
          >
            Empowering you with health, wealth, and freedom—live better, earn smarter, and enjoy life on your terms with NHT Global.
          </p>
          <Button
            asChild
            className="rounded-lg px-4 py-2 sm:px-6 sm:py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
            style={{ backgroundColor: '#38a169', color: '#e2e8f0' }}
          >
            <Link to="/template2/join-us" className="flex items-center justify-center gap-2 sm:gap-3">
              Start Today <User size={16} className="sm:h-5 sm:w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Distributor Section */}
      <section
        aria-label="Message from John Ray"
        className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 min-h-[50vh]"
        style={{ backgroundColor: '#e2e8f0' }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-center"
            style={{ color: '#1a202c' }}
          >
            From John Ray’s Desk
          </h2>
          <div className="w-16 sm:w-20 h-1 mx-auto mb-6 sm:mb-8 rounded" style={{ backgroundColor: '#2c5282' }}></div>

          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 items-center">
            <div className="lg:w-1/2 relative h-48 sm:h-64 md:h-80 lg:h-[400px] overflow-hidden rounded-xl shadow-xl">
              <img
                src="https://plus.unsplash.com/premium_photo-1733328013343-e5ee77acaf05?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                srcSet="https://plus.unsplash.com/premium_photo-1733328013343-e5ee77acaf05?q=80&w=480&auto=format&fit=crop 480w, https://plus.unsplash.com/premium_photo-1733328013343-e5ee77acaf05?q=80&w=800&auto=format&fit=crop 800w, https://plus.unsplash.com/premium_photo-1733328013343-e5ee77acaf05?q=80&w=1932&auto=format&fit=crop 1200w"
                sizes="(max-width: 640px) 480px, (max-width: 1024px) 800px, 1200px"
                alt="Team collaborating on business opportunity"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="lg:w-1/2 flex flex-col justify-center">
              <div className="space-y-4 sm:space-y-5 text-sm sm:text-base md:text-lg" style={{ color: '#1a202c' }}>
                <p>
                  <span className="font-bold">I’m John Ray</span>, your NHT Global independent distributor. We’re a worldwide network driving better health and financial freedom.
                </p>
                <p>
                  Focus on sharing—products, opportunities—and we handle the rest: your e-commerce site, inventory, and support, all powered by NHT Global.
                </p>
              </div>
              <div className="mt-4 sm:mt-6 text-center lg:text-left">
                <p className="text-sm sm:text-base italic mb-4 sm:mb-5" style={{ color: '#1a202c' }}>
                  Ready to dive in? See what’s ahead!
                </p>
                <Button
                  asChild
                  className="rounded-lg px-4 py-2 sm:px-6 sm:py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
                  style={{ backgroundColor: '#38a169', color: '#e2e8f0' }}
                >
                  <Link to="/template2/learn-more" className="flex items-center justify-center gap-2 sm:gap-3">
                    Dive In <CircleEllipsis size={16} className="sm:h-5 sm:w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About NHT Global Section */}
      <section
        aria-label="About NHT Global"
        className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 min-h-[50vh]"
        style={{ backgroundColor: '#e2e8f0' }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-center"
            style={{ color: '#1a202c' }}
          >
            Discover NHT Global
          </h2>
          <div className="w-16 sm:w-20 h-1 mx-auto mb-6 sm:mb-8 rounded" style={{ backgroundColor: '#2c5282' }}></div>

          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-14 items-center">
            <div className="lg:w-1/2 flex flex-col justify-center">
              <ul className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 space-y-3 sm:space-y-4" style={{ color: '#1a202c' }}>
                <li className="font-semibold">• Established in 2001, a legacy of excellence.</li>
                <li className="font-semibold">• Cutting-edge e-commerce platform.</li>
                <li className="font-semibold">• Present in 38+ countries.</li>
                <li className="font-semibold">• Premium products for wellness.</li>
                <li className="font-semibold">• Holistic health focus:
                  <ul className="pl-4 sm:pl-6 space-y-2 mt-2" style={{ color: '#1a202c' }}>
                    <li>• Body & mind wellness</li>
                    <li>• Emotional balance</li>
                    <li>• Financial growth</li>
                  </ul>
                </li>
                <li className="font-semibold">• Expert training for your success.</li>
              </ul>
              <Button
                asChild
                className="rounded-lg px-4 py-2 sm:px-6 sm:py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-300 w-fit mx-auto lg:mx-0 text-sm sm:text-base"
                style={{ backgroundColor: '#38a169', color: '#e2e8f0' }}
              >
                <Link to="/template2/about" className="flex items-center justify-center gap-2 sm:gap-3">
                  Learn More <CircleEllipsis size={16} className="sm:h-5 sm:w-5" />
                </Link>
              </Button>
            </div>
            <div className="lg:w-1/2 relative h-48 sm:h-64 md:h-80 lg:h-[400px] overflow-hidden rounded-xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                srcSet="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=480&auto=format&fit=crop 480w, https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=800&auto=format&fit=crop 800w, https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=2070&auto=format&fit=crop 1200w"
                sizes="(max-width: 640px) 480px, (max-width: 1024px) 800px, 1200px"
                alt="Healthy lifestyle and wellness"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
          <div 
            className="mt-8 sm:mt-10 p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg text-center max-w-3xl sm:max-w-4xl mx-auto"
            style={{ backgroundColor: '#2c5282', color: '#e2e8f0' }}
          >
            <p className="text-sm sm:text-base md:text-lg font-semibold italic">
              NHT Global’s vision: Elevate lives with transformative products and a rewarding opportunity.
            </p>
          </div>
        </div>
      </section>

      {/* Why Network Marketing Section */}
      <section
        aria-label="Why Network Marketing"
        className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 min-h-[50vh]"
        style={{ backgroundColor: '#e2e8f0' }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-center"
            style={{ color: '#1a202c' }}
          >
            Why Choose Network Marketing?
          </h2>
          <div className="w-16 sm:w-20 h-1 mx-auto mb-6 sm:mb-8 rounded" style={{ backgroundColor: '#2c5282' }}></div>

          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-14 items-center">
            <div className="lg:w-1/2 relative h-48 sm:h-64 md:h-80 lg:h-[400px] overflow-hidden rounded-xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                srcSet="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=480 480w, https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800 800w, https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350 1200w"
                sizes="(max-width: 640px) 480px, (max-width: 1024px) 800px, 1200px"
                alt="Network marketing opportunity"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="lg:w-1/2 flex flex-col justify-center">
              <ul className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 space-y-3 sm:space-y-4" style={{ color: '#1a202c' }}>
                <li className="font-semibold">• 50+ years of proven success.</li>
                <li className="font-semibold">• $110B global industry.</li>
                <li className="font-semibold">• Spans 172+ countries.</li>
                <li className="font-semibold">• Welcomes all backgrounds.</li>
                <li className="font-semibold">• Empowers millions worldwide.</li>
                <li className="font-semibold">• High earning potential.</li>
                <li className="font-semibold">• Be your own boss.</li>
                <li className="font-semibold">• Low overhead costs.</li>
                <li className="font-semibold">• Unlimited global reach.</li>
              </ul>
              <Button
                asChild
                className="rounded-lg px-4 py-2 sm:px-6 sm:py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-300 w-fit mx-auto lg:mx-0 text-sm sm:text-base"
                style={{ backgroundColor: '#38a169', color: '#e2e8f0' }}
              >
                <Link to="/template2/network-marketing" className="flex items-center justify-center gap-2 sm:gap-3">
                  Get Started <BookOpen size={16} className="sm:h-5 sm:w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;