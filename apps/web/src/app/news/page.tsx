'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar,
  Clock,
  User,
  Tag,
  ArrowRight,
  ExternalLink,
  Image as ImageIcon,
  Eye,
  Heart,
  Share2,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  category: string;
  read_time: string;
  featured_image: string;
  gallery_images?: string[];
  tags: string[];
  views: number;
  likes: number;
  is_featured: boolean;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('published_at');

  // Mock data for news articles
  const mockArticles: NewsArticle[] = [
    {
      id: 1,
      title: 'HANOTEX chính thức ra mắt sàn giao dịch công nghệ',
      excerpt: 'Sàn giao dịch công nghệ HANOTEX đã chính thức đi vào hoạt động, kết nối các bên trong hệ sinh thái khoa học công nghệ Hà Nội với mục tiêu thúc đẩy chuyển giao và thương mại hóa công nghệ.',
      content: 'Nội dung đầy đủ của bài viết...',
      author: 'Ban biên tập HANOTEX',
      published_at: '2025-01-15',
      category: 'Tin tức',
      read_time: '3 phút',
      featured_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop&crop=center',
      gallery_images: [
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&crop=center'
      ],
      tags: ['HANOTEX', 'Ra mắt', 'Công nghệ'],
      views: 1250,
      likes: 45,
      is_featured: true
    },
    {
      id: 2,
      title: 'Hội thảo "Xu hướng công nghệ 2025" tại Hà Nội',
      excerpt: 'Hội thảo quy tụ các chuyên gia hàng đầu trong lĩnh vực AI, IoT và công nghệ sinh học để thảo luận về xu hướng phát triển và cơ hội hợp tác trong năm 2025.',
      content: 'Nội dung đầy đủ của bài viết...',
      author: 'Phòng tổ chức sự kiện',
      published_at: '2025-01-12',
      category: 'Sự kiện',
      read_time: '5 phút',
      featured_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&crop=center',
      gallery_images: [
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop&crop=center'
      ],
      tags: ['Hội thảo', 'AI', 'IoT', '2025'],
      views: 890,
      likes: 32,
      is_featured: false
    },
    {
      id: 3,
      title: 'Chính sách hỗ trợ doanh nghiệp khởi nghiệp công nghệ',
      excerpt: 'Thành phố Hà Nội ban hành chính sách mới hỗ trợ doanh nghiệp khởi nghiệp trong lĩnh vực khoa học công nghệ với các gói hỗ trợ tài chính và ưu đãi thuế.',
      content: 'Nội dung đầy đủ của bài viết...',
      author: 'Sở KH&CN Hà Nội',
      published_at: '2025-01-10',
      category: 'Chính sách',
      read_time: '4 phút',
      featured_image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop&crop=center',
      gallery_images: [
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&crop=center'
      ],
      tags: ['Chính sách', 'Khởi nghiệp', 'Hỗ trợ'],
      views: 1560,
      likes: 67,
      is_featured: true
    },
    {
      id: 4,
      title: 'Hướng dẫn đăng ký và sử dụng sàn HANOTEX',
      excerpt: 'Hướng dẫn chi tiết cách đăng ký tài khoản, đăng tải công nghệ và tìm kiếm đối tác trên sàn giao dịch HANOTEX.',
      content: 'Nội dung đầy đủ của bài viết...',
      author: 'Đội ngũ hỗ trợ',
      published_at: '2025-01-08',
      category: 'Hướng dẫn',
      read_time: '6 phút',
      featured_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&crop=center',
      gallery_images: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&crop=center'
      ],
      tags: ['Hướng dẫn', 'Đăng ký', 'Sử dụng'],
      views: 2100,
      likes: 89,
      is_featured: false
    },
    {
      id: 5,
      title: 'Thông báo về lịch đấu giá công nghệ tháng 2/2025',
      excerpt: 'Thông báo chi tiết về các công nghệ sẽ được đấu giá trong tháng 2/2025, bao gồm thời gian, địa điểm và quy trình tham gia.',
      content: 'Nội dung đầy đủ của bài viết...',
      author: 'Ban tổ chức đấu giá',
      published_at: '2025-01-05',
      category: 'Thông báo',
      read_time: '2 phút',
      featured_image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop&crop=center',
      gallery_images: [
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop&crop=center'
      ],
      tags: ['Đấu giá', 'Tháng 2', '2025'],
      views: 750,
      likes: 23,
      is_featured: false
    }
  ];

  const categories = ['Tất cả', 'Tin tức', 'Sự kiện', 'Chính sách', 'Hướng dẫn', 'Thông báo'];

  useEffect(() => {
    // Simulate API call
    const fetchArticles = async () => {
      setLoading(true);
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setArticles(mockArticles);
      setLoading(false);
    };

    fetchArticles();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter articles based on search query
    const filtered = mockArticles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setArticles(filtered);
  };

  const filteredArticles = selectedCategory === '' || selectedCategory === 'Tất cả'
    ? articles
    : articles.filter(article => article.category === selectedCategory);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <BookOpen className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Tin tức & Sự kiện</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tin tức & Thông báo
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Cập nhật những thông tin mới nhất về khoa học công nghệ và các sự kiện quan trọng
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span className="text-sm">Tin tức nổi bật</span>
              </div>
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">Sự kiện sắp tới</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <Search className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Tìm kiếm & Lọc</h2>
          </div>
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm tin tức, sự kiện, chính sách..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center"
              >
                <Search className="h-4 w-4 mr-2" />
                Tìm kiếm
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-blue-50 text-blue-600 rounded-full px-4 py-2">
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">
                Tìm thấy <span className="font-bold">{filteredArticles.length}</span> bài viết
              </span>
            </div>
            {filteredArticles.filter(article => article.is_featured).length > 0 && (
              <div className="flex items-center bg-orange-50 text-orange-600 rounded-full px-4 py-2">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">
                  {filteredArticles.filter(article => article.is_featured).length} tin nổi bật
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <Filter className="h-4 w-4 mr-2" />
              <span>Sắp xếp:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="published_at">Mới nhất</option>
              <option value="views">Xem nhiều nhất</option>
              <option value="title">Theo tên</option>
            </select>
          </div>
        </div>

        {/* Featured Articles */}
        {filteredArticles.filter(article => article.is_featured).length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-orange-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Tin tức nổi bật</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredArticles.filter(article => article.is_featured).map((article) => (
                <article
                  key={article.id}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-500 text-white">
                        Nổi bật
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                        <Heart className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {article.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(article.published_at)}</span>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h2>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{article.views}</span>
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          <span>{article.likes}</span>
                        </div>
                      </div>
                      <Link 
                        href={`/news/${article.id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Đọc thêm
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Regular Articles List */}
        {filteredArticles.length > 0 ? (
          <div className="space-y-6">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Featured Image */}
                  <div className="md:w-1/3 relative overflow-hidden">
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 text-gray-800">
                        {article.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                        <Heart className="h-4 w-4 text-white" />
                      </button>
                      <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                        <Share2 className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(article.published_at)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{article.read_time}</span>
                        </div>
                      </div>
                      {article.is_featured && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Nổi bật
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h2>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{article.views}</span>
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          <span>{article.likes}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {article.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                        <button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm">
                          Đọc thêm
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy bài viết nào
            </h3>
            <p className="text-gray-600">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc danh mục
            </p>
          </div>
        )}

        {/* Load More Button */}
        {filteredArticles.length > 0 && (
          <div className="text-center mt-12">
            <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl">
              <BookOpen className="mr-2 h-5 w-5" />
              Xem thêm bài viết
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
