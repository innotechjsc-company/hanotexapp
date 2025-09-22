import { getActiveProjectsAll } from "@/api/projects";
import { Project } from "@/types/project";
import { Chip } from "@heroui/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dự án đang gọi vốn - HANOTEX",
  description:
    "Khám phá các dự án công nghệ đang tìm kiếm nguồn vốn đầu tư để phát triển và mở rộng.",
};

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
      return status;
  }
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "warning";
    case "in_progress":
      return "warning";
    case "completed":
      return "success";
    case "cancelled":
      return "danger";
    default:
      return "default";
  }
};

export default async function FundraisingPage() {
  const response = await getActiveProjectsAll({ limit: 12 });
  const projects: Project[] =
    (response.data as any) || (response.docs as any) || [];
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
            <div className="text-gray-600">Dự án đang gọi vốn</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">200B+</div>
            <div className="text-gray-600">Tổng vốn cần huy động (VNĐ)</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">30+</div>
            <div className="text-gray-600">Nhà đầu tư quan tâm</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">15</div>
            <div className="text-gray-600">Dự án đã gọi vốn thành công</div>
          </div>
        </div>

        {/* Filters */}
        {/* <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Tất cả lĩnh vực</option>
              <option>AI & Machine Learning</option>
              <option>IoT & Smart Systems</option>
              <option>Blockchain</option>
              <option>FinTech</option>
              <option>EdTech</option>
            </select>
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
          {projects.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              Chưa có dự án nào đang hoạt động
            </div>
          ) : (
            projects.map((proj: any) => (
              <div
                key={proj.id || proj.name}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {(typeof proj.technology === "object" &&
                        proj.technology &&
                        proj.technology.name) ||
                        "Dự án"}
                    </span>
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
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {typeof proj.user === "object" && proj.user
                        ? proj.user.name || proj.user.email
                        : "Người tạo"}
                    </span>
                    {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Xem chi tiết
                    </button> */}
                  </div>
                </div>
              </div>
            ))
          )}
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
