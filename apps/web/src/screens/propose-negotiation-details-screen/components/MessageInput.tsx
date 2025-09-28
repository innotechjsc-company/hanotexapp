import React from "react";
import { Form, Input, Button, Upload, Typography } from "antd";
import { Send, Paperclip, X, DollarSign } from "lucide-react";
import { FileText } from "lucide-react";

const { Text } = Typography;

interface MessageInputProps {
  form: any;
  attachments: File[];
  sendingMessage: boolean;
  uploadingFiles?: boolean;
  onSendMessage: (values: { message: string }) => Promise<void>;
  onFileUpload: (file: File) => boolean;
  onRemoveAttachment: (index: number) => void;
  formatFileSize: (bytes: number) => string;
  onSendOffer?: () => void;
  canSendOffer?: boolean;
  hasPendingOffer?: boolean;
  isProposalCreator?: boolean; // Thêm prop để kiểm tra có phải người tạo proposal
}

export const MessageInput: React.FC<MessageInputProps> = ({
  form,
  attachments,
  sendingMessage,
  uploadingFiles = false,
  onSendMessage,
  onFileUpload,
  onRemoveAttachment,
  formatFileSize,
  onSendOffer,
  canSendOffer = true,
  hasPendingOffer = false,
  isProposalCreator = false,
}) => {
  return (
    <div className="bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="max-w-7xl mx-auto">
        {/* File Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Text className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                File đính kèm ({attachments.length}/10)
              </Text>
              {uploadingFiles && (
                <Text className="text-xs text-blue-600 font-medium">
                  Đang tải lên...
                </Text>
              )}
            </div>
            <div className="space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="p-1.5 rounded-md bg-blue-50">
                    <FileText size={14} className="text-blue-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Text className="text-xs font-medium text-gray-800 block truncate">
                      {file.name}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </Text>
                  </div>

                  <Button
                    type="text"
                    size="small"
                    icon={<X size={12} />}
                    onClick={() => onRemoveAttachment(index)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 border-none rounded-md w-6 h-6 flex items-center justify-center"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message Input Form */}
        <Form form={form} onFinish={onSendMessage}>
          <div className="flex gap-3 p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            {/* File upload button */}
            <Upload
              beforeUpload={onFileUpload}
              showUploadList={false}
              multiple
              disabled={uploadingFiles || sendingMessage || attachments.length >= 10}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.csv,.odt,.ods,.odp,.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.ico,.mp4,.avi,.mov,.wmv,.flv,.webm,.mkv,.m4v"
            >
              <Button
                type="text"
                icon={<Paperclip size={16} />}
                disabled={uploadingFiles || sendingMessage || attachments.length >= 10}
                title={
                  uploadingFiles 
                    ? "Đang tải lên file..."
                    : attachments.length >= 10
                      ? "Chỉ có thể đính kèm tối đa 10 file"
                      : "Chọn file để đính kèm (tối đa 50MB mỗi file)"
                }
                className={`
                  border-none rounded-full w-10 h-10 flex items-center justify-center transition-colors
                  ${
                    uploadingFiles || sendingMessage || attachments.length >= 10
                      ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                      : "text-gray-500 hover:text-blue-500 hover:bg-blue-50"
                  }
                `}
              />
            </Upload>

            {/* Message input */}
            <Form.Item name="message" className="flex-1 mb-0">
              <Input
                placeholder="Nhập nội dung đàm phán của bạn..."
                className="border-none text-sm px-0 py-2 bg-transparent focus:shadow-none"
                style={{ boxShadow: "none" }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    form.submit();
                  }
                }}
              />
            </Form.Item>

            {/* Offer button - Only show if user is proposal creator */}
            {onSendOffer && isProposalCreator && (
              <Button
                type="default"
                icon={<DollarSign size={16} />}
                onClick={onSendOffer}
                disabled={!canSendOffer || sendingMessage || uploadingFiles}
                className="rounded-full w-10 h-10 flex items-center justify-center border-orange-300 text-orange-600 hover:border-orange-400 hover:text-orange-700 hover:bg-orange-50 transition-all duration-200"
                title={
                  hasPendingOffer ? "Chờ xác nhận đề xuất" : "Gửi đề xuất giá"
                }
              />
            )}

            {/* Send button */}
            <Button
              type="primary"
              htmlType="submit"
              icon={<Send size={16} />}
              loading={sendingMessage || uploadingFiles}
              disabled={sendingMessage || uploadingFiles}
              className="rounded-full w-10 h-10 flex items-center justify-center border-none bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg transition-all duration-200"
              title={
                uploadingFiles
                  ? "Đang tải lên file..."
                  : sendingMessage
                    ? "Đang gửi tin nhắn..."
                    : "Gửi tin nhắn"
              }
            />
          </div>
        </Form>

        {/* Pending offer status message */}
        {hasPendingOffer && isProposalCreator && (
          <div className="px-3 pb-2">
            <Text className="text-xs text-amber-600">
              Bạn đã gử̉i đề xuất, vui lòng chờ bên bán xác nhận
            </Text>
          </div>
        )}
        
        {/* File upload guidelines */}
        {attachments.length === 0 && !uploadingFiles && (
          <div className="px-3 pb-2">
            <Text className="text-xs text-gray-500">
              📎 Hỗ trợ: PDF, Word, Excel, PowerPoint, hình ảnh, video (tối đa 50MB/file, 10 file/tin nhắn)
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};
