"use client";

import { BrainCircuit, Rocket, Dna, type LucideIcon } from "lucide-react";
import Image from "next/image";

// --- DATA TYPES ---
type Project = {
  name: string;
  category: string;
  description: string;
  fundingGoal: string;
  progress: number;
  icon: LucideIcon;
  color: string;
};

// --- MOCK DATA ---
const featuredFunds = [
  {
    name: "VietTech AI Solutions",
    description:
      "Startup phát triển giải pháp AI cho ngành y tế, tập trung vào chẩn đoán hình ảnh y khoa và hỗ trợ quyết định lâm sàng.",
    image: "/images/stock/startup-team.jpg",
    tags: [
      { text: "Startup", color: "orange" },
      { text: "Đang gọi vốn", color: "green" },
    ],
    fundingGoal: "50 tỷ VND",
    raised: "32 tỷ VND",
    raisedPercent: 64,
    investors: 28,
    daysLeft: 45,
    founder: {
      name: "Nguyễn Minh Tú",
      title: "CEO & Founder",
      avatar: "/images/avatars/founder1.jpg",
    },
    buttonColor: "orange",
  },
  {
    name: "EcoEnergy Vietnam",
    description:
      "Công ty công nghệ năng lượng tái tạo, phát triển hệ thống lưu trữ năng lượng thông minh và giải pháp quản lý lưới điện.",
    image: "/images/stock/solar-panels.jpg",
    tags: [
      { text: "GreenTech", color: "green" },
      { text: "Series A", color: "blue" },
    ],
    fundingGoal: "120 tỷ VND",
    raised: "95 tỷ VND",
    raisedPercent: 79,
    investors: 42,
    daysLeft: 22,
    founder: {
      name: "Trần Thị Lan",
      title: "CTO & Co-founder",
      avatar: "/images/avatars/founder2.jpg",
    },
    buttonColor: "green",
  },
];

const otherProjects: Project[] = [
  {
    name: "NeuroTech Lab",
    category: "Công nghệ thần kinh",
    description: "Phát triển giao diện não-máy tính cho ứng dụng y tế",
    fundingGoal: "80 tỷ VND",
    progress: 67,
    icon: BrainCircuit,
    color: "purple",
  },
  {
    name: "SpaceTech VN",
    category: "Công nghệ vũ trụ",
    description: "Phát triển vệ tinh nano cho giám sát môi trường",
    fundingGoal: "150 tỷ VND",
    progress: 23,
    icon: Rocket,
    color: "blue",
  },
  {
    name: "BioGen Solutions",
    category: "Công nghệ sinh học",
    description: "Liệu pháp gene cho điều trị bệnh hiếm",
    fundingGoal: "200 tỷ VND",
    progress: 45,
    icon: Dna,
    color: "red",
  },
];

// --- HELPER COMPONENTS ---
const ProgressBar = ({ value, color }: { value: number; color: string }) => (
  <div>
    <div className="flex justify-between items-center mb-1 text-sm">
      <span className="text-gray-500">Tiến độ gọi vốn</span>
      <span
        className={`font-semibold ${color === "orange" ? "text-orange-500" : "text-green-500"}`}
      >
        {value}%
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${color === "orange" ? "bg-orange-500" : "bg-green-500"}`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

const FeaturedFundCard = ({ fund }: { fund: (typeof featuredFunds)[0] }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
    <div className="relative">
      <Image
        src={fund.image}
        alt={fund.name}
        width={600}
        height={400}
        className="w-full h-56 object-cover"
      />
      <div className="absolute top-4 left-4 flex gap-2">
        {fund.tags.map((tag) => (
          <span
            key={tag.text}
            className={`px-3 py-1 text-sm font-semibold text-white rounded-full ${tag.color === "orange" ? "bg-orange-500" : tag.color === "green" ? "bg-green-600" : "bg-blue-500"}`}
          >
            {tag.text}
          </span>
        ))}
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{fund.name}</h3>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        {fund.description}
      </p>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6 text-sm">
        <div>
          <p className="text-gray-500">Mục tiêu gọi vốn</p>
          <p className="font-bold text-gray-800 text-base">
            {fund.fundingGoal}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Đã gọi được</p>
          <p
            className={`font-bold text-base ${fund.buttonColor === "orange" ? "text-orange-500" : "text-green-500"}`}
          >
            {fund.raised} ({fund.raisedPercent}%)
          </p>
        </div>
        <div>
          <p className="text-gray-500">Số nhà đầu tư</p>
          <p className="font-bold text-gray-800 text-base">{fund.investors}</p>
        </div>
        <div>
          <p className="text-gray-500">Thời gian còn lại</p>
          <p className="font-bold text-red-500 text-base">
            {fund.daysLeft} ngày
          </p>
        </div>
      </div>

      <ProgressBar value={fund.raisedPercent} color={fund.buttonColor} />

      <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image
            src={fund.founder.avatar}
            alt={fund.founder.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-800">{fund.founder.name}</p>
            <p className="text-xs text-gray-500">{fund.founder.title}</p>
          </div>
        </div>
        <button
          className={`px-6 py-2.5 font-semibold text-white rounded-lg transition-transform hover:scale-105 ${fund.buttonColor === "orange" ? "bg-orange-500 hover:bg-orange-600" : "bg-green-600 hover:bg-green-700"}`}
        >
          Đầu tư ngay
        </button>
      </div>
    </div>
  </div>
);

const OtherProjectCard = ({ project }: { project: Project }) => {
  const colorClasses: {
    [key: string]: { bg: string; text: string; border: string };
  } = {
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      border: "border-purple-200",
    },
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      border: "border-blue-200",
    },
    red: { bg: "bg-red-100", text: "text-red-600", border: "border-red-200" },
  };
  const colors = colorClasses[project.color] || colorClasses.blue;

  return (
    <div
      className={`bg-white p-5 rounded-xl border ${colors.border} flex flex-col`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
        >
          <project.icon className={`w-6 h-6 ${colors.text}`} />
        </div>
        <div>
          <h4 className="font-bold text-gray-800">{project.name}</h4>
          <p className="text-xs text-gray-500">{project.category}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 my-4 flex-grow">
        {project.description}
      </p>
      <div className="text-right">
        <p className={`font-bold ${colors.text} text-lg`}>
          {project.fundingGoal}
        </p>
        <p className="text-xs text-gray-500">{project.progress}% hoàn thành</p>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function FundsSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Cơ hội Đầu tư
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Khám phá những dự án khoa học công nghệ tiềm năng và tham gia đầu tư
            vào tương lai
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {featuredFunds.map((fund) => (
            <FeaturedFundCard key={fund.name} fund={fund} />
          ))}
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-bold text-gray-800">
              Dự án đầu tư khác
            </h3>
            <a href="#" className="text-blue-600 font-semibold hover:underline">
              Xem tất cả
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project) => (
              <OtherProjectCard key={project.name} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
