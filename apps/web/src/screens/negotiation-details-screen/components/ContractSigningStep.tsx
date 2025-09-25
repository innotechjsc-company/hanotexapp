import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, Button, Typography, Space, Divider, Tag, message } from "antd";
import { FileText, Download, CheckCircle } from "lucide-react";
import type { TechnologyPropose } from "@/types/technology-propose";
import type { Contract } from "@/types/contract";
import { ContractStatusEnum } from "@/types/contract";
import { contractsApi } from "@/api/contracts";
import { contractStepsApi } from "@/api/contract-steps";
import type { ContractStep, ContractStepStatus, ContractStepApproval } from "@/types/contract-step";
import { useUser } from "@/store/auth";
import { uploadFile } from "@/api/media";
import { MediaType } from "@/types/media1";

const { Title, Text, Paragraph } = Typography;

interface ContractSigningStepProps {
  proposal: TechnologyPropose;
  contract?: Contract;
  onSignContract?: () => void;
  onDownloadContract?: () => void;
}

export const ContractSigningStep: React.FC<ContractSigningStepProps> = ({
  proposal,
  contract,
  onSignContract,
  onDownloadContract,
}) => {
  const currentUser = useUser();
  const [loading, setLoading] = useState(false);
  const [activeContract, setActiveContract] = useState<Contract | undefined | null>(contract);
  const [steps, setSteps] = useState<ContractStep[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const attachmentsInputRef = useRef<HTMLInputElement | null>(null);

  const isContractSigned = (activeContract || contract)
    ? (contract?.status === ContractStatusEnum.SIGNED ||
        contract?.status === ContractStatusEnum.COMPLETED ||
        activeContract?.status === ContractStatusEnum.SIGNED ||
        activeContract?.status === ContractStatusEnum.COMPLETED)
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
    // Prefer downloading the contract file if available, otherwise fallback
    const c = activeContract || contract;
    if (c?.contract_file?.url) {
      const link = document.createElement("a");
      link.href = c.contract_file.url;
      link.download = c.contract_file.filename || "contract.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    // No template download. Start from upload only.
  };

  const refreshContractAndSteps = async () => {
    try {
      setLoading(true);
      const found = await contractsApi.getByTechnologyPropose(proposal.id, 1);
      setActiveContract(found);
      if (found?.id) {
        const s = await contractStepsApi.listByContract(found.id as any, 1);
        setSteps(s);
      } else {
        setSteps([]);
      }
    } catch (e) {
      // no-op
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!contract) {
      refreshContractAndSteps();
    } else {
      setActiveContract(contract);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal.id]);

  useEffect(() => {
    if (contract) setActiveContract(contract);
  }, [contract]);

  const stepSign = useMemo(
    () => steps.find((s) => s.step === "sign_contract"),
    [steps]
  );
  const stepAttach = useMemo(
    () => steps.find((s) => s.step === "upload_attachments"),
    [steps]
  );
  const stepComplete = useMemo(
    () => steps.find((s) => s.step === "complete_contract"),
    [steps]
  );

  const isUserPartyA = useMemo(() => {
    const c = activeContract || contract;
    if (!c || !currentUser?.id) return false;
    const ua: any = c.user_a as any;
    const userAId = typeof ua === "object" ? ua?.id : ua;
    return String(userAId) === String(currentUser.id);
  }, [activeContract, contract, currentUser]);

  const isUserPartyB = useMemo(() => {
    const c = activeContract || contract;
    if (!c || !currentUser?.id) return false;
    const ub: any = c.user_b as any;
    const userBId = typeof ub === "object" ? ub?.id : ub;
    return String(userBId) === String(currentUser.id);
  }, [activeContract, contract, currentUser]);

  const currentParty: 'A' | 'B' | null = isUserPartyA ? 'A' : isUserPartyB ? 'B' : null;

  const approvalTag = (st?: ContractStepStatus | string) => {
    const map: Record<string, { color: string; text: string }> = {
      pending: { color: 'default', text: 'Chờ duyệt' },
      approved: { color: 'green', text: 'Đã duyệt' },
      rejected: { color: 'red', text: 'Từ chối' },
      cancelled: { color: 'volcano', text: 'Hủy' },
    };
    const meta = (st && map[st]) || map.pending;
    return <Tag color={meta.color}>{meta.text}</Tag>;
  };

  const getApproval = (s?: ContractStep, party?: 'A' | 'B') =>
    s?.approvals?.find((a) => a.party === party);

  const createSignStep = async (file: File) => {
    if (!activeContract?.id) return;
    try {
      setSubmitting(true);
      const media = await uploadFile(file, {
        type: MediaType.DOCUMENT,
        alt: `Hợp đồng ${activeContract.id}`,
      });
      const fileId = media.id;

      if (!currentParty || !currentUser?.id) {
        message.warning("Bạn không phải là Bên A/B của hợp đồng này");
        return;
      }
      const otherParty: 'A' | 'B' = currentParty === 'A' ? 'B' : 'A';

      const approvals: ContractStepApproval[] = [
        {
          party: currentParty,
          user: currentUser.id as any,
          decision: 'approved',
          decided_at: new Date().toISOString(),
        },
        {
          party: otherParty,
          user: otherParty === 'A' ? (activeContract.user_a as any)?.id : (activeContract.user_b as any)?.id,
          decision: 'pending',
        },
      ];

      await contractStepsApi.createStep({
        contract: activeContract.id as any,
        step: 'sign_contract',
        contract_file: fileId,
        uploaded_by: currentUser.id as any,
        approvals,
      });

      message.success('Đã khởi tạo Bước 1');
      await refreshContractAndSteps();
    } catch (e) {
      message.error('Thao tác thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const createAttachmentsStep = async (files: File[]) => {
    if (!activeContract?.id) return;
    try {
      setSubmitting(true);
      const uploads = await Promise.all(
        files.map((f) =>
          uploadFile(f, { type: MediaType.DOCUMENT, alt: `Tài liệu HĐ ${activeContract?.id}` })
        )
      );
      const ids = uploads.map((m) => m.id);

      if (!currentParty || !currentUser?.id) {
        message.warning("Bạn không phải là Bên A/B của hợp đồng này");
        return;
      }
      const otherParty: 'A' | 'B' = currentParty === 'A' ? 'B' : 'A';
      const approvals: ContractStepApproval[] = [
        {
          party: currentParty,
          user: currentUser.id as any,
          decision: 'approved',
          decided_at: new Date().toISOString(),
        },
        {
          party: otherParty,
          user: otherParty === 'A' ? (activeContract.user_a as any)?.id : (activeContract.user_b as any)?.id,
          decision: 'pending',
        },
      ];

      await contractStepsApi.createStep({
        contract: activeContract.id as any,
        step: 'upload_attachments',
        attachments: ids as any,
        uploaded_by: currentUser.id as any,
        approvals,
      });
      message.success('Đã khởi tạo Bước 2');
      await refreshContractAndSteps();
    } catch (e) {
      message.error('Tải lên tài liệu thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const createCompleteStep = async () => {
    if (!activeContract?.id) return;
    try {
      setSubmitting(true);
      if (!currentParty || !currentUser?.id) {
        message.warning("Bạn không phải là Bên A/B của hợp đồng này");
        return;
      }
      const otherParty: 'A' | 'B' = currentParty === 'A' ? 'B' : 'A';
      const approvals: ContractStepApproval[] = [
        {
          party: currentParty,
          user: currentUser.id as any,
          decision: 'approved',
          decided_at: new Date().toISOString(),
        },
        {
          party: otherParty,
          user: otherParty === 'A' ? (activeContract.user_a as any)?.id : (activeContract.user_b as any)?.id,
          decision: 'pending',
        },
      ];
      await contractStepsApi.createStep({
        contract: activeContract.id as any,
        step: 'complete_contract',
        approvals,
      });
      message.success('Đã khởi tạo Bước 3');
      await refreshContractAndSteps();
    } catch (e) {
      message.error('Thao tác thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const updateDecision = async (
    step: ContractStep,
    decision: 'approved' | 'rejected'
  ) => {
    if (!currentParty) return;
    try {
      setSubmitting(true);
      const approvals = step.approvals.map((a) => {
        if (a.party === currentParty) {
          return {
            ...a,
            user: (currentUser?.id as any) || a.user,
            decision,
            decided_at: new Date().toISOString(),
          };
        }
        return a;
      });
      await contractStepsApi.updateApprovals(step.id as any, approvals);
      message.success(decision === 'approved' ? 'Đã đồng ý' : 'Đã từ chối');
      await refreshContractAndSteps();
    } catch (e) {
      message.error('Không thể cập nhật phê duyệt');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
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
            {contract ? (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <Text strong>Mã hợp đồng:</Text>
                  <Text>{contract.id}</Text>
                </div>
                <div className="flex justify-between">
                  <Text strong>Người A:</Text>
                  <Text>
                    {typeof (contract.user_a as any) === "object"
                      ? (contract.user_a as any).full_name ||
                        (contract.user_a as any).email
                      : String(contract.user_a)}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text strong>Người B:</Text>
                  <Text>
                    {typeof (contract.user_b as any) === "object"
                      ? (contract.user_b as any).full_name ||
                        (contract.user_b as any).email
                      : String(contract.user_b)}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text strong>Công nghệ:</Text>
                  <Text>
                    {Array.isArray(contract.technologies) &&
                    contract.technologies.length > 0
                      ? contract.technologies
                          .map((t) => (t as any)?.title || "-")
                          .join(", ")
                      : "-"}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text strong>Giá trị đề xuất:</Text>
                  <Text className="text-green-600 font-semibold">
                    {contract.offer?.price?.toLocaleString("vi-VN")} VND
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text strong>Trạng thái:</Text>
                  <Text className="text-blue-600">
                    {getContractStatusLabel(contract.status)}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text strong>Ngày tạo:</Text>
                  <Text>{formatDateTime(contract.createdAt)}</Text>
                </div>
                <div className="flex justify-between">
                  <Text strong>Cập nhật:</Text>
                  <Text>{formatDateTime(contract.updatedAt)}</Text>
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
                      : "Đang đàm phán"}
                  </Text>
                </div>
              </div>
            )}
          </div>

          {/* Workflow Steps */}
          {activeContract?.id && (
            <div className="space-y-4">
              <Title level={4}>Quy trình 3 bước</Title>
              {/* Bước 1: Ký hợp đồng */}
              <Card size="small">
                <div className="flex items-center justify-between">
                  <div>
                    <Text strong>Bước 1: Ký hợp đồng</Text>
                    <div className="mt-1">
                      {approvalTag(stepSign?.status)}
                    </div>
                  </div>
                  <div>
                    {!stepSign && (
                      <Space>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) createSignStep(f);
                            e.currentTarget.value = '';
                          }}
                        />
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={!currentParty || submitting}
                        >
                          Tải lên hợp đồng
                        </Button>
                      </Space>
                    )}
                  </div>
                </div>
                {stepSign && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <Text>Tệp hợp đồng:</Text>
                      <div className="flex items-center gap-2">
                        <Text>
                          {stepSign.contract_file?.filename || 'Không có tệp'}
                        </Text>
                        {stepSign.contract_file?.url && (
                          <Button size="small" type="link" onClick={() => {
                            const a = document.createElement('a');
                            a.href = stepSign.contract_file?.url!;
                            a.download = stepSign.contract_file?.filename || 'contract';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                          }}>Tải xuống</Button>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Text>Phê duyệt Bên A:</Text>
                      <div>
                        {approvalTag(getApproval(stepSign, 'A')?.decision as ContractStepStatus)}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Text>Phê duyệt Bên B:</Text>
                      <div>
                        {approvalTag(getApproval(stepSign, 'B')?.decision as ContractStepStatus)}
                      </div>
                    </div>
                    {/* Actions for current user if pending */}
                    {currentParty && getApproval(stepSign, currentParty)?.decision === 'pending' && (
                      <div className="text-right">
                        <Space>
                          <Button onClick={() => updateDecision(stepSign, 'rejected')} disabled={submitting}>Từ chối</Button>
                          <Button type="primary" onClick={() => updateDecision(stepSign, 'approved')} disabled={submitting}>Đồng ý</Button>
                        </Space>
                      </div>
                    )}
                  </div>
                )}
              </Card>

              {/* Bước 2: Tài liệu kèm theo */}
              <Card size="small">
                <div className="flex items-center justify-between">
                  <div>
                    <Text strong>Bước 2: Tài liệu kèm theo</Text>
                    <div className="mt-1">{approvalTag(stepAttach?.status)}</div>
                  </div>
                  <div>
                    {!stepAttach && stepSign?.status === 'approved' && (
                      <Space>
                        <input
                          ref={attachmentsInputRef}
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                          className="hidden"
                          onChange={(e) => {
                            const list = e.target.files ? Array.from(e.target.files) : [];
                            if (list.length > 0) createAttachmentsStep(list);
                            e.currentTarget.value = '';
                          }}
                        />
                        <Button onClick={() => attachmentsInputRef.current?.click()} disabled={!currentParty || submitting}>
                          Tải lên tài liệu
                        </Button>
                      </Space>
                    )}
                  </div>
                </div>
                {stepAttach && (
                  <div className="mt-4 space-y-2">
                    <div>
                      <Text strong>Danh sách tài liệu:</Text>
                      <div className="mt-2 space-y-1">
                        {(stepAttach.attachments || []).map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between">
                            <Text>{doc.filename || `Tài liệu #${doc.id}`}</Text>
                            {doc.url && (
                              <Button size="small" type="link" onClick={() => {
                                const a = document.createElement('a');
                                a.href = doc.url!;
                                a.download = doc.filename || 'attachment';
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                              }}>Tải xuống</Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Text>Phê duyệt Bên A:</Text>
                      <div>
                        {approvalTag(getApproval(stepAttach, 'A')?.decision as ContractStepStatus)}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Text>Phê duyệt Bên B:</Text>
                      <div>
                        {approvalTag(getApproval(stepAttach, 'B')?.decision as ContractStepStatus)}
                      </div>
                    </div>
                    {currentParty && getApproval(stepAttach, currentParty)?.decision === 'pending' && (
                      <div className="text-right">
                        <Space>
                          <Button onClick={() => updateDecision(stepAttach, 'rejected')} disabled={submitting}>Từ chối</Button>
                          <Button type="primary" onClick={() => updateDecision(stepAttach, 'approved')} disabled={submitting}>Đồng ý</Button>
                        </Space>
                      </div>
                    )}
                  </div>
                )}
              </Card>

              {/* Bước 3: Hoàn tất hợp đồng */}
              <Card size="small">
                <div className="flex items-center justify-between">
                  <div>
                    <Text strong>Bước 3: Hoàn tất hợp đồng</Text>
                    <div className="mt-1">{approvalTag(stepComplete?.status)}</div>
                  </div>
                  <div>
                    {!stepComplete && stepAttach?.status === 'approved' && (
                      <Space>
                        <Button onClick={() => createCompleteStep()} disabled={!currentParty || submitting}>
                          Khởi tạo hoàn tất
                        </Button>
                      </Space>
                    )}
                  </div>
                </div>
                {stepComplete && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <Text>Phê duyệt Bên A:</Text>
                      <div>
                        {approvalTag(getApproval(stepComplete, 'A')?.decision as ContractStepStatus)}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Text>Phê duyệt Bên B:</Text>
                      <div>
                        {approvalTag(getApproval(stepComplete, 'B')?.decision as ContractStepStatus)}
                      </div>
                    </div>
                    {currentParty && getApproval(stepComplete, currentParty)?.decision === 'pending' && (
                      <div className="text-right">
                        <Space>
                          <Button onClick={() => updateDecision(stepComplete, 'rejected')} disabled={submitting}>Từ chối</Button>
                          <Button type="primary" onClick={() => updateDecision(stepComplete, 'approved')} disabled={submitting}>Đồng ý</Button>
                        </Space>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Contract Document */}
          {(activeContract || contract)?.contract_file && (
            <div>
              <Title level={4}>Tài liệu hợp đồng</Title>
              <Card size="small" className="border-dashed">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={24} className="text-gray-500" />
                    <div>
                      <Text strong>
                        {(activeContract || contract)?.contract_file?.filename || "Hợp đồng"}
                      </Text>
                      <br />
                      <Text type="secondary" className="text-sm">
                        {(activeContract || contract)?.contract_file?.filesize
                          ? `${((((activeContract || contract)!.contract_file!.filesize || 0) / 1024 / 1024).toFixed(2))} MB`
                          : ""}
                      </Text>
                    </div>
                  </div>
                  <Button icon={<Download size={16} />} onClick={handleDownload} type="text">
                    Tải xuống
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {Array.isArray((activeContract || contract)?.documents) && (activeContract || contract)!.documents!.length > 0 && (
            <div>
              <Title level={5}>Tài liệu đính kèm</Title>
              <div className="space-y-2">
                {(activeContract || contract)!.documents!.map((doc) => (
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

          {/* Description */}
          <div>
            <Title level={4}>Mô tả đề xuất</Title>
            <Paragraph className="text-gray-700 bg-gray-50 p-4 rounded-lg">
              {proposal.description || "Không có mô tả chi tiết."}
            </Paragraph>
          </div>

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
