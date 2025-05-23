import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ToastNotification, { showSuccessToast, showErrorToast } from "../../ToastNotification";
import useTenantApi from "@/hooks/useTenantApi";

const CreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subscriptionPlan, setSubscriptionPlan] = useState("yearly");
  const [templateId, setTemplateId] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [plans, setPlans] = useState({
    yearly: { price: 156, discount: 20 },
    monthly: { price: 16.25, discount: 0 },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const { data, loading, error: apiError, getAll, post } = useTenantApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const templateData = await getAll('/templates');
        console.log("Raw template data:", templateData);
        const validatedTemplates = Array.isArray(templateData)
          ? templateData.filter(
              (t) => t.id && t.name && t.description && t.image
            )
          : [];
        console.log("Validated templates:", validatedTemplates);
        setTemplates(validatedTemplates);
        if (validatedTemplates.length > 0) {
          setTemplateId(validatedTemplates[0].id);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load templates or plans");
        showErrorToast("Failed to load templates or plans", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getAll]);

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = "Name is required";
    }
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
    }
    if (!templateId) {
      errors.template = "Please select a template";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showErrorToast("Please correct the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name,
        email,
        subscription_plan: subscriptionPlan,
        template_id: templateId,
      };
      console.log("Submitting payload:", payload);
      const response = await post("/admin/create-user", payload);
      setName("");
      setEmail("");
      setSubscriptionPlan("yearly");
      setTemplateId(templates[0]?.id || null);
      setFormErrors({});
      showSuccessToast(response.message || "User created successfully!");
    } catch (error) {
      console.error("Error creating user:", error.response?.data || error.message);
      showErrorToast(
        "Failed to create user",
        error.response?.data?.message || error.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubscriptionPriceDisplay = (plan) => {
    if (plan === "yearly") {
      return (
        <div className="flex items-center">
          <span className="font-semibold text-black">${plans.yearly.price}/year</span>
          {plans.yearly.discount > 0 && (
            <span className="ml-2 text-xs bg-gray-200 text-black px-2 py-1 rounded-full">
              Save {plans.yearly.discount}%
            </span>
          )}
        </div>
      );
    } else {
      return <span className="font-semibold">${plans.monthly.price}/month</span>;
    }
  };

  const templateOptions = Array.isArray(templates) ? templates : [];
  console.log("Template options:", templateOptions);
  const isFormDisabled = isSubmitting || templateOptions.length === 0;

  if (isLoading || loading) {
    return (
      <div className="min-h-[400px] flex flex-col justify-center items-center p-8 bg-white rounded-xl shadow-sm">
        <svg
          className="animate-spin h-12 w-12 text-gray-800 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="text-gray-700 font-medium">Loading templates...</p>
      </div>
    );
  }

  return (
    <div className="m-4 border-2 bg-white rounded-xl shadow-sm overflow-hidden">
      <ToastNotification />
      <div className="bg-black p-6 text-white">
        <h2 className="text-2xl font-bold">Create Tenant User</h2>
        <p className="text-gray-300 mt-1">
          Set up a new user account with customized template
        </p>
      </div>

      

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="name"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border ${
                  formErrors.name ? "border-gray-800 bg-gray-100" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors`}
                placeholder="Enter user's full name"
                disabled={isSubmitting}
                aria-label="Full Name"
                aria-describedby={formErrors.name ? "name-error" : undefined}
              />
            </div>
            {formErrors.name && (
              <p id="name-error" className="mt-1 text-sm text-gray-800">
                {formErrors.name}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border ${
                  formErrors.email ? "border-gray-800 bg-gray-100" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors`}
                placeholder="user@example.com"
                disabled={isSubmitting}
                aria-label="Email Address"
                aria-describedby={formErrors.email ? "email-error" : undefined}
              />
            </div>
            {formErrors.email && (
              <p id="email-error" className="mt-1 text-sm text-gray-800">
                {formErrors.email}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Subscription Details
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subscription Plan
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  subscriptionPlan === "yearly"
                    ? "border-black bg-gray-100 ring-2 ring-gray-300"
                    : "border-gray-200 hover:border-gray-400"
                }`}
                onClick={() => setSubscriptionPlan("yearly")}
                onKeyDown={(e) => e.key === "Enter" && setSubscriptionPlan("yearly")}
                role="radio"
                aria-checked={subscriptionPlan === "yearly"}
                tabIndex={0}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Yearly Plan</div>
                    {getSubscriptionPriceDisplay("yearly")}
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                      subscriptionPlan === "yearly"
                        ? "border-black bg-black"
                        : "border-gray-300"
                    }`}
                  >
                    {subscriptionPlan === "yearly" && (
                      <svg
                        className="h-3 w-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  subscriptionPlan === "monthly"
                    ? "border-black bg-gray-100 ring-2 ring-gray-300"
                    : "border-gray-200 hover:border-gray-400"
                }`}
                onClick={() => setSubscriptionPlan("monthly")}
                onKeyDown={(e) =>
                  e.key === "Enter" && setSubscriptionPlan("monthly")
                }
                role="radio"
                aria-checked={subscriptionPlan === "monthly"}
                tabIndex={0}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Monthly Plan</div>
                    {getSubscriptionPriceDisplay("monthly")}
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                      subscriptionPlan === "monthly"
                        ? "border-black bg-black"
                        : "border-gray-300"
                    }`}
                  >
                    {subscriptionPlan === "monthly" && (
                      <svg
                        className="h-3 w-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Store Template
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Select a template that best fits the user's business needs
          </p>
          {templateOptions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg
                className="mx-auto h-10 w-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="mt-2 text-sm font-medium">No templates available</p>
              <p className="text-xs">
                Please try again later or contact support.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {templateOptions.map((template) => (
                <div
                  key={template.id}
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                    templateId === template.id
                      ? "border-black ring-2 ring-gray-300"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => setTemplateId(template.id)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setTemplateId(template.id)
                  }
                  role="option"
                  aria-selected={templateId === template.id}
                  tabIndex={0}
                >
                  <div className="h-32 bg-gray-100 flex items-center justify-center">
                    {template.image ? (
                      <img
                        src={template.image}
                        alt={template.name}
                        className="w-full h-full object-cover"
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/300x100")
                        }
                      />
                    ) : (
                      <div className="text-gray-400 text-center p-4">
                        <svg
                          className="h-10 w-10 mx-auto mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Preview
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        {template.name}
                      </h4>
                      {templateId === template.id && (
                        <svg
                          className="h-5 w-5 text-black"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 016 0zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {template.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {formErrors.template && (
            <p className="mt-1 text-sm text-gray-800">{formErrors.template}</p>
          )}
        </div>

        <div className="pt-4">
          <motion.button
            type="submit"
            disabled={isFormDisabled}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center ${
              isFormDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-900 cursor-pointer text-white shadow-md hover:shadow-lg"
            }`}
            whileHover={{ scale: isFormDisabled ? 1 : 1.02 }}
            whileTap={{ scale: isFormDisabled ? 1 : 0.98 }}
            aria-label="Create User"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating User...
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create User
              </>
            )}
          </motion.button>
        </div>
      </form>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <svg
            className="h-5 w-5 text-gray-400 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          New users will receive an email with instructions to set up their password
        </div>
      </div>
    </div>
  );
};

export default CreateUser;