"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Briefcase, Calendar, DollarSign, Users, Building2, Target } from "lucide-react";
import Link from "next/link";
import { getProjectById } from "@/api/projects";
import { getInvestmentFundById } from "@/api/investment-fund";
import type { Project } from "@/types/project";
import type { InvestmentFund } from "@/types/investment_fund";
import { Chip } from "@heroui/react";

function formatVND(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Helper function to get status label
const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Chờ duyệt";
    case "in_progress":
      return "Đang thực hiện";
    case "completed":
      return "Hoàn thành";
    case "cancelled":
      return "Đã hủy";
    default:
      return status || "Chưa xác định";
  }
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "warning";
    case "in_progress":
      return "primary";
    case "completed":
      return "success";
    case "cancelled":
      return "danger";
    default:
      return "default";
  }
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [investmentFund, setInvestmentFund] = useState<InvestmentFund | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) {
        setError("ID dự án không hợp lệ");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        // Fetch project details
        const projectData = await getProjectById(projectId);

        // Check if projectData is valid
        if (!projectData) {
          throw new Error("Không tìm thấy dự án");
        }
        setProject(projectData);

        // Fetch investment fund if exists
        if (projectData && projectData.investment_fund) {
          const fundId = typeof projectData.investment_fund === "string"
            ? projectData.investment_fund
            : (projectData.investment_fund as any)?.id;

          if (fundId) {
            try {
              const fundData = await getInvestmentFundById(fundId);
              setInvestmentFund(fundData);
            } catch (fundError) {
              console.warn("Could not fetch investment fund:", fundError);
            }
          }
        }

      } catch (err: any) {
        console.error("Error fetching project details:", err);
        setError(err.message || "Có lỗi xảy ra khi tải thông tin dự án");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin dự án...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Không tìm thấy dự án"}
          </h1>
          <Link 
            href="/funds/active-projects" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Quay lại danh sách dự án
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with breadcrumb and back button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center text-sm text-gray-500">
              <Link href="/funds/active-projects" className="hover:text-blue-600">
                Dự án hoạt động
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-gray-900 font-medium">Chi tiết</span>
            </div>
          </div>
        </div>

        {/* Project Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Project Image/Banner */}
          <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="text-center text-white">
              <Briefcase className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-3xl font-bold">{project.name}</h1>
            </div>
          </div>

          {/* Project Info */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                {(typeof project.technologies === "object" && project.technologies && (project.technologies as any).name) || "Dự án công nghệ"}
              </span>
              <Chip color={getStatusColor(project.status || "")} size="lg">
                {getStatusLabel(project.status || "")}
              </Chip>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">{project.name || "Chưa có tên dự án"}</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {project.description || "Chưa có mô tả dự án"}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {formatVND(project.goal_money || 0)}
                </div>
                <div className="text-sm text-gray-600">Mục tiêu vốn</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-gray-900">
                  {project.end_date ? formatDate(project.end_date) : "Chưa xác định"}
                </div>
                <div className="text-sm text-gray-600">Ngày kết thúc</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-gray-900">
                  {(typeof project.user === "object" && project.user && (project.user as any).full_name) ? (project.user as any).full_name : "Chưa xác định"}
                </div>
                <div className="text-sm text-gray-600">Người phụ trách</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Target className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-gray-900">
                  {getStatusLabel(project.status || "")}
                </div>
                <div className="text-sm text-gray-600">Trạng thái</div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Fund Section */}
        {investmentFund && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Building2 className="w-6 h-6 mr-2 text-purple-600" />
              Quỹ đầu tư
            </h3>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {investmentFund.name || "Chưa có tên"}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {investmentFund.description || "Chưa có mô tả"}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                      Quỹ đầu tư
                    </span>
                  </div>
                </div>
                {(investmentFund as any)?.id && (
                  <Link
                    href={`/funds/investment-funds/${(investmentFund as any).id}`}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors ml-4"
                  >
                    Xem chi tiết
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Technology Section */}
        {typeof project.technologies === "object" && project.technologies && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Công nghệ sử dụng
            </h3>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {(project.technologies as any).name}
              </h4>
              {(project.technologies as any).description && (
                <p className="text-gray-600">
                  {(project.technologies as any).description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Documents Section */}
        {project.documents_finance && project.documents_finance.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Tài liệu dự án
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.documents_finance.map((_, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Tài liệu {index + 1}</div>
                      <div className="text-sm text-gray-500">PDF</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Quan tâm đến dự án này?</h2>
          <p className="text-lg mb-6 opacity-90">
            Liên hệ với chúng tôi để tìm hiểu thêm về cơ hội hợp tác và đầu tư
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Liên hệ ngay
            </Link>
            <Link
              href="/funds/active-projects"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Xem dự án khác
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
