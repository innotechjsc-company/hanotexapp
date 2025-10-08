"use client";

import { useEffect, useState, useRef } from "react";
import {
  Building2,
  TrendingUp,
  Users,
  Globe,
  Award,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getCompanies } from "@/api/company";
import { getResearchInstitutions } from "@/api/research-institution";
import { getInvestmentFunds } from "@/api/investment-fund";
import { useRouter } from "next/navigation";
import { log } from "console";

type PartnerItem = {
  name: string;
  type: string;
  description?: string;
  url?: string;
};
type FundItem = { name: string; description?: string };

export default function PartnersSection() {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [funds, setFunds] = useState<FundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const partnersSliderRef = useRef<HTMLDivElement>(null);
  const fundsSliderRef = useRef<HTMLDivElement>(null);

  const handleScroll = (
    ref: React.RefObject<HTMLDivElement>,
    direction: "left" | "right"
  ) => {
    if (ref.current) {
      const scrollAmount = ref.current.offsetWidth;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  useEffect(() => {
    const fetchPartnersAndFunds = async () => {
      try {
        const [companiesRes, institutionsRes, fundsRes] = await Promise.all([
          getCompanies({ is_active: true }, { limit: 3 }),
          getResearchInstitutions({ is_active: true }, { limit: 3 }),
          getInvestmentFunds({}, { limit: 4 }),
        ]);

        const companies = (
          Array.isArray((companiesRes as any).data)
            ? (companiesRes as any).data
            : Array.isArray((companiesRes as any).docs)
              ? (companiesRes as any).docs
              : []
        ) as any[];
        const institutions = (
          Array.isArray((institutionsRes as any).data)
            ? (institutionsRes as any).data
            : Array.isArray((institutionsRes as any).docs)
              ? (institutionsRes as any).docs
              : []
        ) as any[];
        const fundsList = (
          Array.isArray((fundsRes as any).data)
            ? (fundsRes as any).data
            : Array.isArray((fundsRes as any).docs)
              ? (fundsRes as any).docs
              : []
        ) as any[];

        const partnerItems: PartnerItem[] = [
          ...companies.map((c: any) => ({
            name: c.company_name,
            type: "Doanh nghiệp",
            description: c.website || c.legal_representative || "",
            url: c.website,
          })),
          ...institutions.map((i: any) => ({
            name: i.institution_name,
            type: mapInstitutionType(i.institution_type),
            description: i.contact_info?.website || i.governing_body || "",
            url: i.contact_info?.website,
          })),
        ].slice(0, 6);

        setPartners(partnerItems);

        const fundItems: FundItem[] = fundsList.map((f: any) => ({
          name: f.name,
          description: f.description,
        }));
        setFunds(fundItems);
      } catch (e) {
        console.error("Error fetching partners/funds:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchPartnersAndFunds();
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Đối tác & Quỹ đầu tư
          </h2> */}
          {/* <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hệ thống đối tác uy tín và các quỹ đầu tư chuyên nghiệp hỗ trợ phát
            triển hệ sinh thái khoa học công nghệ
          </p> */}
        </div>

        {/* Partners Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Đối tác chiến lược
            </h3>
            <p className="text-gray-600 text-lg">
              Các tổ chức, doanh nghiệp và viện nghiên cứu hàng đầu
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => handleScroll(partnersSliderRef, "left")}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <div
              ref={partnersSliderRef}
              className="flex overflow-x-auto space-x-8 pb-4 snap-x snap-mandatory scrollbar-hide"
            >
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 snap-center bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 p-6 text-center cursor-pointer"
                  onClick={() => {
                    if (partner.url) {
                      window.open(partner.url, "_blank");
                    }
                  }}
                >
                  {/* Logo Placeholder */}
                  <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Building2 className="h-10 w-10 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {partner.name}
                  </h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
                    {partner.type}
                  </span>
                  <p className="text-gray-600 text-sm h-12 overflow-hidden">
                    {partner.description || ""}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleScroll(partnersSliderRef, "right")}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Investment Funds Section */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quỹ đầu tư liên kết
            </h3>
            <p className="text-gray-600 text-lg">
              Các quỹ đầu tư chuyên nghiệp hỗ trợ phát triển dự án công nghệ
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => handleScroll(fundsSliderRef, "left")}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <div
              ref={fundsSliderRef}
              className="flex overflow-x-auto space-x-8 pb-4 snap-x snap-mandatory scrollbar-hide"
            >
              {funds.map((fund, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full sm:w-1/2 snap-center bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 p-6"
                >
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {fund.name}
                      </h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Quỹ đầu tư
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 h-16 overflow-hidden">
                    {fund.description || ""}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleScroll(fundsSliderRef, "right")}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Bottom CTA */}
        {/* <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Trở thành đối tác của HANOTEX
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Tham gia mạng lưới đối tác để cùng phát triển hệ sinh thái khoa
              học công nghệ Hà Nội
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/contact")}
                className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
              >
                <Users className="mr-2 h-5 w-5" />
                Trở thành đối tác
              </button>
              {/* <button className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border border-blue-600 bg-white text-blue-600 hover:bg-blue-50 focus:ring-blue-500">
                <Globe className="mr-2 h-5 w-5" />
                Tìm hiểu thêm
              </button> */}
        {/* </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}

function mapInstitutionType(type?: string): string {
  switch (type) {
    case "UNIVERSITY":
      return "Trường đại học";
    case "RESEARCH_INSTITUTE":
      return "Viện nghiên cứu";
    case "GOVERNMENT_LAB":
      return "Phòng thí nghiệm nhà nước";
    case "PRIVATE_RND":
      return "R&D tư nhân";
    case "INTERNATIONAL_ORG":
      return "Tổ chức quốc tế";
    default:
      return "Đối tác";
  }
}
