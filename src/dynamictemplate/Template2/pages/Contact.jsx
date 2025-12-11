import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, MapPin, Mail, Clock, Send, MessageCircle, ArrowRight } from 'lucide-react';

function Contact() {
  // Modern color palette - matching Home, Opportunity, and Join Us pages
  const colors = {
    primary: "#0f172a", // Deep slate
    secondary: "#8b5cf6", // Vibrant purple
    tertiary: "#06b6d4", // Cyan/teal
    accent: "#be3144", // Red accent
    light: "#f8fafc", // Off white
    lightGray: "#e2e8f0", // Light gray
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, country: value }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', phone: '', country: '', message: '' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden pt-10"
        style={{
          background: `radial-gradient(circle, ${colors.primary}, ${colors.tertiary})`,
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight">
                Let's Connect
              </h1>

              <p className="text-lg sm:text-xl opacity-90 leading-relaxed">
                Have questions? We're here to help! Reach out to our team and we'll get back to you as soon as possible.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  style={{ background: colors.light, color: colors.primary }}
                >
                  Get In Touch
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl opacity-50 blur-2xl"></div>
              <img
                src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&h=600&fit=crop"
                alt="Contact Us"
                className="relative w-full h-[400px] object-cover rounded-2xl"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div
              className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ background: colors.light }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: colors.accent }}
              >
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: colors.primary }}>
                Email Us
              </h3>
              <a
                href="mailto:support@nhtglobal.com"
                className="transition-colors"
                style={{ color: colors.tertiary }}
              >
                support@nhtglobal.com
              </a>
            </div>

            <div
              className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ background: colors.light }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: colors.secondary }}
              >
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: colors.primary }}>
                Call Us
              </h3>
              <p className="text-gray-700">+1 (800) 555-1234</p>
            </div>

            <div
              className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ background: colors.light }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: colors.tertiary }}
              >
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: colors.primary }}>
                Visit Us
              </h3>
              <p className="text-gray-700">
                123 Wellness Ave<br />Health City, USA
              </p>
            </div>

            <div
              className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ background: colors.light }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: colors.accent }}
              >
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: colors.primary }}>
                Business Hours
              </h3>
              <p className="text-gray-700">
                Monday - Friday<br />9:00 AM - 5:00 PM EST
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="p-8 sm:p-10 rounded-2xl shadow-xl" style={{ background: colors.light }}>
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="w-8 h-8" style={{ color: colors.secondary }} />
                <h2 className="text-3xl font-semibold" style={{ color: colors.primary }}>
                  Send us a Message
                </h2>
              </div>
              <p className="text-gray-700 mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: colors.primary }}
                    >
                      Your Name *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full border-2 transition-colors"
                      style={{ borderColor: colors.lightGray }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: colors.primary }}
                    >
                      Your Email *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full border-2 transition-colors"
                      style={{ borderColor: colors.lightGray }}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: colors.primary }}
                    >
                      Phone Number *
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full border-2 transition-colors"
                      style={{ borderColor: colors.lightGray }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: colors.primary }}
                    >
                      Country *
                    </label>
                    <Select value={formData.country} onValueChange={handleSelectChange}>
                      <SelectTrigger
                        className="w-full border-2"
                        style={{ borderColor: colors.lightGray }}
                      >
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
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: colors.primary }}
                  >
                    Your Message *
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    className="w-full border-2 transition-colors min-h-32"
                    style={{ borderColor: colors.lightGray }}
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full text-white py-6 text-lg font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  style={{ background: colors.accent }}
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section
        className="py-24 px-4 sm:px-6 lg:px-8 m-10 rounded-2xl shadow-2xl relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${colors.tertiary}, ${colors.secondary})` }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-6">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-lg sm:text-xl text-white opacity-90 mb-10 max-w-3xl mx-auto">
            Join thousands of satisfied customers who have transformed their lives with NHT Global.
            Experience premium quality products and exceptional support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              className="bg-white cursor-pointer px-8 py-6 text-lg font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl flex items-center gap-2"
              style={{ color: colors.primary }}
            >
              Explore Products
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              className="bg-white/10 backdrop-blur-sm border-2 border-white cursor-pointer text-white px-8 py-6 text-lg font-semibold rounded-2xl transition-all duration-300 hover:bg-white/20"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;