"use client";

import { ContactFormState } from "../hooks/useTechnologyDetail";
import {
  MoneyInput,
  FileUpload,
  type FileUploadItem,
} from "@/components/input";
import { MediaType } from "@/types/media1";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onDocumentsChange: (documents: FileUploadItem[]) => void;
  value: ContactFormState;
  loading?: boolean;
}

export default function ContactModal({
  open,
  onClose,
  onSubmit,
  onChange,
  onDocumentsChange,
  value,
  loading = false,
}: ContactModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Liên hệ về công nghệ
          </h3>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Lời nhắn *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={value.description}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập mô tả hoặc lời nhắn của bạn..."
            />
          </div>
          <div>
            <label
              htmlFor="budget"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ngân sách dự kiến (VNĐ) *
            </label>
            <MoneyInput
              id="budget"
              name="budget"
              // live format while typing
              formatOnBlur={false}
              decimalScale={0}
              locale="vi-VN"
              currency="VND"
              required
              min={0}
              step={1000}
              // map current value to number/null for MoneyInput
              value={
                typeof value.budget === "number"
                  ? value.budget
                  : String(value.budget).trim() === ""
                    ? null
                    : Number(value.budget)
              }
              onChange={(n) =>
                onChange({
                  target: {
                    name: "budget",
                    value: n == null ? "" : n,
                  },
                } as any)
              }
              className="w-full"
              placeholder="Nhập ngân sách dự kiến..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tài liệu đính kèm (tùy chọn)
            </label>
            <FileUpload
              value={value.documents}
              onChange={onDocumentsChange}
              multiple={true}
              maxCount={3}
              maxSize={10 * 1024 * 1024} // 10MB
              allowedTypes={["document", "image"]}
              variant="dragger"
              title="Chọn tài liệu"
              description="Kéo thả hoặc click để chọn tài liệu (PDF, Word, Excel, PowerPoint, hình ảnh). Tối đa 3 file, mỗi file 10MB."
              onUploadSuccess={(file, media) => {
                console.log("Document uploaded successfully:", { file, media });
              }}
              onUploadError={(file, error) => {
                console.error("Document upload failed:", { file, error });
              }}
              mediaFields={{
                type: MediaType.DOCUMENT,
                caption: "Tài liệu đính kèm cho đề xuất công nghệ",
              }}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang gửi...
                </>
              ) : (
                "Gửi đề xuất"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
