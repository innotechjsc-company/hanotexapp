import { useState } from "react";
import { Form, message } from "antd";
import { useRouter } from "next/navigation";
import type { Project } from "@/types/project";
import { projectProposeApi } from "@/api/project-propose";
import { ProjectProposeStatus } from "@/types/project-propose";
import toastService from "@/services/toastService";
import type { FileUploadItem } from "@/components/input";

interface UseProposalSubmissionProps {
  project: Project | null;
  projectId: string;
  currentUserId?: string;
  hasExistingProposal: boolean;
  setHasExistingProposal: (value: boolean) => void;
}

export function useProposalSubmission({
  project,
  projectId,
  currentUserId,
  hasExistingProposal,
  setHasExistingProposal,
}: UseProposalSubmissionProps) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [proposalFiles, setProposalFiles] = useState<FileUploadItem[]>([]);

  const handleSendProposal = () => {
    if (!currentUserId) {
      message.warning("Vui lòng đăng nhập để gửi đề xuất đầu tư");
      router.push("/login");
      return;
    }
    if (hasExistingProposal) {
      router.push(`/my-proposals`);
      return;
    }
    setIsProposalModalOpen(true);
  };

  const handleSubmitProposal = async () => {
    try {
      const values = await form.validateFields();
      if (!project) {
        message.error("Không tìm thấy thông tin dự án");
        return;
      }
      if (!currentUserId) {
        message.error("Bạn cần đăng nhập để tiếp tục");
        return;
      }
      // Determine receiver: owner of the project
      const projectUser = (project as any)?.user;
      let receiverId: string | undefined;

      if (typeof projectUser === "string") {
        receiverId = projectUser;
      } else if (projectUser && typeof projectUser === "object") {
        receiverId = projectUser.id || projectUser._id;
      }

      if (!receiverId) {
        message.error("Không xác định được người nhận đề xuất");
        return;
      }
      setIsSubmittingProposal(true);

      // Prepare file attachments
      const fileAttachments = proposalFiles
        .filter((file) => file.uploadStatus === "done" && file.id)
        .map((file) => file.id);

      await projectProposeApi.create({
        project: (project as any)?.id || projectId,
        user: currentUserId,
        receiver: receiverId,
        investor_capacity: values.investor_capacity || "",
        investment_amount: values.investment_amount ?? project?.goal_money ?? 0,
        investment_ratio: values.investment_ratio ?? project?.share_percentage ?? 0,
        investment_type: values.investment_type || "",
        investment_benefits: values.investment_benefits || "",
        documents: fileAttachments?.length > 0 ? fileAttachments : undefined,
        status: ProjectProposeStatus.Pending,
      } as any);

      // Show success toast
      toastService.success(
        "Gửi đề xuất thành công!",
        "Người đăng dự án sẽ thông báo với bạn trong thời gian sớm nhất."
      );
      setIsProposalModalOpen(false);
      setHasExistingProposal(true);
      form.resetFields();
      setProposalFiles([]);
      // Refresh the page to show updated status
      router.refresh();
    } catch (err: any) {
      if (err?.errorFields) return; // validation errors already shown
      console.error("Create project propose error:", err);
      message.error(err?.message || "Gửi đề xuất thất bại");
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  const handleCancelProposal = () => {
    setIsProposalModalOpen(false);
    form.resetFields();
  };

  return {
    form,
    isProposalModalOpen,
    isSubmittingProposal,
    proposalFiles,
    setProposalFiles,
    handleSendProposal,
    handleSubmitProposal,
    handleCancelProposal,
  };
}
