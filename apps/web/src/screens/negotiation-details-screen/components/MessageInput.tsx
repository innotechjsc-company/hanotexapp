import React from "react";
import { Form, Input, Button, Upload, Typography } from "antd";
import { Send, Paperclip, X } from "lucide-react";
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
}) => {
  return (
    <div className="bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="max-w-7xl mx-auto">
        {/* File Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <Text className="text-xs font-semibold text-gray-600 mb-2 block uppercase tracking-wide">
              File đính kèm ({attachments.length})
            </Text>
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
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
            >
              <Button
                type="text"
                icon={<Paperclip size={16} />}
                className="text-gray-500 hover:text-blue-500 hover:bg-blue-50 border-none rounded-full w-10 h-10 flex items-center justify-center transition-colors"
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
      </div>
    </div>
  );
};
