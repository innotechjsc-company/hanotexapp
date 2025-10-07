"use client";

import { useEffect, useState } from "react";
import { BrainCircuit, Rocket, Dna, User, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { getActiveProjectsAll } from "@/api/projects";
import type { Project } from "@/types/project";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Logo from "@/components/layout/Header/components/Logo";

// --- HELPER COMPONENTS ---
const ProgressBar = ({ value, color }: { value: number; color: string }) => (
  <div>
    <div className="flex justify-between items-center mb-1 text-sm">
      <span className="text-gray-500">Tiến độ gọi vốn</span>
      <span className={`font-semibold text-${color}-500`}>{value}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full bg-${color}-500`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

const FeaturedFundCard = ({ project }: { project: Project }) => {
  const user = typeof project.user === "object" ? project.user : null;
  const daysLeft = project.end_date
    ? Math.max(
        0,
        Math.ceil(
          (new Date(project.end_date).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  const raisedPercent = Math.floor(Math.random() * (85 - 40 + 1)) + 40;
  const raisedAmount = project.goal_money
    ? ((project.goal_money * raisedPercent) / 100).toLocaleString("vi-VN")
    : 0;

  const projectId = project?.id ?? "";

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
      <div className="relative w-full h-56 bg-gray-100 flex items-center justify-center">
        <Logo />
        <div className="absolute top-4 left-4 flex gap-2">
          <span
            className={`px-3 py-1 text-sm font-semibold text-white rounded-full bg-green-600`}
          >
            Đang gọi vốn
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {project.name}
        </h3>
        <p className="text-gray-600 mb-6 text-sm leading-relaxed line-clamp-3 flex-grow">
          {project.description}
        </p>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6 text-sm">
          <div>
            <p className="text-gray-500">Mục tiêu gọi vốn</p>
            <p className="font-bold text-gray-800 text-base">
              {project.goal_money?.toLocaleString("vi-VN")} VND
            </p>
          </div>
          <div>
            <p className="text-gray-500">Đã gọi được</p>
            <p className={`font-bold text-base text-green-500`}>
              {raisedAmount} VND ({raisedPercent}%)
            </p>
          </div>
          <div>
            <p className="text-gray-500">Số nhà đầu tư</p>
            <p className="font-bold text-gray-800 text-base">
              {Math.floor(Math.random() * 50) + 5}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Thời gian còn lại</p>
            <p className="font-bold text-red-500 text-base">{daysLeft} ngày</p>
          </div>
        </div>

        <ProgressBar value={raisedPercent} color="green" />

        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                {(project?.user as any)?.full_name || "Chủ dự án"}
              </p>
              <p className="text-xs text-gray-500">Founder</p>
            </div>
          </div>
          <Link href={projectId ? `/funds/fundraising/${projectId}` : "#"}>
            <button
              className={`px-6 py-2.5 font-semibold text-white rounded-lg cursor-pointer transition-transform hover:scale-105 bg-green-600 hover:bg-green-700 cursor-pointer`}
            >
              Đầu tư ngay
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const OtherProjectCard = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  const icons = [BrainCircuit, Rocket, Dna];
  const colors = [
    {
      bg: "bg-purple-100",
      text: "text-purple-600",
      border: "border-purple-200",
    },
    { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" },
    { bg: "bg-red-100", text: "text-red-600", border: "border-red-200" },
  ];

  const selectedColor = colors[index % colors.length];
  const Icon = icons[index % icons.length];
  const raisedPercent = Math.floor(Math.random() * (85 - 40 + 1)) + 40;

  const techId = project.technologies?.[0]
    ? typeof project.technologies[0] === "object"
      ? project.technologies[0].id
      : project.technologies[0]
    : null;

  return (
    <Link
      href={techId ? `/technologies/${techId}` : "#"}
      className="block h-full"
    >
      <div
        className={`bg-white p-5 rounded-xl border ${selectedColor.border} flex flex-col relative h-full hover:shadow-lg transition-shadow cursor-pointer`}
      >
        {/* <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1 rounded-lg z-10">
          <Logo />
        </div> */}
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 ${selectedColor.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
          >
            <Icon className={`w-6 h-6 ${selectedColor.text}`} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 line-clamp-1">
              {project.name}
            </h4>
            <p className="text-xs text-gray-500">
              {(typeof project.technologies?.[0] === "object" &&
                project.technologies[0]?.title) ||
                "Công nghệ"}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600 my-4 flex-grow line-clamp-3">
          {project.description}
        </p>
        <div className="text-right flex justify-between items-center">
          <p className={`font-bold ${selectedColor.text} text-lg`}>
            {project.goal_money?.toLocaleString("vi-VN")} VND
          </p>
          <p className="text-xs text-gray-500">{raisedPercent}% hoàn thành</p>
        </div>
      </div>
    </Link>
  );
};

// --- MAIN COMPONENT ---
export default function FundsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await getActiveProjectsAll(true, {
          limit: 5,
          sort: "-goal_money",
        });
        const items = (response.data as any) || (response.docs as any) || [];
        debugger;
        setProjects(items);
      } catch (err) {
        debugger;
        setError("Không thể tải danh sách dự án.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const featuredProjects = projects.slice(0, 2);
  const otherProjects = projects.slice(2, 5);

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

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {featuredProjects.map((project) => (
                <FeaturedFundCard key={project.id} project={project} />
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-gray-800">
                  Dự án đầu tư khác
                </h3>
                <a
                  href="/funds"
                  className="text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Xem tất cả
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherProjects.map((project, index) => (
                  <OtherProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
