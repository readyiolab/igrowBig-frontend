import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import {
    Clock,
    User,
    Share2,
    Heart,
    ArrowRight,
    Search,
    Eye
} from "lucide-react";

import useTenantApi from '@/hooks/useTenantApi';

const categories = ["ALL", "COMPANY", "FASHION", "STYLE", "TRENDS", "BEAUTY"];

const Blog = () => {
    const navigate = useNavigate();
    const [selectedPost, setSelectedPost] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("ALL");
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [sortBy, setSortBy] = useState("date");

    const { getAll } = useTenantApi();
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [blogPosts, setBlogPosts] = useState([]);
    const [carouselContent, setCarouselContent] = useState([]);

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getAll("/site/data");
                setPageData(response);

                // Transform API blogs data
                if (response?.blogs && Array.isArray(response.blogs)) {
                    const transformedBlogs = response.blogs
                        .filter(blog => blog.is_visible === 1)
                        .map(blog => ({
                            id: blog.id,
                            title: blog.title,
                            category: "COMPANY",
                            date: new Date(blog.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: '2-digit'
                            }),
                            readTime: Math.ceil(blog.content.split(' ').length / 200),
                            excerpt: blog.content.substring(0, 150) + '...',
                            content: blog.content,
                            author: "Admin",
                            image: blog.image_url,
                            tags: ["blog", "article"],
                            likes: 0,
                            views: 0,
                            banners: blog.banners || []
                        }));

                    setBlogPosts(transformedBlogs);
                    setFilteredPosts(transformedBlogs);

                    // Use blog banners for carousel
                    const carouselData = transformedBlogs.slice(0, 3).map((blog) => ({
                        id: blog.id,
                        title: blog.title,
                        description: blog.excerpt,
                        image: blog.banners[0]?.image_url || blog.image
                    }));
                    setCarouselContent(carouselData);
                }

                setError(null);
            } catch (err) {
                console.error("Error fetching blog data:", err);
                setError("Failed to load blog posts");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter and sort posts
    useEffect(() => {
        let updatedPosts = [...blogPosts];
        
        if (activeCategory !== "ALL") {
            updatedPosts = updatedPosts.filter(post => post.category === activeCategory);
        }
        
        updatedPosts = updatedPosts.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        
        if (sortBy === "likes") {
            updatedPosts.sort((a, b) => b.likes - a.likes);
        } else if (sortBy === "views") {
            updatedPosts.sort((a, b) => b.views - a.views);
        } else {
            updatedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        
        setFilteredPosts(updatedPosts);
    }, [searchQuery, activeCategory, sortBy, blogPosts]);

    const handleLike = (postId) => {
        setFilteredPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId ? { ...post, likes: post.likes + 1 } : post
            )
        );
        setBlogPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId ? { ...post, likes: post.likes + 1 } : post
            )
        );
    };

    const handlePostClick = (post) => {
        navigate(`/blog/${post.id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-950 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading blogs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Carousel Section */}
            {carouselContent.length > 0 && (
                <section className="relative w-full">
                    <Carousel className="w-full" plugins={[Autoplay({ delay: 4000 })]}>
                        <CarouselContent>
                            {carouselContent.map((item) => (
                                <CarouselItem key={item.id}>
                                    <div className="relative w-full h-72 sm:h-96 md:h-[500px] overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                        <div className="absolute bottom-8 left-4 sm:left-6 md:left-8 text-white">
                                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 tracking-tight">
                                                {item.title}
                                            </h1>
                                            <p className="text-base sm:text-lg md:text-xl mb-4">{item.description}</p>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2 sm:left-4 top-1/2 -translate-y-1/2" />
                        <CarouselNext className="right-2 sm:right-4 top-1/2 -translate-y-1/2" />
                    </Carousel>
                </section>
            )}

            {/* Blog Posts Section */}
            <section className="py-8 sm:py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                                    activeCategory === category
                                        ? "bg-red-950 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-950"
                            />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-950"
                        >
                            <option value="date">Date</option>
                            <option value="likes">Likes</option>
                            <option value="views">Views</option>
                        </select>
                    </div>
                </div>

                {/* Blog Grid */}
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No blog posts found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <div
                                key={post.id}
                                onClick={() => handlePostClick(post)}
                                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
                            >
                                <div className="relative">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <span className="absolute top-3 left-3 bg-red-950 text-white text-xs px-2 py-1 rounded">
                                        {post.category}
                                    </span>
                                </div>
                                <div className="p-4 sm:p-5">
                                    <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 group-hover:text-red-950 transition-colors line-clamp-1">
                                        {post.title}
                                    </h4>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                                    <div className="flex flex-wrap justify-between items-center text-xs sm:text-sm text-gray-500 mb-3 gap-2">
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <Clock className="w-4 h-4" />
                                            <span>{post.date} • {post.readTime}m</span>
                                        </div>
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <Eye className="w-4 h-4" />
                                            <span>{post.views.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                                                className="flex items-center gap-1 hover:text-red-500 transition-colors"
                                            >
                                                <Heart className="w-4 h-4" />
                                                <span>{post.likes}</span>
                                            </button>
                                            <Share2 className="w-4 h-4 hover:text-indigo-500 transition-colors" />
                                        </div>
                                        <div className="flex gap-1 flex-wrap">
                                            {post.tags.map((tag) => (
                                                <span key={tag} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Blog;