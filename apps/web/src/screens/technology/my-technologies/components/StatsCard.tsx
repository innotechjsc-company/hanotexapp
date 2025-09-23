"use client";

import { Zap } from "lucide-react";
import type { Technology } from "@/types/technologies";

interface StatsCardProps {
  totalDocs: number | undefined;
  items: Technology[];
}

export function StatsCard({ totalDocs, items }: StatsCardProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-blue-100 p-3 rounded-lg">
        <Zap className="h-6 w-6 text-blue-600" />
      </div>
      <div>
        <p className="text-sm text-gray-600">Tổng công nghệ</p>
        <p className="text-2xl font-bold text-gray-900">
          {totalDocs ?? items.length}
        </p>
      </div>
    </div>
  );
}
