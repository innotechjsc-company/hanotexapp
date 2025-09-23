"use client";

interface SummaryCardProps {
  summary?: string;
}

export default function SummaryCard({ summary }: SummaryCardProps) {
  if (!summary) return null;
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Tóm tắt công nghệ</h2>
      <p className="text-gray-700 leading-relaxed">{summary}</p>
    </div>
  );
}

