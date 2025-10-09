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
  MessageCircle,
  Send,
} from "lucide-react";
import Link from "next/link";
import { getNewsById, getNews } from "@/api/news";
import { News } from "@/types/news";
import { PAYLOAD_API_BASE_URL } from "@/api/config";
import { getFullMediaUrl } from "@/utils/mediaUrl";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import LikeButton from "@/components/ui/LikeButton";
import ShareModal from "@/components/ui/ShareModal";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { useAuth } from "@/store/auth";
import {
  getNewsCommentsForDisplay,
  createNewsComment,
  CommentDisplay,
} from "@/api/newsComment";

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
    return fallbackUrl;
  }

  // Always normalize via CMS-aware helper
  return getFullMediaUrl(imageData.url);
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
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<CommentDisplay[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchNewsComments = async (newsId: string) => {
    try {
      setLoadingComments(true);
      const response = await getNewsCommentsForDisplay(newsId, {
        limit: 50, // Get more comments initially
        sort: "-createdAt", // Newest first
      });
      setComments(response.comments);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !user?.id || !article?.id) return;

    try {
      setSubmittingComment(true);

      const newCommentData = {
        user: user.id,
        news: article.id,
        comment: newComment.trim(),
      };

      await createNewsComment(newCommentData);

      setNewComment("");

      await fetchNewsComments(article.id);
    } catch (err) {
      console.error("Error creating comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  useEffect(() => {
    const fetchArticleAndRelated = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch main article data from API
        const newsData = await getNewsById(params.id);
        const articleData = convertNewsToArticle(newsData);
        setArticle(articleData);

        // Fetch comments
        await fetchNewsComments(params.id);

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

  // Split HTML content roughly in the middle by paragraph boundaries
  const splitHtmlContent = (
    html: string
  ): { first: string; second: string } => {
    if (!html) return { first: "", second: "" };
    const parts = html.split(/<\/p>/i);
    if (parts.length <= 1) {
      const midpoint = Math.ceil(html.length / 2);
      return { first: html.slice(0, midpoint), second: html.slice(midpoint) };
    }
    const midpoint = Math.ceil(parts.length / 2);
    const first = parts.slice(0, midpoint).join("</p>");
    const second = parts.slice(midpoint).join("</p>");
    return { first, second };
  };

  const { first: contentFirstHalf, second: contentSecondHalf } =
    splitHtmlContent(article.content);

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
            <div dangerouslySetInnerHTML={{ __html: contentFirstHalf }} />
            {article.featured_image && (
              <div className="my-6">
                <ImageWithFallback
                  src={article.featured_image}
                  alt={article.title}
                  className="w-full rounded-xl object-cover"
                />
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: contentSecondHalf }} />
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Bình luận ({comments.length})
            </h2>
          </div>

          {/* Comment Input */}
          {isAuthenticated ? (
            <div className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Chia sẻ suy nghĩ của bạn về bài viết..."
                className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                disabled={submittingComment}
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleCommentSubmit}
                  disabled={!newComment.trim() || submittingComment}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                >
                  {submittingComment ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang đăng...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Đăng bình luận
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 mb-3">
                Bạn cần đăng nhập để bình luận
              </p>
              <Link
                href="/auth/login"
                className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Đăng nhập
              </Link>
            </div>
          )}

          {/* Comments List */}
          {loadingComments ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải bình luận...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {comment.user.initial}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {comment.user.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ!</p>
                </div>
              )}
            </div>
          )}
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
