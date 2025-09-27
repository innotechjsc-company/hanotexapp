"use client";
import React, { useState } from "react";
import DescriptionEditor from "@/components/DescriptionEditor";
import Button from "@/components/ui/Button";

export default function EditorTestPage() {
  const [html, setHtml] = useState<string>("");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-semibold">Demo Description Editor</h1>
      <p className="mb-6 text-sm text-gray-600">
        Soạn mô tả ở khung bên dưới. HTML xuất ra sẽ hiển thị ở phần xem trước
        và bạn có thể dùng để lưu vào backend.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <DescriptionEditor onChange={setHtml} />
          <div className="mt-4 flex gap-2">
            <Button
              variant="primary"
              onClick={() => {
                // Bạn có thể thay bằng logic gọi API lưu
                console.log("HTML để lưu:", html);
                alert("Đã log HTML ra console để kiểm tra");
              }}
            >
              Lưu (console)
            </Button>
            <Button
              variant="outline"
              onClick={() => setHtml("")}
            >
              Xóa nội dung
            </Button>
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-medium">Xem trước</h2>
          <div className="min-h-[180px] rounded-lg border border-gray-200 p-3">
            {html ? (
              <div dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <div className="text-gray-400">(Chưa có nội dung)</div>
            )}
          </div>
          <h2 className="mb-2 mt-6 text-lg font-medium">HTML xuất ra</h2>
          <pre className="max-h-64 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs">
{html || "(trống)"}
          </pre>
        </div>
      </div>
    </div>
  );
}

