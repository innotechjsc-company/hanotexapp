"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getActiveProjectsAll } from "@/api/projects";
import { Project } from "@/types/project";
import { Chip } from "@heroui/react";
import Image from "next/image";
import { getFullMediaUrl } from "@/utils/mediaUrl";

// Helper function to get status label
const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Chờ duyệt";
    case "active":
      return "Đang hoạt động";
    case "rejected":
      return "Từ chối";
    default:
      return status;
  }
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "warning";
    case "active":
      return "success";
    case "rejected":
      return "danger";
    default:
      return "default";
  }
};

// Format number as VND currency
const formatCurrency = (value?: number) => {
  if (typeof value !== "number") return "";
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}B ₫`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}M ₫`;
  }
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toLocaleString("vi-VN")} ₫`;
  }
};

// Days remaining until end_date
const getDaysRemaining = (endDate?: string) => {
  if (!endDate) return undefined;
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return undefined;
  const now = new Date();
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
};

export default function FundraisingPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [totalGoalMoney, setTotalGoalMoney] = useState<number>(0);
  const [totalInvestors, setTotalInvestors] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await getActiveProjectsAll(true, { limit: 12 });
        const list = (response.data as any) || (response.docs as any) || [];
        if (isMounted) {
          setProjects(list);

          // Calculate statistics
          setTotalProjects(list.length);
          const sumGoalMoney = list.reduce((sum: number, proj: Project) => sum + (proj.goal_money || 0), 0);
          setTotalGoalMoney(sumGoalMoney);

          const uniqueUsers = new Set<string>();
          list.forEach((proj: Project) => {
            if (typeof proj.user === "object" && proj.user && proj.user.id) {
              uniqueUsers.add(proj.user.id);
            } else if (typeof proj.user === "string") {
              uniqueUsers.add(proj.user);
            }
          });
          setTotalInvestors(uniqueUsers.size);
        }
      } catch (e: any) {
        if (isMounted) setError(e?.message || "Đã xảy ra lỗi");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dự án đang gọi vốn
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá các dự án công nghệ đang tìm kiếm nguồn vốn đầu tư để phát
            triển và mở rộng
          </p>
        </div>

        {/* Investment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{totalProjects}</div>
            <div className="text-gray-600">Dự án đang gọi vốn</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{formatCurrency(totalGoalMoney)}</div>
            <div className="text-gray-600">Tổng vốn cần huy động (VNĐ)</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{totalInvestors}+</div>
            <div className="text-gray-600">Người tạo dự án</div>
          </div>
        </div>

        {/* Filters */}
        {/* <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Tất cả mức vốn</option>
              <option>Dưới 1 tỷ VNĐ</option>
              <option>1-5 tỷ VNĐ</option>
              <option>5-10 tỷ VNĐ</option>
              <option>Trên 10 tỷ VNĐ</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Tất cả giai đoạn</option>
              <option>Seed</option>
              <option>Series A</option>
              <option>Series B</option>
              <option>Series C+</option>
            </select>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Lọc
            </button>
          </div>
        </div> */}

        {/* Fundraising Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading &&
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-40 bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-24 bg-gray-200 rounded-full" />
                    <div className="h-6 w-20 bg-gray-200 rounded-full" />
                  </div>
                  <div className="h-6 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded" />
                </div>
              </div>
            ))}

          {!isLoading && error && (
            <div className="col-span-full text-center text-red-500 py-12">
              {error}
            </div>
          )}

          {!isLoading && !error && projects.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">
              Chưa có dự án nào đang hoạt động
            </div>
          )}

          {!isLoading &&
            !error &&
            projects.map((proj: any) => (
              <div
                key={proj.id || proj.name}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => router.push(`/funds/fundraising/${proj.id}`)}
              >
                <div className="h-40 relative overflow-hidden bg-gray-200">
                {proj.image && typeof proj.image === 'object' && proj.image.url ? (
                    <Image
                      src={getFullMediaUrl(proj.image.url)}
                      alt={proj.name || "Project image"}
                      fill
                      className="object-contain"
                      priority={false}
                    />
                  ) : (
                    <Image
                      src="/logo.png"
                      alt="Hanotex"
                      fill
                      className="object-contain"
                      priority={false}
                    />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Chip color={getStatusColor(proj?.status || "")} size="sm">
                      {getStatusLabel(proj?.status || "")}
                    </Chip>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {proj.name}
                  </h3>
                  {proj.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {proj.description}
                    </p>
                  )}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {typeof proj.user === "object" && proj.user
                          ? proj.user.name || proj.user.email
                          : "Người tạo"}
                      </span>
                      {proj.open_investment_fund && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Mở gọi vốn
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-700">
                      <span>Mục tiêu gọi vốn</span>
                      <span className="font-medium">{formatCurrency(proj.goal_money)}</span>
                    </div>
                    {typeof proj.share_percentage === "number" && (
                      <div className="flex items-center justify-between text-sm text-gray-700">
                        <span>Tỷ lệ cổ phần đề xuất (%)</span>
                        <span className="font-medium">{proj.share_percentage}%</span>
                      </div>
                    )}
                    {/* technologies */}
                    {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                      <div className="flex items-center justify-between text-sm text-gray-700">
                        <span>Công nghệ sử dụng</span>
                        <span className="font-medium">{proj.technologies.length} công nghệ</span>
                      </div>
                    )}
                    {proj.end_date && (
                      <div className="flex items-center justify-between text-sm text-gray-700">
                        <span>Hạn gọi vốn</span>
                        <span className="font-medium">
                          {new Date(proj.end_date).toLocaleDateString("vi-VN")}
                          {(() => {
                            const d = getDaysRemaining(proj.end_date);
                            return typeof d === "number"
                              ? d >= 0
                                ? ``
                                : ` • đã kết thúc`
                              : "";
                          })()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-8 text-center text-white mt-12">
          <h2 className="text-3xl font-bold mb-4">Có dự án cần gọi vốn?</h2>
          <p className="text-xl mb-6 opacity-90">
            Đăng ký dự án của bạn để kết nối với các nhà đầu tư tiềm năng
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Đăng ký dự án
            </a>
            <a
              href="/auth/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Tạo tài khoản
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
