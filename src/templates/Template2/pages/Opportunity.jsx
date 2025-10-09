import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

function Opportunity() {
  const carouselItems = [
    { id: 1, text: 'Unleash Your Future', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop' },
    { id: 2, text: 'Seize Your Moment', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070&auto=format&fit=crop' },
    { id: 3, text: 'Grow with NHT', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7e5d9' }}>
      {/* Carousel */}
      <section aria-label="NHT Global Opportunity Highlights" className="relative w-full">
        <Carousel className="w-full">
          <CarouselContent>
            {carouselItems.map((banner) => (
              <CarouselItem key={banner.id}>
                <div className="relative h-60 sm:h-72 md:h-88 lg:h-[520px] overflow-hidden">
                  <img
                    src={banner.image}
                    alt={`${banner.text} - NHT Global Opportunity`}
                    className="w-full h-full object-cover transition-transform duration-600 hover:scale-110"
                    loading="lazy"
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-[#822b00]/70 to-transparent" 
                    style={{ background: 'linear-gradient(to right, #822b00 70%, transparent)' }}
                  />
                  <div className="absolute top-1/2 left-6 sm:left-8 lg:left-12 transform -translate-y-1/2 text-center max-w-2xl">
                    <h1 
                      className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold drop-shadow-lg"
                      style={{ color: '#f7e5d9' }}
                    >
                      {banner.text}
                    </h1>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 rounded-lg" style={{ color: '#822b00', borderColor: '#822b00' }} />
          <CarouselNext className="right-4 top-1/2 -translate-y-1/2 rounded-lg" style={{ color: '#822b00', borderColor: '#822b00' }} />
        </Carousel>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Welcome Section */}
        <section className="mb-10 sm:mb-14 text-center">
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5 tracking-wide"
            style={{ color: '#822b00' }}
          >
            Your NHT Global Opportunity Awaits
          </h2>
          <div className="w-20 h-1 bg-[#822b00] mx-auto mb-6 rounded" style={{ backgroundColor: '#822b00' }}></div>
          <p 
            className="text-base sm:text-lg max-w-3xl mx-auto leading-relaxed"
            style={{ color: '#822b00' }}
          >
            Step into a leading network marketing opportunity—pursue extra income or a transformative career with NHT Global’s support.
          </p>
        </section>

        {/* Opportunity Section */}
        <section 
          className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center rounded-xl shadow-xl p-6 sm:p-8"
          style={{ backgroundColor: '#f7e5d9' }}
        >
          <div className="lg:w-1/2 relative h-60 sm:h-72 md:h-96 lg:h-[450px] overflow-hidden rounded-xl shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop"
              alt="Open the Door of Opportunity - NHT Global"
              className="w-full h-full object-cover transition-transform duration-600 hover:scale-110"
              loading="lazy"
            />
          </div>
          <div className="lg:w-1/2 flex flex-col justify-center">
            <h2 
              className="text-2xl sm:text-3xl font-bold mb-5 text-center lg:text-left"
              style={{ color: '#822b00' }}
            >
              Unlock Endless Possibilities
            </h2>
            <ul className="space-y-4 text-base sm:text-lg" style={{ color: '#822b00' }}>
              <li className="flex items-start gap-3"><span className="font-bold">•</span> Define your own path.</li>
              <li className="flex items-start gap-3"><span className="font-bold">•</span> Craft a brighter future.</li>
              <li className="flex items-start gap-3"><span className="font-bold">•</span> Embrace a healthier lifestyle.</li>
              <li className="flex items-start gap-3"><span className="font-bold">•</span> Grow your wealth.</li>
              <li className="flex items-start gap-3"><span className="font-bold">•</span> Champion global wellness.</li>
              <li className="flex items-start gap-3 font-semibold italic"><span className="font-bold">•</span> Thrive in a top network.</li>
            </ul>
            <div className="mt-6 text-center lg:text-left">
              <Button 
                asChild 
                className="rounded-lg px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-400"
                style={{ backgroundColor: '#822b00', color: '#f7e5d9' }}
              >
                <Link to="/template2/learn-more">Explore Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Opportunity;