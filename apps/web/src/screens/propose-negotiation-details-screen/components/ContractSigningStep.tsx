import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Divider,
  Upload,
  Input,
  message,
  Modal,
} from "antd";
import {
  FileText,
  Download,
  CheckCircle,
  UploadCloud,
  Paperclip,
} from "lucide-react";
import type { Propose } from "@/types/propose";
import type { Contract } from "@/types/contract";
import { ContractStatusEnum } from "@/types/contract";
import { contractsApi } from "@/api/contracts";
import { useUser } from "@/store/auth";
import { uploadFile } from "@/api/media";
import { MediaType } from "@/types/media1";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ContractSigningStepProps {
  proposal: Propose;
  onBothAccepted?: () => void;
  readOnly?: boolean;
}

export const ContractSigningStep: React.FC<ContractSigningStepProps> = ({
  proposal,
  onBothAccepted,
  readOnly = false,
}) => {
  const currentUser = useUser();
  const [loading, setLoading] = useState(false);
  const [activeContract, setActiveContract] = useState<
    Contract | undefined | null
  >(null);
  const [submitting, setSubmitting] = useState(false);
  const [savingContractFile, setSavingContractFile] = useState(false);

  // Unified contract completion state
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [notes, setNotes] = useState("");

  // Contract acceptance state
  const [acceptingContract, setAcceptingContract] = useState(false);

  const isContractSigned = activeContract
    ? activeContract.status === ContractStatusEnum.SIGNED ||
      activeContract.status === ContractStatusEnum.COMPLETED
    : proposal.status === "contract_signed";

  const getContractStatusLabel = (status?: ContractStatusEnum) => {
    switch (status) {
      case ContractStatusEnum.SIGNED:
        return "Đã ký";
      case ContractStatusEnum.IN_PROGRESS:
        return "Đang thực hiện";
      case ContractStatusEnum.COMPLETED:
        return "Hoàn tất";
      case ContractStatusEnum.CANCELLED:
        return "Đã hủy";
      default:
        return isContractSigned ? "Đã ký" : "Đang đàm phán";
    }
  };

  const formatDateTime = (iso?: string) =>
    iso ? new Date(iso).toLocaleString("vi-VN") : "-";

  const handleDownload = () => {
    // Download the contract file if available
    if (activeContract?.contract_file?.url) {
      const link = document.createElement("a");
      link.href = activeContract.contract_file.url;
      link.download = activeContract.contract_file.filename || "contract.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    // No template download. Start from upload only.
  };

  const refreshContract = async () => {
    try {
      setLoading(true);
      console.log("Refreshing contract for proposal:", proposal.id);
      if(!proposal.id) return;
      const found = await contractsApi.getByPropose(proposal.id, 1);
      console.log("Found contract:", found);
      setActiveContract(found);
    } catch (e) {
      console.error("Error refreshing contract:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal.id]);

  // File upload handlers
  const handleContractFileUpload = (file: File) => {
    setContractFile(file);
    message.success(`Đã chọn hợp đồng: ${file.name}`);
    return false; // prevent auto upload
  };

  const handleAttachmentUpload = (file: File) => {
    setAttachments((prev) => [...prev, file]);
    message.success(`Đã thêm tài liệu: ${file.name}`);
    return false; // prevent auto upload
  };

  const removeAttachment = (file: File) => {
    setAttachments((prev) => prev.filter((f) => f !== file));
  };

  // Upload only the contract file into contract_file field (without completing/signing)
  const handleUploadContractFileOnly = async () => {
    if (!activeContract?.id) {
      message.error("Không tìm thấy hợp đồng");
      return;
    }
    if (!contractFile) {
      message.warning("Vui lòng chọn tệp hợp đồng để tải lên");
      return;
    }

    try {
      setSavingContractFile(true);
      const contractMedia = await uploadFile(contractFile, {
        type: MediaType.DOCUMENT,
        alt: `Hợp đồng ${activeContract.id}`,
      });

      await contractsApi.update(activeContract.id, {
        contract_file: contractMedia.id as any,
      });

      message.success("Đã tải lên hợp đồng thành công");
      setContractFile(null);
      await refreshContract();
    } catch (error) {
      console.error("Error uploading contract file:", error);
      message.error("Không thể tải lên hợp đồng. Vui lòng thử lại.");
    } finally {
      setSavingContractFile(false);
    }
  };

  // Helper functions for contract acceptance
  const getCurrentUserRole = () => {
    if (!activeContract || !currentUser?.id) return null;

    const userAId =
      typeof activeContract.user_a === "object"
        ? activeContract.user_a.id
        : activeContract.user_a;
    const userBId =
      typeof activeContract.user_b === "object"
        ? activeContract.user_b.id
        : activeContract.user_b;

    if (String(userAId) === String(currentUser.id)) return "A";
    if (String(userBId) === String(currentUser.id)) return "B";
    return null;
  };

  const hasCurrentUserAccepted = () => {
    if (!activeContract || !currentUser?.id) return false;

    // Check if current user is in the users_confirm array
    const confirmedUsers = activeContract.users_confirm || [];
    return confirmedUsers.some((user) => {
      const userId = typeof user === "object" ? user.id : user;
      return String(userId) === String(currentUser.id);
    });
  };

  const bothPartiesAccepted = () => {
    if (!activeContract) return false;

    const confirmedUsers = activeContract.users_confirm || [];
    const userAId =
      typeof activeContract.user_a === "object"
        ? activeContract.user_a.id
        : activeContract.user_a;
    const userBId =
      typeof activeContract.user_b === "object"
        ? activeContract.user_b.id
        : activeContract.user_b;

    const userAConfirmed = confirmedUsers.some((user) => {
      const userId = typeof user === "object" ? user.id : user;
      return String(userId) === String(userAId);
    });

    const userBConfirmed = confirmedUsers.some((user) => {
      const userId = typeof user === "object" ? user.id : user;
      return String(userId) === String(userBId);
    });

    return userAConfirmed && userBConfirmed;
  };

  // Unified contract completion function
  const handleCompleteContract = async () => {
    if (!activeContract?.id) {
      message.error("Không tìm thấy hợp đồng");
      return;
    }

    if (!contractFile) {
      message.error("Vui lòng tải lên tệp hợp đồng");
      return;
    }

    try {
      setSubmitting(true);

      // Upload contract file
      const contractMedia = await uploadFile(contractFile, {
        type: MediaType.DOCUMENT,
        alt: `Hợp đồng ${activeContract.id}`,
      });

      // Upload attachments if any
      const attachmentMedias = await Promise.all(
        attachments.map((file) =>
          uploadFile(file, {
            type: MediaType.DOCUMENT,
            alt: `Tài liệu hợp đồng ${activeContract.id}`,
          })
        )
      );

      // Update contract with files and mark as signed
      await contractsApi.update(activeContract.id, {
        contract_file: contractMedia.id as any,
        documents: attachmentMedias.map((m) => m.id) as any,
        status: ContractStatusEnum.SIGNED,
      });

      message.success("Hợp đồng đã được hoàn tất thành công!");
      await refreshContract();

      // Clear form
      setContractFile(null);
      setAttachments([]);
      setNotes("");
    } catch (error) {
      console.error("Error completing contract:", error);
      message.error("Không thể hoàn tất hợp đồng. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // Contract acceptance function
  const handleAcceptContract = () => {
    if (!currentUser?.id) {
      message.error("Vui lòng đăng nhập để xác nhận hợp đồng");
      return;
    }

    if (!activeContract?.id) {
      message.error("Không tìm thấy thông tin hợp đồng");
      return;
    }

    Modal.confirm({
      title: "Xác nhận hợp đồng",
      content: "Bạn có chắc chắn muốn xác nhận hợp đồng này?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setAcceptingContract(true);
          const result = await contractsApi.acceptContract(
            activeContract.id,
            currentUser.id
          );
          const msg = (result as any)?.message || "Đã ghi nhận xác nhận hợp đồng";
          message.success(msg);
          if ((result as any)?.bothAccepted) {
            try {
              await refreshContract();
            } finally {
              onBothAccepted?.();
            }
            return;
          }
          await refreshContract();
        } catch (error) {
          console.error("Error accepting contract:", error);
          message.error(
            error instanceof Error ? error.message : "Không thể xác nhận hợp đồng"
          );
        } finally {
          setAcceptingContract(false);
        }
      },
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {isContractSigned ? (
              <CheckCircle size={64} className="text-green-500" />
            ) : (
              <FileText size={64} className="text-blue-500" />
            )}
          </div>
          <Title level={3} className="mb-2">
            {isContractSigned ? "Hợp đồng đã được ký" : "Ký hợp đồng"}
          </Title>
          <Text className="text-gray-600">
            {isContractSigned
              ? "Hợp đồng đã được ký thành công. Dự án có thể bắt đầu triển khai."
              : "Vui lòng xem xét và ký hợp đồng để hoàn tất quá trình đàm phán."}
          </Text>
        </div>

        <Divider />

        <div className="space-y-6">
          {/* Contract Information */}
          <div>
            <Title level={4}>Thông tin hợp đồng</Title>
            {activeContract ? (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <Text strong>Mã hợp đồng:</Text>
                  <Text>{activeContract.id}</Text>
                </div>
                <div className="flex justify-between">
                  <Text strong>Người A:</Text>
                  <Text>
                    {typeof (activeContract.user_a as any) === "object"
                      ? (activeContract.user_a as any).full_name ||
                        (activeContract.user_a as any).email
                      : String(activeContract.user_a)}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text strong>Người B:</Text>
                  <Text>
                    {typeof (activeContract.user_b as any) === "object"
                      ? (activeContract.user_b as any).full_name ||
                        (activeContract.user_b as any).email
                      : String(activeContract.user_b)}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text strong>Công nghệ:</Text>
                  <Text>
                    {Array.isArray(activeContract.technologies) &&
                    activeContract.technologies.length > 0
                      ? activeContract.technologies
                          .map((t) => (t as any)?.title || "-")
                          .join(", ")
                      : "-"}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text strong>Giá trị đề xuất:</Text>
                  <Text className="text-green-600 font-semibold">
                    {activeContract.offer?.price?.toLocaleString("vi-VN")} VND
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text strong>Trạng thái:</Text>
                  <Text className="text-blue-600">
                    {getContractStatusLabel(activeContract.status)}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text strong>Ngày tạo:</Text>
                  <Text>{formatDateTime(activeContract.createdAt)}</Text>
                </div>
                <div className="flex justify-between">
                  <Text strong>Cập nhật:</Text>
                  <Text>{formatDateTime(activeContract.updatedAt)}</Text>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <Text strong>Công nghệ:</Text>
                  <Text>{proposal.technology?.title || "N/A"}</Text>
                </div>
                <div className="flex justify-between">
                  <Text strong>Người đề xuất:</Text>
                  <Text>
                    {typeof proposal.user === "object"
                      ? proposal.user.full_name || proposal.user.email
                      : proposal.user}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text strong>Ngân sách:</Text>
                  <Text className="text-green-600 font-semibold">
                    {proposal.budget?.toLocaleString("vi-VN")} VND
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text strong>Trạng thái:</Text>
                  <Text className="text-blue-600">
                    {proposal.status === "contract_signed"
                      ? "Đã ký hợp đồng"
                      : proposal.status === "contact_signing"
                        ? "Đang ký hợp đồng"
                        : "Đang đàm phán"}
                  </Text>
                </div>
              </div>
            )}
          </div>

          {/* Contract Acceptance Status */}
          {activeContract?.id && (
            <div>
              <Title level={4}>Trạng thái xác nhận hợp đồng</Title>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <Text strong>Bên A:</Text>
                  <div className="flex items-center gap-2">
                    <Text>
                      {typeof activeContract.user_a === "object"
                        ? activeContract.user_a.full_name ||
                          activeContract.user_a.email
                        : String(activeContract.user_a)}
                    </Text>
                    {(() => {
                      const confirmedUsers = activeContract.users_confirm || [];
                      const userAId =
                        typeof activeContract.user_a === "object"
                          ? activeContract.user_a.id
                          : activeContract.user_a;
                      const isUserAConfirmed = confirmedUsers.some((user) => {
                        const userId =
                          typeof user === "object" ? user.id : user;
                        return String(userId) === String(userAId);
                      });
                      return isUserAConfirmed ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                      );
                    })()}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Text strong>Bên B:</Text>
                  <div className="flex items-center gap-2">
                    <Text>
                      {typeof activeContract.user_b === "object"
                        ? activeContract.user_b.full_name ||
                          activeContract.user_b.email
                        : String(activeContract.user_b)}
                    </Text>
                    {(() => {
                      const confirmedUsers = activeContract.users_confirm || [];
                      const userBId =
                        typeof activeContract.user_b === "object"
                          ? activeContract.user_b.id
                          : activeContract.user_b;
                      const isUserBConfirmed = confirmedUsers.some((user) => {
                        const userId =
                          typeof user === "object" ? user.id : user;
                        return String(userId) === String(userBId);
                      });
                      return isUserBConfirmed ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                      );
                    })()}
                  </div>
                </div>

                {/* Accept Contract Button */}
                {getCurrentUserRole() &&
                  !hasCurrentUserAccepted() &&
                  !bothPartiesAccepted() &&
                  !readOnly && (
                    <div className="text-center pt-4">
                      <Button
                        type="primary"
                        size="large"
                        icon={<CheckCircle size={20} />}
                        loading={acceptingContract}
                        onClick={handleAcceptContract}
                        className="bg-blue-600 hover:bg-blue-700 px-8"
                      >
                        Xác nhận hợp đồng
                      </Button>
                    </div>
                  )}

                {/* Status Messages */}
                {bothPartiesAccepted() && (
                  <div className="text-center pt-2">
                    <Text className="text-green-600 font-semibold">
                      ✅ Cả hai bên đã xác nhận hợp đồng
                    </Text>
                  </div>
                )}

                {hasCurrentUserAccepted() && !bothPartiesAccepted() && (
                  <div className="text-center pt-2">
                    <Text className="text-blue-600">
                      ⏳ Đang chờ bên kia xác nhận
                    </Text>
                  </div>
                )}
              </div>

              {/* Contract File Upload (contract_file) - visible when contract exists and not signed */}
              {!isContractSigned && !bothPartiesAccepted() && !readOnly && (
                <div className="mt-6">
                  <Title level={5} className="mb-3">
                    <FileText size={20} className="inline mr-2" />
                    Tệp hợp đồng (tải lên vào contract_file)
                  </Title>
                  {/* Existing contract file preview */}
                  {activeContract.contract_file && (
                    <Card size="small" className="mb-3 border-dashed">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText size={20} className="text-gray-500" />
                          <div>
                            <Text strong>
                              {activeContract.contract_file.filename || 'Hợp đồng hiện tại'}
                            </Text>
                            <br />
                            <Text type="secondary" className="text-xs">
                              {activeContract.contract_file.filesize
                                ? `${((activeContract.contract_file.filesize || 0) / 1024 / 1024).toFixed(2)} MB`
                                : ''}
                            </Text>
                          </div>
                        </div>
                        {activeContract.contract_file.url && (
                          <Button icon={<Download size={14} />} type="text" onClick={handleDownload}>
                            Tải xuống
                          </Button>
                        )}
                      </div>
                    </Card>
                  )}

                  <Upload.Dragger
                    multiple={false}
                    beforeUpload={handleContractFileUpload}
                    showUploadList={!!contractFile}
                    maxCount={1}
                    onRemove={() => setContractFile(null)}
                    accept=".pdf,.doc,.docx"
                    className="mb-3"
                  >
                    <p className="ant-upload-drag-icon">
                      <UploadCloud />
                    </p>
                    <p className="ant-upload-text">
                      Kéo thả file vào đây hoặc bấm để chọn file
                    </p>
                    <p className="ant-upload-hint">Hỗ trợ PDF, Word.</p>
                  </Upload.Dragger>

                  <Button
                    type="primary"
                    onClick={handleUploadContractFileOnly}
                    loading={savingContractFile}
                    disabled={!contractFile}
                  >
                    Lưu tệp hợp đồng
                  </Button>
                </div>
              )}

              {/* Attachments Upload - Available when contract exists */}
              <div className="mt-6">
                <Title level={5} className="mb-3">
                  <Paperclip size={20} className="inline mr-2" />
                  Tài liệu kèm theo (tuỳ chọn)
                </Title>
                <Upload
                  multiple
                  beforeUpload={handleAttachmentUpload}
                  showUploadList
                  fileList={attachments.map((f) => ({
                    uid: f.name,
                    name: f.name,
                    status: "done" as const,
                  }))}
                  onRemove={(file) => {
                    const target = attachments.find(
                      (f) => f.name === file.name
                    );
                    if (target) removeAttachment(target);
                  }}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                >
                  <Button icon={<UploadCloud size={16} />}>
                    Thêm tài liệu
                  </Button>
                </Upload>
              </div>
            </div>
          )}

          {/* Unified Contract Completion */}
          {!isContractSigned && activeContract?.id && bothPartiesAccepted() && (
            <div className="space-y-6">
              <Title level={4}>Hoàn thiện hợp đồng</Title>

              {/* Contract File Upload */}
              <div>
                <Title level={5} className="mb-3">
                  <FileText size={20} className="inline mr-2" />
                  Tải lên hợp đồng đã ký
                </Title>
                <Upload.Dragger
                  multiple={false}
                  beforeUpload={handleContractFileUpload}
                  showUploadList={!!contractFile}
                  maxCount={1}
                  onRemove={() => setContractFile(null)}
                  accept=".pdf,.doc,.docx"
                  className="mb-4"
                >
                  <p className="ant-upload-drag-icon">
                    <UploadCloud />
                  </p>
                  <p className="ant-upload-text">
                    Kéo thả file vào đây hoặc bấm để chọn file
                  </p>
                  <p className="ant-upload-hint">
                    Hỗ trợ PDF, Word. Dung lượng tối đa 10MB.
                  </p>
                </Upload.Dragger>
              </div>

              <div>
                <Title level={5} className="mb-3">Ghi chú (tuỳ chọn)</Title>
                <TextArea
                  rows={3}
                  placeholder="Ghi chú thêm về hợp đồng..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={readOnly}
                />
              </div>

              {!readOnly && (
                <div className="text-center pt-4">
                  <Button
                    type="primary"
                    size="large"
                    icon={<CheckCircle size={20} />}
                    loading={submitting}
                    onClick={handleCompleteContract}
                    disabled={!contractFile}
                    className="bg-green-600 hover:bg-green-700 px-8"
                  >
                    Hoàn tất hợp đồng
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Contract Document */}
          {activeContract?.contract_file && (
            <div>
              <Title level={4}>Tài liệu hợp đồng</Title>
              <Card size="small" className="border-dashed">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={24} className="text-gray-500" />
                    <div>
                      <Text strong>
                        {activeContract.contract_file?.filename || "Hợp đồng"}
                      </Text>
                      <br />
                      <Text type="secondary" className="text-sm">
                        {activeContract.contract_file?.filesize
                          ? `${((activeContract.contract_file.filesize || 0) / 1024 / 1024).toFixed(2)} MB`
                          : ""}
                      </Text>
                    </div>
                  </div>
                  <Button
                    icon={<Download size={16} />}
                    onClick={handleDownload}
                    type="text"
                  >
                    Tải xuống
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {Array.isArray(activeContract?.documents) &&
            activeContract.documents.length > 0 && (
              <div>
                <Title level={5}>Tài liệu đính kèm</Title>
                <div className="space-y-2">
                  {activeContract.documents.map((doc: any) => (
                    <Card key={doc.id} size="small" className="border-dashed">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText size={20} className="text-gray-400" />
                          <div>
                            <Text>{doc.filename || `Tài liệu #${doc.id}`}</Text>
                            <br />
                            <Text type="secondary" className="text-xs">
                              {doc.filesize
                                ? `${((doc.filesize || 0) / 1024 / 1024).toFixed(2)} MB`
                                : ""}
                            </Text>
                          </div>
                        </div>
                        {doc.url && (
                          <Button
                            icon={<Download size={14} />}
                            type="text"
                            onClick={() => {
                              const a = document.createElement("a");
                              a.href = doc.url || "#";
                              a.download = doc.filename || `document-${doc.id}`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            }}
                          >
                            Tải xuống
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

          {/* No template download or direct sign fallback. Start from uploading only. */}

          {isContractSigned && (
            <div className="text-center pt-6">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-full">
                <CheckCircle size={20} />
                <Text strong className="text-green-700">
                  Hợp đồng đã được ký thành công
                </Text>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
