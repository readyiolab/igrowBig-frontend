import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, Eye, Heart, Share2 } from "lucide-react";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAll } = useTenantApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAll("/site/data");
        setData(response.site_data);
      } catch (err) {
        setError(err.message);
        setData({});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAll]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Skeleton className="w-full h-80 rounded-none" />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Skeleton className="h-10 w-32 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-6" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Error loading post</p>
          <Button onClick={() => navigate("/blog")} className="bg-black hover:bg-gray-800 text-white">
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  const post = data?.blogs?.find((p) => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Post not found</p>
          <Button onClick={() => navigate("/blog")} className="bg-black hover:bg-gray-800 text-white">
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden bg-black">
        <img
          src={post.image_url || "https://via.placeholder.com/1200x600"}
          alt={post.title}
          className="w-full h-full object-cover opacity-70 hover:opacity-80 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col items-start justify-end px-4 sm:px-6 pb-8">
          {post.category && (
            <span className="bg-black text-white text-xs px-3 py-1 rounded-full mb-4">
              {post.category}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg max-w-2xl">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <Button
          onClick={() => navigate("/blog")}
          variant="outline"
          className="mb-8 flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Button>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-600 mb-8 text-sm sm:text-base pb-8 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{new Date(post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{(post.views || 0).toLocaleString()} views</span>
          </div>
          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-2 transition-colors ${liked ? "text-red-500" : "text-gray-600 hover:text-red-500"}`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
            <span>{(post.likes || 0) + (liked ? 1 : 0)}</span>
          </button>
          <Share2 className="w-4 h-4 text-gray-600 hover:text-black cursor-pointer transition-colors" />
        </div>

        {/* Article Content */}
        <div
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-8 sm:mb-12"
          dangerouslySetInnerHTML={{
            __html: post.content || "<p>No content available</p>",
          }}
        />

        {/* Back Button */}
        <Button
          onClick={() => navigate("/blog")}
          className="bg-black hover:bg-gray-800 text-white px-8 py-3 font-semibold transition-all duration-300"
        >
          Back to Blog
        </Button>
      </div>
    </div>
  );
};

export default BlogPost;