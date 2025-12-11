import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, User, Eye, Share2, Heart } from 'lucide-react';
import useTenantApi from '@/hooks/useTenantApi';

const BlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getAll } = useTenantApi();
    
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likes, setLikes] = useState(0);

    useEffect(() => {
        const fetchBlogPost = async () => {
            try {
                setLoading(true);
                const response = await getAll("/site/data");
                
                if (response?.blogs && Array.isArray(response.blogs)) {
                    const foundPost = response.blogs.find(
                        blog => blog.id === parseInt(id) && blog.is_visible === 1
                    );

                    if (foundPost) {
                        const transformedPost = {
                            id: foundPost.id,
                            title: foundPost.title,
                            category: "COMPANY",
                            date: new Date(foundPost.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: '2-digit'
                            }),
                            readTime: Math.ceil(foundPost.content.split(' ').length / 200),
                            excerpt: foundPost.content.substring(0, 150) + '...',
                            content: foundPost.content,
                            author: "Admin",
                            image: foundPost.image_url,
                            tags: ["blog", "article"],
                            likes: 0,
                            views: 0,
                            banners: foundPost.banners || []
                        };
                        
                        setPost(transformedPost);
                        setLikes(transformedPost.likes);
                    } else {
                        setError("Blog post not found");
                    }
                }
                
            } catch (err) {
                console.error("Error fetching blog post:", err);
                setError("Failed to load blog post");
            } finally {
                setLoading(false);
            }
        };

        fetchBlogPost();
    }, [id]);

    const handleLike = () => {
        setLikes(prev => prev + 1);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-950 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading blog post...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center py-12">
                    <p className="text-gray-800 text-lg sm:text-xl mb-4">
                        {error || "Blog post not found"}
                    </p>
                    <Button
                        onClick={() => navigate('/blog')}
                        className="bg-red-950 hover:bg-red-900 text-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Hero Section */}
            <section className="relative w-full h-72 sm:h-96 md:h-[500px] overflow-hidden">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
                <div className="absolute bottom-6 left-4 sm:left-6 text-white">
                    <span className="inline-block bg-red-950 text-white text-xs px-2 py-1 rounded mb-2 sm:mb-3">
                        {post.category}
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
                        <User className="w-4 h-4" /> {post.author}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Clock className="w-4 h-4" /> {post.date} • {post.readTime}m
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Eye className="w-4 h-4" /> {post.views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleLike}
                            className="flex items-center gap-1 hover:text-red-500 transition-colors"
                        >
                            <Heart className="w-4 h-4" /> {likes}
                        </button>
                        <Share2 className="w-4 h-4 hover:text-indigo-500 transition-colors cursor-pointer" />
                    </div>
                </div>

                <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed mb-6 sm:mb-8 whitespace-pre-line">
                    {post.content}
                </div>

                {/* Display Banners if available */}
                {post.banners && post.banners.length > 0 && (
                    <div className="mb-6 sm:mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Related Images</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {post.banners.map((banner) => (
                                <div key={banner.id} className="rounded-lg overflow-hidden shadow-md">
                                    <img
                                        src={banner.image_url}
                                        alt={banner.image_content || "Blog banner"}
                                        className="w-full h-48 object-cover"
                                        loading="lazy"
                                    />
                                    {banner.image_content && (
                                        <p className="p-3 bg-white text-sm text-gray-600">
                                            {banner.image_content}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
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