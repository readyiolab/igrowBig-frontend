import { useState } from "react";
import { CheckIcon, Gift, Shield } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PricingSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const handleBuyClick = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const features = [
    "Website Setup",
    "Hosting",
    "Product Catalog",
    "Lead Capture",
    "Autoresponders",
    "Blog",
    "Training Hub",
    "Tracking Tools",
    "Social Links",
    "Domain Support",
    "Ongoing Updates",
  ];

  const transparencyPoints = [
    { text: "No Hidden Fees", icon: <Shield size={16} /> },
    { text: "No Upsells", icon: <Shield size={16} /> },
    { text: "One Flat Price — Full Access", icon: <Shield size={16} /> },
  ];

  return (
    <div className="relative bg-gray-100 px-4 sm:px-6 lg:px-10 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-medium text-center mb-4 text-black">
          Simple, Transparent Pricing — Built to Empower You
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Whether you're new or already part of NHTGlobal, our system gives you
          everything you need to look professional, scale faster, and duplicate
          your team.
        </p>

        {/* All Features Section */}
        <div className="mb-16 bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-xl p-8 shadow-lg border border-gray-200">
          <h3 className="text-2xl font-medium text-white text-center mb-8">
            All Features Included
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                    <CheckIcon
                      className="h-3 w-3 text-black"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium text-white">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b-2 border-gray-200 pb-8">
            {transparencyPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-center justify-center px-4 py-2"
              >
                <span className="text-white mr-2">{point.icon}</span>
                <span className="text-sm font-medium text-white">
                  {point.text}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-8 mx-auto max-w-md rounded-lg p-6 text-white border border-gray-200 bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-lg">
            <div className="text-center">
              <h3 className="text-xl font-medium">Annual Plan</h3>
              <div className="mt-4 flex items-end justify-center gap-2">
                <span className="text-3xl font-medium tracking-tight text-white">
                  $149
                </span>
                <span className="text-base text-gray-300 mb-1">/year</span>
              </div>
            </div>
            <button
              onClick={handleBuyClick}
              className="mt-6 block w-full rounded cursor-pointer bg-white px-5 py-3 text-center text-sm font-semibold text-black shadow-md hover:bg-gray-200 transition-colors"
            >
              Buy Now
            </button>
          </div>
          
          <div className="flex items-center justify-center mt-6 px-4">
            <Gift className="h-5 w-5 text-white mr-2 flex-shrink-0" />
            <p className="text-sm text-white">
              Bonus: Join through our NHTGlobal team and get 3 extra months
              free (15 months total)
            </p>
          </div>
        </div>

        {/* Modal */}
        <AlertDialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <AlertDialogContent className="rounded-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Payment Gateway Coming Soon!</AlertDialogTitle>
              <AlertDialogDescription>
                Our payment gateway is currently under development. Stay tuned
                for updates!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={handleCloseModal}
                className="border-black rounded-lg"
              >
                Close
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCloseModal}
                className="bg-black text-white rounded-lg"
              >
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}