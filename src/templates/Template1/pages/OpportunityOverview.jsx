import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  DollarSign,
  Users,
  TrendingUp,
  Award,
  CheckCircle,
  Globe,
  Info,
  Play,
  Star,
  ChevronRight,
  Gift,
  Briefcase,
  Calendar,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function CompensationPlan() {
  const [activeTab, setActiveTab] = useState("retail");

  return (
    <div className="bg-gray-50">
      {/* Hero Banner */}
      <motion.section className="relative min-h-[60vh] sm:min-h-screen flex items-center justify-center overflow-hidden py-6 sm:py-12 bg-blue-950">
        <motion.div className="relative z-10 max-w-7xl mx-auto text-center px-4 sm:px-6">
          <motion.div className="inline-flex items-center gap-2 bg-white backdrop-blur-sm px-3 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-8">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-blue-950" />
            <span className="text-blue-950 font-normal text-xs sm:text-sm">
              Proven Business Model
            </span>
          </motion.div>

          <motion.h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 sm:mb-8 bg-white bg-clip-text text-transparent leading-tight">
            NHT Global <br />
            <span className="bg-white bg-clip-text text-transparent">
              Compensation Plan
            </span>
          </motion.h1>

          <motion.p className="text-sm sm:text-lg md:text-xl text-white mb-6 sm:mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            Unlock Your Earning Potential with Network Marketing
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6">
            <Button
              className="bg-white text-blue-950 font-normal py-3 sm:py-6 px-6 sm:px-10 rounded-full hover:bg-white/10 shadow-xl border-0 text-sm sm:text-lg"
              asChild
            >
              <motion.a
                href="#categories"
                className="flex items-center gap-2 sm:gap-3"
              >
                Get Started Now
                <ArrowRight className="h-3 w-3 sm:h-5 sm:w-5" />
              </motion.a>
            </Button>

            <Button
              className="bg-blue-500 backdrop-blur-lg text-white font-normal py-3 sm:py-6 px-6 sm:px-10 rounded-full hover:bg-blue-700/80 shadow-xl text-sm sm:text-lg border border-blue-400/30"
              asChild
            >
              <motion.a
                href="#learn-more"
                className="flex items-center gap-2 sm:gap-3"
              >
                Learn More
                <Play className="h-3 w-3 sm:h-5 sm:w-5" />
              </motion.a>
            </Button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Important Note Section */}
      <section className="py-8 sm:py-10 bg-white/15 border-y border-orange-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-start gap-4 bg-white/50 p-4 sm:p-6 shadow-md">
            <p className="text-gray-600 font-medium text-xs sm:text-sm leading-relaxed text-center">
              Please visit our Opportunity Overview page if you have directly
              landed on this page. Some important information provided there
              will help you better understand the NHT Global Compensation Plan
              explained below.
            </p>
          </div>
        </div>
      </section>

      {/* Updated Introduction Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 px-3 sm:px-4 py-1 sm:py-2 rounded-full mb-4 sm:mb-6">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-gray-900" />
            <span className="text-gray-900 font-semibold text-xs uppercase tracking-wide">
              Start Your Journey
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold mb-6 sm:mb-8 text-black">
            Understanding NHT Global's Compensation Plan
          </h2>

          <div className="space-y-3 sm:space-y-4 text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed text-left sm:text-center">
            <p>
              Before we start, please review the Earning Disclaimer on
              GetDreamLife and refer to NHT Global's Statement of Average Gross
              Compensation to better understand the income potential.
            </p>
            <p>
              Since you have a basic understanding of the terminology used in
              NHT Global from the Opportunity page, let's dive into its
              Compensation or Earning Plan in detail.
            </p>
            <p>
              As you start your network marketing business, it helps to know how
              much you can earn. This can also be a great way to understand how
              to leverage your individual strengths to make money (e.g., some
              people are good at building networks, others are better at
              retailing).
            </p>
            <p>
              NHT Global's Compensation Plan is an industry benchmark. The plan
              is now being adopted by new companies in this domain as a case
              study of how a company can grow fast while helping its
              distributors succeed through network marketing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-10 justify-center items-center">
            <a
              href="#"
              className="text-black font-semibold flex items-center gap-1 hover:text-gray-700 transition-colors text-sm sm:text-base"
              aria-label="View Earning Disclaimer"
            >
              View Earning Disclaimer{" "}
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </a>
            <a
              href="#"
              className="text-black font-semibold flex items-center gap-1 hover:text-gray-700 transition-colors text-sm sm:text-base"
              aria-label="Statement of Average Gross Compensation"
            >
              Statement of Average Gross Compensation
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-r from-slate-100 to-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 sm:px-4 py-1 sm:py-2 rounded-full mb-4 sm:mb-6">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-blue-950" />
              <span className="text-blue-950 font-semibold text-xs uppercase tracking-wide">
                Earning Potential
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold mb-6 sm:mb-8 text-blue-950">
              Key Features of Industry-Leading Compensation Plan
            </h2>
            <h3 className="text-xl sm:text-2xl font-semibold text-blue-950">
              Understand Your Earnings
            </h3>
          </div>

          <p className="text-sm sm:text-lg mb-8 sm:mb-12 text-center max-w-4xl mx-auto text-black">
            Maximize your earnings with NHT Global by understanding these key
            features:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: (
                  <Calendar className="h-8 w-8 text-black" aria-hidden="true" />
                ),
                title: "No Expiry of Bonus Volume (BV)",
                description:
                  "Your earned BV never expires, allowing you to redeem points whenever you choose.",
              },
              {
                icon: (
                  <DollarSign
                    className="h-8 w-8 text-black"
                    aria-hidden="true"
                  />
                ),
                title: "Cycle Bonus Weekly Potential at US$50,000",
                description:
                  "One of the highest weekly earning potentials in the industry.",
              },
              {
                icon: (
                  <TrendingUp
                    className="h-8 w-8 text-black"
                    aria-hidden="true"
                  />
                ),
                title: "Unlimited Depth Income",
                description:
                  "Our Infinite Binary Plan allows you to earn from unlimited levels in your organization.",
              },
              {
                icon: (
                  <Gift className="h-8 w-8 text-black" aria-hidden="true" />
                ),
                title: "No Monthly Targets or Minimum Purchase*",
                description:
                  "Grow your business at your own pace without pressure to meet monthly quotas.",
              },
              {
                icon: (
                  <Briefcase
                    className="h-8 w-8 text-black"
                    aria-hidden="true"
                  />
                ),
                title: "Highest Commission from Day 1",
                description:
                  "No waiting period or level-based commission plan - earn top rates immediately.",
              },
              {
                icon: (
                  <Star className="h-8 w-8 text-black" aria-hidden="true" />
                ),
                title: "True Financial Potential",
                description:
                  "Unmatched compensation plan designed for maximum earning opportunities.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-gray-50 to-gray-100
 rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
              >
                <div className="p-2 sm:p-3 bg-blue-50 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-black mb-4 sm:mb-6 text-center">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed flex-grow text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 sm:px-4 py-1 sm:py-2 rounded-full mb-4 sm:mb-6">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-blue-950" />
              <span className="text-blue-950 font-semibold text-xs uppercase tracking-wide">
                Earning Potential
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold mb-6 sm:mb-8 text-blue-950">
              Highlights of NHT Global Compensation Plan
            </h2>
            <h3 className="text-xl sm:text-2xl font-semibold text-blue-950">
              Key Advantages
            </h3>
          </div>

          <p className="text-sm sm:text-lg mb-8 sm:mb-12 text-center max-w-4xl mx-auto text-black">
            Discover the standout benefits of the NHT Global compensation plan
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1554224155-cfa08c2a758f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fENvbXBlbnNhdGlvbiUyMFBsYW58ZW58MHx8MHx8fDA%3D"
                alt="NHT Global Compensation Plan"
                className="shadow-md object-cover w-full max-w-sm sm:max-w-md h-auto"
              />
            </div>

            <div className="flex flex-col">
              <ul className="list-disc list-outside space-y-3 sm:space-y-4 text-sm sm:text-base text-black leading-relaxed pl-6">
                {[
                  "NHT Global compensation plan allows you to earn a maximum of US$50,000 per week.",
                  "NHT Global has helped over a dozen individuals become big earners in the last year alone.",
                  "NHT Global allows you to earn 20% on your weak leg (details on weak & strong leg below), while other companies allow a maximum of 10%.",
                  "NHT Global does not set weekly or monthly targets*, so you can grow your business at your own pace. No pressure, you are your own boss.",
                  "NHT Global does not take back or expire any unclaimed points (called Business Volume or BV) in your sales, you can redeem your BVs whenever you want. In most companies, you lose your BVs if not claimed or if you do not hit your targets.",
                ].map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-start marker:text-gray-700"
                  >
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Four Ways to Earn Section with Detailed Earning Types */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 bg-gradient-to-r from-slate-100 to-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6">
              <DollarSign className="h-4 w-4 text-black" />
              <span className="text-black font-semibold text-xs uppercase tracking-wide">
                Earnings
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-3 sm:mb-6 text-black  flex items-center justify-center gap-5">
              4 Ways to Earn with{" "}
              <span>
                <img
                  src="./nht-logo.png"
                  alt="NHT Global Logo"
                  className="h-16 w-auto"
                />
              </span>
            </h2>
            <h3 className="text-lg sm:text-xl font-medium text-black">
              Multiple Income Streams
            </h3>
          </div>

          <p className="text-base sm:text-lg mb-8 sm:mb-12 text-center max-w-4xl mx-auto text-black">
            Unlock multiple ways to earn with NHT Global through our
            comprehensive compensation plan
          </p>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-4 gap-2 mb-8 bg-blue-50 p-2 sm:p-4 ">
              <TabsTrigger
                value="retail"
                className="py-2 px-4 rounded-lg bg-white text-blue-950 font-semibold hover:bg-blue-100 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-950 transition-colors duration-200"
              >
                Retail Profits
              </TabsTrigger>
              <TabsTrigger
                value="direct"
                className="py-2 px-4 rounded-lg bg-white text-blue-950 font-semibold hover:bg-blue-100 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-950 transition-colors duration-200"
              >
                Direct Sales
              </TabsTrigger>
              <TabsTrigger
                value="cycle"
                className="py-2 px-4 rounded-lg bg-white text-blue-950 font-semibold hover:bg-blue-100 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-950 transition-colors duration-200"
              >
                Cycle Bonus
              </TabsTrigger>
              <TabsTrigger
                value="matching"
                className="py-2 px-4 rounded-lg bg-white text-blue-950 font-semibold hover:bg-blue-100 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-950 transition-colors duration-200"
              >
                Matching Bonus
              </TabsTrigger>
            </TabsList>

            {/* Earning Type 1: Retail Profits/Income */}
            <TabsContent value="retail">
              <div className="bg-gradient-to-r from-blue-200 to-blue-100 rounded-xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <DollarSign
                    className="h-10 w-10 text-blue-950"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-black mb-6 text-center">
                  Retail Profits: Your Gateway to Immediate Earnings
                </h3>
                <p className="text-base text-gray-700 mb-6 sm:mb-8 leading-relaxed text-center">
                  As an NHT Global Distributor, you can generate immediate
                  income by purchasing products at wholesale prices and selling
                  them at retail, pocketing the difference as profit. With your
                  personalized e-commerce platform, you can expand your reach
                  and sell NHT Global’s premium products worldwide, tapping into
                  a global market from the comfort of your home.
                </p>
                <p className="text-base text-gray-700 mb-6 sm:mb-8 leading-relaxed text-center">
                  Retail Profits offer one of the fastest ways to start earning
                  with NHT Global. Whether through direct sales or your
                  e-commerce site, you can build a steady income stream without
                  needing extensive marketing experience. NHT Global provides
                  the tools and support to help you succeed.
                </p>
                <Accordion type="single" collapsible className="text-gray-700">
                  <AccordionItem value="overview">
                    <AccordionTrigger className="text-base sm:text-lg font-semibold text-black hover:text-blue-950">
                      Overview
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed">
                      Retail Profits work on a simple principle: buy products at
                      a wholesale price and sell them at a retail price, keeping
                      the difference as your profit. This model, similar to a
                      retail store, allows you to earn directly from each sale.
                      With NHT Global, you can sell through personal
                      interactions, product demonstrations, or your own
                      e-commerce website, making it accessible and flexible for
                      anyone to start earning immediately.
                      <br />
                      <br />
                      <strong>Profit = Retail Price – Wholesale Price</strong>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="profit-margins">
                    <AccordionTrigger className="text-base sm:text-lg font-semibold text-black hover:text-blue-950">
                      Profit Margins by Membership Level
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed">
                      Your profit margin depends on your Membership Rank (Gold,
                      Silver, or Bronze), which determines the discount you
                      receive on wholesale purchases:
                      <div className="overflow-x-auto mt-4 sm:mt-6">
                        <table
                          className="w-full text-left border-collapse text-sm sm:text-base"
                          aria-label="Retail Profit Margins Table"
                        >
                          <thead>
                            <tr className="bg-blue-50">
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold min-w-[120px]">
                                Membership Level
                              </th>
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold min-w-[120px]">
                                Profit Margin (Discount %)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="hover:bg-blue-50">
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                Gold
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                34%
                              </td>
                            </tr>
                            <tr className="hover:bg-blue-50">
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                Silver
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                11%
                              </td>
                            </tr>
                            <tr className="hover:bg-blue-50">
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                Bronze
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                3%
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="mt-4 sm:mt-6">
                        <strong>Example:</strong> As a Gold member, you purchase
                        a product at a 34% discount off the retail price of US
                        $100, paying US $66. Selling it at retail earns you a US
                        $34 profit per sale. Higher ranks mean higher margins,
                        maximizing your earnings.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="how-to-sell">
                    <AccordionTrigger className="text-base sm:text-lg font-semibold text-black hover:text-blue-950">
                      How to Sell
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed">
                      NHT Global equips you with multiple ways to sell products
                      and generate Retail Profits, even if you’re new to sales.
                      Our experienced leaders provide training to help you
                      succeed, including:
                      <ul className="list-disc pl-6 mt-4 space-y-2">
                        <li>
                          <strong>Product Demonstrations:</strong> Showcase NHT
                          Global’s premium products through in-person or virtual
                          demos to attract customers.
                        </li>
                        <li>
                          <strong>Personal Networks:</strong> Share products
                          with friends, family, and contacts to build a loyal
                          customer base.
                        </li>
                        <li>
                          <strong>Social Media Marketing:</strong> Leverage
                          platforms to promote products and drive sales through
                          engaging content.
                        </li>
                        <li>
                          <strong>E-Commerce Platform:</strong> Use your
                          personalized NHT Global website to sell products
                          globally with ease.
                        </li>
                      </ul>
                      <p className="mt-4 sm:mt-6">
                        Many distributors earn substantial monthly income
                        through retail sales alone, making it one of the fastest
                        ways to start generating revenue with NHT Global.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="ecommerce">
                    <AccordionTrigger className="text-base sm:text-lg font-semibold text-black hover:text-blue-950">
                      E-Commerce Features
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed">
                      NHT Global’s e-commerce platform empowers you to run a
                      global retail business from anywhere, with features
                      designed for simplicity and scalability:
                      <ul className="list-disc pl-6 mt-4 space-y-2">
                        <li>
                          <strong>Personalized E-Commerce Website:</strong> Sell
                          NHT Global products online to customers worldwide,
                          with a professional site tailored to your business.
                        </li>
                        <li>
                          <strong>Global Reach:</strong> Available in 18
                          languages, your e-commerce site allows sales in
                          countries where NHT Global operates, even if you don’t
                          speak the local language.
                        </li>
                        <li>
                          <strong>Streamlined Operations:</strong> NHT Global
                          handles ordering, billing, and shipping, so you don’t
                          need to manage inventory, logistics, or employees.
                        </li>
                        <li>
                          <strong>24/7 Accessibility:</strong> Your online store
                          is open around the clock, generating sales while you
                          focus on other aspects of your business or personal
                          life.
                        </li>
                      </ul>
                      <p className="mt-4 sm:mt-6">
                        With these tools, you can build a thriving retail
                        business from the comfort of your home, reaching
                        customers across the globe and earning profits at your
                        own pace.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="why-it-matters">
                    <AccordionTrigger className="text-base sm:text-lg font-semibold text-black hover:text-blue-950">
                      Why It Matters
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed">
                      Retail Profits provide an accessible entry point to
                      earning with NHT Global, requiring no prior experience.
                      Combined with Direct Sales Commissions, Cycle Bonuses, and
                      Matching Bonuses, retail sales create a diversified income
                      stream that can grow into a substantial business. Whether
                      you’re selling locally or globally through your e-commerce
                      site, Retail Profits offer flexibility and immediate
                      rewards.
                      <br />
                      <br />
                      Contact us via the{" "}
                      <a
                        href="/contact"
                        className="text-blue-950 hover:text-blue-700 underline"
                      >
                        Contact Page
                      </a>{" "}
                      to learn how to maximize your Retail Profits or to get
                      personalized guidance on starting your NHT Global journey.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <p className="text-base text-gray-700 mt-6 sm:mt-8 leading-relaxed text-center">
                  Retail Profits are your foundation for building a successful
                  NHT Global business. With high-quality products, a global
                  e-commerce platform, and comprehensive support, you can start
                  earning immediately and scale your income to achieve financial
                  freedom.
                </p>
              </div>
            </TabsContent>

            {/* Earning Type 2: Direct Sales Commission & Team Bonus */}
            <TabsContent value="direct">
              <div className="bg-gradient-to-r from-blue-200 to-blue-100 rounded-xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Users
                    className="h-10 w-10 text-blue-950"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-black mb-6 text-center">
                  Direct Sales Commission & Team Bonus
                </h3>
                <p className="text-base text-gray-700 mb-6 sm:mb-8 leading-relaxed text-center">
                  Unlock the full potential of your network with NHT Global’s
                  Direct Sales Commission and Team Bonus structure. Earn
                  generous commissions on the Bonus Volume (BV) generated by
                  your personally sponsored distributors, extending up to three
                  levels deep in your Generation Tree. Build a dynamic team,
                  foster their success, and secure lifetime commissions on their
                  purchases for a sustainable income stream.
                </p>
                <p className="text-base text-gray-700 mb-6 sm:mb-8 leading-relaxed text-center">
                  At NHT Global, your network is your greatest asset. You’re not
                  alone—you’re building a team that grows together. Through our
                  Binary Plan, you create two teams (Left and Right Sales Teams)
                  and earn a percentage of their purchases based on your
                  Membership Rank (Gold, Silver, or Bronze). The higher your
                  rank, the greater your rewards.
                </p>
                <img
                  src="spon-member1.png"
                  alt="Binary Team Structure Illustration"
                  className="w-full max-w-xs sm:max-w-sm md:max-w-lg mx-auto mb-6 sm:mb-8 rounded-lg shadow-md"
                  aria-label="Illustration of NHT Global Binary Team Structure"
                />
                <Accordion type="single" collapsible className="text-gray-700">
                  <AccordionItem value="overview">
                    <AccordionTrigger className="text-base sm:text-lg font-semibold text-black hover:text-blue-950">
                      Overview
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed">
                      The Direct Sales Commission and Team Bonus system rewards
                      you for recruiting, mentoring, and growing a thriving
                      network. You earn commissions on the Bonus Volume (BV)
                      from product purchases made by your personally sponsored
                      distributors (Level 1), their sponsored distributors
                      (Level 2), and their sponsored distributors (Level 3).
                      This multi-level structure creates a powerful income
                      stream tied to your team’s sales performance.
                      <br />
                      <br />
                      Your commission percentage is determined by your
                      Membership Rank—Gold, Silver, or Bronze—with Gold members
                      enjoying the highest rates. This incentivizes both
                      team-building and advancing your rank to maximize
                      earnings.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="commission-structure">
                    <AccordionTrigger className="text-base sm:text-lg font-semibold text-black hover:text-blue-950">
                      Commission Structure
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed">
                      The table below details the commission percentages you
                      earn based on your Membership Rank and the sponsor level
                      of your team members:
                      <div className="overflow-x-auto mt-4 sm:mt-6">
                        <table
                          className="w-full text-left border-collapse text-sm sm:text-base"
                          aria-label="Commission Structure Table"
                        >
                          <thead>
                            <tr className="bg-blue-50">
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold">
                                Team Member Sponsor Level
                              </th>
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold">
                                Gold
                              </th>
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold">
                                Silver
                              </th>
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold">
                                Bronze
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="hover:bg-blue-50">
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                Level 1 (Blue)
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                10%
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                5%
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                3%
                              </td>
                            </tr>
                            <tr className="hover:bg-blue-50">
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                Level 2 (Green)
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                5%
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                3%
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                -
                              </td>
                            </tr>
                            <tr className="hover:bg-blue-50">
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                Level 3 (Orange)
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                3%
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                -
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                -
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="mt-4 sm:mt-6">
                        <strong>Example:</strong> As a Gold member, if your
                        Level 1 distributor (Jane) generates 10,000 BV, you earn
                        10% (1,000 BV). If Jane’s sponsored distributor (Level
                        2, Susan) generates 5,000 BV, you earn 5% (250 BV). If
                        Susan’s sponsored distributor (Level 3, Chris) generates
                        3,000 BV, you earn 3% (90 BV). These commissions apply
                        to lifetime purchases, ensuring a consistent and
                        scalable income.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="binary-plan">
                    <AccordionTrigger className="text-base sm:text-lg font-semibold text-black hover:text-blue-950">
                      Understanding the Binary Plan
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed">
                      NHT Global’s Binary Plan empowers you to build two dynamic
                      teams: a Left Sales Team and a Right Sales Team. You can
                      directly sponsor distributors into either team, making
                      them your Level 1 members (Blue). Those sponsored by your
                      Level 1 members become your Level 2 members (Green), and
                      those sponsored by Level 2 members become your Level 3
                      members (Orange).
                      <br />
                      <br />
                      <strong>Visual Example:</strong>
                      <ul className="list-disc pl-6 mt-4 space-y-2">
                        <li>
                          <strong>You</strong> sponsor Jane and John (Level 1,
                          Blue).
                        </li>
                        <li>
                          <strong>Jane</strong> sponsors Susan and Lee (your
                          Level 2, Green).
                        </li>
                        <li>
                          <strong>Susan</strong> sponsors Chris (your Level 3,
                          Orange).
                        </li>
                        <li>
                          <strong>You</strong> also sponsor Mike and Ravi (Level
                          1, Blue).
                        </li>
                        <li>
                          <strong>John</strong> sponsors Derek and Ali (your
                          Level 3, Orange).
                        </li>
                      </ul>
                      <p className="mt-4 sm:mt-6">
                        This structure allows you to earn commissions on
                        purchases up to three levels deep, with the highest
                        commissions from your directly sponsored Level 1
                        distributors. The Binary Plan encourages balanced growth
                        across both teams for maximum earning potential.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="how-to-earn">
                    <AccordionTrigger className="text-base sm:text-lg font-semibold text-black hover:text-blue-950">
                      How to Maximize Earnings
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed">
                      To optimize your Direct Sales Commissions and Team
                      Bonuses:
                      <ul className="list-disc pl-6 mt-4 space-y-2">
                        <li>
                          <strong>Recruit Strategically:</strong> Bring in
                          motivated individuals passionate about building their
                          own businesses and contributing to team success.
                        </li>
                        <li>
                          <strong>Mentor Your Team:</strong> Provide training,
                          support, and resources to empower your distributors,
                          as their success directly boosts your commissions.
                        </li>
                        <li>
                          <strong>Achieve Gold Rank:</strong> Unlock the highest
                          commission rates (10%, 5%, 3%) across all three levels
                          by reaching Gold membership.
                        </li>
                        <li>
                          <strong>Drive Product Sales:</strong> Encourage
                          consistent product purchases within your team to
                          increase Bonus Volume and your earnings.
                        </li>
                        <li>
                          <strong>Leverage NHT Global Tools:</strong> Utilize
                          NHT Global’s training programs, marketing resources,
                          and community support to accelerate your team’s
                          growth.
                        </li>
                      </ul>
                      <p className="mt-4 sm:mt-6">
                        By focusing on recruitment, mentorship, and rank
                        advancement, you can build a robust network that
                        generates substantial, long-term commissions.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <p className="text-base text-gray-700 mt-6 sm:mt-8 leading-relaxed text-center">
                  This is just the beginning of your earning potential with NHT
                  Global. Beyond Direct Sales Commissions, you can generate
                  substantial income through Retail Income by selling our
                  premium products directly to customers. Explore additional
                  earning opportunities to fully harness the power of NHT
                  Global’s compensation plan and take your business to new
                  heights.
                </p>
              </div>
            </TabsContent>

            {/* Earning Type 3: Cycle Bonus (The Two-Team Infinity Compensation System) */}
            <TabsContent value="cycle">
              <div className="bg-gradient-to-r from-blue-200 to-blue-100 rounded-xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <TrendingUp
                    className="h-10 w-10 text-blue-950"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-black mb-6 text-center">
                  Cycle Bonus: Infinite Binary Compensation System
                </h3>
                <p className="text-base text-gray-700 mb-6 sm:mb-8 leading-relaxed text-center">
                  Experience unparalleled earning potential with NHT Global’s
                  Cycle Bonus, part of our Infinite Binary Plan. Build two
                  teams—Left and Right—and earn commissions on the Bonus Volume
                  (BV) generated by product purchases across your entire
                  network, with no depth limit. Whether it’s your 3rd or 1000th
                  level, you earn on every sale, creating a truly limitless
                  income opportunity.
                </p>
                <p className="text-base text-gray-700 mb-6 sm:mb-8 leading-relaxed text-center">
                  Every product purchase—whether direct or through your NHT
                  Global e-commerce site—generates BV, which never expires. This
                  allows you to build your business at your own pace without
                  losing your hard-earned volume. Track your BV in real-time via
                  your online account and watch your network’s growth translate
                  into substantial earnings.
                </p>
                <img
                  src="spon-member2.png"
                  alt="Infinite Binary Plan Illustration"
                  className="w-full max-w-xs sm:max-w-sm md:max-w-lg mx-auto mb-6 sm:mb-8 rounded-lg shadow-md"
                  aria-label="Illustration of NHT Global Infinite Binary Plan"
                />
                <Accordion type="single" collapsible className="text-gray-700">
                  <AccordionItem value="overview">
                    <AccordionTrigger className="text-base sm:text-lg font-semibold text-black hover:text-blue-950">
                      Overview
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed">
                      The Cycle Bonus is the heart of NHT Global’s Infinite
                      Binary Plan, designed to reward you for the sales activity
                      of your Left and Right Sales Teams. Every product purchase
                      generates Bonus Volume (BV), which accumulates in your
                      online account and never expires—unlike other network
                      marketing programs. This system allows you to earn
                      commissions on BV from distributors at any level, from
                      your direct sponsors to those infinitely deep in your
                      network, creating a scalable and sustainable income
                      stream.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="cycle-mechanism">
                    <AccordionTrigger className="text-base sm:text-lg font-semibold text-black hover:text-blue-950">
                      How Cycles Work
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed">
                      Each week, the system calculates the BV generated by your
                      Left and Right teams. A cycle is completed when you
                      accumulate 2500 BV in one team and 1250 BV in the other,
                      in any combination (e.g., 2500 BV Left + 1250 BV Right or
                      vice versa). Excess BV carries over to the next week,
                      ensuring no effort is wasted.
                      <br />
                      <br />
                      <strong>Cycle Bonus Example Table:</strong>
                      <div className="overflow-x-auto mt-4 sm:mt-6">
                        <table
                          className="w-full text-left border-collapse text-sm sm:text-base"
                          aria-label="Cycle Bonus Example Table"
                        >
                          <thead>
                            <tr className="bg-blue-50">
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold">
                                Left Side Team (BV)
                              </th>
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold">
                                Right Side Team (BV)
                              </th>
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold">
                                Cycles Completed
                              </th>
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold">
                                Carry Over BV
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="hover:bg-blue-50">
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                2500 BV
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                1250 BV
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                1
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                0 BV
                              </td>
                            </tr>
                            <tr className="hover:bg-blue-50">
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                5000 BV
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                2750 BV
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                2
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                250 BV (Right)
                              </td>
                            </tr>
                            <tr className="hover:bg-blue-50">
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                10150 BV
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                5350 BV
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                4
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                150 BV (Left) & 350 BV (Right)
                              </td>
                            </tr>
                            <tr className="hover:bg-blue-50">
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                10150 BV
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                2750 BV
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                2
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                5150 BV (Left) & 250 BV (Right)
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="mt-4 sm:mt-6">
                        <strong>Example:</strong> If your Left Team generates
                        5000 BV and your Right Team generates 2750 BV, you
                        complete 2 cycles (2 x [2500 BV + 1250 BV]). The
                        remaining 250 BV from the Right Team carries over to the
                        next week for recalculation.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="earnings-structure">
                    <AccordionTrigger className="text-base sm:text-lg font-semibold text-black hover:text-blue-950">
                      Earnings Structure
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed">
                      Your earnings per cycle are based on your Membership Rank
                      (Gold, Silver, or Bronze). The table below outlines the
                      payouts for completed cycles:
                      <div className="overflow-x-auto mt-4 sm:mt-6">
                        <table
                          className="w-full text-left border-collapse text-sm sm:text-base"
                          aria-label="Cycle Bonus Payout Table"
                        >
                          <thead>
                            <tr className="bg-blue-50">
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold">
                                No. of Cycles
                              </th>
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold">
                                Gold
                              </th>
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold">
                                Silver
                              </th>
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold">
                                Bronze
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="hover:bg-blue-50">
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                1 Cycle
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                US $250
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                US $125
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                US $62.50
                              </td>
                            </tr>
                            <tr className="hover:bg-blue-50">
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                2 Cycles
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                US $500
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                US $250
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                -
                              </td>
                            </tr>
                            <tr className="hover:bg-blue-50">
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                5 Cycles
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                US $1250
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                US $625
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                US $312.50
                              </td>
                            </tr>
                            <tr className="hover:bg-blue-50">
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                10 Cycles
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                US $2500
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                US $1250
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                US $625
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="mt-4 sm:mt-6">
                        <strong>Weak Leg Earnings:</strong> You earn up to 20%
                        of the BV from your weaker leg (the team with less BV).
                        For example, in a cycle with 2500 BV (strong leg) and
                        1250 BV (weak leg), a Gold member earns 20% of 1250 BV =
                        US $250 per cycle.
                      </p>
                      <p className="mt-4">
                        <strong>Weekly Cap:</strong> The Cycle Bonus is capped
                        at US $50,000 per week (US $200,000 per month), one of
                        the industry’s highest limits. Distributors with large,
                        active teams can complete multiple cycles daily,
                        unlocking significant earning potential.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="how-to-maximize">
                    <AccordionTrigger className="text-base sm:text-lg font-semibold text-black hover:text-blue-950">
                      How to Maximize Earnings
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed">
                      To maximize your Cycle Bonus earnings:
                      <ul className="list-disc pl-6 mt-4 space-y-2">
                        <li>
                          <strong>Balance Your Teams:</strong> Drive sales in
                          both Left and Right teams to complete cycles
                          efficiently and minimize carry-over BV.
                        </li>
                        <li>
                          <strong>Achieve Gold Rank:</strong> Unlock the highest
                          payout per cycle (US $250) as a Gold member, doubling
                          Silver and quadrupling Bronze earnings.
                        </li>
                        <li>
                          <strong>Boost Product Sales:</strong> Promote
                          consistent product purchases across your network to
                          increase BV and complete more cycles.
                        </li>
                        <li>
                          <strong>Utilize E-Commerce:</strong> Leverage your NHT
                          Global e-commerce platform to generate BV from global
                          sales, even from distant team members.
                        </li>
                        <li>
                          <strong>Expand Your Network:</strong> Recruit and
                          mentor motivated distributors to grow your teams
                          infinitely, as earnings have no depth limit.
                        </li>
                        <li>
                          <strong>Track and Strategize:</strong> Monitor BV in
                          your online account to optimize cycle completion and
                          plan carry-over for maximum weekly earnings.
                        </li>
                      </ul>
                      <p className="mt-4 sm:mt-6">
                        Many NHT Global distributors earn thousands of dollars
                        weekly by building expansive, active teams that complete
                        multiple cycles frequently. With dedication and
                        strategy, you can tap into this powerful income stream.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <p className="text-base text-gray-700 mt-6 sm:mt-8 leading-relaxed text-center">
                  The Cycle Bonus is just one part of NHT Global’s robust
                  compensation plan. Combine it with Direct Sales Commissions
                  and Retail Income to unlock the full potential of your
                  business. With no limits on network depth and non-expiring BV,
                  your earning possibilities are truly infinite.
                </p>
              </div>
            </TabsContent>

            {/* Earning Type 4: Matching Bonus */}
            <TabsContent value="matching">
              <div className="bg-gradient-to-r from-blue-200 to-blue-100 rounded-xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Award
                    className="h-10 w-10 text-blue-950"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-black mb-6 text-center">
                  Matching Bonus: Amplify Your Income
                </h3>
                <p className="text-base text-gray-700 mb-6 sm:mb-8 leading-relaxed text-center">
                  The Matching Bonus is the crown jewel of NHT Global’s
                  Compensation Plan, offering a powerful passive income stream.
                  Earn a percentage of the Cycle Bonus income generated by your
                  personally sponsored team members, up to three levels deep. As
                  your team grows and thrives globally, your earnings
                  multiply—allowing you to earn substantial income, even while
                  you sleep.
                </p>
                <p className="text-base text-gray-700 mb-6 sm:mb-8 leading-relaxed text-center">
                  With the Matching Bonus, your success is tied to your team’s
                  achievements. By mentoring your distributors to excel in their
                  Cycle Bonus earnings, you unlock a scalable income stream that
                  grows with your network, whether they’re in your city or on
                  the other side of the world.
                </p>
                <img
                  src="NHT Matching Bonus diagram 4.png"
                  alt="Matching Bonus Team Structure Illustration"
                  className="w-full max-w-xs sm:max-w-sm md:max-w-lg mx-auto mb-6 sm:mb-8 rounded-lg shadow-md"
                  aria-label="Illustration of NHT Global Matching Bonus Structure"
                />
                <Accordion type="single" collapsible className="text-gray-700">
                  <AccordionItem value="overview">
                    <AccordionTrigger className="text-base sm:text-lg font-semibold text-black hover:text-blue-950">
                      Overview
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed">
                      The Matching Bonus is designed to reward your leadership
                      by paying you a percentage of the Cycle Bonus earnings
                      from your Level 1, Level 2, and Level 3 sponsored
                      distributors. As your team members earn through their own
                      Cycle Bonuses, you receive a matching percentage, creating
                      a passive income stream that scales with your network’s
                      success. This bonus leverages your team-building efforts,
                      enabling you to benefit from the activity of distributors
                      worldwide, even those you’ve never met.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="bonus-structure">
                    <AccordionTrigger className="text-base sm:text-lg font-semibold text-black hover:text-blue-950">
                      Bonus Structure
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed">
                      Your Matching Bonus percentage depends on your Membership
                      Rank (Gold, Silver, or Bronze) and aligns with the Direct
                      Sales Commission structure:
                      <div className="overflow-x-auto mt-4 sm:mt-6">
                        <table
                          className="w-full text-left border-collapse text-sm sm:text-base"
                          aria-label="Matching Bonus Percentage Table"
                        >
                          <thead>
                            <tr className="bg-blue-50">
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold min-w-[120px]">
                                Team Member Sponsor Level
                              </th>
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold min-w-[100px]">
                                Gold
                              </th>
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold min-w-[100px]">
                                Silver
                              </th>
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold min-w-[100px]">
                                Bronze
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="hover:bg-blue-50">
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                Level 1
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                10%
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                5%
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                3%
                              </td>
                            </tr>
                            <tr className="hover:bg-blue-50">
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                Level 2
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                5%
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                3%
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                -
                              </td>
                            </tr>
                            <tr className="hover:bg-blue-50">
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                Level 3
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                3%
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                -
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                -
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="mt-4 sm:mt-6">
                        <strong>Example (Gold Rank):</strong> If your team
                        members earn the following Cycle Bonuses:
                      </p>
                      <div className="overflow-x-auto mt-4">
                        <table
                          className="w-full text-left border-collapse text-sm sm:text-base"
                          aria-label="Matching Bonus Example Table"
                        >
                          <thead>
                            <tr className="bg-blue-50">
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold min-w-[120px]">
                                Team Member
                              </th>
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold min-w-[120px]">
                                Sponsored Level
                              </th>
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold min-w-[140px]">
                                Cycle Bonus Income
                              </th>
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold min-w-[120px]">
                                Matching Bonus %
                              </th>
                              <th className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold min-w-[140px]">
                                Matching Bonus Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="hover:bg-blue-50">
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                Jane
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                Level 1
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                US $10,000
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                10%
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                US $1,000
                              </td>
                            </tr>
                            <tr className="hover:bg-blue-50">
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                Lee
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                Level 2
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                US $5,000
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                5%
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                US $250
                              </td>
                            </tr>
                            <tr className="hover:bg-blue-50">
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                Ali
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                Level 3
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                US $1,000
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                3%
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6">
                                US $30
                              </td>
                            </tr>
                            <tr className="hover:bg-blue-50">
                              <td
                                className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold"
                                colSpan="4"
                              >
                                Total Matching Bonus Income
                              </td>
                              <td className="border-b border-blue-200 py-3 sm:py-4 px-4 sm:px-6 font-semibold">
                                US $1,280
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="mt-4 sm:mt-6">
                        With just three team members, including one you directly
                        sponsored (Jane), you earn US $1,280. Imagine the
                        potential with hundreds or thousands of team members
                        across multiple levels—your income grows exponentially!
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="how-to-maximize">
                    <AccordionTrigger className="text-base sm:text-lg font-semibold text-black hover:text-blue-950">
                      How to Maximize Earnings
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed">
                      To maximize your Matching Bonus earnings:
                      <ul className="list-disc pl-6 mt-4 space-y-2">
                        <li>
                          <strong>Empower Your Team:</strong> Mentor your
                          personally sponsored distributors to build strong
                          teams and maximize their Cycle Bonus earnings, as
                          their success directly boosts your Matching Bonus.
                        </li>
                        <li>
                          <strong>Achieve Gold Rank:</strong> Unlock the highest
                          Matching Bonus percentages (10%, 5%, 3%) by reaching
                          Gold membership, significantly increasing your income
                          across all three levels.
                        </li>
                        <li>
                          <strong>Expand Your Downline:</strong> Recruit more
                          Level 1 distributors to grow your network, increasing
                          the number of team members contributing to your
                          Matching Bonus.
                        </li>
                        <li>
                          <strong>Promote Global Growth:</strong> Encourage your
                          team to leverage NHT Global’s e-commerce platform to
                          drive sales worldwide, as their Cycle Bonuses from
                          global markets add to your income.
                        </li>
                        <li>
                          <strong>Stay Engaged:</strong> Provide ongoing
                          training, support, and motivation to keep your team
                          active, ensuring consistent Cycle Bonus earnings that
                          fuel your Matching Bonus.
                        </li>
                      </ul>
                      <p className="mt-4 sm:mt-6">
                        The Matching Bonus creates a passive income stream that
                        grows as your team succeeds, allowing you to earn
                        effortlessly—whether you’re working, traveling, or
                        relaxing.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="why-it-matters">
                    <AccordionTrigger className="text-base sm:text-lg font-semibold text-black hover:text-blue-950">
                      Why It Matters
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed">
                      The Matching Bonus transforms your earning potential by
                      allowing you to benefit from all four NHT Global earning
                      types simultaneously: Retail Income, Direct Sales
                      Commission, Cycle Bonus, and Matching Bonus. With initial
                      effort in building and mentoring your team, you create a
                      sustainable, scalable income that grows globally. Your
                      team’s success—whether in your hometown or across
                      continents—drives your financial freedom, delivering the
                      “Dream Life” where income flows into your bank account,
                      even during a two-month vacation.
                      <br />
                      <br />
                      Contact us via the{" "}
                      <a
                        href="/contact"
                        className="text-blue-950 hover:text-blue-700 underline"
                      >
                        Contact Page
                      </a>{" "}
                      to learn more about maximizing your Matching Bonus or to
                      get personalized support in building your NHT Global
                      business.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <p className="text-base text-gray-700 mt-6 sm:mt-8 leading-relaxed text-center">
                  The Matching Bonus is your gateway to passive, global income.
                  Combined with NHT Global’s other earning streams, it empowers
                  you to build a thriving business that delivers financial
                  independence and the lifestyle you’ve always dreamed of.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 bg-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="space-y-2 text-xs sm:text-sm text-gray-500">
              <p>
                *There are few countries where monthly purchase qualification
                applies, but these are very nominal and easy to achieve compared
                to industry standards. Contact us for more details.
              </p>
              <p>
                “All references to income, implied or stated, in the NHT Global
                Compensation Plan are indicative. NHT Global and Get Dream Life
                do NOT guarantee that anyone will earn any level of income or
                any income at all. Earnings from the NHT Global Compensation
                Plan, if any, will depend solely on each person’s effort, skill,
                and ability.”
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}