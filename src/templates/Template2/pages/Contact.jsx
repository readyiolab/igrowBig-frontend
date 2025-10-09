import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, MapPin } from 'lucide-react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    message: '',
    captcha: ''
  });

  const carouselItems = [
    {
      id: 1,
      text: "Reach Out Today",
      image: "https://images.unsplash.com/photo-1557426272-fc91fdb8f385?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 2,
      text: "Your Questions, Our Priority",
      image: "https://images.unsplash.com/photo-1516321310766-16f15db3248e?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 3,
      text: "Let’s Connect",
      image: "https://images.unsplash.com/photo-1528747045269-390fe33c19f2?q=80&w=2070&auto=format&fit=crop"
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, country: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here (e.g., API call)
    setFormData({ name: '', email: '', phone: '', country: '', message: '', captcha: '' });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f7e5d9' }}>
      {/* Carousel */}
      <section aria-label="Contact Us Highlights" className="relative w-full">
        <Carousel className="w-full">
          <CarouselContent>
            {carouselItems.map((banner) => (
              <CarouselItem key={banner.id}>
                <div className="relative h-60 sm:h-72 md:h-88 lg:h-[480px] w-full overflow-hidden">
                  <img
                    src={banner.image}
                    alt={`${banner.text} - NHT Global`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    loading="lazy"
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-[#822b00]/60 to-transparent" 
                    style={{ background: 'linear-gradient(to right, #822b00 60%, transparent)' }}
                  />
                  <div className="absolute top-1/2 left-6 transform -translate-y-1/2 text-[#f7e5d9]">
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-grow">
        {/* Contact Form Section */}
        <section className="p-6 sm:p-8 mb-10 sm:mb-14 rounded-lg shadow-xl" style={{ backgroundColor: '#f7e5d9' }}>
          <h1 
            className="text-3xl sm:text-4xl font-bold text-center mb-5"
            style={{ color: '#822b00' }}
          >
            Get in Touch
          </h1>
          <p 
            className="text-base sm:text-lg text-center mb-8 max-w-3xl mx-auto"
            style={{ color: '#822b00' }}
          >
            We’re excited to connect! Share your details below.
          </p>
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2" style={{ color: '#822b00' }}>
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full rounded-lg"
                    style={{ borderColor: '#822b00', color: '#822b00' }}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: '#822b00' }}>
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email"
                    className="w-full rounded-lg"
                    style={{ borderColor: '#822b00', color: '#822b00' }}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold mb-2" style={{ color: '#822b00' }}>
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone"
                    className="w-full rounded-lg"
                    style={{ borderColor: '#822b00', color: '#822b00' }}
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="country" className="block text-sm font-semibold mb-2" style={{ color: '#822b00' }}>
                    Country
                  </label>
                  <Select
                    value={formData.country}
                    onValueChange={handleSelectChange}
                    required
                  >
                    <SelectTrigger className="w-full rounded-lg" style={{ borderColor: '#822b00', color: '#822b00' }}>
                      <SelectValue placeholder="Choose your country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usa">USA</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="uk">UK</SelectItem>
                      <SelectItem value="india">India</SelectItem>
                      {/* Add more countries as needed */}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-2" style={{ color: '#822b00' }}>
                    Your Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share your thoughts"
                    className="w-full rounded-lg"
                    rows="4"
                    style={{ borderColor: '#822b00', color: '#822b00' }}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="captcha" className="block text-sm font-semibold mb-2" style={{ color: '#822b00' }}>
                    Captcha
                  </label>
                  <Input
                    id="captcha"
                    name="captcha"
                    value={formData.captcha}
                    onChange={handleChange}
                    placeholder="Enter captcha"
                    className="w-full HLSrounded-lg"
                    style={{ borderColor: '#822b00', color: '#822b00' }}
                    required
                  />
                  <div 
                    className="mt-3 h-12 flex items-center justify-center text-sm rounded-lg shadow-md"
                    style={{ backgroundColor: '#822b00', color: '#f7e5d9' }}
                  >
                    CAPTCHA Placeholder (e.g., 7 + 2 = ?)
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                type="submit"
                className="rounded-lg px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: '#822b00', color: '#f7e5d9' }}
              >
                Submit Inquiry
              </Button>
            </div>
          </form>
        </section>

        {/* Contact Info Section */}
        <section className="flex flex-col lg:flex-row gap-8 sm:gap-10">
          {/* Left Side: Contact Details */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <h2 
              className="text-2xl sm:text-3xl font-bold mb-5"
              style={{ color: '#822b00' }}
            >
              Contact Details
            </h2>
            <ul className="space-y-4 text-base" style={{ color: '#822b00' }}>
              <li className="flex items-center gap-4">
                <span className="text-[#822b00]">📧</span>
                <span>
                  Email: <a href="mailto:support@nhtglobal.com" className="hover:bg-[#822b00] hover:text-[#f7e5d9] transition-all duration-300 rounded px-1">support@nhtglobal.com</a>
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-5 h-5" style={{ color: '#822b00' }} />
                <span>Phone: +1 (800) 555-1234</span>
              </li>
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5" style={{ color: '#822b00' }} />
                <span>Address: 123 Wellness Ave, Health City, USA</span>
              </li>
            </ul>
            <p 
              className="mt-5 text-base"
              style={{ color: '#822b00' }}
            >
              Mon-Fri, 9 AM - 6 PM (EST). Ready to support you!
            </p>
          </div>

          {/* Right Side: Image */}
          <div className="lg:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
              alt="Contact NHT Global Team"
              className="w-full h-60 sm:h-72 lg:h-88 object-cover rounded-xl shadow-xl transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contact;