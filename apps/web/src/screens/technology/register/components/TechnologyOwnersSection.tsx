import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Owner } from "../types";

interface TechnologyOwnersSectionProps {
  owners: Owner[];
  onAddOwner: () => void;
  onRemoveOwner: (index: number) => void;
  onUpdateOwner: (index: number, field: string, value: string) => void;
}

export const TechnologyOwnersSection: React.FC<TechnologyOwnersSectionProps> = ({
  owners,
  onAddOwner,
  onRemoveOwner,
  onUpdateOwner,
}) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            3. Chủ sở hữu công nghệ *
          </h2>
          <button
            type="button"
            onClick={onAddOwner}
            className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm chủ sở hữu
          </button>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {owners.map((owner, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại chủ sở hữu
              </label>
              <select
                value={owner.ownerType}
                onChange={(e) =>
                  onUpdateOwner(index, "ownerType", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="INDIVIDUAL">Cá nhân</option>
                <option value="COMPANY">Doanh nghiệp</option>
                <option value="RESEARCH_INSTITUTION">Viện/Trường</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên chủ sở hữu
              </label>
              <input
                type="text"
                value={owner.ownerName}
                onChange={(e) =>
                  onUpdateOwner(index, "ownerName", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập tên chủ sở hữu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tỷ lệ sở hữu (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={owner.ownershipPercentage}
                onChange={(e) =>
                  onUpdateOwner(
                    index,
                    "ownershipPercentage",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => onRemoveOwner(index)}
                className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};