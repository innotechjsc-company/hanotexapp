import { Metadata } from "next";
import { getInvestmentFunds } from "@/api/investment-fund";
import type { InvestmentFund } from "@/types/investment_fund";
import { getProjects } from "@/api/projects";
import type { Project } from "@/types/project";

export const metadata: Metadata = {
  title: "Danh sách Quỹ đầu tư - HANOTEX",
  description:
    "Khám phá các quỹ đầu tư chuyên về công nghệ và đổi mới sáng tạo trên nền tảng HANOTEX.",
};

type PageProps = {
  searchParams?: {
    size?: string;
  };
};

export default async function InvestmentFundsPage({ searchParams }: PageProps) {
  const response = await getInvestmentFunds();
  const funds: InvestmentFund[] =
    ((Array.isArray((response as any).docs)
      ? (response as any).docs
      : (response as any).data) as InvestmentFund[]) || [];
  const totalFunds = (response as any).totalDocs ?? funds.length ?? 0;

  // Fetch all related projects with pagination to build stats
  const fetchAllProjects = async (): Promise<Project[]> => {
    const limit = 200;
    const firstRes = await getProjects(
      {},
      { limit, page: 1, sort: "-createdAt" }
    );
    const firstDocs: Project[] =
      ((firstRes as any).docs as Project[]) ||
      ((firstRes as any).data as Project[]) ||
      [];
    const totalPages: number = (firstRes as any).totalPages ?? 1;

    if (totalPages <= 1) return firstDocs;

    let all: Project[] = [...firstDocs];
    for (let p = 2; p <= totalPages; p++) {
      const res = await getProjects({}, { limit, page: p, sort: "-createdAt" });
      const docs: Project[] =
        ((res as any).docs as Project[]) ||
        ((res as any).data as Project[]) ||
        [];
      if (docs.length === 0) break;
      all = all.concat(docs);
    }
    return all;
  };

  const projects = await fetchAllProjects();

  // Build per-fund totals
  const fundIdToTotalAmount = new Map<string, number>();
  for (const p of projects) {
    const fundId =
      typeof p.investment_fund === "string"
        ? p.investment_fund
        : (p.investment_fund as any)?.id;
    const amount = typeof p.goal_money === "number" ? p.goal_money : 0;
    if (fundId) {
      fundIdToTotalAmount.set(
        fundId,
        (fundIdToTotalAmount.get(fundId) || 0) + amount
      );
    }
  }

  // Filter funds by selected size range
  const size = searchParams?.size || "all";
  const ranges: Record<string, [number, number | null]> = {
    all: [0, null],
    lt50b: [0, 50_000_000_000],
    b50_200b: [50_000_000_000, 200_000_000_000],
    b200_500b: [200_000_000_000, 500_000_000_000],
    gte500b: [500_000_000_000, null],
  };
  const [minAmount, maxAmount] = ranges[size] || ranges.all;
  const filteredFunds = funds.filter((f) => {
    const total = fundIdToTotalAmount.get((f as any).id) || 0;
    if (maxAmount == null) return total >= minAmount;
    return total >= minAmount && total < maxAmount;
  });

  // Tổng quy mô quỹ = tổng goal_money của các dự án đã có quỹ
  const totalFundSizeVND = projects
    .filter((p) => !!p.investment_fund)
    .reduce(
      (sum, p) => sum + (typeof p.goal_money === "number" ? p.goal_money : 0),
      0
    );

  // Dự án đã đầu tư = số dự án có quỹ
  const investedProjectsCount = projects.filter(
    (p) => !!p.investment_fund
  ).length;

  // Quỹ đang tìm kiếm dự án = tổng quỹ - số quỹ đã có ít nhất 1 dự án
  const fundIdsWithProjects = new Set<string>(
    projects
      .map((p) => p.investment_fund)
      .filter(Boolean)
      .map((rel) => (typeof rel === "string" ? rel : (rel as any)?.id))
      .filter((id): id is string => typeof id === "string")
  );
  const fundsSeekingProjects = Math.max(
    totalFunds - fundIdsWithProjects.size,
    0
  );

  const formatVNDShort = (value: number) => {
    if (value >= 1_000_000_000) return `${Math.round(value / 1_000_000_000)}B+`;
    if (value >= 1_000_000) return `${Math.round(value / 1_000_000)}M+`;
    if (value >= 1_000) return `${Math.round(value / 1_000)}K+`;
    return `${value}`;
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Danh sách Quỹ đầu tư
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá các quỹ đầu tư chuyên về công nghệ và đổi mới sáng tạo
          </p>
        </div>

        {/* Fund Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {totalFunds}+
            </div>
            <div className="text-gray-600">Quỹ đầu tư</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {formatVNDShort(totalFundSizeVND)}
            </div>
            <div className="text-gray-600">Tổng quy mô quỹ (VNĐ)</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {investedProjectsCount}+
            </div>
            <div className="text-gray-600">Dự án đã đầu tư</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {fundsSeekingProjects}+
            </div>
            <div className="text-gray-600">Quỹ đang tìm kiếm dự án</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form className="flex flex-wrap gap-4" method="get">
            <select
              name="size"
              defaultValue={size}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả quy mô</option>
              <option value="lt50b">Dưới 50 tỷ VNĐ</option>
              <option value="b50_200b">50-200 tỷ VNĐ</option>
              <option value="b200_500b">200-500 tỷ VNĐ</option>
              <option value="gte500b">Trên 500 tỷ VNĐ</option>
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lọc
            </button>
          </form>
        </div>

        {/* Investment Funds */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFunds.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              Chưa có quỹ đầu tư nào.
            </div>
          )}
          {filteredFunds.map((fund, idx) => (
            <div
              key={`${fund.name}-${idx}`}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    Investment Fund
                  </span>
                  <span className="text-green-600 font-semibold">
                    Đang hoạt động
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {fund.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {fund.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Việt Nam</span>
                  <a
                    href="/contact"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Liên hệ
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-center text-white mt-12">
          <h2 className="text-3xl font-bold mb-4">Là quỹ đầu tư?</h2>
          <p className="text-xl mb-6 opacity-90">
            Tham gia nền tảng để kết nối với các dự án công nghệ tiềm năng
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Đăng ký quỹ
            </a>
            <a
              href="/auth/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              Tạo tài khoản
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
