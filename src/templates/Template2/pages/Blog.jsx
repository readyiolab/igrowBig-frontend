import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import {
  BookOpen,
  Clock,
  User,
  Share2,
  Heart,
  ArrowRight,
  Tag,
  Search,
  Eye
} from 'lucide-react';

// Carousel content
const blogCarouselContent = [
  {
    id: 1,
    title: 'Spring Fashion Unveiled',
    description: 'Discover the hottest trends for 2025',
    image: 'https://plus.unsplash.com/premium_photo-1720744786849-a7412d24ffbf?q=80&w=2009&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Beauty Secrets Revealed',
    description: 'Master your makeup routine',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Style Icons of the Year',
    description: 'Inspiration from the runway',
    image: 'https://plus.unsplash.com/premium_photo-1683309565422-77818a287060?q=80&w=2070&auto=format&fit=crop'
  },
];

// Blog categories
const categories = ['ALL', 'COMPANY', 'FASHION', 'STYLE', 'TRENDS', 'BEAUTY'];

// Blog posts data
const blogPosts = [
  {
    id: 1,
    title: 'Top 10 Fashion Trends for 2025',
    category: 'TRENDS',
    date: 'March 06, 2025',
    readTime: 6,
    excerpt: 'Get ahead of the curve with these must-know fashion trends for the upcoming season.',
    author: 'Emma Style',
    image: 'https://images.unsplash.com/photo-1516763296043-f676c1105999?q=80&w=2043&auto=format&fit=crop',
    tags: ['fashion', 'trends', '2025'],
    likes: 32,
    views: 1240
  },
  {
    id: 2,
    title: 'Spring Beauty Essentials',
    category: 'BEAUTY',
    date: 'March 05, 2025',
    readTime: 4,
    excerpt: 'The ultimate guide to refreshing your beauty routine this spring.',
    author: 'Lily Glam',
    image: 'https://plus.unsplash.com/premium_photo-1689371953070-10782471db47?q=80&w=1974&auto=format&fit=crop',
    tags: ['beauty', 'makeup', 'spring'],
    likes: 25,
    views: 980
  },
  {
    id: 3,
    title: 'Company Spotlight: Sustainable Fashion',
    category: 'COMPANY',
    date: 'March 04, 2025',
    readTime: 5,
    excerpt: 'How our brand is revolutionizing eco-friendly style.',
    author: 'Sophie Green',
    image: 'https://images.unsplash.com/photo-1595270320786-94dd95d4a1db?q=60&w=600&auto=format&fit=crop',
    tags: ['company', 'sustainability', 'fashion'],
    likes: 18,
    views: 750
  },
];

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    let updatedPosts = [...blogPosts];
    if (activeCategory !== 'ALL') {
      updatedPosts = updatedPosts.filter(post => post.category === activeCategory);
    }
    updatedPosts = updatedPosts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    if (sortBy === 'likes') {
      updatedPosts.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'views') {
      updatedPosts.sort((a, b) => b.views - a.views);
    } else {
      updatedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    setFilteredPosts(updatedPosts);
  }, [searchQuery, activeCategory, sortBy]);

  const handleLike = (postId) => {
    setFilteredPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f7e5d9' }}>
      {/* Carousel Section */}
      <section className="relative w-full">
        <Carousel className="w-full" plugins={[Autoplay({ delay: 4000 })]}>
          <CarouselContent>
            {blogCarouselContent.map((item) => (
              <CarouselItem key={item.id}>
                <div className="relative w-full h-60 sm:h-72 md:h-88 lg:h-[520px] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-95 transition-transform duration-600 hover:scale-110"
                    loading="lazy"
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-[#822b00]/70 to-transparent" 
                    style={{ background: 'linear-gradient(to right, #822b00 70%, transparent)' }}
                  />
                  <div className="absolute top-1/2 left-6 sm:left-8 lg:left-12 transform -translate-y-1/2 text-center max-w-2xl">
                    <h1 
                      className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 tracking-tight"
                      style={{ color: '#f7e5d9' }}
                    >
                      {item.title}
                    </h1>
                    <p 
                      className="text-base sm:text-lg mb-5"
                      style={{ color: '#f7e5d9' }}
                    >
                      {item.description}
                    </p>
                    <Button
                      className="rounded-lg px-6 py-3 font-semibold shadow-md hover:shadow-xl transition-all duration-400"
                      style={{ backgroundColor: '#822b00', color: '#f7e5d9' }}
                    >
                      Explore Now <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 rounded-lg" style={{ color: '#822b00', borderColor: '#822b00' }} />
          <CarouselNext className="right-4 top-1/2 -translate-y-1/2 rounded-lg" style={{ color: '#822b00', borderColor: '#822b00' }} />
        </Carousel>
      </section>

      {/* Blog Posts Section */}
      <section className="py-10 sm:py-14 lg:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 rounded-xl shadow-xl p-6" style={{ backgroundColor: '#f7e5d9' }}>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-400 ${
                  activeCategory === category
                    ? 'bg-[#822b00] text-[#f7e5d9]'
                    : 'bg-[#f7e5d9] text-[#822b00] border border-[#822b00] hover:bg-[#822b00] hover:text-[#f7e5d9]'
                }`}
                style={{ boxShadow: activeCategory === category ? '0 4px 12px rgba(130, 43, 0, 0.2)' : 'none' }}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#822b00' }} />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm rounded-lg border-2 focus:outline-none focus:ring-2 shadow-md"
                style={{ borderColor: '#822b00', color: '#822b00', backgroundColor: '#f7e5d9', focusRingColor: '#822b00' }}
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-3 text-sm rounded-lg border-2 focus:outline-none focus:ring-2 shadow-md"
              style={{ borderColor: '#822b00', color: '#822b00', backgroundColor: '#f7e5d9' }}
            >
              <option value="date">Date</option>
              <option value="likes">Likes</option>
              <option value="views">Views</option>
            </select>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="rounded-xl shadow-xl overflow-hidden cursor-pointer group transition-all duration-400"
              style={{ backgroundColor: '#f7e5d9' }}
            >
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-600"
                  loading="lazy"
                />
                <span 
                  className="absolute top-3 left-3 text-xs px-3 py-1 rounded font-semibold"
                  style={{ backgroundColor: '#822b00', color: '#f7e5d9' }}
                >
                  {post.category}
                </span>
              </div>
              <div className="p-5">
                <h4 
                  className="text-lg sm:text-xl font-bold mb-3 group-hover:text-[#822b00] transition-colors line-clamp-1"
                  style={{ color: '#822b00' }}
                >
                  {post.title}
                </h4>
                <p 
                  className="text-sm mb-4 line-clamp-2"
                  style={{ color: '#822b00' }}
                >
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap justify-between items-center text-sm mb-4 gap-3" style={{ color: '#822b00' }}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{post.date} • {post.readTime}m</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    <span>{post.views.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                      className="flex items-center gap-2 hover:text-red-500 transition-colors"
                      style={{ color: '#822b00' }}
                    >
                      <Heart className="w-5 h-5" />
                      <span>{post.likes}</span>
                    </button>
                    <Share2 className="w-5 h-5 hover:text-[#822b00] transition-colors" />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {post.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="text-xs px-2 py-1 rounded-lg font-semibold"
                        style={{ backgroundColor: '#f7e5d9', color: '#822b00', border: '1px solid #822b00' }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Selected Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div 
            className="rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8"
            style={{ backgroundColor: '#f7e5d9' }}
          >
            <div className="flex justify-between items-center mb-5">
              <h3 
                className="text-xl sm:text-2xl font-bold line-clamp-1"
                style={{ color: '#822b00' }}
              >
                {selectedPost.title}
              </h3>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-lg font-bold hover:text-[#822b00] transition-colors"
                style={{ color: '#822b00' }}
              >
                ✕
              </button>
            </div>
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full h-52 sm:h-64 object-cover rounded-xl mb-5"
              loading="lazy"
            />
            <div className="flex flex-wrap items-center gap-4 text-sm mb-5" style={{ color: '#822b00' }}>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{selectedPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{selectedPost.date} • {selectedPost.readTime}m</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>{selectedPost.views.toLocaleString()}</span>
              </div>
            </div>
            <p 
              className="text-base leading-relaxed mb-6"
              style={{ color: '#822b00' }}
            >
              {selectedPost.excerpt} {/* Replace with full content if available */}
            </p>
            <Button 
              className="w-full rounded-lg px-6 py-3 font-semibold shadow-md hover:shadow-xl transition-all duration-400"
              style={{ backgroundColor: '#822b00', color: '#f7e5d9' }}
            >
              Read Full Article <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;