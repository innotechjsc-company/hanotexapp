"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getDemands } from "@/api/demands";
import type { Demand } from "@/types/demand";

export default function SupplyDemandSection() {
  const [loading, setLoading] = useState(true);
  const [demands, setDemands] = useState<Demand[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const demandRes = await getDemands(
          {},
          { limit: 2, sort: "-createdAt" }
        );

        const demandList = (
          Array.isArray((demandRes as any).data)
            ? (demandRes as any).data
            : Array.isArray((demandRes as any).docs)
              ? (demandRes as any).docs
              : []
        ) as Demand[];
        setDemands(demandList.slice(0, 2));
      } catch (error) {
        console.error("Error fetching demand data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // demands are now loaded from API

  if (loading) {
    return (
      <section className="py-5 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-7 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Demands List */}
          <div>
            {/* Section Header */}
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nhu cầu Khoa học Công nghệ
              </h2>
              <p className="text-lg text-gray-600">
                Kết nối doanh nghiệp với các nhà khoa học để giải quyết những
                thách thức công nghệ thực tế
              </p>
            </div>

            {/* Demands List */}
            <div className="space-y-3">
              {demands.length > 0 ? (
                demands.map((demand, index) => (
                  <Link
                    key={(demand as any).id ?? demand.title}
                    href={`/demands/${(demand as any).id || (demand as any)._id || encodeURIComponent(demand.title)}`}
                    className="block  rounded-lg transition-all duration-200 cursor-pointer group"
                  >
                    {/* Color bar on the left */}
                    <div className="flex p-4">
                      <div
                        className={`w-1 rounded-full mr-3 ${
                          index === 0
                            ? "bg-green-500"
                            : index === 1
                              ? "bg-blue-500"
                              : "bg-purple-500"
                        }`}
                      />
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {demand.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {demand.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {typeof demand.category === "object"
                              ? (demand.category as any).name
                              : demand.category || "Nông nghiệp"}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            IoT
                          </span>
                        </div>

                        {/* Budget */}
                        <div className="text-sm text-gray-700">
                          <span className="font-bold text-gray-900">
                            Ngân sách:{" "}
                          </span>
                          <span className="font-bold text-green-600 text-base">
                            {demand.from_price && demand.to_price ? (
                              <>
                                {new Intl.NumberFormat("vi-VN").format(
                                  demand.from_price
                                )}{" "}
                                VNĐ
                              </>
                            ) : (
                              "Liên hệ"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có nhu cầu mới</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <Link
                href="/demands"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
              >
                Xem tất cả nhu cầu
              </Link>
              <Link
                href="/demands/register"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500"
              >
                Đăng nhu cầu mới
              </Link>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="flex items-center justify-center h-full">
            <div className="relative w-full max-w-lg">
              <img
                src="https://ictv.1cdn.vn/2021/09/09/ictvietnam-mediacdn-vn-iot-16310978301901453862004.jpeg"
                alt="Kết nối thành công"
                className="rounded-2xl shadow-xl w-full h-auto object-cover aspect-[4/3]"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-6 rounded-b-2xl">
                <h4 className="text-xl font-bold">Kết nối thành công</h4>
                <p className="text-sm">
                  Hơn 3,200 giao dịch thành công đã được thực hiện
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
