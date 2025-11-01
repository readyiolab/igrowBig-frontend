// Blog.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Eye, Heart, Share2, Search } from "lucide-react";

const Blog = () => {
  const navigate = useNavigate();
  const { getAll } = useTenantApi();
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [liked, setLiked] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAll("/site/data");
        setSiteData(response);
      } catch (err) {
        setError(err.message);
        setSiteData({});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAll]);

  useEffect(() => {
    if (!siteData?.blogs) return;
    
    let updatedPosts = [...siteData.blogs];
    
    if (activeCategory !== "ALL") {
      updatedPosts = updatedPosts.filter((post) => post.category === activeCategory);
    }
    
    updatedPosts = updatedPosts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (sortBy === "views") {
      updatedPosts.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else {
      updatedPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    setFilteredPosts(updatedPosts);
  }, [siteData, searchQuery, activeCategory, sortBy]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Skeleton className="w-full h-80 rounded-none" />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-80 rounded-lg" />
            <Skeleton className="h-80 rounded-lg" />
            <Skeleton className="h-80 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  const blogPosts = siteData?.blogs || [];
  const blogBanners = siteData?.sliders || []; // Assuming sliders for blog if separate not present
  const categories = ["ALL", ...new Set(blogPosts.map((post) => post.category).filter(Boolean))];

  const handleLike = (postId) => {
    setLiked((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Banner Carousel */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[450px] overflow-hidden bg-black">
        {blogBanners.length > 0 ? (
          <img
            src={blogBanners[0]?.image_url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"}
            alt={blogBanners[0]?.image_content || "Blog Banner"}
            className="w-full h-full object-cover opacity-70 hover:opacity-80 transition-opacity duration-500"
          />
        ) : (
          <img
            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
            alt="Blog"
            className="w-full h-full object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-black/40"></div>
        
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setActiveCategory(category)}
                variant={activeCategory === category ? "default" : "outline"}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-black text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="date">Latest</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => navigate(`/blog/${post.id}`)}
              >
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={post.image_url || "https://via.placeholder.com/600x400"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {post.category && (
                    <span className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-black mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.content?.replace(/<[^>]*>/g, "") || "No description"}
                  </p>

                  <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{(post.views || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post.id);
                      }}
                      className={`flex items-center gap-1 transition-colors ${
                        liked[post.id] ? "text-red-500" : "text-gray-600 hover:text-red-500"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${liked[post.id] ? "fill-current" : ""}`} />
                      <span className="text-sm">{(post.likes || 0) + (liked[post.id] ? 1 : 0)}</span>
                    </button>
                    <Share2 className="w-4 h-4 text-gray-600 hover:text-black transition-colors cursor-pointer" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No posts found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;