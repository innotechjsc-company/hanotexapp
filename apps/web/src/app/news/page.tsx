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
  ExternalLink
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
  image_url?: string;
  tags: string[];
  views: number;
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
      tags: ['HANOTEX', 'Ra mắt', 'Công nghệ'],
      views: 1250
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
      tags: ['Hội thảo', 'AI', 'IoT', '2025'],
      views: 890
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
      tags: ['Chính sách', 'Khởi nghiệp', 'Hỗ trợ'],
      views: 1560
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
      tags: ['Hướng dẫn', 'Đăng ký', 'Sử dụng'],
      views: 2100
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
      tags: ['Đấu giá', 'Tháng 2', '2025'],
      views: 750
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tin tức & Thông báo
          </h1>
          <p className="text-gray-600">
            Cập nhật những thông tin mới nhất về khoa học công nghệ và các sự kiện quan trọng
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm tin tức..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tìm kiếm
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            <p className="text-gray-600">
              Tìm thấy <span className="font-semibold">{filteredArticles.length}</span> bài viết
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="published_at">Mới nhất</option>
              <option value="views">Xem nhiều nhất</option>
              <option value="title">Theo tên</option>
            </select>
          </div>
        </div>

        {/* Articles List */}
        {filteredArticles.length > 0 ? (
          <div className="space-y-6">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {article.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(article.published_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{article.read_time}</span>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
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
                        <span>{article.views} lượt xem</span>
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
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </button>
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
          <div className="text-center mt-8">
            <button className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Xem thêm bài viết
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
