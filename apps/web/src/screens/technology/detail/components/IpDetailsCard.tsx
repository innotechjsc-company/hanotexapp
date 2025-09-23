"use client";

interface IpItem {
  ip_type?: string;
  ip_number?: string;
  status?: string;
  territory?: string;
}

interface IpDetailsCardProps {
  ip_details?: IpItem[];
}

export default function IpDetailsCard({ ip_details }: IpDetailsCardProps) {
  if (!Array.isArray(ip_details) || ip_details.length === 0) return null;
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Thông tin sở hữu trí tuệ
      </h2>
      <div className="space-y-4">
        {ip_details.map((ip, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Loại IP:</span>
                <p className="text-gray-900">{ip.ip_type}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Số hiệu:</span>
                <p className="text-gray-900">{ip.ip_number}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Trạng thái:</span>
                <p className="text-gray-900">{ip.status}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Lãnh thổ:</span>
                <p className="text-gray-900">{ip.territory}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

