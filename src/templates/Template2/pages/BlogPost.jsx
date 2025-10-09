import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, User, Eye, Share2, Heart } from 'lucide-react';

// Blog posts data (should ideally be in a separate file or fetched from an API)
const blogPosts = [
    {
        id: 1,
        title: "Top 10 Fashion Trends for 2025",
        category: "TRENDS",
        date: "March 06, 2025",
        readTime: 6,
        excerpt: "Get ahead of the curve with these must-know fashion trends for the upcoming season.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. This post explores the top fashion trends for 2025, including sustainable fabrics, bold colors, and innovative designs. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        author: "Emma Style",
        image: "https://images.unsplash.com/photo-1516763296043-f676c1105999?q=80&w=2043&auto=format&fit=crop",
        tags: ["fashion", "trends", "2025"],
        likes: 32,
        views: 1240
    },
    {
        id: 2,
        title: "Spring Beauty Essentials",
        category: "BEAUTY",
        date: "March 05, 2025",
        readTime: 4,
        excerpt: "The ultimate guide to refreshing your beauty routine this spring.",
        content: "Spring is the perfect time to refresh your beauty routine. In this article, we dive into the must-have products and techniques for a radiant look. From lightweight foundations to vibrant lip colors, discover how to embrace the season’s best trends. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        author: "Lily Glam",
        image: "https://plus.unsplash.com/premium_photo-1689371953070-107824b71c47d?q=80&w=1974&auto=format&fit=crop",
        tags: ["beauty", "makeup", "spring"],
        likes: 25,
        views: 980
    },
    {
        id: 3,
        title: "Company Spotlight: Sustainable Fashion",
        category: "COMPANY",
        date: "March 04, 2025",
        readTime: 5,
        excerpt: "How our brand is revolutionizing eco-friendly style.",
        content: "Sustainability is at the heart of modern fashion. This post highlights our company’s journey towards eco-friendly practices, featuring innovative materials and ethical production methods. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        author: "Sophie Green",
        image: "https://images.unsplash.com/photo-1595270210786-94dd53d4a1db?q=60&w=600&auto=format&fit=crop",
        tags: ["company", "sustainability", "fashion"],
        likes: 18,
        views: 750
    },
];

const BlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const post = blogPosts.find((p) => p.id === parseInt(id));

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f7e5d9' }}>
                <div className="text-center py-12 text-xl font-semibold" style={{ color: '#822b00' }}>
                    Blog post not found
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f7e5d9' }}>
            {/* Hero Section */}
            <section className="relative w-full h-60 sm:h-72 md:h-88 lg:h-[520px] overflow-hidden">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover opacity-95 transition-transform duration-600 hover:scale-110"
                    loading="lazy"
                />
                <div 
                    className="absolute inset-0 bg-gradient-to-r from-[#822b00]/70 to-transparent" 
                    style={{ background: 'linear-gradient(to right, #822b00 70%, transparent)' }}
                />
                <div className="absolute top-1/2 left-6 sm:left-8 lg:left-12 transform -translate-y-1/2 text-center max-w-2xl">
                    <span 
                        className="inline-block text-xs px-3 py-1 rounded mb-3 font-semibold"
                        style={{ backgroundColor: '#822b00', color: '#f7e5d9' }}
                    >
                        {post.category}
                    </span>
                    <h1 
                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold drop-shadow-lg"
                        style={{ color: '#f7e5d9' }}
                    >
                        {post.title}
                    </h1>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-grow">
                <Button
                    onClick={() => navigate('/template2/blog')}
                    className="mb-8 rounded-lg px-4 py-2 font-semibold shadow-md hover:shadow-lg transition-all duration-400 flex items-center gap-3"
                    style={{ backgroundColor: '#822b00', color: '#f7e5d9' }}
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Blog
                </Button>

                <div className="flex flex-wrap items-center gap-4 text-base mb-8 rounded-xl shadow-xl p-6" style={{ backgroundColor: '#f7e5d9', color: '#822b00' }}>
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5" /> {post.author}
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" /> {post.date} • {post.readTime}m
                    </div>
                    <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5" /> {post.views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                            <Heart className="w-5 h-5" /> {post.likes}
                        </button>
                        <Share2 className="w-5 h-5 hover:text-[#822b00] transition-colors" />
                    </div>
                </div>

                <div 
                    className="prose prose-base max-w-none text-base leading-relaxed mb-8 rounded-xl shadow-xl p-6"
                    style={{ backgroundColor: '#f7e5d9', color: '#822b00' }}
                >
                    <p>{post.content}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className="text-xs px-3 py-1 rounded-lg font-semibold hover:bg-[#822b00] hover:text-[#f7e5d9] transition-all duration-300"
                            style={{ backgroundColor: '#f7e5d9', color: '#822b00', border: '1px solid #822b00' }}
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