import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, MapPin, Mail, Clock, Send, MessageCircle, ArrowRight } from 'lucide-react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    message: '',
    captcha: ''
  });

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
    setFormData({ name: '', email: '', phone: '', country: '', message: '', captcha: '' });
  };

  return (
    <div className="bg-[#d3d6db] min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden">
        <img
          src="https://plus.unsplash.com/premium_photo-1681487748082-839c7c0ee0c4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGNvbnRhY3R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600"
          alt="Contact NHT Global"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#303841]/95 via-[#3a4750]/85 to-[#303841]/90" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-4">
            Let's Connect
          </h1>
          
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-grow">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className=" p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-[#be3144] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Email Us</h3>
              <a href="mailto:support@nhtglobal.com" className="text-black  transition-colors">
                support@nhtglobal.com
              </a>
            </div>

            <div className=" p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-[#be3144] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Call Us</h3>
              <p className="text-black">+1 (800) 555-1234</p>
            </div>

            <div className=" p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-[#be3144] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Visit Us</h3>
              <p className="text-black">123 Wellness Ave<br/>Health City, USA</p>
            </div>

            <div className=" p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-[#be3144] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Business Hours</h3>
              <p className="text-black">Monday - Friday<br/>9:00 AM - 5:00 PM EST</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="w-8 h-8 text-[#be3144]" />
                <h2 className="text-3xl font-bold text-[#303841]">Send us a Message</h2>
              </div>
              <p className="text-[#3a4750] mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-[#303841] mb-2">
                      Your Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full border-2 border-[#d3d6db] focus:border-[#be3144] transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[#303841] mb-2">
                      Your Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full border-2 border-[#d3d6db] focus:border-[#be3144] transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-[#303841] mb-2">
                      Phone Number *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full border-2 border-[#d3d6db] focus:border-[#be3144] transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-sm font-semibold text-[#303841] mb-2">
                      Country *
                    </label>
                    <Select
                      value={formData.country}
                      onValueChange={handleSelectChange}
                      required
                    >
                      <SelectTrigger className="w-full border-2 border-[#d3d6db] focus:border-[#be3144]">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usa">USA</SelectItem>
                        <SelectItem value="canada">Canada</SelectItem>
                        <SelectItem value="uk">UK</SelectItem>
                        <SelectItem value="india">India</SelectItem>
                        <SelectItem value="australia">Australia</SelectItem>
                        <SelectItem value="germany">Germany</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-[#303841] mb-2">
                    Your Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    className="w-full border-2 border-[#d3d6db] focus:border-[#be3144] transition-colors min-h-32"
                    required
                  />
                </div>

               

                <Button
                  type="submit"
                  className="w-full bg-[#be3144] hover:bg-[#a02839] text-white py-6 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>

       
      </div>

      {/* CTA Section */}
      <section className="bg-[#be3144] py-16 sm:py-20 m-10 rounded-2xl shadow-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sembold text-white mb-6">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-lg sm:text-xl text-white mb-10 max-w-3xl mx-auto">
            Join thousands of satisfied customers who have transformed their lives with NHT Global. 
            Experience premium quality products and exceptional support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-white hover:bg-[#d3d6db] cursor-pointer text-black px-8 py-6 text-lg font-medium rounded-lg transition-all duration-300 hover:shadow-xl  flex items-center gap-2">
              Explore Products
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button className="bg-white hover:bg-[#d3d6db] cursor-pointer text-[#303841] px-8 py-6 text-lg font-medium rounded-lg transition-all duration-300 hover:shadow-xl ">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      
    </div>
  );
}

export default Contact;