"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Tag,
  ArrowRight,
  ExternalLink,
  Eye,
  Heart,
  Share2,
  BookOpen,
  TrendingUp,
  X,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import { getNews, NewsFilters, PaginationParams } from "@/api/news";
import { News } from "@/types/news";
import { PAYLOAD_API_BASE_URL } from "@/api/config";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  category: string;
  featured_image: string;
  gallery_images?: string[];
  tags: string[];
  views: number;
  likes: number;
}

// Helper function to get full image URL
function getFullImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) {
    return "/images/news/default.svg";
  }

  // If it's already a full URL, return as is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // If it's a relative path, combine with PayloadCMS base URL
  const baseUrl = PAYLOAD_API_BASE_URL.replace("/api", "");
  return `${baseUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}

// Transform PayloadCMS News data to NewsArticle interface
function transformNewsToArticle(news: News): NewsArticle {
  let imageUrl = "/images/news/default.svg";

  if (typeof news.image === "object" && news.image?.url) {
    imageUrl = getFullImageUrl(news.image.url);
  } else if (typeof news.image === "string") {
    imageUrl = getFullImageUrl(news.image);
  }

  const tags = news.hashtags
    ? news.hashtags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  return {
    id: news.id || "",
    title: news.title,
    excerpt:
      news.content.length > 200
        ? news.content.substring(0, 200) + "..."
        : news.content,
    content: news.content,
    author: "Ban biên tập HANOTEX", // Default author since not in News model
    published_at: news.createdAt,
    category: "Tin tức", // Default category since not in News model
    featured_image: imageUrl,
    gallery_images: [imageUrl], // Use main image as gallery
    tags: tags,
    views: news.views ?? 0,
    likes: news.likes ?? 0,
  };
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState(""); // Query được sử dụng để gọi API
  const [sortBy, setSortBy] = useState("published_at");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch news from API
  const fetchNews = async (isLoadMore = false, customSearchQuery?: string) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const filters: NewsFilters = {};
      const pagination: PaginationParams = {
        page: isLoadMore ? currentPage + 1 : 1,
        limit: 10,
        sort: sortBy === "published_at" ? "-createdAt" : sortBy,
      };

      // Add search filter
      const searchQueryToUse =
        customSearchQuery !== undefined ? customSearchQuery : activeSearchQuery;
      if (searchQueryToUse.trim()) {
        filters.search = searchQueryToUse.trim();
      }

      const response = await getNews(filters, pagination);

      if (response.docs && Array.isArray(response.docs)) {
        const transformedArticles = (response.docs as unknown as News[]).map(
          transformNewsToArticle
        );

        if (isLoadMore) {
          setArticles((prev) => [...prev, ...transformedArticles]);
          setCurrentPage((prev) => prev + 1);
        } else {
          setArticles(transformedArticles);
          setCurrentPage(1);
        }
        setTotalDocs(response.totalDocs || 0);
      } else if (response.data && Array.isArray(response.data)) {
        const transformedArticles = (response.data as unknown as News[]).map(
          transformNewsToArticle
        );

        if (isLoadMore) {
          setArticles((prev) => [...prev, ...transformedArticles]);
        } else {
          setArticles(transformedArticles);
        }
        setTotalDocs(response.data.length);
      } else {
        if (!isLoadMore) {
          setArticles([]);
          setTotalDocs(0);
        }
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Không thể tải tin tức. Vui lòng thử lại sau.");
      if (!isLoadMore) {
        setArticles([]);
        setTotalDocs(0);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchNews();
  }, [sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Nếu đã có activeSearchQuery, thực hiện xóa tìm kiếm
    if (activeSearchQuery) {
      setSearchQuery("");
      setActiveSearchQuery("");
      setCurrentPage(1);
      fetchNews(false, "");
      return;
    }

    // Nếu chưa có activeSearchQuery, thực hiện tìm kiếm
    const newSearchQuery = searchQuery.trim();
    if (newSearchQuery) {
      setActiveSearchQuery(newSearchQuery);
      setCurrentPage(1);
      fetchNews(false, newSearchQuery);
    }
  };

  const handleLoadMore = () => {
    fetchNews(true);
  };

  const handleRetry = () => {
    fetchNews();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
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
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
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
              Cập nhật những thông tin mới nhất về khoa học công nghệ và các sự
              kiện quan trọng
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
            <h2 className="text-lg font-semibold text-gray-900">
              Tìm kiếm & Lọc
            </h2>
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
                className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center ${
                  activeSearchQuery
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                }`}
              >
                {activeSearchQuery ? (
                  <X className="h-4 w-4 mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                {activeSearchQuery ? "Xóa tìm kiếm" : "Tìm kiếm"}
              </button>
            </div>
          </form>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-blue-50 text-blue-600 rounded-full px-4 py-2">
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">
                <span className="font-bold">{articles.length}</span> bài viết
                {activeSearchQuery && (
                  <span className="ml-1 text-gray-500">
                    cho "{activeSearchQuery}"
                  </span>
                )}
              </span>
            </div>
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
        {articles.filter((article) => article.is_featured).length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-orange-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">
                Tin tức nổi bật
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {articles
                .filter((article) => article.is_featured)
                .map((article) => (
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
        {articles.length > 0 ? (
          <div className="space-y-6">
            {articles.map((article) => (
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
              {activeSearchQuery
                ? `Không tìm thấy bài viết nào với từ khóa "${activeSearchQuery}". Hãy thử từ khóa khác.`
                : "Hãy thử thay đổi từ khóa tìm kiếm hoặc danh mục"}
            </p>
          </div>
        )}

        {/* Load More Button */}
        {articles.length > 0 && articles.length < totalDocs && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Đang tải...
                </>
              ) : (
                <>
                  <BookOpen className="mr-2 h-5 w-5" />
                  Xem thêm bài viết
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-red-600 mb-4">
                <ExternalLink className="h-12 w-12 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Có lỗi xảy ra</h3>
                <p className="text-sm mt-2">{error}</p>
              </div>
              <button
                onClick={handleRetry}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-gray-500 mb-4">
                <BookOpen className="h-12 w-12 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Không có bài viết nào</h3>
                <p className="text-sm mt-2">
                  {searchQuery.trim()
                    ? "Không tìm thấy bài viết phù hợp với tiêu chí tìm kiếm."
                    : "Chưa có bài viết nào được đăng tải."}
                </p>
              </div>
              {searchQuery.trim() && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveSearchQuery("");
                    setCurrentPage(1);
                    fetchNews(false, "");
                  }}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Xem tất cả tin tức
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
