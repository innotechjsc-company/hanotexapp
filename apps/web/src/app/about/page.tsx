"use client";

import { Building2, Award, MapPin, Phone, Mail, Globe } from "lucide-react";
import { Card, CardBody, Chip, Avatar } from "@heroui/react";

export default function AboutPage() {
  const values = [
    {
      title: "Đổi mới sáng tạo",
      description:
        "Thúc đẩy và hỗ trợ các ý tưởng sáng tạo, công nghệ tiên tiến",
    },
    {
      title: "Minh bạch công khai",
      description:
        "Hoạt động minh bạch, công khai trong mọi giao dịch và dịch vụ",
    },
    {
      title: "Chất lượng cao",
      description: "Cam kết cung cấp dịch vụ chất lượng cao, chuyên nghiệp",
    },
    {
      title: "Phát triển bền vững",
      description: "Hướng đến phát triển bền vững cho cộng đồng và môi trường",
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
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
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
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardBody className="p-6">
                  <Avatar
                    icon={<Award className="h-8 w-8" />}
                    className="w-16 h-16 mx-auto mb-4 bg-primary-100 text-primary-600"
                  />
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

      {/* Milestones Section */}
      <section className="py-20 bg-default-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Lịch sử phát triển
            </h2>
            <p className="text-xl text-default-600 max-w-3xl mx-auto">
              Những dấu mốc quan trọng trong quá trình phát triển của HANOTEX
            </p>
          </div>

          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardBody className="p-6">
                  <div className="flex items-start space-x-6">
                    <Chip
                      color="primary"
                      variant="solid"
                      size="lg"
                      className="font-bold text-lg min-w-[80px] text-center"
                    >
                      {milestone.year}
                    </Chip>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-default-600">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-content1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Liên hệ với chúng tôi
            </h2>
            <p className="text-xl text-default-600 max-w-3xl mx-auto">
              Sẵn sàng hỗ trợ và tư vấn cho các nhu cầu của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardBody className="p-6">
                <Avatar
                  icon={<MapPin className="h-8 w-8" />}
                  className="w-16 h-16 mx-auto mb-4 bg-primary-100 text-primary-600"
                />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Địa chỉ
                </h3>
                <p className="text-default-600 text-sm">
                  Sở KH&CN Hà Nội
                  <br />
                  15 Lê Thánh Tông
                  <br />
                  Hoàn Kiếm, Hà Nội
                </p>
              </CardBody>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardBody className="p-6">
                <Avatar
                  icon={<Phone className="h-8 w-8" />}
                  className="w-16 h-16 mx-auto mb-4 bg-success-100 text-success-600"
                />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Điện thoại
                </h3>
                <p className="text-default-600">024 3825 1234</p>
              </CardBody>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardBody className="p-6">
                <Avatar
                  icon={<Mail className="h-8 w-8" />}
                  className="w-16 h-16 mx-auto mb-4 bg-warning-100 text-warning-600"
                />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Email
                </h3>
                <p className="text-default-600">info@hanotex.gov.vn</p>
              </CardBody>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardBody className="p-6">
                <Avatar
                  icon={<Globe className="h-8 w-8" />}
                  className="w-16 h-16 mx-auto mb-4 bg-secondary-100 text-secondary-600"
                />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Website
                </h3>
                <p className="text-default-600">www.hanotex.gov.vn</p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
