import { getActiveProjectsAll } from "@/api/projects";
import { Project } from "@/types/project";
import { Chip } from "@heroui/react";

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

export default async function ActiveProjectsPage() {
  const response = await getActiveProjectsAll({ limit: 12 });
  const projects: Project[] =
    (response.data as any) || (response.docs as any) || [];
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
