"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Chip,
  Spinner,
  Card,
  CardBody,
} from "@heroui/react";
import { FileText, User, Calendar, DollarSign } from "lucide-react";
import { technologyProposeApi } from "@/api/technology-propose";
import type {
  TechnologyPropose,
  TechnologyProposeStatus,
} from "@/types/technology-propose";
import { formatDate, formatCurrency } from "../utils";

interface ProposalsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  technologyId: string | null;
  technologyTitle: string;
}

export function ProposalsModal({
  isOpen,
  onOpenChange,
  technologyId,
  technologyTitle,
}: ProposalsModalProps) {
  const [proposals, setProposals] = useState<TechnologyPropose[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Fetch proposals when modal opens and technologyId is available
  useEffect(() => {
    if (isOpen && technologyId) {
      fetchProposals();
    }
  }, [isOpen, technologyId]);

  const fetchProposals = async () => {
    if (!technologyId) return;

    setLoading(true);
    setError("");
    try {
      const response = await technologyProposeApi.list(
        { technology: technologyId },
        { limit: 100, sort: "-createdAt" }
      );
      const proposalsList = ((response as any).docs ||
        (response as any).data ||
        []) as TechnologyPropose[];
      setProposals(proposalsList);
    } catch (err) {
      console.error("Failed to fetch proposals:", err);
      setError("Không thể tải danh sách đề xuất");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: TechnologyProposeStatus) => {
    switch (status) {
      case "pending":
        return "warning";
      case "negotiating":
        return "primary";
      case "contract_signed":
        return "success";
      case "completed":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: TechnologyProposeStatus) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "negotiating":
        return "Đang đàm phán";
      case "contract_signed":
        return "Đã ký hợp đồng";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getUserName = (user: any) => {
    if (typeof user === "string") return user;
    return user?.name || user?.email || "Không xác định";
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="5xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold">Danh sách đề xuất</h3>
              <p className="text-sm text-gray-600 font-normal">
                Công nghệ: {technologyTitle}
              </p>
            </ModalHeader>
            <ModalBody>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Spinner size="lg" />
                  <span className="ml-2">Đang tải...</span>
                </div>
              ) : error ? (
                <Card>
                  <CardBody className="text-center py-8">
                    <p className="text-red-600">{error}</p>
                    <Button
                      color="primary"
                      variant="flat"
                      onPress={fetchProposals}
                      className="mt-4"
                    >
                      Thử lại
                    </Button>
                  </CardBody>
                </Card>
              ) : proposals.length === 0 ? (
                <Card>
                  <CardBody className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Chưa có đề xuất nào cho công nghệ này
                    </p>
                  </CardBody>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Tổng cộng: {proposals.length} đề xuất
                  </div>
                  <Table removeWrapper aria-label="Danh sách đề xuất">
                    <TableHeader>
                      <TableColumn>Người đề xuất</TableColumn>
                      <TableColumn>Mô tả</TableColumn>
                      <TableColumn>Ngân sách</TableColumn>
                      <TableColumn>Trạng thái</TableColumn>
                      <TableColumn>Ngày tạo</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {proposals.map((proposal, index) => (
                        <TableRow
                          key={
                            (proposal as any).id ||
                            (proposal as any)._id ||
                            index
                          }
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">
                                {getUserName(proposal.user)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <p className="text-sm line-clamp-2">
                                {proposal.description || "Không có mô tả"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">
                                {formatCurrency(proposal.budget || 0, "vnd")}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Chip
                              color={getStatusColor(proposal.status)}
                              size="sm"
                              variant="flat"
                            >
                              {getStatusLabel(proposal.status)}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">
                                {proposal.createdAt
                                  ? formatDate(proposal.createdAt)
                                  : "Không xác định"}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Đóng
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
