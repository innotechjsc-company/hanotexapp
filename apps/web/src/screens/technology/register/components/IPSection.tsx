import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { IPDetail, MasterData } from "../types";
import { getIPTypeDescription } from "../utils";

interface IPSectionProps {
  ipDetails: IPDetail[];
  masterData: MasterData | null;
  masterDataLoading: boolean;
  onAddIPDetail: () => void;
  onRemoveIPDetail: (index: number) => void;
  onUpdateIPDetail: (index: number, field: string, value: string) => void;
}

export const IPSection: React.FC<IPSectionProps> = ({
  ipDetails,
  masterData,
  masterDataLoading,
  onAddIPDetail,
  onRemoveIPDetail,
  onUpdateIPDetail,
}) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            4. Sở hữu trí tuệ (IP) *
          </h2>
          <button
            type="button"
            onClick={onAddIPDetail}
            className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm IP
          </button>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {ipDetails.map((ip, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại hình IP
                </label>
                <select
                  value={ip.ipType}
                  onChange={(e) => {
                    onUpdateIPDetail(index, "ipType", e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={masterDataLoading}
                >
                  <option value="">Chọn loại hình IP</option>
                  {masterData?.ipTypes.map((ipType) => (
                    <option key={ipType.value} value={ipType.value}>
                      {ipType.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số đơn/Số bằng
                </label>
                <input
                  type="text"
                  value={ip.ipNumber}
                  onChange={(e) =>
                    onUpdateIPDetail(index, "ipNumber", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="VD: VN1-001234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tình trạng
                </label>
                <select
                  value={ip.status}
                  onChange={(e) =>
                    onUpdateIPDetail(index, "status", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={masterDataLoading}
                >
                  <option value="">Chọn tình trạng</option>
                  {masterData?.ipStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => onRemoveIPDetail(index)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa
                </button>
              </div>
            </div>

            {/* Mô tả IP - nằm dưới grid */}
            {ip.ipType && (
              <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                <strong>💡</strong> {getIPTypeDescription(ip.ipType, masterData)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};