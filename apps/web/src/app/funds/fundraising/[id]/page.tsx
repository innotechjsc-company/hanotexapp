"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Briefcase, Calendar, DollarSign, Users, Building2, Clock, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getProjectById } from "@/api/projects";
import { getInvestmentFundById } from "@/api/investment-fund";
import type { Project } from "@/types/project";
import type { InvestmentFund } from "@/types/investment_fund";
import { Chip } from "@heroui/react";
import { Tag } from "antd";

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
      return "magenta";
    case "in_progress":
      return "blue";
    case "completed":
      return "green";
    case "cancelled":
      return "red";
    default:
      return "gray";
  }
};

export default function FundraisingProjectDetailPage() {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
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
            href="/funds/fundraising" 
            className="text-green-600 hover:text-green-800 font-medium"
          >
            Quay lại danh sách dự án gọi vốn
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
              <Link href="/funds/fundraising" className="hover:text-green-600">
                Dự án gọi vốn
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-gray-900 font-medium">Chi tiết</span>
            </div>
          </div>
        </div>

        {/* Project Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Project Image/Banner */}
          <div className="h-64 bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
            <div className="text-center text-white">
              <TrendingUp className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <p className="text-lg opacity-90 mt-2">Dự án đang gọi vốn</p>
            </div>
          </div>

          {/* Project Info */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                {(typeof project.technologies === "object" && project.technologies && (project.technologies as any).name) || "Dự án công nghệ"}
              </span>
              <Tag color={getStatusColor(project.status || "")}>{getStatusLabel(project.status || "")}</Tag>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">{project.name || "Chưa có tên dự án"}</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {project.description || "Chưa có mô tả dự án"}
            </p>

            {/* Fundraising Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {formatVND(project.goal_money || 0)}
                </div>
                <div className="text-sm text-gray-600">Mục tiêu gọi vốn</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-gray-900">
                  {project.end_date ? formatDate(project.end_date) : "Chưa xác định"}
                </div>
                <div className="text-sm text-gray-600">Hạn gọi vốn</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-gray-900">
                  {(typeof project.user === "object" && project.user && (project.user as any).full_name) || "Chưa xác định"}
                </div>
                <div className="text-sm text-gray-600">Người phụ trách</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <Target className="w-8 h-8 text-orange-600 mx-auto mb-2" />
               <div className="text-lg font-bold text-gray-900">{getStatusLabel(project.status || "")}</div>
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
              Quỹ đầu tư hỗ trợ
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

        {/* Investment Opportunity */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Cơ hội đầu tư
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin tài chính</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mục tiêu gọi vốn:</span>
                  <span className="font-semibold text-green-600">{formatVND(project.goal_money || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hạn chót:</span>
                  <span className="font-semibold">{project.end_date ? formatDate(project.end_date) : "Chưa xác định"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <Tag color={getStatusColor(project.status || "")}>{getStatusLabel(project.status || "")}</Tag>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Lý do đầu tư</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Công nghệ tiên tiến và có tiềm năng thương mại hóa cao
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Đội ngũ có kinh nghiệm và chuyên môn sâu
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Thị trường mục tiêu rộng lớn và đang phát triển
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        {typeof project.technologies === "object" && project.technologies && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Công nghệ cốt lõi
            </h3>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {(project.technologies as any).title}
              </h4>
              {(project.technologies as any).description && (
                <p className="text-gray-600">
                  {(project.technologies as any).description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Quan tâm đầu tư vào dự án này?</h2>
          <p className="text-lg mb-6 opacity-90">
            Liên hệ với chúng tôi để tìm hiểu thêm về cơ hội đầu tư và hợp tác
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Đầu tư ngay
            </Link>
            <Link
              href="/funds/fundraising"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Xem dự án khác
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
