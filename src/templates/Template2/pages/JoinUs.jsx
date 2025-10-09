import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

function JoinUs() {
  const carouselItems = [
    {
      id: 1,
      text: "Launch Your Path",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 2,
      text: "Build Your Future",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 3,
      text: "Be Part of NHT",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f7e5d9' }}>
      {/* Carousel */}
      <section aria-label="Join Us Highlights" className="relative w-full">
        <Carousel className="w-full">
          <CarouselContent>
            {carouselItems.map((banner) => (
              <CarouselItem key={banner.id}>
                <div className="relative h-60 sm:h-72 md:h-88 lg:h-[520px] w-full overflow-hidden">
                  <img
                    src={banner.image}
                    alt={`${banner.text} - NHT Global`}
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-grow">
        <h1 
          className="text-3xl sm:text-4xl font-bold text-center mb-6 tracking-wide"
          style={{ color: '#822b00' }}
        >
          Become a Part of NHT Global
        </h1>
        <p 
          className="text-base sm:text-lg text-center mb-8 leading-relaxed max-w-3xl mx-auto"
          style={{ color: '#822b00' }}
        >
          Take the first step toward your own business and a thriving future. We’re committed to guiding you every step of the way.
        </p>

        <div className="space-y-8 rounded-xl shadow-xl p-6 sm:p-8" style={{ backgroundColor: '#f7e5d9' }}>
          <h2 
            className="text-2xl sm:text-3xl font-bold text-center"
            style={{ color: '#822b00' }}
          >
            Your Path to Start
          </h2>
          <div className="space-y-5 text-base sm:text-lg leading-relaxed text-center" style={{ color: '#822b00' }}>
            <p>
              Hit <strong>Enroll Now</strong> to begin. Select your package from the <Link to="/template2/compensation-plan" className="font-semibold hover:bg-[#822b00] hover:text-[#f7e5d9] transition-all duration-300 rounded px-1" style={{ color: '#822b00' }}>Compensation Plan</Link> page. We’re here to assist.
            </p>
            <p>
              Once payment is complete, you’re an NHT Global distributor! Watch your email for details and access your back office to monitor growth.
            </p>
            <p>
              Country not listed? Pioneer a new market—<Link to="/template2/contact" className="font-semibold hover:bg-[#822b00] hover:text-[#f7e5d9] transition-all duration-300 rounded px-1" style={{ color: '#822b00' }}>reach out</Link> to explore.
            </p>
          </div>
          <div className="flex justify-center mt-8">
            <Button
              asChild
              className="rounded-lg px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-400"
              style={{ backgroundColor: '#822b00', color: '#f7e5d9' }}
            >
              <Link to="/template2/enrollment">Enroll Now</Link>
            </Button>
          </div>
        </div>

        <div className="mt-10 sm:mt-14 space-y-8 rounded-xl shadow-xl p-6 sm:p-8" style={{ backgroundColor: '#f7e5d9' }}>
          <h2 
            className="text-2xl sm:text-3xl font-bold text-center"
            style={{ color: '#822b00' }}
          >
            Questions or Support?
          </h2>
          <p 
            className="text-base sm:text-lg text-center max-w-3xl mx-auto"
            style={{ color: '#822b00' }}
          >
            Need assistance or curious about new markets? Connect with us to kickstart your journey with NHT Global.
          </p>
          <div className="flex justify-center mt-8">
            <Button
              asChild
              className="rounded-lg px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-400"
              style={{ backgroundColor: '#822b00', color: '#f7e5d9' }}
            >
              <Link to="/template2/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinUs;