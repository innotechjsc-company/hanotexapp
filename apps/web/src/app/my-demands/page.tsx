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
} from "lucide-react";
import { useUser, useAuthStore } from "@/store/auth";
import { getDemandsByUser, deleteDemand } from "@/api/demands";
import { Demand } from "@/types/demand";
import { Category } from "@/types/categories";

export default function MyDemandsPage() {
  const router = useRouter();
  const user = useUser();
  const { isAuthenticated } = useAuthStore();

  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

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
      console.log("Fetching demands for user:", user.id);

      const response = await getDemandsByUser(user.id as string);
      console.log("Demands fetched------------------abc:", response.docs);

      setDemands(response.docs?.flat() || []);
    } catch (err: any) {
      console.error("Error fetching demands:", err);
      setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete demand
  const handleDeleteDemand = async (demandId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa nhu cầu này?")) {
      return;
    }

    try {
      setDeletingIds((prev) => new Set(prev).add(demandId));
      await deleteDemand(demandId);

      // Remove from local state
      setDemands((prev) => prev.filter((demand) => demand.id !== demandId));
      console.log("Demand deleted successfully:", demandId);
    } catch (err: any) {
      console.error("Error deleting demand:", err);
      setError(err.message || "Có lỗi xảy ra khi xóa nhu cầu");
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(demandId);
        return newSet;
      });
    }
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
                        onClick={() => router.push(`/demands/${demand.id}`)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/demands/${demand.id}/edit`)
                        }
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDemand(demand.id!)}
                        disabled={deletingIds.has(demand.id!)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
}
