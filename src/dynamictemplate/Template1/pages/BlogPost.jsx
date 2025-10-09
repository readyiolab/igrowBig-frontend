import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useTenantApi from '@/hooks/useTenantApi';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, User, Eye, Share2, Heart } from 'lucide-react';

const BlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getAll } = useTenantApi();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("BlogPost: Fetching for id:", id);
                const response = await getAll("/site/data");
                console.log("BlogPost: Response:", response);
                setData(response.site_data);
            } catch (err) {
                console.error("BlogPost: Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, getAll]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-accent">
                <div className="text-gray-800 text-xl font-semibold animate-pulse">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-accent">
                <div className="text-red-600 text-xl font-semibold">Error: {error}</div>
            </div>
        );
    }

    const post = data?.blog?.find((p) => p.id === parseInt(id));

    if (!post) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center py-12 text-gray-800 text-lg sm:text-xl">
                    Blog post not found
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Hero Section */}
            <section className="relative w-full h-72 sm:h-96 md:h-[500px] overflow-hidden">
                <img
                    src={post.image_url || "https://via.placeholder.com/1200x600?text=Blog+Post"}
                    alt={post.title}
                    className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
                <div className="absolute bottom-6 left-4 sm:left-6 text-white">
                    <span className="inline-block bg-red-950 text-white text-xs px-2 py-1 rounded mb-2 sm:mb-3">
                        {post.category || "Uncategorized"}
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold drop-shadow-md leading-tight">
                        {post.title}
                    </h1>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-grow">
                <Button
                    onClick={() => navigate('/blog')}
                    variant="outline"
                    className="mb-6 sm:mb-8 text-gray-800 border-gray-300 hover:bg-gray-100 transition-all duration-200 flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Blog
                </Button>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <User className="w-4 h-4" /> {post.author || "Unknown"}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Clock className="w-4 h-4" /> 
                        {new Date(post.created_at).toLocaleDateString("en-US", {
                            month: "long",
                            day: "2-digit",
                            year: "numeric",
                        })} • {post.read_time || 5}m
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Eye className="w-4 h-4" /> {(post.views || 0).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                            <Heart className="w-4 h-4" /> {post.likes || 0}
                        </button>
                        <Share2 className="w-4 h-4 hover:text-indigo-500 transition-colors" />
                    </div>
                </div>

                <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed mb-6 sm:mb-8">
                    <div
                        dangerouslySetInnerHTML={{
                            __html: post.content || "<p>No content available.</p>",
                        }}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {(post.tags || []).map((tag) => (
                        <span
                            key={tag}
                            className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogPost;