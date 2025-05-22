import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '../ui/button';

const NHTGlobalPromotion = () => {
    return (
        <div className="flex flex-col md:flex-row bg-white shadow-lg min-h-screen">
            {/* Content Section (Left) */}
            <div className="w-full md:w-1/2 p-8 bg-black flex flex-col justify-center gap-5">
                <h1 className="text-4xl tracking-wide font-medium text-white mb-4">
                    Start a Home-Based Global Business — We’ll Help You Grow.
                </h1>
                <p className="text-lg text-white mb-6 font-light">
                    Join NHTGlobal with our all-in-one platform that helps you launch, automate, and scale — both online and offline.
                </p>
                <ul className="space-y-4 mb-4 font-light">
                    <li className="flex items-start">
                        <Check className="text-white mr-2 mt-1 flex-shrink-0" size={20} />
                        <span className="text-white">
                             Traditional network marketing meets a new-age digital system
                        </span>
                    </li>
                    <li className="flex items-start">
                        <Check className="text-white mr-2 mt-1 flex-shrink-0" size={20} />
                        <span className="text-white">
                             Build your brand online while growing your network offline
                        </span>
                    </li>
                    <li className="flex items-start">
                        <Check className="text-white mr-2 mt-1 flex-shrink-0" size={20} />
                        <span className="text-white">
                             Be your own boss, set your hours, and work from anywhere
                        </span>
                    </li>
                    <li className="flex items-start">
                        <Check className="text-white mr-2 mt-1 flex-shrink-0" size={20} />
                        <span className="text-white">
                             Connect globally, duplicate locally — grow your way
                        </span>
                    </li>
                </ul>
                <Button variant="outline" size='lg' className="py-3 px-6 rounded-md font-medium cursor-pointer transition duration-300 w-max">
                    Get Started
                </Button>
            </div>

            {/* Image Section (Right) */}
            <div className="w-full md:w-1/2 bg-gray-200">
                <img
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="NHT Global Business Growth"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default NHTGlobalPromotion;