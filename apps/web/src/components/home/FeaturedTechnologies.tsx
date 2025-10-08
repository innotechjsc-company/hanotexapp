"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, Heart, TrendingUp, User } from "lucide-react";
import Image from "next/image";
import { Technology } from "@/types";
import {
  formatCurrency,
  formatDate,
  getTRLColor,
  getStatusText,
  getStatusColor,
} from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getTechnologies } from "@/api/technologies";
import { getFullMediaUrl } from "@/utils/mediaUrl";

export default function FeaturedTechnologies() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedTechnologies = async () => {
      try {
        const response = await getTechnologies(
          {
            status: "active",
            visibility_mode: "public",
          },
          {
            limit: 3,
            sort: "-createdAt",
          }
        );

        const list = (
          Array.isArray((response as any).data)
            ? (response as any).data
            : Array.isArray((response as any).docs)
              ? (response as any).docs
              : []
        ) as Technology[];
        setTechnologies(list);
      } catch (error) {
        console.error("Error fetching featured technologies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTechnologies();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sản phẩm Khoa học Công nghệ Nổi bật
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Khám phá những sản phẩm công nghệ tiên tiến và giải pháp sáng tạo từ
            các nhà khoa học hàng đầu
          </p>
        </div>

        {/* Technologies Grid */}
        {technologies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {technologies.map((tech) => (
              <div
                key={tech.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full"
              >
                {/* Image Section */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                  {tech.image &&
                  typeof tech.image === "object" &&
                  tech.image.url ? (
                    <img
                      src={getFullMediaUrl(tech.image.url)}
                      alt={tech.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full border-2 border-white/50 flex items-center justify-center bg-white/10 backdrop-blur-sm">
                          <Image
                            src="/logo.png"
                            alt="Hanotex"
                            width={48}
                            height={48}
                            className="object-contain opacity-80"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Badges Container */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 gap-2">
                    {/* Status Badge */}
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium text-white truncate ${getBadgeColor(tech.category)}`}
                    >
                      {getBadgeText(tech.category)}
                    </span>

                    {/* Trending Badge */}
                    {tech.trl_level && Number(tech.trl_level) >= 7 && (
                      <span className="inline-block flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium bg-orange-500 text-white">
                        TRENDING
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col flex-grow">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {tech.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-3 text-sm line-clamp-3">
                    {tech.description ||
                      "Giải pháp kỹ thuật tiên tiến cho việc chẩn đoán và phân tích dữ liệu về tế độ chính xác cao."}
                  </p>

                  {/* Author & Price */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {typeof tech.submitter === "object" &&
                          tech.submitter?.full_name
                            ? tech.submitter?.full_name
                            : "_"}
                        </p>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {tech.pricing?.price_from
                        ? formatCurrency(tech.pricing.price_from, "VND")
                        : "2.5 tỷ VND"}
                    </div>
                  </div>

                  {/* Footer - Always at bottom */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>
                        {Math.floor(Math.random() * 2000) + 1000} lượt xem
                      </span>
                    </div>

                    <Link
                      href={`/technologies/${tech.id}`}
                      className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors group"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              Chưa có công nghệ nào
            </h3>
            <p className="text-gray-400">
              Hãy là người đầu tiên đăng tải công nghệ lên sàn giao dịch
            </p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/technologies"
            className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500 group"
          >
            Xem tất cả công nghệ
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Helper functions for badges and categories
function getBadgeColor(category: any): string {
  if (!category) return "bg-blue-500";

  const categoryName =
    (typeof category === "object" ? category.name : category)?.toLowerCase() ||
    "";

  if (
    categoryName.includes("ai") ||
    categoryName.includes("machine learning")
  ) {
    return "bg-purple-500";
  }
  if (categoryName.includes("energy") || categoryName.includes("green")) {
    return "bg-green-500";
  }
  if (categoryName.includes("bio") || categoryName.includes("medical")) {
    return "bg-red-500";
  }
  if (
    categoryName.includes("manufactur") ||
    categoryName.includes("industry")
  ) {
    return "bg-orange-500";
  }
  return "bg-blue-500";
}

function getBadgeText(category: any): string {
  if (category && typeof category === "object" && category.name) {
    return category.name;
  }
  if (typeof category === "string" && category) {
    return category;
  }
  return "Công nghệ chung";
}

// Helper function for user type label
function getUserTypeLabel(userType: string): string {
  const userTypeLabels: Record<string, string> = {
    INDIVIDUAL: "Cá nhân",
    COMPANY: "Doanh nghiệp",
    RESEARCH_INSTITUTION: "Viện/Trường",
  };

  return userTypeLabels[userType] || userType;
}
