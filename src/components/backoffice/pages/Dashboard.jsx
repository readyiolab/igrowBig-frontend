import React, { useEffect, useState, useCallback } from "react";
import { BarChart2, Users, Package, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import toast, { Toaster } from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: categoryData, loading: categoryLoading, error: categoryError, getAll: getCategories } = useTenantApi();
  const { data: blogData, loading: blogLoading, error: blogError, getAll: getBlogs } = useTenantApi();
  const { data: productData, loading: productLoading, error: productError, getAll: getProducts } = useTenantApi();
  const { data: subscriberData, loading: subscriberLoading, error: subscriberError, getAll: getSubscribers } = useTenantApi();

  const [tenantId, setTenantId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [retryCounts, setRetryCounts] = useState({
    categories: 0,
    blogs: 0,
    products: 0,
    subscribers: 0,
  });

  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    if (storedTenantId && tenantId !== storedTenantId) {
      setTenantId(storedTenantId);
    }
  }, []);

  useEffect(() => {
    if (tenantId) {
      getCategories(`/tenants/${tenantId}/categories`);
      getBlogs(`/tenants/${tenantId}/blogs`);
      getProducts(`/tenants/${tenantId}/products`);
      getSubscribers(`/tenants/${tenantId}/subscribers`); // Assuming an endpoint for subscribers
    }
  }, [tenantId, getCategories, getBlogs, getProducts, getSubscribers]);

  useEffect(() => {
    const handleRetry = async (type, fetchFn, endpoint) => {
      if (retryCounts[type] < 3 && (type === "subscribers" ? subscriberError : categoryError || blogError || productError)) {
        toast.error(`Failed to load ${type}. Retrying... (${retryCounts[type] + 1}/3)`);
        setTimeout(() => {
          setRetryCounts((prev) => ({ ...prev, [type]: prev[type] + 1 }));
          fetchFn(endpoint);
        }, 2000);
      }
    };

    if (tenantId) {
      handleRetry("categories", getCategories, `/tenants/${tenantId}/categories`);
      handleRetry("blogs", getBlogs, `/tenants/${tenantId}/blogs`);
      handleRetry("products", getProducts, `/tenants/${tenantId}/products`);
      handleRetry("subscribers", getSubscribers, `/tenants/${tenantId}/subscribers`);
    }
  }, [categoryError, blogError, productError, subscriberError, tenantId, retryCounts, getCategories, getBlogs, getProducts, getSubscribers]);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearchChange = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const productCategories = (categoryData || []).map((cat, index) => ({
  srNo: index + 1,
  category: cat.name || "Unnamed Category",
  productCount: !productLoading && !productError && productData?.data
    ? productData.data.filter((prod) => prod.category_id === cat.id).length
    : 0,
  status: cat.status === "active" ? "ACTIVE" : "INACTIVE",
}));

  const filteredCategories = productCategories.filter((item) =>
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCategories = productCategories.length;
  const totalProducts = productData?.length || 0;
  const totalSubscribers = subscriberData?.length || 0; // Dynamic subscriber count
  const nextBilling = "31-Mar-2025"; // Placeholder, update with dynamic data if available

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const totalPages = Math.ceil(filteredCategories.length / entriesPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const blogPosts = (blogData || []).map((blog) => ({
    id: blog.id,
    title: blog.title || "Untitled",
    createdOn: new Date(blog.created_at).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    excerpt: blog.content ? `${blog.content.substring(0, 50)}...` : "No content available",
    imageUrl: blog.image_url || "/placeholder-image.jpg",
  }));

  const handleRetry = (type, fetchFn, endpoint) => {
    setRetryCounts((prev) => ({ ...prev, [type]: 0 }));
    fetchFn(endpoint);
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {!tenantId && (
        <div className="p-12 text-center bg-white shadow-lg rounded-xl border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Authentication Required</h3>
          <p className="text-gray-500 mb-6">No tenant ID found. Please log in to continue.</p>
          <button
            onClick={() => navigate("/backoffice-login")}
            className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
            aria-label="Go to login page"
          >
            Log In
          </button>
        </div>
      )}

      {tenantId && (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-800">Hello Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome to your dashboard</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: "Total Categories", value: totalCategories, icon: BarChart2, color: "bg-gradient-to-r from-gray-800 to-black" },
              { title: "Total Products", value: totalProducts, icon: Package, color: "bg-gradient-to-r from-gray-700 to-gray-900" },
              { title: "Total Subscribers", value: totalSubscribers, icon: Users, color: "bg-gradient-to-r from-gray-800 to-black", loading: subscriberLoading },
              { title: "Next Billing", value: nextBilling, icon: Calendar, color: "bg-gradient-to-r from-gray-700 to-gray-900" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`${stat.color} text-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium mb-2 opacity-90">{stat.title}</h3>
                    {stat.loading ? (
                      <div className="animate-pulse h-6 w-12 bg-gray-200 rounded"></div>
                    ) : (
                      <p className="text-lg font-semibold">{stat.value}</p>
                    )}
                  </div>
                  <stat.icon size={32} className="opacity-80" />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Product Overview</h3>
            {(categoryLoading || productLoading) && (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gray-900 mx-auto"></div>
                <span className="text-gray-500 text-sm mt-2 block">Loading data...</span>
              </div>
            )}
            {(categoryError || productError) && retryCounts.categories >= 3 && retryCounts.products >= 3 && !categoryLoading && !productLoading && (
              <div className="p-6 text-center bg-white shadow-lg rounded-xl border border-gray-200">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Unable to Load Product Data</h3>
                <p className="text-gray-500 mb-4">
                  {categoryError?.message || productError?.message || "An error occurred while loading data."}
                </p>
                <button
                  onClick={() => {
                    handleRetry("categories", getCategories, `/tenants/${tenantId}/categories`);
                    handleRetry("products", getProducts, `/tenants/${tenantId}/products`);
                  }}
                  className="border border-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                  aria-label="Retry loading product data"
                >
                  Retry
                </button>
              </div>
            )}
            {!categoryLoading && !productLoading && !categoryError && !productError && (
              filteredCategories.length > 0 ? (
                <>
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <div className="flex items-center">
                      <label htmlFor="entries" className="text-sm text-gray-700 mr-2">
                        Show
                      </label>
                      <select
                        id="entries"
                        value={entriesPerPage}
                        onChange={handleEntriesChange}
                        className="border border-gray-200 rounded-md p-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                        aria-label="Select number of entries per page"
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                      </select>
                      <span className="text-sm text-gray-700 ml-2">entries</span>
                    </div>
                    <div className="relative w-full sm:w-64">
                      <input
                        type="text"
                        id="search"
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200"
                        placeholder="Search categories..."
                        aria-label="Search product categories"
                      />
                      <BarChart2 size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-gray-800 to-black text-white">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Sr. No.</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Product Count</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {paginatedCategories.map((item) => (
                          <tr key={item.srNo} className="hover:bg-gray-50 transition-all duration-200">
                            <td className="px-6 py-4 text-sm text-gray-800">{item.srNo}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">{item.category}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">{item.productCount}</td>
                            <td className="px-6 py-4 text-sm">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                  item.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-600">
                    <p>Showing {(currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, filteredCategories.length)} of {filteredCategories.length} entries</p>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
                        aria-label="Previous page"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded-full ${
                            currentPage === page
                              ? "bg-gradient-to-r from-gray-800 to-black text-white"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                          aria-label={`Page ${page}`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
                        aria-label="Next page"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center bg-white shadow-lg rounded-xl border border-gray-200">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Product Categories Found</h3>
                  <p className="text-gray-500 mb-4">Start by adding categories and products to see them here.</p>
                </div>
              )
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Latest Blog Posts</h3>
            {blogLoading && (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gray-900 mx-auto"></div>
                <span className="text-gray-500 text-sm mt-2 block">Loading blogs...</span>
              </div>
            )}
            {blogError && retryCounts.blogs >= 3 && !blogLoading && (
              <div className="p-6 text-center bg-white shadow-lg rounded-xl border border-gray-200">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Unable to Load Blogs</h3>
                <p className="text-gray-500 mb-4">{blogError.message || "An error occurred while loading blogs."}</p>
                <button
                  onClick={() => handleRetry("blogs", getBlogs, `/tenants/${tenantId}/blogs`)}
                  className="border border-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                  aria-label="Retry loading blogs"
                >
                  Retry
                </button>
              </div>
            )}
            {!blogLoading && !blogError && (
              blogPosts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogPosts.slice(0, 6).map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                      <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" onError={(e) => (e.target.src = "/placeholder-image.jpg")} />
                      <div className="p-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{post.title}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-500">Created: {post.createdOn}</p>
                          <button
                            onClick={() => navigate(`/blogs/${post.id}`)} // Assuming a blog detail route
                            className="text-sm text-gray-800 hover:text-black underline font-medium transition-colors duration-200"
                            aria-label={`Read more about ${post.title}`}
                          >
                            Read More
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-white shadow-lg rounded-xl border border-gray-200">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Blog Posts Found</h3>
                  <p className="text-gray-500 mb-4">Start by adding blog posts to see them here.</p>
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;