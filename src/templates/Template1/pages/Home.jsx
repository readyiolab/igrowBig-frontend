import React from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import TestimonialsSection from './TestimonialsSection';
import { BookOpen, CircleEllipsis, User, ArrowRight } from 'lucide-react';

// Editable Banner Data
const banners = [
    {
        id: 1,
        image: 'https://via.placeholder.com/1200x500',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        ctaText: 'Lorem Ipsum',
        ctaLink: '/lorem-ipsum-1',
    },
    {
        id: 2,
        image: 'https://via.placeholder.com/1200x500',
        description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        ctaText: 'Lorem Ipsum',
        ctaLink: '/lorem-ipsum-2',
    },
    {
        id: 3,
        image: 'https://via.placeholder.com/1200x500',
        description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
        ctaText: 'Lorem Ipsum',
        ctaLink: '/lorem-ipsum-3',
    },
    {
        id: 4,
        image: 'https://via.placeholder.com/1200x500',
        description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
        ctaText: 'Lorem Ipsum',
        ctaLink: '/lorem-ipsum-4',
    },
];

function Home() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Carousel */}
            <section aria-label="Featured Section" className="relative">
                <Carousel className="w-full">
                    <CarouselContent>
                        {banners.map((banner) => (
                            <CarouselItem key={banner.id}>
                                <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
                                    <img
                                        src={banner.image}
                                        alt={`Placeholder - ${banner.description}`}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 text-white p-4 sm:p-6 md:p-8">
                                        <p className="text-xs sm:text-sm md:text-lg lg:text-xl font-medium drop-shadow-lg mb-4 max-w-3xl mx-auto text-center">
                                            {banner.description}
                                        </p>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </section>

            {/* Welcome Section */}
            <section
                aria-label="Welcome Section"
                className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-16 bg-gradient-to-b from-indigo-50 to-white"
            >
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium mb-4 sm:mb-6 text-teal-900">
                        Lorem Ipsum Dolor Sit Amet
                    </h2>
                    <p className="text-sm sm:text-md md:text-lg leading-relaxed mb-6 sm:mb-8 text-gray-700 px-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <Button
                        asChild
                        className="bg-teal-900 hover:bg-teal-600 text-white transition-all duration-300 rounded-md px-4 py-2 sm:px-6 sm:py-3"
                    >
                        <Link to="/join" className="flex items-center justify-center gap-2">
                            Lorem Ipsum <User />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Team Section */}
            <section
                aria-label="Message Section"
                className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-16 bg-gradient-to-r from-teal-50 to-white"
            >
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium mb-4 sm:mb-5 text-gray-900 text-center tracking-tight">
                        Lorem Ipsum from Placeholder
                    </h2>
                    <div className="w-16 sm:w-24 h-1 bg-black mx-auto mb-6"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
                        <div className="order-1 md:order-2 relative h-64 sm:h-72 md:h-[400px] lg:h-[500px] overflow-hidden rounded-xl shadow-2xl">
                            <img
                                src="https://via.placeholder.com/600x400"
                                alt="Placeholder image"
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                loading="lazy"
                            />
                        </div>

                        <div className="order-2 md:order-1 flex flex-col justify-center">
                            <div className="space-y-6 sm:space-y-9 text-gray-700">
                                <p className="text-sm sm:text-md md:text-lg leading-relaxed">
                                    <span className="font-medium text-gray-900">Lorem ipsum</span>, dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                                <p className="text-sm sm:text-md md:text-lg leading-relaxed">
                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                            </div>
                            <div className="mt-4 sm:mt-5 text-center md:text-left">
                                <p className="text-sm sm:text-md md:text-lg text-gray-600 mb-4 italic">
                                    Lorem ipsum dolor sit amet?
                                </p>
                                <Button
                                    asChild
                                    className="text-white rounded-md px-4 py-2 sm:px-6 sm:py-3 font-medium shadow-md transition-all duration-300"
                                >
                                    <Link to="/learn" className="flex items-center justify-center gap-2">
                                        Lorem Ipsum <CircleEllipsis />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section
                aria-label="About Placeholder"
                className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-16 bg-gradient-to-r from-teal-50 to-white"
            >
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium mb-4 sm:mb-5 text-teal-900 text-center tracking-tight">
                        About Lorem Ipsum
                    </h2>
                    <div className="w-16 sm:w-24 h-1 bg-teal-900 mx-auto mb-6"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 lg:gap-14 items-center">
                        <div className="order-2 md:order-1 flex flex-col justify-center">
                            <ol className="text-sm sm:text-md md:text-lg leading-relaxed mb-6 sm:mb-8 text-gray-700 list-decimal pl-4 sm:pl-6 space-y-3 sm:space-y-4">
                                <li className="font-medium">Lorem ipsum dolor sit amet.</li>
                                <li className="font-medium">Consectetur adipiscing elit.</li>
                                <li className="font-medium">Sed do eiusmod tempor incididunt.</li>
                                <li className="font-medium">Ut enim ad minim veniam.</li>
                                <li>
                                    <span className="font-medium">Duis aute irure dolor:</span>
                                    <ul className="list-disc pl-4 sm:pl-6 mt-2 space-y-2 text-gray-600 text-sm sm:text-md">
                                        <li>Lorem ipsum</li>
                                        <li>Dolor sit amet</li>
                                        <li>Consectetur adipiscing</li>
                                    </ul>
                                </li>
                                <li className="font-medium">Exercitation ullamco laboris.</li>
                            </ol>
                            <Button
                                asChild
                                className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 py-2 sm:px-6 sm:py-3 font-semibold shadow-lg transition-all duration-300 w-fit mx-auto md:mx-0"
                            >
                                <Link to="/about" className="flex items-center justify-center gap-2">
                                    Lorem Ipsum <CircleEllipsis />
                                </Link>
                            </Button>
                        </div>

                        <div className="order-1 md:order-2 relative h-64 sm:h-72 md:h-[400px] lg:h-[500px] overflow-hidden rounded-xl shadow-2xl">
                            <img
                                src="https://via.placeholder.com/600x400"
                                alt="Placeholder image"
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    <div className="mt-8 sm:mt-12 p-6 sm:p-8 bg-white border border-teal-100 shadow-md rounded-2xl italic max-w-3xl sm:max-w-4xl mx-auto">
                        <p className="text-sm sm:text-md md:text-lg leading-relaxed text-gray-700 text-center">
                            <span className="font-semibold font-serif text-teal-800">Lorem ipsum</span> dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>
                </div>
            </section>

            {/* Why Section */}
            <section
                aria-label="Why Placeholder"
                className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-16 bg-gradient-to-b from-indigo-50 to-white"
            >
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium mb-4 sm:mb-5 text-center tracking-tight">
                        Why Lorem Ipsum?
                    </h2>
                    <div className="w-16 sm:w-24 h-1 bg-black mx-auto mb-6"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 lg:gap-14 items-center">
                        <div className="order-2 md:order-1 relative h-64 sm:h-72 md:h-[400px] lg:h-[500px] overflow-hidden rounded-xl shadow-2xl">
                            <div
                                className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-105"
                                style={{
                                    backgroundImage: `url('https://via.placeholder.com/600x400')`,
                                    backgroundAttachment: 'fixed',
                                    backgroundPosition: 'center',
                                }}
                            ></div>
                        </div>

                        <div className="order-1 md:order-2 flex flex-col justify-center">
                            <ol className="text-sm sm:text-md md:text-lg leading-relaxed mb-6 sm:mb-8 text-gray-700 list-decimal pl-4 sm:pl-6 space-y-3 sm:space-y-4">
                                <li className="font-medium">Lorem ipsum dolor sit amet.</li>
                                <li className="font-medium">Consectetur adipiscing elit.</li>
                                <li className="font-medium">Sed do eiusmod tempor incididunt.</li>
                                <li className="font-medium">Ut enim ad minim veniam.</li>
                                <li className="font-medium">Quis nostrud exercitation.</li>
                                <li className="font-medium">Ullamco laboris nisi.</li>
                                <li className="font-medium">Aliquip ex ea commodo.</li>
                                <li className="font-medium">Duis aute irure dolor.</li>
                                <li className="font-medium">Voluptate velit esse.</li>
                            </ol>
                            <Button
                                asChild
                                className="text-white rounded-lg px-4 py-2 sm:px-6 sm:py-3 font-semibold shadow-lg transition-all duration-300 w-fit mx-auto md:mx-0"
                            >
                                <Link to="/explore" className="flex items-center justify-center gap-2">
                                    Lorem Ipsum <BookOpen />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
            {/* <TestimonialsSection /> */}
        </div>
    );
}

export default Home;