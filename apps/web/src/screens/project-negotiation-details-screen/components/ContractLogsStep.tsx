"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Typography,
  message,
  Modal,
  Tag,
  Upload,
  Input,
} from "antd";
import {
  FileText,
  Download,
  UploadCloud,
  CheckCircle,
  X as XIcon,
} from "lucide-react";
import type { ProjectPropose } from "@/types/project-propose";
import { contractLogsApi } from "@/api/contract-logs";
import { contractsApi } from "@/api/contracts";
import { useUser } from "@/store/auth";
import { uploadFile } from "@/api/media";
import { MediaType } from "@/types/media1";
import type { ContractLog } from "@/types/contract-log";
import { ContractLogStatus } from "@/types/contract-log";

const { Text } = Typography;

interface ContractLogsStepProps {
  proposal: ProjectPropose;
}

export const ContractLogsStep: React.FC<ContractLogsStepProps> = ({
  proposal,
}) => {
  const currentUser = useUser();
  const isCompleted = proposal?.status === "completed";

  const [logs, setLogs] = useState<ContractLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"progress" | "complete">(
    "progress"
  );
  const [modalContent, setModalContent] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [activeContractId, setActiveContractId] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatFileSize = (bytes: number) => {
    if (!bytes && bytes !== 0) return "";
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    let size = bytes;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(2)} ${units[i]}`;
  };

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

  const fetchLogs = async () => {
    if (!proposal?.id) return;
    setLoading(true);
    try {
      // Load active contract for this proposal (required by CMS schema)
      try {
        const contract = await contractsApi.getByPropose(
          proposal.id,
          1
        );
        setActiveContractId(
          (contract as any)?.id || (contract as any)?._id || null
        );
      } catch {
        setActiveContractId(null);
      }

      const res = await contractLogsApi.list(
        { propose: proposal.id },
        { limit: 100, sort: "createdAt" }
      );
      const data = (res as any).docs || (res as any).data || [];
      setLogs(data as ContractLog[]);
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop =
            scrollContainerRef.current.scrollHeight;
        }
      }, 50);
    } catch (e) {
      console.error("Failed to load contract logs", e);
      message.error("Không thể tải nhật ký hợp đồng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal?.id]);

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

  const getUserId = (user: any) =>
    typeof user === "object" ? user?.id : String(user || "");

  const performSend = async (content: string) => {
    try {
      setSending(true);

      if (!activeContractId) {
        message.error("Không tìm thấy hợp đồng để ghi nhận nhật ký");
        return;
      }

      if (!proposal?.id) {
        message.error("Không tìm thấy đề xuất");
        return;
      }

      let documentId: any = undefined;
      if (attachments[0]) {
        const uploaded = await uploadFile(attachments[0], {
          type: MediaType.DOCUMENT,
          alt: `Contract log for proposal ${proposal.id}`,
        });
        documentId = uploaded.id;
      }

      await contractLogsApi.create({
        propose: proposal?.id as any,
        contract: activeContractId as any,
        user: currentUser!.id as any,
        content: content.trim(),
        documents: documentId,
        status: ContractLogStatus.Pending,
        // Mark completion logs so UI can gate sending until confirmed
        is_done_contract: modalMode === "complete",
      });

      setModalOpen(false);
      setModalContent("");
      setAttachments([]);
      await fetchLogs();
      setTimeout(() => {
        try {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        } catch {}
      }, 50);
    } catch (e) {
      console.error("Failed to send contract log", e);
      message.error("Không thể gửi cập nhật hợp đồng");
    } finally {
      setSending(false);
    }
  };

  const openProgressModal = () => {
    if (isCompleted) {
      message.info("Hợp đồng đã hoàn thành. Không thể gửi thêm cập nhật.");
      return;
    }
    setModalMode("progress");
    setModalContent("");
    setAttachments([]);
    setModalOpen(true);
  };

  const openCompleteModal = () => {
    if (isCompleted) {
      message.info("Hợp đồng đã hoàn thành. Không thể xác nhận thêm.");
      return;
    }
    setModalMode("complete");
    setModalContent("Xác nhận hoàn thành hợp đồng");
    setAttachments([]);
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    if (!proposal?.id || !currentUser?.id) {
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

  const handleApprove = (log: ContractLog) => {
    if (!log?.id) return;
    const contentText = String(log.content || "");
    const content = contentText.toLowerCase();
    const isDone =
      typeof (log as any).is_done_contract === "boolean"
        ? Boolean((log as any).is_done_contract)
        : content.includes("hoàn thành hợp đồng") ||
          content.includes("xác nhận hoàn thành") ||
          content.includes("hoan thanh hop dong");

    Modal.confirm({
      title: "Xác nhận cập nhật",
      content: (
        <div>
          <div className="mb-2">
            <Text className="text-sm">{contentText}</Text>
          </div>
          {isDone && (
            <Text className="text-xs text-gray-500">
              Thao tác này sẽ đánh dấu hợp đồng đã hoàn tất.
            </Text>
          )}
        </div>
      ),
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await contractLogsApi.confirmLog({
            contract_log_id: String(log.id),
            status: "completed",
            is_done_contract: isDone,
          });
          message.success("Đã xác nhận cập nhật");
          await fetchLogs();
        } catch (e) {
          console.error(e);
          message.error("Không thể xác nhận");
          throw e;
        }
      },
    });
  };

  const handleOpenReject = (log: ContractLog) => {
    setRejectTargetId((log as any).id || null);
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
      await contractLogsApi.confirmLog({
        contract_log_id: rejectTargetId,
        status: "cancelled",
        reason,
      });
      message.success("Đã từ chối cập nhật");
      setRejectModalOpen(false);
      setRejectTargetId(null);
      setRejectReason("");
      await fetchLogs();
    } catch (e) {
      console.error(e);
      message.error("Không thể từ chối");
    }
  };

  return (
    <div className="h-full p-4 bg-gray-50">
      <div className="h-full max-w-2xl mx-auto">
        <div
          className="h-full bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-3 min-h-0"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#d1d5db #f3f4f6",
            }}
          >
            <div className="space-y-2">
              {logs.map((log) => {
                const user = log.user as any;
                const userName =
                  typeof user === "object"
                    ? user.full_name || user.email || "Người dùng"
                    : String(user || "Người dùng");
                const avatar = userName.charAt(0).toUpperCase();
                const doc = log.documents as any;
                const docUrl =
                  doc && typeof doc === "object" ? doc.url : undefined;
                const fileName =
                  doc && typeof doc === "object" ? doc.filename : undefined;
                const fileSize =
                  doc && typeof doc === "object" ? doc.filesize : undefined;
                const isMine = getUserId(log.user) === String(currentUser?.id);

                return (
                  <div
                    key={
                      (log as any).id ||
                      log.createdAt ||
                      Math.random().toString()
                    }
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
                            log.status === ContractLogStatus.Pending
                              ? "gold"
                              : log.status === ContractLogStatus.Completed
                                ? "green"
                                : "red"
                          }
                        >
                          {log.status === ContractLogStatus.Pending
                            ? "Chờ xác nhận"
                            : log.status === ContractLogStatus.Completed
                              ? "Đã xác nhận"
                              : "Đã từ chối"}
                        </Tag>
                      </div>
                      <div className="mt-1 p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <Text className="text-sm text-gray-800 whitespace-pre-wrap">
                          {log.content}
                        </Text>

                        {docUrl && (
                          <div className="mt-2 p-2 bg-white rounded-lg border border-gray-200 flex items-center justify-between">
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

                        {log.status === ContractLogStatus.Cancelled &&
                          (log as any).reason && (
                            <div className="mt-2 text-xs text-red-500">
                              Lý do từ chối: {(log as any).reason}
                            </div>
                          )}

                        {!isCompleted &&
                          !isMine &&
                          log.status === ContractLogStatus.Pending && (
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

              {logs.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-16 text-center w-full min-h-[300px]">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <FileText size={24} className="text-gray-400" />
                  </div>
                  <Text className="text-gray-500 text-sm">
                    Chưa có nhật ký hoàn thiện hợp đồng.
                  </Text>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {!isCompleted && (
          <div className="flex-shrink-0 border-t border-gray-200 bg-white p-3">
              {(() => {
                // Only block sending when there is a pending completion log
                const hasPendingCompletion = logs.some(
                  (l) =>
                    l.status === ContractLogStatus.Pending &&
                    (l as any).is_done_contract === true
                );
                const disabled = Boolean(hasPendingCompletion);
                return (
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {disabled ? (
                        <span>
                          ⏳ Đang chờ xác nhận hoàn thành hợp đồng.
                        </span>
                      ) : (
                        <span>Chọn một hành động để tiếp tục.</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={openProgressModal} disabled={disabled}>
                        Gửi báo cáo tiến độ
                      </Button>
                      <Button
                        type="primary"
                        onClick={openCompleteModal}
                        disabled={disabled}
                      >
                        Gửi xác nhận hoàn thành hợp đồng
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      <Modal
        title={
          modalMode === "progress"
            ? "Gửi báo cáo tiến độ"
            : "Gửi xác nhận hoàn thành hợp đồng"
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
                  ? "Mô tả tiến độ thực hiện hợp đồng..."
                  : "Xác nhận đã hoàn thành các hạng mục của hợp đồng..."
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
                <UploadCloud />
              </p>
              <p className="ant-upload-text">
                Kéo thả file vào đây hoặc bấm để chọn file
              </p>
              <p className="ant-upload-hint">Hỗ trợ PDF, Word, hình ảnh.</p>
            </Upload.Dragger>
          </div>
        </div>
      </Modal>

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