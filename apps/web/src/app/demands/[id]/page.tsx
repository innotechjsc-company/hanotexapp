"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/store/auth";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  Download,
  Send,
  Share2,
  Bookmark,
  Eye,
  Clock,
  Target,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Spinner,
  Divider,
  Link,
  Badge,
  Tooltip,
} from "@heroui/react";
import { getDemandById } from "@/api/demands";
import { Demand } from "@/types/demand";
import { PAYLOAD_API_BASE_URL } from "@/api/config";
import DemandContactCard from "@/components/demands/DemandContactCard";
import { getProposes } from "@/api/propose";

export default function DemandDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, user } = useAuth();
  const [demand, setDemand] = useState<Demand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasUserProposed, setHasUserProposed] = useState(false);
  const [checkingProposal, setCheckingProposal] = useState(false);
  const [activeTab, setActiveTab] = useState("features");

  const demandId = params.id as string;

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  // Helper function to get document URL
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

  // Check if user has already proposed for this demand
  const checkUserProposal = async () => {
    if (!isAuthenticated || !user?.id || !demandId) {
      setHasUserProposed(false);
      return;
    }

    try {
      setCheckingProposal(true);
      const response = await getProposes(
        {
          demand: demandId,
          user: user.id,
        },
        { limit: 1 }
      );

      setHasUserProposed((response.totalDocs || 0) > 0);
    } catch (err) {
      console.error("Error checking user proposal:", err);
      setHasUserProposed(false);
    } finally {
      setCheckingProposal(false);
    }
  };

  // Fetch demand details
  const fetchDemandDetail = async () => {
    if (!demandId) {
      setError("ID nhu cầu không hợp lệ");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const demandData = await getDemandById(demandId);
      console.log("Demand detail response:", demandData);

      if (!demandData || !demandData.id) {
        throw new Error("Nhu cầu không tồn tại");
      }

      setDemand(demandData);
    } catch (err: any) {
      console.error("Error fetching demand detail:", err);
      setError(err.message || "Có lỗi xảy ra khi tải thông tin nhu cầu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandDetail();
  }, [demandId]);

  useEffect(() => {
    if (demand && isAuthenticated && user?.id) {
      checkUserProposal();
    }
  }, [demand, isAuthenticated, user?.id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: demand?.title || "Nhu cầu công nghệ",
          text: demand?.description || "",
          url: typeof window !== "undefined" ? window.location.href : "",
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback - copy to clipboard
      if (typeof window !== "undefined") {
        navigator.clipboard.writeText(window.location.href);
      }
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would typically save to user's bookmarks via API
  };

  const handlePropose = () => {
    if (isAuthenticated) {
      router.push(`/demands/${demandId}/propose`);
    } else {
      router.push(`/auth/login?redirect=/demands/${demandId}/propose`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTrlDescription = (level: number) => {
    const descriptions: Record<number, string> = {
      1: "Nguyên lý cơ bản được quan sát và báo cáo",
      2: "Khái niệm và/hoặc ứng dụng công nghệ được xây dựng",
      3: "Bằng chứng thực nghiệm về chức năng quan trọng và/hoặc đặc tính",
      4: "Xác nhận thành phần và/hoặc breadboard trong môi trường phòng thí nghiệm",
      5: "Xác nhận thành phần và/hoặc breadboard trong môi trường có liên quan",
      6: "Mô hình hoặc nguyên mẫu hệ thống/hệ thống con được chứng minh trong môi trường có liên quan",
      7: "Nguyên mẫu hệ thống được chứng minh trong môi trường hoạt động",
      8: "Hệ thống hoàn chỉnh và đủ điều kiện thông qua thử nghiệm và chứng minh",
      9: "Hệ thống thực tế được chứng minh thông qua hoạt động thành công",
    };
    return descriptions[level] || "Không xác định";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Spinner size="lg" color="primary" />
            <p className="text-default-600 mt-4">
              Đang tải thông tin nhu cầu...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-8">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <Card className="text-center py-12 shadow-none border-none bg-transparent">
            <CardBody className="flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 bg-danger-100 rounded-full flex items-center justify-center mb-2">
                <FileText className="h-10 w-10 text-danger-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Có lỗi xảy ra
              </h3>
              <p className="text-default-600 text-center max-w-sm">{error}</p>
              <div className="flex gap-3 justify-center pt-2">
                <Button
                  color="primary"
                  size="lg"
                  onPress={() => {
                    setError("");
                    fetchDemandDetail();
                  }}
                  className="min-w-[120px] shadow-none"
                  style={{
                    backgroundColor: "#006FEE",
                    color: "#ffffff",
                    fontWeight: "500",
                  }}
                >
                  Thử lại
                </Button>
                <Button
                  variant="bordered"
                  size="lg"
                  onPress={() => router.back()}
                  className="min-w-[120px] shadow-none"
                  style={{
                    borderColor: "#E4E4E7",
                    color: "#71717A",
                    fontWeight: "500",
                  }}
                >
                  Quay lại
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  if (!demand) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-8">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <Card className="text-center py-12 shadow-none border-none bg-transparent">
            <CardBody className="flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 bg-default-100 rounded-full flex items-center justify-center mb-2">
                <FileText className="h-10 w-10 text-default-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Không tìm thấy nhu cầu
              </h3>
              <p className="text-default-600 text-center max-w-sm">
                Nhu cầu bạn đang tìm không tồn tại hoặc đã bị xóa
              </p>
              <div className="pt-2">
                <Button
                  color="primary"
                  size="lg"
                  onPress={() => router.push("/demands")}
                  className="min-w-[200px] shadow-none"
                  style={{
                    backgroundColor: "#006FEE",
                    color: "#ffffff",
                    fontWeight: "500",
                  }}
                >
                  Về danh sách nhu cầu
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  // Determine if the current user is the creator of the demand
  const isOwner = (() => {
    if (!isAuthenticated || !user || !demand) return false;
    const demandUserId =
      typeof demand.user === "object"
        ? (demand.user?.id as string | undefined)
        : (demand.user as string | undefined);
    return Boolean(demandUserId && user.id && demandUserId === user.id);
  })();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with breadcrumb and actions */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              isIconOnly
              variant="bordered"
              onPress={() => router.back()}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center text-sm text-default-500">
              <Link href="/demands" className="hover:text-primary">
                Nhu cầu công nghệ
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-foreground font-medium">Chi tiết</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Basic Info */}
            <Card className="shadow-sm">
              <CardBody className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Chip size="sm" color="primary" variant="flat">
                      {typeof demand.category === "object" &&
                      demand.category?.name
                        ? demand.category.name
                        : typeof demand.category === "string"
                          ? demand.category
                          : "Chưa phân loại"}
                    </Chip>
                    <Chip size="sm" color="success" variant="flat">
                      TRL {demand.trl_level}
                    </Chip>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-foreground mb-4">
                  {demand.title}
                </h1>

                <div className="flex items-center space-x-6 text-sm text-default-500 mb-6">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      Đăng ngày{" "}
                      {demand.createdAt
                        ? formatDate(demand.createdAt)
                        : "Không xác định"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>
                      Cập nhật{" "}
                      {demand.updatedAt
                        ? formatDate(demand.updatedAt)
                        : "Không xác định"}
                    </span>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Mô tả chi tiết
                  </h3>
                  <p className="text-default-700 leading-relaxed whitespace-pre-wrap">
                    {demand.description}
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Technical Details & Documents */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <h3 className="text-xl font-semibold text-foreground flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary" />
                  Yêu cầu cần đáp ứng
                </h3>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">
                      Mức độ sẵn sàng công nghệ (TRL)
                    </h4>
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge
                        content={demand.trl_level}
                        color="success"
                        size="lg"
                        className="text-white font-bold"
                      >
                        <div className="w-8 h-8 bg-success-100 rounded-full"></div>
                      </Badge>
                      <span className="font-medium">
                        Cấp độ {demand.trl_level}
                      </span>
                    </div>
                    <p className="text-sm text-default-600">
                      {getTrlDescription(demand.trl_level)}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">
                      Hình thức hợp tác
                    </h4>
                    <Chip
                      color="primary"
                      variant="bordered"
                      className="text-sm"
                    >
                      {demand.cooperation || "Chưa xác định"}
                    </Chip>
                  </div>
                </div>

                <Divider className="my-6" />
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Budget Information */}
            <Card className="shadow-sm">
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-success" />
                  Ngân sách
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-default-500 mb-1">Khoảng giá</p>
                    <p className="text-2xl font-bold text-success">
                      {demand.from_price && demand.to_price
                        ? `${formatPrice(demand.from_price)} - ${formatPrice(demand.to_price)}`
                        : "Thỏa thuận"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-default-500 mb-1">
                      Yêu cầu về thời gian
                    </p>
                    {demand.start_date || demand.end_date ? (
                      <p className="text-base font-medium text-foreground">
                        {demand.start_date
                          ? formatDate(demand.start_date)
                          : "N/A"}{" "}
                        -{" "}
                        {demand.end_date ? formatDate(demand.end_date) : "N/A"}
                      </p>
                    ) : (
                      <p className="text-base font-medium text-foreground">
                        Không có yêu cầu cụ thể
                      </p>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Contact Information with Chat */}
            <DemandContactCard
              demandUser={typeof demand.user === "object" ? demand.user : null}
              demandTitle={demand.title}
            />
            <div>
              <h4 className="font-medium text-foreground mb-2">
                Tài liệu đính kèm
              </h4>
              {demand.documents && demand.documents.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {demand.documents.map((doc, index) => {
                    const documentUrl = getDocumentUrl(doc);
                    const documentName =
                      typeof doc === "object" && doc.filename
                        ? doc.filename
                        : `Tài liệu ${index + 1}`;

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border border-default-200 rounded-lg hover:border-primary-200 hover:bg-primary-50 transition-all duration-200 group"
                      >
                        <div
                          className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
                          onClick={() => {
                            if (documentUrl) {
                              window.open(documentUrl, "_blank");
                            }
                          }}
                        >
                          <div className="flex-shrink-0">
                            <FileText className="h-6 w-6 text-primary group-hover:text-primary-600 transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground group-hover:text-primary-700 truncate transition-colors">
                              {documentName}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (documentUrl) {
                              handleDownload(documentUrl, documentName);
                            }
                          }}
                          className="flex-shrink-0 p-2 rounded-md hover:bg-gray-200 transition-colors opacity-50 group-hover:opacity-100"
                          aria-label={`Tải xuống ${documentName}`}
                        >
                          <Download className="h-4 w-4 text-primary-500" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-default-600">Không có tài liệu.</p>
              )}
            </div>
            {/* Action Buttons */}
            <div className="space-y-3">
              {!isAuthenticated ? (
                <Button
                  color="primary"
                  size="lg"
                  className="w-full"
                  onPress={() =>
                    router.push(
                      `/auth/login?redirect=/demands/${demandId}/propose`
                    )
                  }
                  endContent={<Send className="h-5 w-5" />}
                  style={{
                    backgroundColor: "#006FEE",
                    color: "#ffffff",
                    minHeight: "48px",
                    fontWeight: "600",
                    fontSize: "16px",
                  }}
                >
                  Đăng nhập để đề xuất
                </Button>
              ) : !isOwner ? (
                checkingProposal ? (
                  <div className="w-full flex items-center justify-center py-3">
                    <Spinner size="sm" color="primary" />
                    <span className="ml-2 text-sm text-default-600">
                      Đang kiểm tra...
                    </span>
                  </div>
                ) : hasUserProposed ? (
                  <div className="w-full p-4 bg-success-50 border border-success-200 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                        <Send className="h-4 w-4 text-success-600" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-success-700">
                      Bạn đã gửi đề xuất
                    </p>
                    <p className="text-xs text-success-600 mt-1">
                      Đề xuất của bạn đang được xem xét
                    </p>
                  </div>
                ) : (
                  <Button
                    color="primary"
                    size="lg"
                    className="w-full"
                    onPress={handlePropose}
                    endContent={<Send className="h-5 w-5" />}
                    style={{
                      backgroundColor: "#006FEE",
                      color: "#ffffff",
                      minHeight: "48px",
                      fontWeight: "600",
                      fontSize: "16px",
                    }}
                  >
                    Đề xuất giải pháp
                  </Button>
                )
              ) : null}

              <Button
                variant="bordered"
                size="lg"
                className="w-full"
                onPress={() => router.push("/demands")}
                style={{
                  minHeight: "48px",
                  fontWeight: "500",
                }}
              >
                Xem nhu cầu khác
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="border-b border-gray-200">
            <div className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("features")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "features"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Tính năng/chức năng
              </button>
              <button
                onClick={() => setActiveTab("tech")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "tech"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Kỹ thuật/công nghệ
              </button>
              <button
                onClick={() => setActiveTab("standards")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "standards"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Quy chuẩn/Tiêu chuẩn
              </button>
            </div>
          </div>
          <div className="py-6">
            {activeTab === "features" && (
              <p className="text-sm text-default-600">
                {demand.option || "Không có"}
              </p>
            )}
            {activeTab === "tech" && (
              <p className="text-sm text-default-600">
                {demand.option_technology || "Không có yêu cầu cụ thể"}
              </p>
            )}
            {activeTab === "standards" && (
              <p className="text-sm text-default-600">
                {demand.option_rule || "Theo quy định chung"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
