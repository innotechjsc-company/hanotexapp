import React from "react";
import { Form, Input, Button, Upload, Typography, Card, Space } from "antd";
import { Send, Paperclip, X } from "lucide-react";
import { FileText } from "lucide-react";

const { Text } = Typography;

interface MessageInputProps {
  form: any;
  attachments: File[];
  sendingMessage: boolean;
  onSendMessage: (values: { message: string }) => Promise<void>;
  onFileUpload: (file: File) => boolean;
  onRemoveAttachment: (index: number) => void;
  formatFileSize: (bytes: number) => string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  form,
  attachments,
  sendingMessage,
  onSendMessage,
  onFileUpload,
  onRemoveAttachment,
  formatFileSize,
}) => {
  return (
    <div className="p-5 bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
      <div className="max-w-screen-2xl mx-auto px-5">
        {/* File Attachments Preview */}
        {attachments.length > 0 && (
          <Card
            className="mb-4 rounded-xl border border-gray-200 bg-gray-50"
            bodyStyle={{ padding: "16px" }}
          >
            <Text className="text-sm font-semibold text-gray-800 mb-3 block">
              File đính kèm ({attachments.length})
            </Text>
            <Space direction="vertical" size="small" className="w-full">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
                >
                  <div className="p-2 rounded-md bg-blue-50">
                    <FileText size={16} className="text-blue-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Text className="text-sm font-medium text-gray-800 block mb-0.5 truncate">
                      {file.name}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </Text>
                  </div>

                  <Button
                    type="text"
                    size="small"
                    icon={<X size={14} />}
                    onClick={() => onRemoveAttachment(index)}
                    className="text-red-500 bg-red-50 hover:bg-red-100 border-none rounded-md"
                  />
                </div>
              ))}
            </Space>
          </Card>
        )}

        {/* Message Input Form */}
        <Form form={form} onFinish={onSendMessage}>
          <div className="flex items-end gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
            {/* File upload button */}
            <Upload
              beforeUpload={onFileUpload}
              showUploadList={false}
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
            >
              <Button
                type="text"
                icon={<Paperclip size={18} />}
                className="text-blue-500 bg-blue-50 hover:bg-blue-100 border-none rounded-xl w-11 h-11 flex items-center justify-center"
              />
            </Upload>

            {/* Message input */}
            <Form.Item name="message" className="flex-1 mb-0">
              <Input
                placeholder="Nhập tin nhắn của bạn..."
                className="rounded-3xl border border-gray-300 text-sm px-4 py-3 bg-white min-h-[44px]"
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
              icon={<Send size={18} />}
              loading={sendingMessage}
              className="rounded-full w-11 h-11 flex items-center justify-center border-none bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30"
            />
          </div>
        </Form>
      </div>
    </div>
  );
};
