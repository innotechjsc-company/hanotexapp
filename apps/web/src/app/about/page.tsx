"use client";

import {
  Building2,
  Award,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Target,
  Lightbulb,
  Rocket,
  CheckCircle,
  Star,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Card, CardBody, Chip, Avatar } from "@heroui/react";

export default function AboutPage() {
  const values = [
    {
      title: "Đổi mới sáng tạo",
      description:
        "Thúc đẩy và hỗ trợ các ý tưởng sáng tạo, công nghệ tiên tiến",
      icon: Lightbulb,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      title: "Minh bạch công khai",
      description:
        "Hoạt động minh bạch, công khai trong mọi giao dịch và dịch vụ",
      icon: Shield,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Chất lượng cao",
      description: "Cam kết cung cấp dịch vụ chất lượng cao, chuyên nghiệp",
      icon: Award,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Phát triển bền vững",
      description: "Hướng đến phát triển bền vững cho cộng đồng và môi trường",
      icon: Target,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  const milestones = [
    {
      year: "2024",
      title: "Thành lập HANOTEX",
      description: "Chính thức ra mắt sàn giao dịch công nghệ Hà Nội",
    },
    {
      year: "2024",
      title: "Triển khai hệ thống",
      description: "Hoàn thiện hệ thống công nghệ và đưa vào vận hành",
    },
    {
      year: "2025",
      title: "Mở rộng dịch vụ",
      description: "Mở rộng các dịch vụ hỗ trợ và kết nối",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Rocket className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">
                Sàn giao dịch công nghệ
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Về HANOTEX</h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Sàn giao dịch công nghệ trực tuyến của thành phố Hà Nội
            </p>
            <Chip
              color="primary"
              variant="flat"
              size="lg"
              className="bg-white/20 text-white"
            >
              Kết nối - Đổi mới - Phát triển
            </Chip>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Sứ mệnh của chúng tôi
              </h2>
              <p className="text-lg text-default-600 mb-6">
                HANOTEX được thành lập với sứ mệnh kết nối cung - cầu công nghệ,
                thúc đẩy đổi mới sáng tạo và thương mại hóa kết quả nghiên cứu
                khoa học công nghệ tại Hà Nội và cả nước.
              </p>
              <p className="text-lg text-default-600 mb-6">
                Chúng tôi cam kết tạo ra một môi trường minh bạch, công khai và
                hiệu quả để các nhà nghiên cứu, doanh nghiệp và nhà đầu tư có
                thể gặp gỡ, hợp tác và phát triển.
              </p>
            </div>
            <Card className="shadow-lg">
              <CardBody className="text-center p-8">
                <Avatar
                  icon={<Building2 className="h-12 w-12" />}
                  className="w-24 h-24 mx-auto mb-6 bg-primary-100 text-primary-600"
                />
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  Tầm nhìn
                </h3>
                <p className="text-default-600">
                  Trở thành sàn giao dịch công nghệ hàng đầu Việt Nam, góp phần
                  đưa Việt Nam trở thành quốc gia đổi mới sáng tạo trong khu vực
                  và thế giới.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-content1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary-50 text-primary-600 rounded-full px-4 py-2 mb-4">
              <Star className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Giá trị cốt lõi</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-xl text-default-600 max-w-3xl mx-auto">
              Những giá trị định hướng hoạt động và phát triển của HANOTEX
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="group text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <div
                  className={`h-24 bg-gradient-to-r ${value.color} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-4 right-4">
                    <div
                      className={`w-12 h-12 ${value.bgColor} rounded-xl flex items-center justify-center`}
                    >
                      <value.icon className={`h-6 w-6 ${value.iconColor}`} />
                    </div>
                  </div>
                </div>
                <CardBody className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-default-600">{value.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary-100 text-primary-600 rounded-full px-4 py-2 mb-4">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Thành tựu</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              HANOTEX trong số liệu
            </h2>
            <p className="text-xl text-default-600 max-w-3xl mx-auto">
              Những con số ấn tượng thể hiện sự phát triển và tác động của
              HANOTEX
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                500+
              </div>
              <div className="text-default-600">Thành viên đăng ký</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                150+
              </div>
              <div className="text-default-600">Dự án công nghệ</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                200+
              </div>
              <div className="text-default-600">Sáng chế đăng ký</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">95%</div>
              <div className="text-default-600">Tỷ lệ hài lòng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-20 bg-default-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary-50 text-primary-600 rounded-full px-4 py-2 mb-4">
              <Rocket className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Lịch sử phát triển</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Lịch sử phát triển
            </h2>
            <p className="text-xl text-default-600 max-w-3xl mx-auto">
              Những dấu mốc quan trọng trong quá trình phát triển của HANOTEX
            </p>
          </div>

          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardBody className="p-6">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <Chip
                        color="default"
                        variant="solid"
                        size="lg"
                        className="font-bold text-lg min-w-[80px] text-center"
                      >
                        {milestone.year}
                      </Chip>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-default-600">
                        {milestone.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Liên hệ</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Liên hệ với chúng tôi
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Sẵn sàng hỗ trợ và tư vấn cho các nhu cầu của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/10 backdrop-blur-sm border-white/20">
              <CardBody className="p-6 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Địa chỉ
                </h3>
                <p className="text-white text-sm">
                  Sở KH&CN Hà Nội
                  <br />
                  15 Lê Thánh Tông
                  <br />
                  Hoàn Kiếm, Hà Nội
                </p>
              </CardBody>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/10 backdrop-blur-sm border-white/20">
              <CardBody className="p-6 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Điện thoại
                </h3>
                <p className="text-white">0986287758</p>
              </CardBody>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/10 backdrop-blur-sm border-white/20">
              <CardBody className="p-6 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Email</h3>
                <p className="text-white">contact@hanotex.vn</p>
              </CardBody>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/10 backdrop-blur-sm border-white/20">
              <CardBody className="p-6 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Website
                </h3>
                <p className="text-white">www.hanotex.gov.vn</p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
