"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/store/auth";
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  DollarSign,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Chip,
  Spinner,
  Avatar,
  Divider,
  Badge,
  Tooltip,
} from "@heroui/react";
import { getProposeById } from "@/api/propose";
import { getDemandById } from "@/api/demands";
import { Propose } from "@/types/propose";
import { Demand } from "@/types/demand";
import { PAYLOAD_API_BASE_URL } from "@/api/config";

function SolutionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const [demand, setDemand] = useState<Demand | null>(null);
  const [solution, setSolution] = useState<Propose | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load solution and demand details
  useEffect(() => {
    const fetchData = async () => {
      if (!params.id || !params.solutionId) return;

      setLoading(true);
      try {
        // Fetch solution details
        const solutionData = await getProposeById(params.solutionId as string);
        setSolution(solutionData);

        // Fetch demand details
        const demandData = await getDemandById(params.id as string);
        setDemand(demandData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, params.solutionId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "success";
      case "rejected":
        return "danger";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted":
        return "Đã chấp nhận";
      case "rejected":
        return "Đã từ chối";
      case "pending":
        return "Đang chờ duyệt";
      default:
        return "Không xác định";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getDocumentUrl = (doc: any): string | null => {
    if (typeof doc !== "object" || !doc) return null;

    // If doc has a direct URL
    if (doc.url) {
      // If URL is already absolute, use it as is
      if (doc.url.startsWith("http")) {
        return doc.url;
      }
      // If URL is relative, prepend CMS base URL
      return `${PAYLOAD_API_BASE_URL?.replace("/api", "")}${doc.url}`;
    }

    // If doc has an ID, construct media URL
    if (doc.id) {
      return `${PAYLOAD_API_BASE_URL?.replace("/api", "")}/api/media/${doc.id}`;
    }

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-default-600">
            Đang tải chi tiết giải pháp...
          </p>
        </div>
      </div>
    );
  }

  if (error || !solution) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-danger mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Có lỗi xảy ra
          </h2>
          <p className="text-default-600 mb-6">
            {error || "Không tìm thấy giải pháp"}
          </p>
          <Button color="primary" onPress={() => router.back()}>
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="light"
            startContent={<ArrowLeft className="h-4 w-4" />}
            onPress={() => router.back()}
            className="mb-4"
          >
            Quay lại
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Chi tiết giải pháp
              </h1>
              {demand && (
                <p className="text-default-600">
                  Cho nhu cầu:{" "}
                  <span className="font-medium">{demand.title}</span>
                </p>
              )}
            </div>
            <Chip
              color={getStatusColor(solution.status)}
              variant="flat"
              size="lg"
              startContent={getStatusIcon(solution.status)}
            >
              {getStatusText(solution.status)}
            </Chip>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Solution Title */}
            <Card className="shadow-sm">
              <CardHeader>
                <h2 className="text-2xl font-semibold text-foreground">
                  {solution.title}
                </h2>
              </CardHeader>
              <CardBody>
                <div className="prose max-w-none">
                  <p className="text-default-600 leading-relaxed">
                    {solution.description}
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Technology Details */}
            <Card className="shadow-sm">
              <CardHeader>
                <h3 className="text-xl font-semibold text-foreground flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary" />
                  Thông tin công nghệ
                </h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">
                      Tên công nghệ
                    </h4>
                    <p className="text-default-600">
                      {typeof solution.technology === "string"
                        ? solution.technology
                        : solution.technology?.title || "Không xác định"}
                    </p>
                  </div>

                  {typeof solution.technology === "object" &&
                    solution.technology?.description && (
                      <div>
                        <h4 className="font-medium text-foreground mb-2">
                          Mô tả công nghệ
                        </h4>
                        <p className="text-default-600">
                          {solution.technology.description}
                        </p>
                      </div>
                    )}

                  {typeof solution.technology === "object" &&
                    solution.technology?.trl_level && (
                      <div>
                        <h4 className="font-medium text-foreground mb-2">
                          Mức độ sẵn sàng công nghệ (TRL)
                        </h4>
                        <Badge
                          content={solution.technology.trl_level}
                          color="success"
                          size="lg"
                          className="text-white font-bold"
                        >
                          <div className="w-8 h-8 bg-success-100 rounded-full"></div>
                        </Badge>
                      </div>
                    )}
                </div>
              </CardBody>
            </Card>

            {/* Implementation Details */}
            <Card className="shadow-sm">
              <CardHeader>
                <h3 className="text-xl font-semibold text-foreground flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Chi tiết triển khai
                </h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-2 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-success" />
                      Chi phí ước tính
                    </h4>
                    <p className="text-2xl font-bold text-success">
                      {formatPrice(solution.estimated_cost)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-warning" />
                      Thời gian thực hiện
                    </h4>
                    <p className="text-lg font-semibold text-warning">
                      {solution.execution_time}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Cooperation Conditions */}
            {solution.cooperation_conditions && (
              <Card className="shadow-sm">
                <CardHeader>
                  <h3 className="text-xl font-semibold text-foreground flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Điều kiện hợp tác
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="prose max-w-none">
                    <p className="text-default-600 leading-relaxed">
                      {solution.cooperation_conditions}
                    </p>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Proposer Info */}
            <Card className="shadow-sm">
              <CardHeader>
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Người đề xuất
                </h3>
              </CardHeader>
              <CardBody>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar
                    size="lg"
                    name={
                      typeof solution.user === "string"
                        ? solution.user
                        : solution.user?.full_name || solution.user?.email
                    }
                  />
                  <div>
                    <h4 className="font-medium text-foreground">
                      {typeof solution.user === "string"
                        ? solution.user
                        : solution.user?.full_name || "Không xác định"}
                    </h4>
                    <p className="text-sm text-default-600">
                      {typeof solution.user === "string"
                        ? ""
                        : solution.user?.email || ""}
                    </p>
                  </div>
                </div>

                {/* {typeof solution.user === "object" &&
                  solution.user?.company && (
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-foreground">
                          Công ty:
                        </span>
                        <p className="text-sm text-default-600">
                          {solution.user.company.name || "Không xác định"}
                        </p>
                      </div>
                      {solution.user.company.website && (
                        <div>
                          <span className="text-sm font-medium text-foreground">
                            Website:
                          </span>
                          <a
                            href={solution.user.company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:text-primary-600 ml-1"
                          >
                            {solution.user.company.website}
                          </a>
                        </div>
                      )}
                    </div>
                  )} */}
              </CardBody>
            </Card>

            {/* Document */}
            {solution.document && (
              <Card className="shadow-sm">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-foreground flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    Tài liệu đính kèm
                  </h3>
                </CardHeader>
                <CardBody>
                  <div
                    className="flex items-center space-x-3 p-4 border border-default-200 rounded-lg hover:border-primary-200 hover:bg-primary-50 transition-all duration-200 cursor-pointer group"
                    onClick={() => {
                      const documentUrl = getDocumentUrl(solution.document);
                      if (documentUrl) {
                        window.open(documentUrl, "_blank");
                      }
                    }}
                  >
                    <div className="flex-shrink-0">
                      <FileText className="h-8 w-8 text-primary group-hover:text-primary-600 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary-700 truncate">
                        {typeof solution.document === "object" &&
                        solution.document.filename
                          ? solution.document.filename
                          : "Tài liệu đính kèm"}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-default-500">
                        {typeof solution.document === "object" &&
                          solution.document.filesize && (
                            <span>
                              {(solution.document.filesize / 1024).toFixed(1)}{" "}
                              KB
                            </span>
                          )}
                        {typeof solution.document === "object" &&
                          solution.document.mimeType && (
                            <>
                              <span>•</span>
                              <span className="uppercase">
                                {solution.document.mimeType.split("/")[1] ||
                                  "FILE"}
                              </span>
                            </>
                          )}
                        <span>•</span>
                        <span className="text-primary-500 group-hover:text-primary-600">
                          Click để xem
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="h-5 w-5 text-primary-500" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Timeline */}
            <Card className="shadow-sm">
              <CardHeader>
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Thông tin thời gian
                </h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-foreground">
                      Ngày đề xuất:
                    </span>
                    <p className="text-sm text-default-600">
                      {solution.createdAt
                        ? new Date(solution.createdAt).toLocaleDateString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "Không xác định"}
                    </p>
                  </div>
                  {solution.updatedAt &&
                    solution.updatedAt !== solution.createdAt && (
                      <div>
                        <span className="text-sm font-medium text-foreground">
                          Cập nhật lần cuối:
                        </span>
                        <p className="text-sm text-default-600">
                          {new Date(solution.updatedAt).toLocaleDateString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    )}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SolutionDetailPage;
