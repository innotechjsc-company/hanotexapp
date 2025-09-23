"use client";

interface OwnerItem {
  owner_type?: string;
  owner_name?: string;
  ownership_percentage?: number;
}

interface OwnersCardProps {
  owners?: OwnerItem[];
}

export default function OwnersCard({ owners }: OwnersCardProps) {
  if (!Array.isArray(owners) || owners.length === 0) return null;
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Chủ sở hữu công nghệ
      </h2>
      <div className="space-y-4">
        {owners.map((owner, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Loại:</span>
                <p className="text-gray-900">{owner.owner_type}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Tên chủ sở hữu:</span>
                <p className="text-gray-900">{owner.owner_name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Tỷ lệ sở hữu:</span>
                <p className="text-gray-900">
                  {typeof owner.ownership_percentage === "number"
                    ? `${owner.ownership_percentage}%`
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

