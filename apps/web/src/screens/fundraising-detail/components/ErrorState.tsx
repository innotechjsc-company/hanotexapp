import Link from "next/link";

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {error || "Không tìm thấy dự án"}
        </h1>
        <Link
          href="/funds/fundraising"
          className="text-green-600 hover:text-green-800 font-medium"
        >
          Quay lại danh sách dự án gọi vốn
        </Link>
      </div>
    </div>
  );
}
