"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Building2, Calendar, DollarSign, Users } from "lucide-react";
import Link from "next/link";
import { getInvestmentFundById } from "@/api/investment-fund";
import { getProjectsByInvestmentFund } from "@/api/projects";
import type { InvestmentFund } from "@/types/investment_fund";
import { Project, ProjectStatusEnum } from "@/types/project";
import { getFullMediaUrl } from "@/utils/mediaUrl";

function formatVND(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function formatVNDShort(value: number) {
  if (value >= 1_000_000_000) return `${Math.round(value / 1_000_000_000)}B VNĐ`;
  if (value >= 1_000_000) return `${Math.round(value / 1_000_000)}M VNĐ`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K VNĐ`;
  return `${value} VNĐ`;
}

export default function InvestmentFundDetailPage() {
  const params = useParams();
  const router = useRouter();
  const fundId = params.id as string;

  const [fund, setFund] = useState<InvestmentFund | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      if (!fundId) {
        setError("ID quỹ đầu tư không hợp lệ");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        // Fetch fund details and projects in parallel
        const [fundData, projectsResponse] = await Promise.all([
          getInvestmentFundById(fundId),
          getProjectsByInvestmentFund(fundId, { limit: 100 })
        ]);

        setFund(fundData);
        
        // Extract projects from response
        const projectList: Project[] = 
          ((projectsResponse as any).docs as Project[]) ||
          ((projectsResponse as any).data as Project[]) ||
          [];
        setProjects(projectList);

      } catch (err: any) {
        console.error("Error fetching fund details:", err);
        setError(err.message || "Có lỗi xảy ra khi tải thông tin quỹ đầu tư");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fundId]);

  const totalFundingAmount = projects.reduce((sum, project) => {
    return sum + (typeof project.goal_money === "number" ? project.goal_money : 0);
  }, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin quỹ đầu tư...</p>
        </div>
      </div>
    );
  }

  if (error || !fund) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Không tìm thấy quỹ đầu tư"}
          </h1>
          <Link 
            href="/funds/investment-funds" 
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Quay lại danh sách quỹ đầu tư
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
              <Link href="/funds/investment-funds" className="hover:text-purple-600">
                Quỹ đầu tư
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-gray-900 font-medium">Chi tiết</span>
            </div>
          </div>
        </div>

        {/* Fund Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Fund Image/Banner */}
          <div className="h-64 relative overflow-hidden bg-gray-200">
            {fund.image && typeof fund.image === 'object' && fund.image.url ? (
              <img src={getFullMediaUrl(fund.image.url)} alt={fund.name} className="object-cover w-full h-64" />
            ) : (
              <div className="h-64 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
            <div className="text-center text-white">
              <Building2 className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-3xl font-bold">{fund.name}</h1>
            </div>
          </div>
          )}
          </div>

          {/* Fund Info */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                Quỹ đầu tư
              </span>
              <span className="text-green-600 font-semibold">
                Đang hoạt động
              </span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">{fund.name}</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {fund.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {formatVNDShort(totalFundingAmount)}
                </div>
                <div className="text-sm text-gray-600">Tổng vốn đầu tư</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {projects.length}
                </div>
                <div className="text-sm text-gray-600">Dự án đầu tư</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  Việt Nam
                </div>
                <div className="text-sm text-gray-600">Khu vực hoạt động</div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        {projects.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Các dự án trong quỹ ({projects.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <div
                  key={`${project.name}-${index}`}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {project.name}
                  </h4>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Mục tiêu: {formatVND(project.goal_money || 0)}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === ProjectStatusEnum.PENDING
                        ? 'bg-green-100 text-green-800'
                        : project.status === ProjectStatusEnum.ACTIVE
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status === ProjectStatusEnum.PENDING ? 'Đang hoạt động' :
                       project.status === ProjectStatusEnum.ACTIVE ? 'Đang hoạt động' : project.status === ProjectStatusEnum.REJECTED ? 'Đã hủy' :
                       project.status || 'Chưa xác định'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total funding summary */}
            <div className="mt-8 p-6 bg-purple-50 rounded-lg">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-purple-900 mb-2">
                  Tổng số tiền dự án trong quỹ
                </h4>
                <div className="text-3xl font-bold text-purple-600">
                  {formatVND(totalFundingAmount)}
                </div>
                <p className="text-purple-700 mt-2">
                  Từ {projects.length} dự án đang được đầu tư
                </p>
              </div>
            </div>
          </div>
        )}

        {/* No projects message */}
        {projects.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có dự án nào
            </h3>
            <p className="text-gray-600">
              Quỹ đầu tư này hiện chưa có dự án nào được đầu tư.
            </p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-center text-white mt-8">
          <h2 className="text-2xl font-bold mb-4">Quan tâm đến quỹ đầu tư này?</h2>
          <p className="text-lg mb-6 opacity-90">
            Liên hệ với chúng tôi để tìm hiểu thêm về cơ hội hợp tác
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Liên hệ ngay
            </Link>
            <Link
              href="/funds/investment-funds"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              Xem quỹ khác
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
