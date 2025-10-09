"use client";

import { useState } from "react";
import {
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  Download,
} from "lucide-react";

interface AuctionDetailsProps {
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  organizer: {
    name: string;
    email: string;
    phone?: string | null;
  };
  documents: Array<{
    id: string;
    name: string;
    url: string;
    size: string;
  }>;
  terms: string[];
}

export default function AuctionDetails({
  description,
  startTime,
  endTime,
  location,
  organizer,
  documents,
  terms,
}: AuctionDetailsProps) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Mô tả", icon: FileText },
    { id: "documents", label: "Tài liệu", icon: Download },
    { id: "terms", label: "Điều khoản", icon: FileText },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === "description" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Mô tả chi tiết
              </h3>
              <div className="prose max-w-none text-gray-700">
                {description}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">
                      Thời gian bắt đầu
                    </div>
                    <div className="font-medium text-gray-900">
                      {startTime.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">
                      Thời gian kết thúc
                    </div>
                    <div className="font-medium text-gray-900">
                      {endTime.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Địa điểm</div>
                    <div className="font-medium text-gray-900">{location}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Thông tin người tổ chức
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {organizer.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {organizer.email}
                    </span>
                  </div>
                  {organizer.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {organizer.phone}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tài liệu đính kèm
            </h3>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {doc.name}
                      </div>
                      <div className="text-sm text-gray-500">{doc.size}</div>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Tải xuống
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "terms" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Điều khoản đấu giá
            </h3>
            <div className="space-y-3">
              {terms.map((term, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{term}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
