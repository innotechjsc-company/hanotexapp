"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Tag,
  ArrowLeft,
  Eye,
  Heart,
  Share2,
  BookOpen,
  TrendingUp,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

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

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data - in real app, fetch from API
  const mockArticle: NewsArticle = {
    id: parseInt(params.id),
    title: "HANOTEX chính thức ra mắt sàn giao dịch công nghệ",
    excerpt:
      "Sàn giao dịch công nghệ HANOTEX đã chính thức đi vào hoạt động, kết nối các bên trong hệ sinh thái khoa học công nghệ Hà Nội với mục tiêu thúc đẩy chuyển giao và thương mại hóa công nghệ.",
    content: `
      <p>Sàn giao dịch công nghệ HANOTEX đã chính thức đi vào hoạt động, đánh dấu một bước ngoặt quan trọng trong việc kết nối các bên trong hệ sinh thái khoa học công nghệ Hà Nội. Với mục tiêu thúc đẩy chuyển giao và thương mại hóa công nghệ, HANOTEX hứa hẹn sẽ trở thành cầu nối quan trọng giữa các nhà nghiên cứu, doanh nghiệp và nhà đầu tư.</p>
      
      <h2>Mục tiêu và tầm nhìn</h2>
      <p>HANOTEX được thiết kế để tạo ra một môi trường minh bạch và hiệu quả cho việc giao dịch công nghệ. Sàn giao dịch này sẽ giúp:</p>
      <ul>
        <li>Kết nối các nhà nghiên cứu với doanh nghiệp</li>
        <li>Tạo cơ hội thương mại hóa kết quả nghiên cứu</li>
        <li>Hỗ trợ quá trình chuyển giao công nghệ</li>
        <li>Thúc đẩy đổi mới sáng tạo trong khu vực</li>
      </ul>
      
      <h2>Tính năng nổi bật</h2>
      <p>Sàn giao dịch HANOTEX được trang bị nhiều tính năng hiện đại:</p>
      <ul>
        <li>Hệ thống đăng ký và quản lý tài khoản thông minh</li>
        <li>Công cụ tìm kiếm và lọc công nghệ tiên tiến</li>
        <li>Hệ thống đấu giá trực tuyến</li>
        <li>Dịch vụ tư vấn và hỗ trợ chuyên nghiệp</li>
      </ul>
      
      <h2>Kế hoạch phát triển</h2>
      <p>Trong thời gian tới, HANOTEX sẽ tiếp tục mở rộng và phát triển các tính năng mới, bao gồm tích hợp AI để tối ưu hóa quá trình kết nối và đưa ra gợi ý phù hợp cho người dùng.</p>
    `,
    author: "Ban biên tập HANOTEX",
    published_at: "2025-01-15",
    category: "Tin tức",
    read_time: "3 phút",
    featured_image: "/images/news/hanotex-launch.jpg",
    gallery_images: [
      "/images/news/hanotex-launch.jpg",
      "/images/news/tech-trends-2025.jpg",
      "/images/news/startup-policy.jpg",
      "/images/news/hanotex-launch.jpg",
    ],
    tags: ["HANOTEX", "Ra mắt", "Công nghệ", "Đổi mới sáng tạo"],
    views: 1250,
    likes: 45,
    is_featured: true,
  };

  useEffect(() => {
    // Simulate API call
    const fetchArticle = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setArticle(mockArticle);
      setLoading(false);
    };

    fetchArticle();
  }, [params.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const nextImage = () => {
    if (article?.gallery_images) {
      setCurrentImageIndex((prev) =>
        prev === article.gallery_images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (article?.gallery_images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? article.gallery_images!.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy bài viết
          </h1>
          <Link href="/news" className="text-blue-600 hover:text-blue-700">
            Quay lại danh sách tin tức
          </Link>
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
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link
              href="/news"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại tin tức
            </Link>
          </div>

          <div className="flex items-center space-x-3 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
              {article.category}
            </span>
            {article.is_featured && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-500 text-white">
                <TrendingUp className="h-3 w-3 mr-1" />
                Nổi bật
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {article.title}
          </h1>

          <div className="flex items-center space-x-6 text-blue-100">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(article.published_at)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{article.read_time}</span>
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              <span>{article.views} lượt xem</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Image */}
        <div className="relative mb-8 rounded-xl overflow-hidden shadow-lg">
          <img
            src={article.featured_image}
            alt={article.title}
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        </div>

        {/* Gallery Images */}
        {article.gallery_images && article.gallery_images.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <ImageIcon className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">
                Hình ảnh liên quan
              </h2>
            </div>

            <div className="relative">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <img
                  src={article.gallery_images[currentImageIndex]}
                  alt={`Gallery image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Navigation buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
              </div>

              {/* Thumbnail navigation */}
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {article.gallery_images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                      index === currentImageIndex ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Article Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {}}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${"bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"}`}
              >
                <Heart className={`h-4 w-4 mr-2fill-current`} />
                <span>{article.likes}</span>
              </button>

              <button className="flex items-center px-4 py-2 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                <Share2 className="h-4 w-4 mr-2" />
                Chia sẻ
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">
              Bài viết liên quan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=120&h=80&fit=crop&crop=center"
                  alt="Related article"
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    Hội thảo "Xu hướng công nghệ 2025" tại Hà Nội
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">5 phút đọc</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="h-3 w-3 mr-1" />
                    <span>890 lượt xem</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=120&h=80&fit=crop&crop=center"
                  alt="Related article"
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    Chính sách hỗ trợ doanh nghiệp khởi nghiệp công nghệ
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">4 phút đọc</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="h-3 w-3 mr-1" />
                    <span>1,560 lượt xem</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
