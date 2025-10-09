"use client";

import { Building2, Target, Users, Lightbulb } from "lucide-react";
import AnimatedIcon from "@/components/ui/AnimatedIcon";
import Link from "next/link";

export default function IntroSection() {
  const features = [
    {
      icon: Building2,
      title: "HANOTEX là gì?",
      description:
        "HANOTEX là sàn giao dịch công nghệ Hà Nội do Ủy ban nhân dân thành phố Hà Nội chỉ đạo phát triển, được Sở Khoa học và Công nghệ Hà Nội chủ trì triển khai, nhằm kết nối toàn diện giữa công nghệ – nhu cầu – tài chính – chuyên gia – chính sách, góp phần thúc đẩy thương mại hóa kết quả nghiên cứu và đổi mới sáng tạo, phát triển thị trường khoa học và công nghệ của Thủ đô theo mô hình minh bạch, hiện đại, hội nhập quốc tế.",
    },
    {
      icon: Target,
      title: "Mục tiêu",
      description:
        "Tăng cường kết nối đa chiều giữa doanh nghiệp – viện trường – chuyên gia – nhà đầu tư, từng bước hình thành hệ sinh thái đổi mới sáng tạo đồng bộ và phát triển bền vững tại Hà Nội.",
    },
    {
      icon: Users,
      title: "Đối tượng phục vụ",
      description:
        "Doanh nghiệp và tổ chức sản xuất, kinh doanh, Viện nghiên cứu, trường đại học, tổ chức khoa học và công nghệ,Chuyên gia, nhà sáng chế, nhà khoa học, Nhà đầu tư và các tổ chức hỗ trợ đổi mới sáng tạo",
    },
    {
      icon: Lightbulb,
      title: "Lợi ích mang lại",
      description:
        "Tiếp cận công nghệ chất lượng cao, sẵn sàng chuyển giao, Mở rộng kết nối chuyên gia, viện trường, đối tác tiềm năng, Khai phá cơ hội hợp tác đầu tư, phát triển sản phẩm, Thụ hưởng chính sách hỗ trợ từ Thành phố Hà Nội",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Về HANOTEX
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nền tảng chuyển giao công nghệ – kết nối toàn diện hệ sinh thái đổi
            mới sáng tạo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {features.map((feature, index) => (
            <div
              key={index}
              className="h-72 md:h-80 text-center p-6 rounded-xl bg-blue-50 hover:bg-blue-100 hover:scale-105 transition-all duration-300 group"
            >
              <div className="flex flex-col h-full">
                <div className="inline-flex self-center items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4 group-hover:shadow-lg transition-shadow duration-300">
                  <AnimatedIcon
                    animation="bounce"
                    delay={index * 200}
                    size="lg"
                  >
                    <feature.icon className="h-8 w-8" />
                  </AnimatedIcon>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 overflow-hidden text-ellipsis whitespace-nowrap">
                  {feature.title}
                </h3>
                <p
                  className="text-gray-600 leading-relaxed"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {feature.description}
                </p>
                <div className="mt-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Tham gia ngay để kết nối và phát triển
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Hãy trở thành một phần của hệ sinh thái khoa học công nghệ Hà Nội.
              Đăng ký tài khoản miễn phí và bắt đầu hành trình đổi mới sáng tạo
              của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
              >
                Đăng ký miễn phí
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border border-blue-600 bg-white text-blue-600 hover:bg-blue-50 focus:ring-blue-500"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
