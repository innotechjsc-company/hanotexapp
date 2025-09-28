import React from "react";
import { Card, Button, Space, Typography, Form, Input, Upload, Modal, message, Avatar, List, Badge } from "antd";
import { SendOutlined, UploadOutlined, CheckCircleOutlined, FileTextOutlined, DownloadOutlined, UserOutlined } from "@ant-design/icons";
import type { ServiceTicket } from "@/types/service-ticket";
import type { ServiceTicketLog } from "@/types/service_ticket_logs";
import type { FormInstance } from "antd";
import dayjs from "dayjs";
import { useAuthStore } from "@/store/auth";
import downloadService from "@/services/downloadService";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ProcessingStepProps {
  ticket: ServiceTicket;
  logs: ServiceTicketLog[];
  attachments: File[];
  form: FormInstance;
  sendingMessage: boolean;
  uploadingFiles: boolean;
  onSendMessage: (values: { message: string }) => void;
  onFileUpload: (files: File[]) => void;
  onRemoveAttachment: (index: number) => void;
  formatFileSize: (bytes: number) => string;
  onStatusUpdate: (status: string, reason?: string) => void;
  updatingStatus: boolean;
  isViewing?: boolean;
}

export const ProcessingStep: React.FC<ProcessingStepProps> = ({
  ticket,
  logs,
  attachments,
  form,
  sendingMessage,
  uploadingFiles,
  onSendMessage,
  onFileUpload,
  onRemoveAttachment,
  formatFileSize,
  onStatusUpdate,
  updatingStatus,
  isViewing = false,
}) => {
  const [showCompleteModal, setShowCompleteModal] = React.useState(false);
  const [completeForm] = Form.useForm();

  const handleSendMessage = async (values: { message: string }) => {
    await onSendMessage(values);
  };
  const user = useAuthStore((state: any) => state.user);

  const handleFileUpload = (info: any) => {
    const files = info.fileList.map((file: any) => file.originFileObj).filter(Boolean);
    if (files.length > 0) {
      onFileUpload(files);
    }
  };

  const handleComplete = async () => {
    try {
      const values = await completeForm.validateFields();
      await onStatusUpdate("completed", values.confirmation);
      setShowCompleteModal(false);
      completeForm.resetFields();
    } catch (error) {
      // Form validation error
    }
  };

  const canComplete = ticket.status === "processing" && ticket.implementers?.filter((implementer) => (implementer as any).id === user.id).length > 0;

  // Get all files from logs
  const exchangedFiles = logs
    .filter(log => log.document)
    .map((log, index) => ({
      ...log.document,
      uploadedBy: log.user?.full_name || log.user?.email || "Người dùng",
      uploadedAt: log.createdAt,
      logId: index // Use index as logId since ServiceTicketLog doesn't have id
    }));

  const handleDownloadDocument = (file: any) => {
    // Access the actual file data from index 0
    const fileData = file?.[0];

    if (fileData?.url) {
      downloadService.downloadByUrl(fileData.url, fileData.filename || undefined);
    } else {
      message.warning("Không có tài liệu để tải xuống");
    }
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Left side - Chat Messages */}
      <div className="flex-1 flex flex-col">
        <Card 
          title={
            <div className="flex items-center justify-between">
              <span>Cuộc trò chuyện</span>
              <Badge count={logs.length} showZero color="#1890ff" />
            </div>
          }
          className="flex-1 flex flex-col shadow-sm border-0"
          bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0 }}
        >
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {logs.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <div className="text-6xl mb-4">💬</div>
                <div className="text-lg font-medium">Chưa có tin nhắn nào</div>
                <div className="text-sm">Hãy bắt đầu cuộc trò chuyện!</div>
              </div>
            ) : (
              logs.map((log, index) => {
                const isCurrentUser = log.user?.id === user.id;
                return (
                  <div key={index} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
                      <Avatar 
                        size={40}
                        icon={<UserOutlined />}
                        className="flex-shrink-0"
                        style={{ backgroundColor: isCurrentUser ? '#1890ff' : '#52c41a' }}
                      >
                        {(log.user?.full_name || log.user?.email || "U").charAt(0).toUpperCase()}
                      </Avatar>
                      
                      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center space-x-2 mb-1">
                          <Text strong className="text-sm">
                            {log.user?.full_name || log.user?.email || "Người dùng"}
                          </Text>
                          <Text type="secondary" className="text-xs">
                            {log.createdAt ? dayjs(log.createdAt).format("DD/MM/YYYY HH:mm") : ""}
                          </Text>
                        </div>
                        
                        <div className={`rounded-2xl px-4 py-3 max-w-full ${
                          isCurrentUser 
                            ? 'bg-blue-500 text-white rounded-br-md' 
                            : 'bg-white border border-gray-200 rounded-bl-md'
                        }`}>
                          <Text className={`text-sm ${isCurrentUser ? 'text-white' : 'text-gray-800'}`}>
                            {log.content}
                          </Text>
                        </div>
                        
                        {log.document && (
                          <div className={`mt-2 flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg ${
                            isCurrentUser ? 'bg-blue-50' : 'bg-gray-50'
                          }`}>
                            <FileTextOutlined className="text-blue-500" />
                            <Text type="secondary" className="text-xs">
                              File: {log.document.filename || log.document.alt || 'Tài liệu'}
                            </Text>
                            <Button type="text" icon={<DownloadOutlined />} onClick={() => handleDownloadDocument(log.document)} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input */}
          {!isViewing && (
            <div className="border-t bg-white p-4">
              <Form form={form} onFinish={handleSendMessage} layout="vertical">
                <Form.Item name="message" rules={[{ required: true, message: "Vui lòng nhập tin nhắn" }]}>
                  <TextArea 
                    rows={3} 
                    placeholder="Nhập tin nhắn trao đổi..."
                    disabled={sendingMessage}
                    className="rounded-xl border-gray-200 focus:border-blue-500"
                  />
                </Form.Item>
                
                <div className="flex items-center justify-between">
                  <Upload
                    beforeUpload={() => false}
                    onChange={handleFileUpload}
                    multiple
                    showUploadList={false}
                  >
                    <Button 
                      icon={<UploadOutlined />} 
                      loading={uploadingFiles}
                      disabled={sendingMessage}
                      className="rounded-lg"
                    >
                      Đính kèm file
                    </Button>
                  </Upload>
                  
                  <Button 
                    type="primary" 
                    icon={<SendOutlined />}
                    htmlType="submit"
                    loading={sendingMessage}
                    className="rounded-lg px-6"
                  >
                    Gửi
                  </Button>
                </div>
              </Form>
            </div>
          )}
          
          {isViewing && (
            <div className="border-t bg-gray-50 p-4 text-center">
              <Text type="secondary">
                Chế độ xem - Không thể gửi tin nhắn mới
              </Text>
            </div>
          )}
        </Card>
      </div>

      {/* Right side - Files and Actions */}
      <div className="w-80 ml-4 space-y-4">
        {/* Exchanged Files */}
        <Card 
          title={
            <div className="flex items-center justify-between">
              <span>📁 File đã trao đổi</span>
              <Badge count={exchangedFiles.length} showZero color="#52c41a" />
            </div>
          }
          className="shadow-sm border-0"
        >
          {exchangedFiles.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">📁</div>
              <div className="text-sm">Chưa có file nào được trao đổi</div>
            </div>
          ) : (
            <List
              dataSource={exchangedFiles}
              renderItem={(file, index) => (
                <List.Item className="!px-0 !py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileTextOutlined className="text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Text className="text-sm font-medium block truncate">
                          {file.filename || file.alt || `Tài liệu ${exchangedFiles.length - index}`}
                        </Text>
                        <Text type="secondary" className="text-xs">
                          {file.uploadedBy} • {file.uploadedAt ? dayjs(file.uploadedAt).format("DD/MM HH:mm") : ""}
                        </Text>
                        {file.filesize && (
                          <Text type="secondary" className="text-xs block">
                            {formatFileSize(file.filesize)}
                          </Text>
                        )}
                      </div>
                    </div>
                    <Button 
                      type="text" 
                      size="small" 
                      onClick={() => handleDownloadDocument(file)}
                      icon={<DownloadOutlined />}
                      className="flex-shrink-0"
                    />
                  </div>
                </List.Item>
              )}
            />
          )}
        </Card>

        {/* Current Attachments */}
        {attachments.length > 0 && (
          <Card title="📎 File đang chọn" size="small" className="shadow-sm border-0">
            <div className="space-y-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <FileTextOutlined className="text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Text className="text-sm block truncate">{file.name}</Text>
                      <Text type="secondary" className="text-xs">
                        {formatFileSize(file.size)}
                      </Text>
                    </div>
                  </div>
                  <Button 
                    type="text" 
                    size="small" 
                    danger
                    onClick={() => onRemoveAttachment(index)}
                    className="flex-shrink-0"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Complete Button */}
        {canComplete && !isViewing && (
          <Card className="shadow-sm border-0">
            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <Title level={5} className="mb-2">Hoàn thành phiếu dịch vụ</Title>
              <Text type="secondary" className="block mb-4 text-xs">
                Chỉ người chịu trách nhiệm chính mới có thể xác nhận hoàn thành
              </Text>
              <Button 
                type="primary" 
                icon={<CheckCircleOutlined />}
                onClick={() => setShowCompleteModal(true)}
                loading={updatingStatus}
                block
                className="rounded-lg h-10"
              >
                Xác nhận hoàn thành
              </Button>
            </div>
          </Card>
        )}
        
        {isViewing && (
          <Card className="shadow-sm border-0">
            <div className="text-center">
              <Title level={5} className="mb-2">Chế độ xem</Title>
              <Text type="secondary" className="block text-xs">
                Bạn đang xem lại thông tin của bước này. Không thể thực hiện các hành động.
              </Text>
            </div>
          </Card>
        )}
      </div>

      {/* Complete Modal */}
      <Modal
        title="Xác nhận hoàn thành phiếu dịch vụ"
        open={showCompleteModal}
        onOk={handleComplete}
        onCancel={() => setShowCompleteModal(false)}
        okText="Xác nhận hoàn thành"
        cancelText="Hủy"
        confirmLoading={updatingStatus}
      >
        <Form form={completeForm} layout="vertical">
          <Form.Item 
            name="confirmation" 
            label="Nội dung xác nhận"
            rules={[{ required: true, message: "Vui lòng nhập nội dung xác nhận" }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Nhập nội dung xác nhận hoàn thành phiếu dịch vụ..."
            />
          </Form.Item>
          
          {attachments.length > 0 && (
            <Form.Item label="File đính kèm">
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <FileTextOutlined />
                    <Text className="text-sm">{file.name}</Text>
                    <Text type="secondary" className="text-xs">
                      ({formatFileSize(file.size)})
                    </Text>
                  </div>
                ))}
              </div>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};
