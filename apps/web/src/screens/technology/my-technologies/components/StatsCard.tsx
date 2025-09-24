"use client";

import { Statistic } from "antd";
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
      <Statistic
        title="Tổng công nghệ"
        value={totalDocs ?? items.length}
        valueStyle={{ color: "#1f2937", fontSize: "24px", fontWeight: "bold" }}
      />
    </div>
  );
}
