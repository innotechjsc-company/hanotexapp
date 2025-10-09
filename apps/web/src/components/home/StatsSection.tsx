"use client";

import { useEffect, useMemo, useState } from "react";
import {
  TrendingUp,
  Users,
  Award,
  Zap,
  Building,
  Globe,
  Crosshair,
  CheckCircle,
} from "lucide-react";
import { getTechnologies } from "@/api/technologies";
import { getCompanies } from "@/api/company";
import { getAuctions } from "@/api/auctions";

const achievements = [
  {
    icon: CheckCircle,
    title: "Giải thưởng Công nghệ",
    description:
      "Được vinh danh là sàn giao dịch công nghệ tốt nhất Việt Nam 2024",
    year: "2024",
  },
  {
    icon: CheckCircle,
    title: "Chứng nhận ISO 27001",
    description: "Đảm bảo an toàn thông tin và bảo mật dữ liệu",
    year: "2023",
  },
  {
    icon: CheckCircle,
    title: "Đối tác chiến lược",
    description: "Hợp tác với 50+ viện nghiên cứu và trường đại học",
    year: "2023",
  },
];

export default function StatsSection() {
  const [counts, setCounts] = useState({
    technologies: 0,
    users: 0, // Chưa có endpoint thống kê user -> để 0 hoặc tính sau
    transactions: 0, // Placeholder
    companies: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [techRes, compRes, auctionRes] = await Promise.all([
          getTechnologies({}, { limit: 1 }),
          getCompanies({}, { limit: 1 }),
          getAuctions({}, { limit: 1 }),
        ]);

        const getTotal = (res: any) =>
          (res?.totalDocs as number) ??
          (res?.total as number) ??
          (Array.isArray(res?.data)
            ? res.data.length
            : Array.isArray(res?.docs)
              ? res.docs.length
              : 0);

        setCounts({
          technologies: getTotal(techRes),
          users: 0, // TODO: hook to users when backend ready
          transactions: getTotal(auctionRes), // tạm dùng số phiên đấu giá
          companies: getTotal(compRes),
        });
      } catch (e) {
        // silent fail, keep defaults
        console.error("Error fetching stats:", e);
      }
    };

    fetchCounts();
  }, []);

  const stats = useMemo(
    () => [
      {
        icon: TrendingUp,
        label: "Công nghệ đã đăng tải",
        value: "976+",
        description:
          "Nhiều công nghệ mới, đa ngành nghề đã sẵn sàng chuyển giao",
        color: "text-primary-600",
        bgColor: "bg-primary-100",
      },
      {
        icon: Users,
        label: "Hàng nghìn người dùng đăng ký",
        value: "1056+ ",
        description:
          "Gồm các doanh nghiệp, tổ chức nghiên cứu, viện trường và chuyên gia",
        color: "text-secondary-600",
        bgColor: "bg-secondary-100",
      },
      {
        icon: Award,
        label: "Phiên giao dịch, đấu giá công nghệ",
        value: "120+",
        description:
          "Các giao dịch minh bạch, công khai, bảo đảm quyền lợi các bên tham gia",
        color: "text-accent-600",
        bgColor: "bg-accent-100",
      },
      {
        icon: Building,
        label: "Doanh nghiệp trong và ngoài nước tham gia",
        value: "100+",
        description: "Hình thành mạng lưới hợp tác công nghệ rộng mở",
        color: "text-purple-600",
        bgColor: "bg-purple-100",
      },
      {
        icon: Globe,
        label: "Quốc gia kết nối",
        value: "15+",
        description:
          "Tăng cường hội nhập và hợp tác quốc tế trong lĩnh vực KH&CN",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      {
        icon: Crosshair,
        label: "Tỷ lệ chuyển giao thành công",
        value: "85%",
        description:
          "Khẳng định hiệu quả của cơ chế thẩm định – môi giới – hỗ trợ pháp lý trên HANOTEX",
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
    ],
    [counts]
  );
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Giải thưởng & Ghi nhận
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Những con số phản ánh kết quả bước đầu trong quá trình xây dựng và
            vận hành Sàn giao dịch công nghệ Hà Nội – HANOTEX, khẳng định vai
            trò kết nối và thúc đẩy thị trường công nghệ
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${stat.bgColor} ${stat.color} mb-4`}
              >
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-gray-700 mb-2 leading-snug">
                {stat.label}
              </div>
              <div className="text-sm text-gray-500">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Giải thưởng & Ghi nhận
            </h3>
            <p className="text-lg text-gray-600">
              HANOTEX được các tổ chức trong nước và quốc tế ghi nhận với nhiều
              giải thưởng và chứng nhận uy tín, góp phần củng cố vị thế trung
              tâm chuyển giao công nghệ của Thủ đô.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <div key={achievement.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-4">
                  <achievement.icon className="h-6 w-6" />
                </div>
                <div className="text-sm font-semibold text-green-600 mb-2">
                  {achievement.year}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {achievement.title}
                </h4>
                <p className="text-gray-600">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        {/* <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Tham gia cùng chúng tôi
            </h3>
            <p className="text-lg text-primary-100 mb-6 max-w-2xl mx-auto">
              Trở thành một phần của cộng đồng công nghệ lớn nhất Việt Nam và khám phá những cơ hội mới
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-primary-600 hover:bg-gray-100 focus:ring-white"
              >
                Đăng ký ngay
              </a>
              <a
                href="/technologies"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-white text-white hover:bg-white hover:text-primary-600 focus:ring-white"
              >
                Khám phá công nghệ
              </a>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
