"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  MapPin,
  TrendingUp,
  Users,
  Eye,
} from "lucide-react";
import { Technology } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getTechnologies } from "@/api/technologies";
import { getDemands } from "@/api/demands";
import type { Demand } from "@/types/demand";

export default function SupplyDemandSection() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [demands, setDemands] = useState<Demand[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [techRes, demandRes] = await Promise.all([
          getTechnologies(
            { status: "active", visibility_mode: "public" },
            { limit: 6, sort: "-createdAt" }
          ),
          getDemands({}, { limit: 3, sort: "-createdAt" }),
        ]);

        const techList = (Array.isArray((techRes as any).data)
          ? (techRes as any).data
          : Array.isArray((techRes as any).docs)
          ? (techRes as any).docs
          : []) as Technology[];
        setTechnologies(techList);

        const demandList = (Array.isArray((demandRes as any).data)
          ? (demandRes as any).data
          : Array.isArray((demandRes as any).docs)
          ? (demandRes as any).docs
          : []) as Demand[];
        setDemands(demandList.slice(0, 3));
      } catch (error) {
        console.error("Error fetching supply/demand data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // demands are now loaded from API

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kết nối cung - cầu
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Khám phá công nghệ mới và nhu cầu thị trường để tạo ra những kết nối
            có giá trị
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Supply Side - New Technologies */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">
                Công nghệ mới niêm yết
              </h3>
              <Link
                href="/technologies"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Xem tất cả
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-6">
              {technologies.length > 0 ? (
                technologies.slice(0, 3).map((tech) => (
                  <div
                    key={tech.id}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {tech.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {tech.description}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          TRL {String(tech.trl_level)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Mới cập nhật</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>123 lượt xem</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có công nghệ mới</p>
                </div>
              )}
            </div>
          </div>

          {/* Demand Side - New Demands */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Nhu cầu mới</h3>
              <Link
                href="/demands"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Xem tất cả
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-6">
              {demands.map((demand) => (
                <div
                  key={(demand as any).id ?? demand.title}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {demand.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {demand.description}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {typeof demand.category === "object"
                          ? (demand.category as any).name
                          : demand.category}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center text-gray-500">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>
                        {new Intl.NumberFormat("vi-VN").format(
                          demand.from_price || 0
                        )}
                        {" - "}
                        {new Intl.NumberFormat("vi-VN").format(
                          demand.to_price || 0
                        )}
                        {" VNĐ"}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{demand.cooperation || "Hình thức hợp tác"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {demand.createdAt
                          ? new Date(demand.createdAt).toLocaleDateString(
                              "vi-VN"
                            )
                          : "Mới tạo"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>— lượt xem</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Bạn có công nghệ hoặc nhu cầu?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Tham gia ngay để kết nối với cộng đồng khoa học công nghệ và tìm
              kiếm cơ hội hợp tác
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/technologies/register"
                className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                Đăng công nghệ
              </Link>
              <Link
                href="/demands/register"
                className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border border-blue-600 bg-white text-blue-600 hover:bg-blue-50 focus:ring-blue-500"
              >
                <Users className="mr-2 h-5 w-5" />
                Đăng nhu cầu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
