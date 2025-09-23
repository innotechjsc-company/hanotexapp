"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, Heart, TrendingUp } from "lucide-react";
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
            limit: 6,
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Công nghệ nổi bật
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá những công nghệ mới nhất và tiên tiến nhất được đăng tải
            trên sàn giao dịch
          </p>
        </div>

        {/* Technologies Grid */}
        {technologies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {technologies.map((tech, index) => (
              <div
                key={tech.id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="px-6 py-4">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(tech.status)}`}
                    >
                      {getStatusText(tech.status)}
                    </span>
                    {tech.trl_level && (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTRLColor(Number(tech.trl_level))}`}
                      >
                        TRL {String(tech.trl_level)}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {tech.title}
                  </h3>

                  {/* Summary */}
                  {tech.description && (
                    <p
                      className="text-gray-600 mb-4 overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {tech.description}
                    </p>
                  )}

                  {/* Category */}
                  {tech.category && (
                    <div className="text-sm text-gray-500 mb-4">
                      <span className="font-medium">Danh mục:</span>{" "}
                      {typeof tech.category === "object"
                        ? tech.category.name
                        : "N/A"}
                    </div>
                  )}

                  {/* Price */}
                  {tech.pricing && (
                    <div className="text-lg font-bold text-primary-600 mb-4">
                      {formatCurrency(
                        tech.pricing.price_from,
                        tech.pricing.currency
                      )}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{formatDate(tech.createdAt || "")}</span>
                    <span>
                      {getUserTypeLabel(
                        typeof tech.submitter === "object"
                          ? tech.submitter.user_type
                          : ""
                      )}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/technologies/${tech.id}`}
                      className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 group"
                    >
                      Xem chi tiết
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <div className="flex items-center space-x-3">
                      <button className="flex items-center space-x-1 text-gray-400 hover:text-red-500 transition-colors">
                        <Heart className="h-4 w-4" />
                        <span className="text-xs">0</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors">
                        <Eye className="h-4 w-4" />
                        <span className="text-xs">0</span>
                      </button>
                    </div>
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

// Helper function for user type label
function getUserTypeLabel(userType: string): string {
  const userTypeLabels: Record<string, string> = {
    INDIVIDUAL: "Cá nhân",
    COMPANY: "Doanh nghiệp",
    RESEARCH_INSTITUTION: "Viện/Trường",
  };

  return userTypeLabels[userType] || userType;
}
