"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Target,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Loader2,
  AlertCircle,
  X,
  Save,
  FileText,
  Calendar,
  DollarSign,
  ExternalLink,
} from "lucide-react";
import { useUser, useAuthStore } from "@/store/auth";
import { getDemandsByUser, deleteDemand, updateDemand } from "@/api/demands";
import { Demand } from "@/types/demand";
import { Category } from "@/types/categories";
import { useCategories } from "@/hooks/useCategories";
import { PAYLOAD_API_BASE_URL } from "@/api/config";

export default function MyDemandsPage() {
  const router = useRouter();
  const user = useUser();
  const { isAuthenticated } = useAuthStore();

  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [editFormData, setEditFormData] = useState<
    Partial<Demand> & { category?: string }
  >({});
  const [editLoading, setEditLoading] = useState(false);

  // Get categories for edit form
  const { categories } = useCategories();

  // No longer need status functions since Demand interface doesn't have status field

  // Fetch user's demands
  const fetchUserDemands = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await getDemandsByUser(user.id as string);
      setDemands(response.docs?.flat() || []);
    } catch (err: any) {
      console.error("Error fetching demands:", err);
      setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const handleViewDemand = (demand: Demand) => {
    setSelectedDemand(demand);
    setViewModalOpen(true);
  };

  const handleEditDemand = (demand: Demand) => {
    setSelectedDemand(demand);
    setEditFormData({
      title: demand.title,
      description: demand.description,
      category:
        typeof demand.category === "string"
          ? demand.category
          : (demand.category as any)?.id || "",
      trl_level: demand.trl_level,
      option: demand.option,
      option_technology: demand.option_technology,
      option_rule: demand.option_rule,
      from_price: demand.from_price,
      to_price: demand.to_price,
      cooperation: demand.cooperation,
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (demand: Demand) => {
    setSelectedDemand(demand);
    setDeleteModalOpen(true);
  };

  // Handle opening document in new tab
  const handleOpenDocument = (document: any) => {
    if (document.url) {
      // Construct full URL using CMS base URL
      const cmsBaseUrl = PAYLOAD_API_BASE_URL.replace("/api", ""); // Remove /api from base URL
      const fullUrl = document.url.startsWith("http")
        ? document.url
        : `${cmsBaseUrl}${document.url}`;

      window.open(fullUrl, "_blank", "noopener,noreferrer");
    } else {
      console.warn("Document URL not available:", document);
    }
  };

  // Handle delete demand (actual deletion)
  const handleConfirmDelete = async () => {
    if (!selectedDemand?.id) return;

    try {
      setDeletingIds((prev) => new Set(prev).add(selectedDemand.id!));
      await deleteDemand(selectedDemand.id);

      // Remove from local state
      setDemands((prev) =>
        prev.filter((demand) => demand.id !== selectedDemand.id)
      );
      console.log("Demand deleted successfully:", selectedDemand.id);
      setDeleteModalOpen(false);
      setSelectedDemand(null);
    } catch (err: any) {
      console.error("Error deleting demand:", err);
      setError(err.message || "Có lỗi xảy ra khi xóa nhu cầu");
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(selectedDemand.id!);
        return newSet;
      });
    }
  };

  // Handle edit form submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDemand?.id) return;

    try {
      setEditLoading(true);
      const updatedDemand = await updateDemand(selectedDemand.id, editFormData);

      // Update local state
      setDemands((prev) =>
        prev.map((demand) =>
          demand.id === selectedDemand.id
            ? { ...demand, ...updatedDemand }
            : demand
        )
      );

      console.log("Demand updated successfully:", updatedDemand);
      setEditModalOpen(false);
      setSelectedDemand(null);
      setEditFormData({});
    } catch (err: any) {
      console.error("Error updating demand:", err);
      setError(err.message || "Có lỗi xảy ra khi cập nhật nhu cầu");
    } finally {
      setEditLoading(false);
    }
  };

  // Handle edit form change
  const handleEditFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]:
        name === "trl_level" || name === "from_price" || name === "to_price"
          ? value
            ? parseInt(value)
            : 0
          : value,
    }));
  };

  // Check authentication and fetch data
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (user?.id) {
      fetchUserDemands();
    }
  }, [user?.id, isAuthenticated, router]);

  // Calculate stats from real data
  const stats = {
    total: demands.length,
    documents: demands.reduce(
      (sum, demand) => sum + (demand.documents?.length || 0),
      0
    ),
    withPrice: demands.filter(
      (demand) => demand.from_price > 0 || demand.to_price > 0
    ).length,
    withDocuments: demands.filter(
      (demand) => demand.documents && demand.documents.length > 0
    ).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Target className="h-8 w-8 text-green-600 mr-3" />
                Nhu cầu của tôi
              </h1>
              <p className="text-gray-600 mt-2">
                Quản lý và theo dõi các nhu cầu công nghệ bạn đã đăng
              </p>
            </div>
            <button
              onClick={() => router.push("/demands/register")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Đăng nhu cầu mới
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
            <button
              onClick={fetchUserDemands}
              className="ml-4 text-sm underline hover:no-underline"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Tổng nhu cầu
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    stats.total
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MoreVertical className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tài liệu</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    stats.documents
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Có giá cả</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    stats.withPrice
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Edit className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Có tài liệu</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    stats.withDocuments
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Demands List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Danh sách nhu cầu
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {demands.map((demand) => (
                <div key={demand.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {demand.title}
                        </h3>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          Đã đăng
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        {typeof demand.category === "string"
                          ? demand.category
                          : (demand.category as any)?.name || "Chưa phân loại"}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Giá từ:</span>
                          <span className="ml-2 font-medium">
                            {demand.from_price
                              ? `${demand.from_price.toLocaleString()} VNĐ`
                              : "Chưa xác định"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Giá đến:</span>
                          <span className="ml-2 font-medium">
                            {demand.to_price
                              ? `${demand.to_price.toLocaleString()} VNĐ`
                              : "Chưa xác định"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">TRL Level:</span>
                          <span className="ml-2 font-medium text-blue-600">
                            {demand.trl_level || "Chưa xác định"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-gray-500">
                        Ngày đăng:{" "}
                        {new Date(demand.createdAt || "").toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDemand(demand)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditDemand(demand)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(demand)}
                        disabled={deletingIds.has(demand.id!)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Xóa"
                      >
                        {deletingIds.has(demand.id!) ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && demands.length === 0 && (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có nhu cầu nào
              </h3>
              <p className="text-gray-600 mb-6">
                Bắt đầu đăng nhu cầu đầu tiên của bạn
              </p>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewModalOpen && selectedDemand && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setViewModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Chi tiết nhu cầu
              </h2>
              <button
                onClick={() => setViewModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề
                </label>
                <p className="text-gray-900">{selectedDemand.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {selectedDemand.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục
                  </label>
                  <p className="text-gray-900">
                    {typeof selectedDemand.category === "string"
                      ? selectedDemand.category
                      : (selectedDemand.category as any)?.name ||
                        "Chưa phân loại"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    TRL Level
                  </label>
                  <p className="text-gray-900">{selectedDemand.trl_level}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá từ
                  </label>
                  <p className="text-gray-900">
                    {selectedDemand.from_price
                      ? `${selectedDemand.from_price.toLocaleString()} VNĐ`
                      : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá đến
                  </label>
                  <p className="text-gray-900">
                    {selectedDemand.to_price
                      ? `${selectedDemand.to_price.toLocaleString()} VNĐ`
                      : "Chưa xác định"}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hình thức hợp tác
                </label>
                <p className="text-gray-900">
                  {selectedDemand.cooperation || "Chưa xác định"}
                </p>
              </div>

              {selectedDemand.option && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Yêu cầu mong muốn
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selectedDemand.option}
                  </p>
                </div>
              )}

              {selectedDemand.option_technology && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Yêu cầu công nghệ
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selectedDemand.option_technology}
                  </p>
                </div>
              )}

              {selectedDemand.option_rule && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Yêu cầu quy tắc
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selectedDemand.option_rule}
                  </p>
                </div>
              )}

              {selectedDemand.documents &&
                selectedDemand.documents.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tài liệu đính kèm
                    </label>
                    <div className="space-y-2">
                      {selectedDemand.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => handleOpenDocument(doc)}
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <div>
                              <span className="text-sm font-medium text-gray-900">
                                {doc.filename || doc.alt}
                              </span>
                              {doc.mimeType && (
                                <p className="text-xs text-gray-500">
                                  {doc.mimeType}{" "}
                                  {doc.filesize &&
                                    `• ${(doc.filesize / 1024).toFixed(1)} KB`}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <ExternalLink className="h-4 w-4 text-blue-500" />
                            <span className="text-xs text-gray-500">
                              Mở file
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày tạo
                </label>
                <p className="text-gray-900">
                  {new Date(selectedDemand.createdAt || "").toLocaleDateString(
                    "vi-VN"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && selectedDemand && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setEditModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Chỉnh sửa nhu cầu
              </h2>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title || ""}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả *
                </label>
                <textarea
                  name="description"
                  value={editFormData.description || ""}
                  onChange={handleEditFormChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục *
                  </label>
                  <select
                    name="category"
                    value={editFormData.category || ""}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    TRL Level *
                  </label>
                  <select
                    name="trl_level"
                    value={editFormData.trl_level || 1}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                      <option key={level} value={level}>
                        TRL {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá từ (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="from_price"
                    value={editFormData.from_price || ""}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá đến (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="to_price"
                    value={editFormData.to_price || ""}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hình thức hợp tác
                </label>
                <input
                  type="text"
                  name="cooperation"
                  value={editFormData.cooperation || ""}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yêu cầu mong muốn
                </label>
                <textarea
                  name="option"
                  value={editFormData.option || ""}
                  onChange={handleEditFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yêu cầu công nghệ
                </label>
                <textarea
                  name="option_technology"
                  value={editFormData.option_technology || ""}
                  onChange={handleEditFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yêu cầu quy tắc
                </label>
                <textarea
                  name="option_rule"
                  value={editFormData.option_rule || ""}
                  onChange={handleEditFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedDemand && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setDeleteModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Xác nhận xóa
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <div>
                  <p className="text-gray-900">
                    Bạn có chắc chắn muốn xóa nhu cầu này?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    "{selectedDemand.title}"
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deletingIds.has(selectedDemand.id!)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingIds.has(selectedDemand.id!) ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Đang xóa...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Đồng ý
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
