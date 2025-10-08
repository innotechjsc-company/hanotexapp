"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getActiveProjectsAll } from "@/api/projects";
import { Project } from "@/types/project";
import { Chip } from "@heroui/react";
import Image from "next/image";
import { getFullMediaUrl } from "@/utils/mediaUrl";

// Helper function to get status label (mapped to ProjectStatusEnum)
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
  const diff = Math.ceil(
    (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff;
};

export default function ActiveProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await getActiveProjectsAll(false, { limit: 12 });
        const list = (response.data as any) || (response.docs as any) || [];
        if (isMounted) setProjects(list);
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
            Dự án đang hoạt động
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá các dự án công nghệ đang được triển khai và phát triển
          </p>
        </div>

        {/* Filters */}
        {/* <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Tất cả lĩnh vực</option>
              <option>AI & Machine Learning</option>
              <option>IoT & Smart Systems</option>
              <option>Blockchain</option>
              <option>Công nghệ xanh</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Tất cả TRL</option>
              <option>TRL 1-3 (Nghiên cứu cơ bản)</option>
              <option>TRL 4-6 (Phát triển)</option>
              <option>TRL 7-9 (Thương mại hóa)</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Tất cả địa điểm</option>
              <option>Hà Nội</option>
              <option>TP. Hồ Chí Minh</option>
              <option>Đà Nẵng</option>
              <option>Khác</option>
            </select>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Lọc
            </button>
          </div>
        </div> */}

        {/* Projects Grid */}
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
                onClick={() => router.push(`/funds/active-projects/${proj.id}`)}
              >
                <div className="h-40 relative overflow-hidden bg-gray-200">
                  {proj.image &&
                  typeof proj.image === "object" &&
                  proj.image.url ? (
                    <img
                      src={getFullMediaUrl(proj.image.url)}
                      alt={proj.name || "Project image"}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <img
                      src={"/logo.png"}
                      alt={"Hanotex"}
                      className="w-full h-full object-contain object-center"
                    />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-wrap gap-2">
                      {/* Technologies: array of ids or objects */}
                      {Array.isArray(proj.technologies) &&
                      proj.technologies.length > 0 ? (
                        proj.technologies
                          .slice(0, 3)
                          .map((tech: any, idx: number) => (
                            <span
                              key={`tech-${proj.id}-${idx}`}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {typeof tech === "string"
                                ? tech
                                : tech?.name || "Công nghệ"}
                            </span>
                          ))
                      ) : (
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                          Dự án
                        </span>
                      )}
                    </div>
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
                      <span className="font-medium">
                        {formatCurrency(proj.goal_money)}
                      </span>
                    </div>
                    {typeof proj.share_percentage === "number" && (
                      <div className="flex items-center justify-between text-sm text-gray-700">
                        <span>Tỷ lệ cổ phần đề xuất (%)</span>
                        <span className="font-medium">
                          {proj.share_percentage}%
                        </span>
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

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
              Trước
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">
              1
            </button>
            <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
              2
            </button>
            <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
              3
            </button>
            <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
              Sau
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
