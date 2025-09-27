import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  Alert,
  message,
  Upload,
  Avatar,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  DownloadOutlined,
  CloudUploadOutlined,
  CheckCircleOutlined as CheckCircle,
  CloseOutlined as XIcon,
} from "@ant-design/icons";
import { FileText, Download } from "lucide-react";
import type { ServiceTicket } from "@/types/service-ticket";
import type { ServiceTicketLog } from "@/types/service_ticket_logs";
import type { Service } from "@/types/services";
import type { Technology } from "@/types/technologies";
import type { Project } from "@/types/project";
import dayjs from "dayjs";
import downloadService from "@/services/downloadService";
import {
  getServiceTicketLogs,
  createServiceTicketLog,
  updateServiceTicketLog,
} from "@/api/service-ticket";
import { useUser } from "@/store/auth";
import { uploadFile } from "@/api/media";
import { MediaType } from "@/types/media1";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface CompletionStepProps {
  ticket: ServiceTicket;
  logs: ServiceTicketLog[];
  services: Service[];
  userTechnologies: Technology[];
  userProjects: Project[];
  formatFileSize: (bytes: number) => string;
  onStatusUpdate: (status: string, reason?: string) => void;
  updatingStatus: boolean;
  isViewing?: boolean;
  onLogsUpdate?: () => void;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({
  ticket,
  logs,
  services,
  userTechnologies,
  userProjects,
  formatFileSize,
  onStatusUpdate,
  updatingStatus,
  isViewing = false,
  onLogsUpdate,
}) => {
  const currentUser = useUser();
  const [showRejectModal, setShowRejectModal] = React.useState(false);
  const [form] = Form.useForm();

  // New state for service ticket logs functionality
  const [serviceLogs, setServiceLogs] = useState<ServiceTicketLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"progress" | "complete">(
    "progress"
  );
  const [modalContent, setModalContent] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [isDoneServiceLogId, setIsDoneServiceLogId] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Utility functions for service ticket logs
  const formatMessageTime = (timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserId = (user: any) =>
    typeof user === "object" ? user?.id : String(user || "");

  const fetchServiceLogs = useCallback(
    async (options: { silent?: boolean } = {}) => {
      const { silent = false } = options;
      if (!ticket?.id) return;
      if (!silent) {
        setLoading(true);
      }
      try {
        const res = await getServiceTicketLogs(ticket.id, {
          limit: 1000,
          sort: "createdAt",
        });
        const data = (res as any).docs || (res as any).data || [];
        debugger
        setServiceLogs(data as ServiceTicketLog[]);
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop =
              scrollContainerRef.current.scrollHeight;
          }
        }, 50);
      } catch (e) {
        console.error("Failed to load service ticket logs", e);
        message.error("Không thể tải nhật ký dịch vụ");
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [ticket?.id]
  );

  useEffect(() => {
    fetchServiceLogs();
  }, [fetchServiceLogs]);

  useEffect(() => {
    if (serviceLogs.length > 0) {
      setIsDoneServiceLogId(serviceLogs.find((log) => log.is_done_service)?.id !== undefined || false);
    }
  }, [serviceLogs]);

  useEffect(() => {
    if (!ticket?.id) {
      return;
    }

    const interval = setInterval(() => {
      fetchServiceLogs({ silent: true });
    }, 5000);

    return () => clearInterval(interval);
  }, [ticket?.id, fetchServiceLogs]);

  const onFileUpload = (file: File) => {
    if (attachments.length >= 1) {
      message.warning("Chỉ chọn tối đa 1 tệp đính kèm");
      return false;
    }
    setAttachments((prev) => [...prev, file]);
    return false;
  };

  const onRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const performSend = async (content: string) => {
    try {
      setSending(true);

      if (!ticket?.id) {
        message.error("Không tìm thấy phiếu dịch vụ");
        return;
      }

      let documentId: any = undefined;
      if (attachments[0]) {
        const uploaded = await uploadFile(attachments[0], {
          type: MediaType.DOCUMENT,
          alt: `Service ticket log for ticket ${ticket.id}`,
        });
        documentId = uploaded.id;
      }

      await createServiceTicketLog({
        service_ticket: ticket.id as any,
        user: currentUser!.id as any,
        content: content.trim(),
        document: documentId,
        status: "pending",
      });

      setModalOpen(false);
      setModalContent("");
      setAttachments([]);
      await fetchServiceLogs();
      if (onLogsUpdate) {
        onLogsUpdate();
      }
    } catch (e) {
      console.error("Failed to send service ticket log", e);
      message.error("Không thể gửi cập nhật dịch vụ");
    } finally {
      setSending(false);
    }
  };

  const openProgressModal = () => {
    if (isCompleted) {
      message.info("Phiếu dịch vụ đã hoàn thành. Không thể gửi thêm cập nhật.");
      return;
    }
    setModalMode("progress");
    setModalContent("");
    setAttachments([]);
    setModalOpen(true);
  };

  const openCompleteModal = async () => {
    if (isCompleted) {
      message.info("Phiếu dịch vụ đã hoàn thành. Không thể xác nhận thêm.");
      return;
    }
    if (isDoneServiceLogId) {
      message.info("Phiếu dịch vụ đã được xác nhận hoàn thành. Không thể xác nhận thêm.");
      return;
    }
    // get last log in serviceLogs
    if(serviceLogs.length === 0) {
      message.error("Không tìm thấy nhật ký hoàn thành dịch vụ");
      return;
    }
    const log = serviceLogs[serviceLogs.length - 1];
    if (!log) {
      message.error("Không tìm thấy nhật ký hoàn thành dịch vụ");
      return;
    }
    await updateServiceTicketLog(String(log.id), {
      is_done_service: true,
    });
    message.success("Đã xác nhận hoàn thành dịch vụ");
    setIsDoneServiceLogId(true);
    await fetchServiceLogs();
    if (onLogsUpdate) {
      onLogsUpdate();
    }

    setModalMode("complete");
    setModalContent("Xác nhận hoàn thành dịch vụ");
    setAttachments([]);
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    if (!ticket?.id || !currentUser?.id) {
      message.error("Vui lòng đăng nhập");
      return;
    }
    const content = modalContent.trim();
    if (!content) {
      message.warning("Vui lòng nhập nội dung");
      return;
    }
    await performSend(content);
  };

  const handleApprove = (log: ServiceTicketLog) => {
    if (!log?.id) return;
    const contentText = String(log.content || "");
    const content = contentText.toLowerCase();
    const isDone =
      content.includes("hoàn thành dịch vụ") ||
      content.includes("xác nhận hoàn thành") ||
      content.includes("hoan thanh dich vu");

    Modal.confirm({
      title: "Xác nhận cập nhật",
      content: (
        <div>
          <div className="mb-2">
            <Text className="text-sm">{contentText}</Text>
          </div>
          {isDone && (
            <Text className="text-xs text-gray-500">
              Thao tác này sẽ đánh dấu phiếu dịch vụ đã hoàn tất.
            </Text>
          )}
        </div>
      ),
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await updateServiceTicketLog(String(log.id), {
            ...log,
            status: "completed",
          });
          message.success("Đã xác nhận cập nhật");
          await fetchServiceLogs();
          if (onLogsUpdate) {
            onLogsUpdate();
          }
        } catch (e) {
          console.error(e);
          message.error("Không thể xác nhận");
          throw e;
        }
      },
    });
  };

  const handleOpenReject = (log: ServiceTicketLog) => {
    setRejectTargetId(log.id || null);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const handleRejectOk = async () => {
    if (!rejectTargetId) return;
    const reason = rejectReason.trim();
    if (!reason) {
      message.warning("Vui lòng nhập lý do từ chối");
      return;
    }
    try {
      await updateServiceTicketLog(rejectTargetId, {
        status: "rejected",
        reason,
      });
      message.success("Đã từ chối cập nhật");
      setRejectModalOpen(false);
      setRejectTargetId(null);
      setRejectReason("");
      await fetchServiceLogs();
      if (onLogsUpdate) {
        onLogsUpdate();
      }
    } catch (e) {
      console.error(e);
      message.error("Không thể từ chối");
    }
  };

  const getServiceName = () => {
    if (!ticket.service) return "Không xác định";
    if (typeof ticket.service === "string") {
      const service = services.find(
        (s) => String(s.id) === String(ticket.service)
      );
      return service?.name || `Dịch vụ #${ticket.service}`;
    }
    return (ticket.service as any)?.name || "Không xác định";
  };

  const getUserName = (user: any) => {
    if (!user) return "Không xác định";
    if (typeof user === "string") return "Người dùng";
    return user?.full_name || user?.email || "Người dùng";
  };

  const handleDownloadDocument = (file: any) => {
    // Access the actual file data from index 0
    const fileData = file?.[0];

    if (fileData?.url) {
      downloadService.downloadByUrl(
        fileData.url,
        fileData.filename || undefined
      );
    } else {
      message.warning("Không có tài liệu để tải xuống");
    }
  };

  const getTechnologiesList = () => {
    if (!ticket.technologies || !Array.isArray(ticket.technologies)) return [];
    return ticket.technologies.map((tech: any) => {
      if (typeof tech === "string") {
        const technology = userTechnologies.find(
          (t) => String(t.id) === String(tech)
        );
        return technology?.title || tech;
      }
      return tech?.title || "Công nghệ";
    });
  };

  const getProjectName = () => {
    if (!ticket.project) return null;
    if (typeof ticket.project === "string") {
      const project = userProjects.find(
        (p) => String(p.id) === String(ticket.project)
      );
      return project?.name || `Dự án #${ticket.project}`;
    }
    return (ticket.project as any)?.name || "Dự án";
  };

  const handleReject = async () => {
    try {
      const values = await form.validateFields();
      await onStatusUpdate("cancelled", values.reason);
      setShowRejectModal(false);
      form.resetFields();
    } catch (error) {
      // Form validation error
    }
  };

  const handleAccept = async () => {
    await onStatusUpdate("completed", "Đã xác nhận hoàn thành");
  };

  const isCompleted = ticket.status === "completed" && isDoneServiceLogId;

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Success Result Banner */}
      {isCompleted && (
        <Alert
          message="Phiếu dịch vụ đã gần hoàn thành!"
          description="Kết quả đã được xác nhận và chỉ cần xác nhận cuối cùng."
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
          className="mb-6"
        />
      )}
      {/* Pending Confirmation Banner */}
      {!isCompleted && (
        <Alert
          message="Chờ xác nhận hoàn thành cuối cùng"
          description="Dịch vụ đã được thực hiện xong. Vui lòng xác nhận kết quả để hoàn tất phiếu dịch vụ."
          type="info"
          showIcon
          icon={<CheckCircleOutlined />}
          className="mb-6"
        />
      )}

      {/* Service Ticket Logs Section */}
      <Card title="Nhật ký hoàn thiện dịch vụ" className="shadow-sm">
        <div
          ref={scrollContainerRef}
          className="max-h-96 overflow-y-auto p-3 bg-gray-50 rounded-lg"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#d1d5db #f3f4f6",
          }}
        >
          <div className="space-y-2">
            {serviceLogs.map((log) => {
              const user = log.user as any;
              const userName =
                typeof user === "object"
                  ? user.full_name || user.email || "Người dùng"
                  : String(user || "Người dùng");
              const avatar = userName.charAt(0).toUpperCase();
              const doc = log.document as any;
              const docUrl = doc ? doc[0].url : undefined;
              const fileName = doc ? doc[0].filename : undefined;
              const fileSize = doc ? doc[0].filesize : undefined;
              const isMine = getUserId(log.user) === String(currentUser?.id);

              return (
                <div
                  key={log.id || log.createdAt || Math.random().toString()}
                  className="flex gap-2"
                >
                  <Avatar size={32} className="bg-blue-500 text-white">
                    {avatar}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Text className="text-sm font-medium text-gray-800">
                        {userName}
                      </Text>
                      <Text className="text-xs text-gray-400">
                        {formatMessageTime(log.createdAt)}
                      </Text>
                      <Tag
                        color={
                          log.status === "pending"
                            ? "gold"
                            : log.status === "completed"
                              ? "green"
                              : "red"
                        }
                      >
                        {log.status === "pending"
                          ? "Chờ xác nhận"
                          : log.status === "completed"
                            ? "Đã xác nhận"
                            : "Đã từ chối"}
                      </Tag>
                    </div>
                    <div className="mt-1 p-3 rounded-xl bg-white border border-gray-200">
                      <Text className="text-sm text-gray-800 whitespace-pre-wrap">
                        {log.content}
                      </Text>

                      {docUrl && (
                        <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-md bg-blue-50">
                              <FileText size={14} className="text-blue-500" />
                            </div>
                            <div>
                              <Text className="text-xs font-medium text-gray-800 block">
                                {fileName || "Tài liệu"}
                              </Text>
                              {fileSize && (
                                <Text className="text-xs text-gray-500">
                                  {formatFileSize(fileSize)}
                                </Text>
                              )}
                            </div>
                          </div>
                          <Button
                            type="text"
                            icon={<Download size={14} />}
                            onClick={() => {
                              const a = document.createElement("a");
                              a.href = docUrl;
                              a.download = fileName || "document";
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            }}
                          >
                            Tải xuống
                          </Button>
                        </div>
                      )}

                      {log.status === "rejected" && log.reason && (
                        <div className="mt-2 text-xs text-red-500">
                          Lý do từ chối: {log.reason}
                        </div>
                      )}

                      {!isCompleted && !isMine && log.status === "pending" && (
                        <div className="mt-3 flex gap-2">
                          <Button
                            size="small"
                            type="primary"
                            icon={<CheckCircle size={14} />}
                            onClick={() => handleApprove(log)}
                          >
                            Xác nhận
                          </Button>
                          <Button
                            size="small"
                            danger
                            icon={<XIcon size={14} />}
                            onClick={() => handleOpenReject(log)}
                          >
                            Từ chối
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {serviceLogs.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-16 text-center w-full min-h-[200px]">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <FileText size={24} className="text-gray-400" />
                </div>
                <Text className="text-gray-500 text-sm">
                  Chưa có nhật ký hoàn thiện dịch vụ.
                </Text>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {!isCompleted && (
          <div className="mt-4 p-3 bg-white border-t border-gray-200">
            {(() => {
              // Only block sending when there is a pending completion log
              const hasPendingCompletion = serviceLogs.some(
                (l) =>
                  l.status === "pending" &&
                  l.content.toLowerCase().includes("hoàn thành dịch vụ")
              );
              const disabled = Boolean(hasPendingCompletion);
              return (
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {disabled ? (
                      <span>⏳ Đang chờ xác nhận hoàn thành dịch vụ.</span>
                    ) : isCompleted ? (
                      <span>
                        Dịch vụ đã hoàn thành. Chờ xác nhận cuối cùng.
                      </span>
                    ) : (
                      <span>Chọn một hành động để tiếp tục.</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={openProgressModal}
                      disabled={disabled || isCompleted}
                    >
                      Gửi báo cáo tiến độ
                    </Button>
                    <Button
                      type="primary"
                      onClick={openCompleteModal}
                      disabled={disabled || isCompleted}
                    >
                      Gửi xác nhận hoàn thành dịch vụ
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </Card>


      {isViewing && (
        <Card className="shadow-sm">
          <div className="text-center">
            <Title level={4}>Chế độ xem</Title>
            <Text type="secondary" className="block mb-6">
              Bạn đang xem lại thông tin của bước này. Không thể thực hiện các
              hành động.
            </Text>
          </div>
        </Card>
      )}

      <Card title="Thông tin chốt kết quả thành công" className="shadow-sm">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Khách hàng liên quan" span={1}>
            <Space>
              <UserOutlined />
              {getUserName(ticket.user)}
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Loại dịch vụ" span={1}>
            <Space>
              <FileTextOutlined />
              {getServiceName()}
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái" span={1}>
            <Tag color={isCompleted ? "green" : "blue"}>
              {isCompleted ? "Đã hoàn thành" : "Chờ xác nhận"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Ngày hoàn thành" span={1}>
            {isCompleted && ticket.updatedAt
              ? dayjs(ticket.updatedAt).format("DD/MM/YYYY HH:mm")
              : "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title="Sản phẩm / Công nghệ / Dự án liên quan"
        className="shadow-sm"
      >
        <div className="space-y-4">
          {getTechnologiesList().length > 0 && (
            <div>
              <Title level={5}>Công nghệ liên quan:</Title>
              <Space wrap>
                {getTechnologiesList().map((techName, index) => (
                  <Tag key={index} color="blue">
                    {techName}
                  </Tag>
                ))}
              </Space>
            </div>
          )}

          {getProjectName() && (
            <div>
              <Title level={5}>Dự án liên quan:</Title>
              <Tag color="green">{getProjectName()}</Tag>
            </div>
          )}
        </div>
      </Card>

     

      {/* Reject Modal */}
      <Modal
        title="Từ chối kết quả"
        open={showRejectModal}
        onOk={handleReject}
        onCancel={() => setShowRejectModal(false)}
        okText="Từ chối"
        cancelText="Hủy"
        confirmLoading={updatingStatus}
        okButtonProps={{ danger: true }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="reason"
            label="Lý do từ chối"
            rules={[{ required: true, message: "Vui lòng nhập lý do từ chối" }]}
          >
            <TextArea rows={4} placeholder="Nhập lý do từ chối kết quả..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Service Ticket Log Modal */}
      <Modal
        title={
          modalMode === "progress"
            ? "Gửi báo cáo tiến độ"
            : "Gửi xác nhận hoàn thành dịch vụ"
        }
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setAttachments([]);
          setModalContent("");
        }}
        onOk={handleModalOk}
        okText="Gửi"
        confirmLoading={sending}
      >
        <div className="space-y-3">
          <div>
            <Typography.Text className="block mb-1">Nội dung</Typography.Text>
            <Input.TextArea
              rows={4}
              placeholder={
                modalMode === "progress"
                  ? "Mô tả tiến độ thực hiện dịch vụ..."
                  : "Xác nhận đã hoàn thành các hạng mục của dịch vụ..."
              }
              value={modalContent}
              onChange={(e) => setModalContent(e.target.value)}
            />
          </div>

          <div>
            <Typography.Text className="block mb-1">
              Tài liệu (tuỳ chọn)
            </Typography.Text>
            <Upload.Dragger
              multiple={false}
              beforeUpload={onFileUpload}
              showUploadList={!!attachments.length}
              maxCount={1}
              onRemove={(file) => {
                setAttachments((prev) =>
                  prev.filter((f) => f.name !== file.name)
                );
              }}
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
            >
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className="ant-upload-text">
                Kéo thả file vào đây hoặc bấm để chọn file
              </p>
              <p className="ant-upload-hint">Hỗ trợ PDF, Word, hình ảnh.</p>
            </Upload.Dragger>
          </div>
        </div>
      </Modal>

      {/* Reject Service Log Modal */}
      <Modal
        title="Từ chối cập nhật"
        open={rejectModalOpen}
        onCancel={() => setRejectModalOpen(false)}
        onOk={handleRejectOk}
        okText="Từ chối"
        okButtonProps={{ danger: true }}
      >
        <Typography.Text className="block mb-1">Lý do</Typography.Text>
        <Input.TextArea
          rows={3}
          placeholder="Nhập lý do từ chối..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </div>
  );
};
