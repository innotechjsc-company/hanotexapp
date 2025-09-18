"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/store/auth";
import {
  ArrowLeft,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  FileText,
  Download,
} from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Select,
  SelectItem,
  Chip,
  Avatar,
  Progress,
  Divider,
} from "@heroui/react";

interface Proposal {
  id: string;
  proposer: {
    id: string;
    name: string;
    company: string;
    avatar: string;
  };
  technology: {
    id: string;
    title: string;
    description: string;
  };
  match_score: number;
  solution_description: string;
  implementation_timeline: string;
  estimated_cost: string;
  cooperation_terms: string;
  additional_documents: string[];
  status: "pending" | "accepted" | "rejected" | "under_review";
  created_at: string;
}

interface Demand {
  id: string;
  title: string;
  description: string;
  budget: string;
  deadline: string;
}

export default function DemandProposalsPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [demand, setDemand] = useState<Demand | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Load demand and proposals
  useEffect(() => {
    // TODO: Fetch demand details
    setDemand({
      id: params.id as string,
      title: "Tìm kiếm công nghệ xử lý rác thải sinh học",
      description:
        "Cần công nghệ xử lý rác thải sinh học hiệu quả, thân thiện môi trường.",
      budget: "500,000,000 VND",
      deadline: "2024-03-15",
    });

    // TODO: Fetch proposals
    setProposals([
      {
        id: "1",
        proposer: {
          id: "user1",
          name: "Nguyễn Văn B",
          company: "Công ty ABC Tech",
          avatar: "NB",
        },
        technology: {
          id: "tech1",
          title: "Hệ thống xử lý rác thải sinh học tiên tiến",
          description:
            "Công nghệ xử lý rác thải sinh học sử dụng vi sinh vật có lợi...",
        },
        match_score: 9,
        solution_description:
          "Giải pháp của chúng tôi sử dụng công nghệ vi sinh tiên tiến...",
        implementation_timeline: "3-6 tháng",
        estimated_cost: "400,000,000 - 500,000,000 VND",
        cooperation_terms: "Thanh toán theo tiến độ, bảo hành 2 năm...",
        additional_documents: ["technical_spec.pdf", "certificate.pdf"],
        status: "pending",
        created_at: "2024-01-20",
      },
      {
        id: "2",
        proposer: {
          id: "user2",
          name: "Trần Thị C",
          company: "Viện Nghiên cứu XYZ",
          avatar: "TC",
        },
        technology: {
          id: "tech2",
          title: "Công nghệ phân hủy rác thải hữu cơ",
          description:
            "Công nghệ phân hủy nhanh rác thải hữu cơ bằng enzyme...",
        },
        match_score: 7,
        solution_description:
          "Công nghệ enzyme của chúng tôi có thể phân hủy...",
        implementation_timeline: "4-8 tháng",
        estimated_cost: "300,000,000 - 450,000,000 VND",
        cooperation_terms: "Hợp tác nghiên cứu, chia sẻ quyền sở hữu...",
        additional_documents: ["research_paper.pdf"],
        status: "under_review",
        created_at: "2024-01-22",
      },
    ]);
  }, [params.id]);

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xem xét";
      case "accepted":
        return "Đã chấp nhận";
      case "rejected":
        return "Đã từ chối";
      case "under_review":
        return "Đang xem xét";
      default:
        return "Không xác định";
    }
  };

  const handleAcceptProposal = (proposalId: string) => {
    // TODO: Implement accept proposal
    console.log("Accepting proposal:", proposalId);
  };

  const handleRejectProposal = (proposalId: string) => {
    // TODO: Implement reject proposal
    console.log("Rejecting proposal:", proposalId);
  };

  const handleContactProposer = (proposal: Proposal) => {
    // TODO: Navigate to message with proposer
    router.push(`/messages?user=${proposal.proposer.id}`);
  };

  const filteredProposals =
    filterStatus === "all"
      ? proposals
      : proposals.filter((p) => p.status === filterStatus);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Card className="shadow-sm rounded-none border-b">
        <CardBody className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                isIconOnly
                variant="bordered"
                onPress={() => router.back()}
                className="bg-white border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                style={{
                  minWidth: "44px",
                  minHeight: "44px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Đề xuất nhận được
                </h1>
                <p className="text-default-600">{demand?.title}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Select
                value={filterStatus}
                onSelectionChange={(key) => setFilterStatus(key as string)}
                variant="bordered"
                size="sm"
                className="w-48"
                classNames={{
                  label: "text-sm font-medium text-foreground",
                }}
              >
                <SelectItem key="all">Tất cả</SelectItem>
                <SelectItem key="pending">Chờ xem xét</SelectItem>
                <SelectItem key="under_review">Đang xem xét</SelectItem>
                <SelectItem key="accepted">Đã chấp nhận</SelectItem>
                <SelectItem key="rejected">Đã từ chối</SelectItem>
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProposals.length === 0 ? (
          <Card className="text-center py-12">
            <CardBody>
              <MessageSquare className="h-12 w-12 text-default-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Chưa có đề xuất nào
              </h3>
              <p className="text-default-600">
                Các đề xuất sẽ xuất hiện ở đây khi có người quan tâm đến nhu cầu
                của bạn.
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Proposals List */}
            <div className="lg:col-span-1 space-y-4">
              {filteredProposals.map((proposal) => (
                <Card
                  key={proposal.id}
                  isPressable
                  onPress={() => setSelectedProposal(proposal)}
                  className={`cursor-pointer transition-all ${
                    selectedProposal?.id === proposal.id
                      ? "ring-2 ring-primary border-primary"
                      : "hover:shadow-md"
                  }`}
                >
                  <CardBody className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          name={proposal.proposer.avatar}
                          size="sm"
                          className="bg-primary text-white font-semibold"
                        />
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {proposal.proposer.name}
                          </h3>
                          <p className="text-sm text-default-600">
                            {proposal.proposer.company}
                          </p>
                        </div>
                      </div>
                      <Chip
                        size="sm"
                        color={
                          proposal.status === "pending"
                            ? "warning"
                            : proposal.status === "accepted"
                              ? "success"
                              : proposal.status === "rejected"
                                ? "danger"
                                : "primary"
                        }
                        variant="flat"
                        className="text-xs"
                      >
                        {getStatusText(proposal.status)}
                      </Chip>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground text-sm">
                        {proposal.technology.title}
                      </h4>

                      <div className="flex items-center space-x-4 text-xs text-default-500">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-warning" />
                          <span>{proposal.match_score}/10</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{proposal.implementation_timeline}</span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            {/* Proposal Details */}
            <div className="lg:col-span-2">
              {selectedProposal ? (
                <Card className="shadow-sm">
                  <CardHeader className="p-6">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-4">
                        <Avatar
                          name={selectedProposal.proposer.avatar}
                          size="md"
                          className="bg-primary text-white font-semibold"
                        />
                        <div>
                          <h2 className="text-lg font-semibold text-foreground">
                            {selectedProposal.proposer.name}
                          </h2>
                          <p className="text-default-600">
                            {selectedProposal.proposer.company}
                          </p>
                        </div>
                      </div>
                      <Chip
                        size="md"
                        color={
                          selectedProposal.status === "pending"
                            ? "warning"
                            : selectedProposal.status === "accepted"
                              ? "success"
                              : selectedProposal.status === "rejected"
                                ? "danger"
                                : "primary"
                        }
                        variant="flat"
                        className="text-sm"
                      >
                        {getStatusText(selectedProposal.status)}
                      </Chip>
                    </div>
                  </CardHeader>
                  <Divider />

                  <CardBody className="p-6 space-y-6">
                    {/* Technology Info */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Công nghệ đề xuất
                      </h3>
                      <p className="text-foreground font-medium">
                        {selectedProposal.technology.title}
                      </p>
                      <p className="text-default-600 mt-1">
                        {selectedProposal.technology.description}
                      </p>
                    </div>

                    {/* Match Score */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Mức độ phù hợp
                      </h3>
                      <div className="flex items-center space-x-3">
                        <Progress
                          value={selectedProposal.match_score * 10}
                          color="primary"
                          className="flex-1"
                          size="sm"
                        />
                        <span className="text-lg font-semibold text-primary">
                          {selectedProposal.match_score}/10
                        </span>
                      </div>
                    </div>

                    {/* Solution Description */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Mô tả giải pháp
                      </h3>
                      <p className="text-default-700">
                        {selectedProposal.solution_description}
                      </p>
                    </div>

                    {/* Timeline & Cost */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          Thời gian triển khai
                        </h3>
                        <p className="text-default-700">
                          {selectedProposal.implementation_timeline}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          Chi phí ước tính
                        </h3>
                        <p className="text-default-700">
                          {selectedProposal.estimated_cost}
                        </p>
                      </div>
                    </div>

                    {/* Cooperation Terms */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Điều kiện hợp tác
                      </h3>
                      <p className="text-default-700">
                        {selectedProposal.cooperation_terms}
                      </p>
                    </div>

                    {/* Documents */}
                    {selectedProposal.additional_documents.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          Tài liệu đính kèm
                        </h3>
                        <div className="space-y-2">
                          {selectedProposal.additional_documents.map(
                            (doc, index) => (
                              <Card key={index} className="bg-default-50">
                                <CardBody className="flex flex-row items-center justify-between p-3">
                                  <div className="flex items-center space-x-3">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <span className="text-sm text-foreground">
                                      {doc}
                                    </span>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="solid"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-2 border-blue-600 hover:border-blue-700"
                                    startContent={
                                      <Download className="h-4 w-4" />
                                    }
                                    style={{
                                      minHeight: "36px",
                                      minWidth: "110px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      gap: "6px",
                                    }}
                                  >
                                    Tải xuống
                                  </Button>
                                </CardBody>
                              </Card>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {selectedProposal.status === "pending" && (
                      <>
                        <Divider />
                        <div className="flex justify-end space-x-4 pt-6">
                          <Button
                            variant="bordered"
                            size="lg"
                            onPress={() =>
                              handleContactProposer(selectedProposal)
                            }
                            startContent={<MessageSquare className="h-4 w-4" />}
                            className="bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 hover:bg-gray-50 font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                            style={{
                              minHeight: "44px",
                              minWidth: "120px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                              borderRadius: "10px",
                            }}
                          >
                            Liên hệ
                          </Button>
                          <Button
                            variant="bordered"
                            size="lg"
                            onPress={() =>
                              handleRejectProposal(selectedProposal.id)
                            }
                            startContent={<XCircle className="h-4 w-4" />}
                            className="bg-white border-2 border-red-500 text-red-600 hover:border-red-600 hover:text-red-700 hover:bg-red-50 font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                            style={{
                              minHeight: "44px",
                              minWidth: "120px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                              borderRadius: "10px",
                            }}
                          >
                            Từ chối
                          </Button>
                          <Button
                            variant="solid"
                            size="lg"
                            onPress={() =>
                              handleAcceptProposal(selectedProposal.id)
                            }
                            startContent={<CheckCircle className="h-5 w-5" />}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-green-600 hover:border-green-700 transform hover:scale-105"
                            style={{
                              minHeight: "48px",
                              minWidth: "140px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                              borderRadius: "12px",
                            }}
                          >
                            Chấp nhận
                          </Button>
                        </div>
                      </>
                    )}
                  </CardBody>
                </Card>
              ) : (
                <Card className="shadow-sm p-12 text-center">
                  <CardBody>
                    <Eye className="h-12 w-12 text-default-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Chọn một đề xuất để xem chi tiết
                    </h3>
                    <p className="text-default-600">
                      Click vào đề xuất ở bên trái để xem thông tin chi tiết
                    </p>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
