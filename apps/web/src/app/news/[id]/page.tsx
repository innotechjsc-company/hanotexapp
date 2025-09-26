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
import { getNewsById, getNews } from "@/api/news";
import { News } from "@/types/news";
import { PAYLOAD_API_BASE_URL } from "@/api/config";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import LikeButton from "@/components/ui/LikeButton";
import ShareModal from "@/components/ui/ShareModal";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

interface NewsArticle {
  id: string;
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

// Helper function to get proper image URL
function getImageUrl(imageData: any): string {
  const fallbackUrl =
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&crop=center";

  if (!imageData?.url) {
    console.log("No image found in news data, using fallback");
    return fallbackUrl;
  }

  const originalUrl = imageData.url;
  console.log("Original image URL from API:", originalUrl);
  console.log("PAYLOAD_API_BASE_URL:", PAYLOAD_API_BASE_URL);

  // Check if URL is already absolute (starts with http/https)
  if (originalUrl.startsWith("http")) {
    console.log("Using absolute URL:", originalUrl);
    return originalUrl;
  }

  // For relative URLs, construct proper URL
  const baseUrl = PAYLOAD_API_BASE_URL?.replace("/api", ""); // Remove /api from base URL

  // Handle different URL formats
  let cleanUrl = originalUrl;
  if (!cleanUrl.startsWith("/")) {
    cleanUrl = `/${cleanUrl}`;
  }

  const constructedUrl = `${baseUrl}${cleanUrl}`;
  console.log("Constructed relative URL:", constructedUrl);

  return constructedUrl;
}

// Helper function to convert News to display format
function convertNewsToArticle(news: News): NewsArticle {
  const imageUrl = getImageUrl(news.image);

  // Parse hashtags
  const tags = news.hashtags
    ? news.hashtags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
    : [];

  return {
    id: news.id || "",
    title: news.title,
    excerpt:
      news.content && news.content.length > 200
        ? news.content.substring(0, 200) + "..."
        : news.content,
    content: news.content,
    author: "Ban biên tập HANOTEX",
    published_at: news.createdAt,
    category: "Tin tức",
    read_time: "3 phút",
    featured_image: imageUrl,
    gallery_images: [imageUrl],
    tags: tags,
    views: news.views || 0,
    likes: news.likes || 0,
    is_featured: true,
  };
}

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [shareModal, setShareModal] = useState<{
    isOpen: boolean;
    article: NewsArticle | null;
  }>({ isOpen: false, article: null });

  useEffect(() => {
    const fetchArticleAndRelated = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch main article data from API
        const newsData = await getNewsById(params.id);
        const articleData = convertNewsToArticle(newsData);
        setArticle(articleData);

        // Fetch related articles (2 random articles, excluding current one)
        const relatedResponse = await getNews({}, { limit: 3, page: 1 });
        const relatedData = relatedResponse.data || [];

        // Convert to NewsArticle format and exclude current article
        const relatedConverted = relatedData
          .filter((news) => news.id !== params.id)
          .slice(0, 2)
          .map(convertNewsToArticle);

        setRelatedArticles(relatedConverted);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticleAndRelated();
  }, [params.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle share button click
  const handleShareClick = (e: React.MouseEvent, article: NewsArticle) => {
    e.preventDefault();
    e.stopPropagation();
    setShareModal({ isOpen: true, article });
  };

  // Close share modal
  const closeShareModal = () => {
    setShareModal({ isOpen: false, article: null });
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Có lỗi xảy ra
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/news" className="text-blue-600 hover:text-blue-700">
            Quay lại danh sách tin tức
          </Link>
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
            <div className="flex items-center">
              <LikeButton
                newsId={article.id}
                initialLikes={article.likes}
                variant="compact"
                size="sm"
              />
            </div>
            <div className="flex items-center">
              <button
                onClick={(e) => handleShareClick(e, article)}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 bg-white/10 text-blue-100 hover:bg-white/20"
                title="Chia sẻ bài viết"
              >
                <Share2 className="h-3 w-3" />
                <span className="text-xs font-medium">Chia sẻ</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Image */}
        <div className="relative mb-8 rounded-xl overflow-hidden shadow-lg">
          <ImageWithFallback
            src={article.featured_image}
            alt={article.title}
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

          {/* Share Button on Image */}
          <div className="absolute top-4 right-4">
            <button
              onClick={(e) => handleShareClick(e, article)}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              title="Chia sẻ bài viết"
            >
              <Share2 className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {shareModal.article && (
        <ShareModal
          isOpen={shareModal.isOpen}
          onClose={closeShareModal}
          title={shareModal.article.title}
          url={`/news/${shareModal.article.id}`}
          description={shareModal.article.excerpt}
        />
      )}
    </div>
  );
}
