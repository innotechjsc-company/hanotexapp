"use client";

import { TechnologyStatus } from "@/types";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title?: string;
  status?: TechnologyStatus;
  trl_level?: number;
  categoryName?: string;
  getStatusLabel: (s: TechnologyStatus) => string;
  getStatusColor: (s: TechnologyStatus) => string;
  getTrlLabel: (lvl?: number) => string | undefined;
}

export default function Header({
  title,
  status,
  trl_level,
  categoryName,
  getStatusColor,
  getStatusLabel,
  getTrlLabel,
}: HeaderProps) {
  const router = useRouter();
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <div className="flex items-center space-x-4 mt-1">
                {status ? (
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      status
                    )}`}
                  >
                    {getStatusLabel(status)}
                  </span>
                ) : null}
                {categoryName ? (
                  <span className="text-sm text-gray-600">{categoryName}</span>
                ) : null}
                {Number.isFinite(trl_level) ? (
                  <span className="text-sm text-gray-600">
                    TRL {trl_level} - {getTrlLabel(trl_level)}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Heart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
