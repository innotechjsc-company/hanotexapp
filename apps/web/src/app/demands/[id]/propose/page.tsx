"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/store/auth";
import {
  ArrowLeft,
  Send,
  Upload,
  CheckCircle,
  AlertCircle,
  Target,
  Clock,
  DollarSign,
  FileText,
  Users,
  Calendar,
} from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
  Select,
  SelectItem,
  Textarea,
  Chip,
  Spinner,
  Divider,
} from "@heroui/react";

interface Demand {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: string;
  deadline: string;
  requirements: string[];
  contact_info: {
    name: string;
    email: string;
    phone: string;
  };
}

interface Technology {
  id: string;
  title: string;
}

interface Proposal {
  title: string;
  technology_id: string;
  technology_title: string;
  match_score: number;
  solution_description: string;
  implementation_timeline: string;
  estimated_cost: string;
  cooperation_terms: string;
  additional_documents: File[];
}

function ProposeSolutionPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [demand, setDemand] = useState<Demand | null>(null);
  const [proposal, setProposal] = useState<Proposal>({
    title: "",
    technology_id: "",
    technology_title: "",
    match_score: 5,
    solution_description: "",
    implementation_timeline: "",
    estimated_cost: "",
    cooperation_terms: "",
    additional_documents: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userTechnologies, setUserTechnologies] = useState<Technology[]>([]);

  // Load demand details
  useEffect(() => {
    // TODO: Fetch demand details from API
    setDemand({
      id: params.id as string,
      title: "Tìm kiếm công nghệ xử lý rác thải sinh học",
      description:
        "Cần công nghệ xử lý rác thải sinh học hiệu quả, thân thiện môi trường, có thể triển khai quy mô công nghiệp.",
      category: "Công nghệ môi trường",
      budget: "500,000,000 VND",
      deadline: "2024-03-15",
      requirements: [
        "Hiệu suất xử lý > 90%",
        "Chi phí vận hành thấp",
        "Thời gian triển khai < 6 tháng",
        "Có chứng nhận môi trường",
      ],
      contact_info: {
        name: "Nguyễn Văn A",
        email: "nguyenvana@company.com",
        phone: "0123456789",
      },
    });

    // TODO: Fetch user's technologies
    setUserTechnologies([
      { id: "1", title: "Hệ thống xử lý rác thải sinh học tiên tiến" },
      { id: "2", title: "Công nghệ phân hủy rác thải hữu cơ" },
    ]);
  }, [params.id]);

  const handleSubmitProposal = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Submit proposal to API
      console.log("Submitting proposal:", proposal);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Success - redirect to success page
      router.push(`/demands/${params.id}/propose/success`);
    } catch (error) {
      console.error("Error submitting proposal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setProposal((prev) => ({
      ...prev,
      additional_documents: [...prev.additional_documents, ...files],
    }));
  };

  if (!demand) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Card className="rounded-none shadow-sm border-b">
        <CardBody className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              isIconOnly
              variant="bordered"
              onPress={() => router.back()}
              className="bg-white border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Đề xuất giải pháp
              </h1>
              <p className="text-default-600">
                Gửi đề xuất công nghệ cho nhu cầu này
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Demand Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader className="pb-3">
                <h2 className="text-lg font-semibold text-foreground">
                  Thông tin nhu cầu
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground">
                    {demand.title}
                  </h3>
                  <p className="text-sm text-default-600 mt-1">
                    {demand.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-default-600">{demand.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-success" />
                    <span className="text-default-600">{demand.budget}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-warning" />
                    <span className="text-default-600">{demand.deadline}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    Yêu cầu kỹ thuật:
                  </h4>
                  <ul className="text-sm text-default-600 space-y-1">
                    {demand.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Divider />

                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    Thông tin liên hệ:
                  </h4>
                  <div className="text-sm text-default-600 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{demand.contact_info.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>{demand.contact_info.email}</span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Proposal Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Đề xuất của bạn
                  </h2>
                  <p className="text-default-600 mt-1">
                    Điền thông tin chi tiết về giải pháp công nghệ
                  </p>
                </div>
              </CardHeader>

              <CardBody className="space-y-6">
                {/* Proposal Title */}
                <Input
                  label="Tiêu đề đề xuất *"
                  placeholder="Nhập tiêu đề ngắn gọn cho đề xuất của bạn"
                  value={proposal.title}
                  onChange={(e) =>
                    setProposal((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full"
                  description="Tiêu đề sẽ giúp dễ dàng nhận diện đề xuất của bạn"
                />

                {/* Technology Selection */}
                <Select
                  label="Chọn công nghệ đề xuất *"
                  placeholder="Chọn công nghệ"
                  selectedKeys={
                    proposal.technology_id ? [proposal.technology_id] : []
                  }
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    const selectedTech = userTechnologies.find(
                      (t) => t.id === selectedKey
                    );
                    setProposal((prev) => ({
                      ...prev,
                      technology_id: selectedKey || "",
                      technology_title: selectedTech?.title || "",
                    }));
                  }}
                  variant="bordered"
                  isRequired
                  classNames={{
                    label: "text-sm font-medium text-foreground",
                  }}
                >
                  {userTechnologies.map((tech) => (
                    <SelectItem key={tech.id}>{tech.title}</SelectItem>
                  ))}
                </Select>

                {/* Match Score */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mức độ phù hợp (1-10) *
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={proposal.match_score}
                      onChange={(e) =>
                        setProposal((prev) => ({
                          ...prev,
                          match_score: parseInt(e.target.value),
                        }))
                      }
                      className="flex-1 h-2 bg-default-200 rounded-lg appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
                        [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                        [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
                    />
                    <Chip
                      color="primary"
                      variant="flat"
                      className="w-12 justify-center"
                    >
                      {proposal.match_score}
                    </Chip>
                  </div>
                  <div className="flex justify-between text-xs text-default-500 mt-1">
                    <span>Không phù hợp</span>
                    <span>Rất phù hợp</span>
                  </div>
                </div>

                {/* Solution Description */}
                <Textarea
                  label="Mô tả giải pháp cụ thể *"
                  placeholder="Mô tả chi tiết về cách công nghệ của bạn đáp ứng nhu cầu này..."
                  value={proposal.solution_description}
                  onValueChange={(value) =>
                    setProposal((prev) => ({
                      ...prev,
                      solution_description: value,
                    }))
                  }
                  minRows={4}
                  variant="bordered"
                  isRequired
                  classNames={{
                    label: "text-sm font-medium text-foreground",
                  }}
                />

                {/* Implementation Timeline */}
                <Input
                  label="Thời gian triển khai *"
                  placeholder="Ví dụ: 3-6 tháng, 6-12 tháng..."
                  value={proposal.implementation_timeline}
                  onValueChange={(value) =>
                    setProposal((prev) => ({
                      ...prev,
                      implementation_timeline: value,
                    }))
                  }
                  variant="bordered"
                  isRequired
                  classNames={{
                    label: "text-sm font-medium text-foreground",
                  }}
                />

                {/* Estimated Cost */}
                <Input
                  label="Chi phí ước tính *"
                  placeholder="Ví dụ: 300,000,000 - 500,000,000 VND"
                  value={proposal.estimated_cost}
                  onValueChange={(value) =>
                    setProposal((prev) => ({
                      ...prev,
                      estimated_cost: value,
                    }))
                  }
                  variant="bordered"
                  isRequired
                  classNames={{
                    label: "text-sm font-medium text-foreground",
                  }}
                />

                {/* Cooperation Terms */}
                <Textarea
                  label="Điều kiện hợp tác"
                  placeholder="Điều kiện hợp tác, phương thức thanh toán, bảo hành..."
                  value={proposal.cooperation_terms}
                  onValueChange={(value) =>
                    setProposal((prev) => ({
                      ...prev,
                      cooperation_terms: value,
                    }))
                  }
                  minRows={3}
                  variant="bordered"
                  classNames={{
                    label: "text-sm font-medium text-foreground",
                  }}
                />

                {/* Additional Documents */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tài liệu bổ sung
                  </label>
                  <Card className="border-2 border-dashed border-default-300 bg-default-50">
                    <CardBody className="p-6 text-center">
                      <Upload className="h-12 w-12 text-default-400 mx-auto mb-4" />
                      <div className="text-sm text-default-600 mb-4">
                        Kéo thả tài liệu vào đây hoặc click để chọn
                      </div>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        className="hidden"
                        id="file-upload"
                      />
                      <Button
                        as="label"
                        htmlFor="file-upload"
                        variant="solid"
                        size="lg"
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-600 hover:border-blue-700 transform hover:scale-105"
                      >
                        <Upload className="h-5 w-5 mr-2" />
                        Chọn tài liệu
                      </Button>
                    </CardBody>
                  </Card>

                  {proposal.additional_documents.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {proposal.additional_documents.map((file, index) => (
                        <Card key={index} className="bg-default-50">
                          <CardBody className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <span className="text-sm text-foreground">
                                  {file.name}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                variant="solid"
                                className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-2 border-red-500 hover:border-red-600"
                                onPress={() => {
                                  setProposal((prev) => ({
                                    ...prev,
                                    additional_documents:
                                      prev.additional_documents.filter(
                                        (_, i) => i !== index
                                      ),
                                  }));
                                }}
                              >
                                Xóa
                              </Button>
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Divider className="my-6" />
                <div className="flex justify-end space-x-4">
                  <Button
                    variant="bordered"
                    size="lg"
                    onPress={() => router.back()}
                    className="bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 hover:bg-gray-50 font-medium px-8 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="solid"
                    size="lg"
                    onPress={handleSubmitProposal}
                    isDisabled={
                      isSubmitting ||
                      !proposal.title ||
                      !proposal.technology_id ||
                      !proposal.solution_description
                    }
                    isLoading={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-3 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-green-600 hover:border-green-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600 transform hover:scale-105"
                    startContent={
                      !isSubmitting ? <Send className="h-5 w-5" /> : undefined
                    }
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi đề xuất"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProposeSolutionPage;
