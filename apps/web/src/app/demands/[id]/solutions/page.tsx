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
} from "@heroui/react";
import { getProposes } from "@/api/propose";
import { getDemandById } from "@/api/demands";
import { Propose } from "@/types/propose";
import { Demand } from "@/types/demand";
import { PAYLOAD_API_BASE_URL } from "@/api/config";

function DemandSolutionsPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const [demand, setDemand] = useState<Demand | null>(null);
  const [solutions, setSolutions] = useState<Propose[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load demand and solutions
  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return;

      setLoading(true);
      try {
        // Fetch demand details
        const demandData = await getDemandById(params.id as string);
        setDemand(demandData);

        // Fetch solutions for this demand
        const solutionsResponse = await getProposes(
          { demand: params.id as string },
          { limit: 100, sort: "-createdAt" }
        );

        if (solutionsResponse.docs) {
          setSolutions(solutionsResponse.docs as any as Propose[]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

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
      return `${PAYLOAD_API_BASE_URL.replace("/api", "")}${doc.url}`;
    }

    // If doc has an ID, construct media URL
    if (doc.id) {
      return `${PAYLOAD_API_BASE_URL.replace("/api", "")}/api/media/${doc.id}`;
    }

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-default-600 text-lg">
            Đang tải danh sách giải pháp...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="h-16 w-16 text-danger mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Có lỗi xảy ra
          </h2>
          <p className="text-default-600 mb-6">{error}</p>
          <Button
            color="primary"
            onPress={() =>
              typeof window !== "undefined" && window.location.reload()
            }
            className="w-full"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white ">
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
                Tất cả giải pháp
              </h1>
              {demand && (
                <p className="text-default-600">
                  Cho nhu cầu:{" "}
                  <span className="font-medium">{demand.title}</span>
                </p>
              )}
            </div>
            <Chip color="primary" variant="flat" size="lg">
              {solutions.length} giải pháp
            </Chip>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Solutions List */}
        {solutions.length === 0 ? (
          <div className="flex justify-center">
            <Card className="shadow-sm max-w-md w-full">
              <CardBody className="text-center py-12">
                <Target className="h-16 w-16 text-default-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Chưa có giải pháp nào
                </h3>
                <p className="text-default-600 mb-6">
                  Hiện tại chưa có giải pháp nào được đề xuất cho nhu cầu này.
                </p>
                {isAuthenticated && (
                  <Button
                    color="primary"
                    onPress={() => router.push(`/demands/${params.id}/propose`)}
                  >
                    Đề xuất giải pháp đầu tiên
                  </Button>
                )}
              </CardBody>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution) => (
              <Card
                key={solution.id}
                className="shadow-sm hover:shadow-lg transition-all duration-300 border border-default-200 hover:border-primary-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between w-full">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-2">
                        {solution.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Chip
                          color={getStatusColor(solution.status)}
                          variant="flat"
                          size="sm"
                          startContent={getStatusIcon(solution.status)}
                        >
                          {getStatusText(solution.status)}
                        </Chip>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardBody className="pt-0">
                  {/* Technology Info */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        Công nghệ
                      </span>
                    </div>
                    <p className="text-sm text-default-600">
                      {typeof solution.technology === "string"
                        ? solution.technology
                        : solution.technology?.title || "Không xác định"}
                    </p>
                  </div>

                  {/* Cost and Timeline */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <DollarSign className="h-4 w-4 text-success" />
                        <span className="text-xs font-medium text-foreground">
                          Chi phí
                        </span>
                      </div>
                      <p className="text-sm text-default-600">
                        {formatPrice(solution.estimated_cost)}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Clock className="h-4 w-4 text-warning" />
                        <span className="text-xs font-medium text-foreground">
                          Thời gian
                        </span>
                      </div>
                      <p className="text-sm text-default-600">
                        {solution.execution_time}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-sm text-default-600 line-clamp-3">
                      {solution.description}
                    </p>
                  </div>

                  {/* User Info */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        Người đề xuất
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Avatar
                        size="sm"
                        name={
                          typeof solution.user === "string"
                            ? solution.user
                            : solution.user?.full_name || solution.user?.email
                        }
                        className="text-tiny"
                      />
                      <span className="text-sm text-default-600">
                        {typeof solution.user === "string"
                          ? solution.user
                          : solution.user?.full_name || solution.user?.email}
                      </span>
                    </div>
                  </div>

                  {/* Document */}
                  {solution.document && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          Tài liệu đính kèm
                        </span>
                      </div>
                      <div
                        className="flex items-center space-x-3 p-3 border border-default-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 cursor-pointer group"
                        onClick={() => {
                          const documentUrl = getDocumentUrl(solution.document);
                          if (documentUrl) {
                            window.open(documentUrl, "_blank");
                          }
                        }}
                      >
                        <FileText className="h-6 w-6 text-primary group-hover:text-primary-600 transition-colors" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground group-hover:text-primary-700 truncate">
                            {typeof solution.document === "object" &&
                            solution.document.filename
                              ? solution.document.filename
                              : "Tài liệu đính kèm"}
                          </p>
                          <p className="text-xs text-default-500 group-hover:text-primary-600">
                            Click để xem
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Divider className="my-4" />

                  {/* Actions */}
                  <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-2 text-xs text-default-500">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {solution.createdAt
                          ? new Date(solution.createdAt).toLocaleDateString(
                              "vi-VN"
                            )
                          : "Không xác định"}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DemandSolutionsPage;
