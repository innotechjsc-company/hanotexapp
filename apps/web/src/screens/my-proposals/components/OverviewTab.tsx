"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, Spinner, Button } from "@heroui/react";
import { 
  Lightbulb, 
  Target, 
  Briefcase, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  BarChart3,
  Activity
} from "lucide-react";
import { technologyProposeApi } from "@/api/technology-propose";
import { getProposes } from "@/api/propose";
import { projectProposeApi } from "@/api/project-propose";
import type { TechnologyPropose } from "@/types/technology-propose";
import type { Propose } from "@/types/propose";
import type { ProjectPropose } from "@/types/project-propose";

interface ProposalStats {
  total: number;
  pending: number;
  negotiating: number;
  contactSigning: number;
  contractSigned: number;
  completed: number;
  cancelled: number;
  sent: number;
  received: number;
  other: number;
}

interface OverviewData {
  technology: ProposalStats;
  demand: ProposalStats;
  project: ProposalStats;
  total: ProposalStats;
}

export default function OverviewTab({ userId, activeTab }: { userId: string; activeTab?: string }) {
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchOverviewData = async () => {
    if (!userId) return;

    setLoading(true);
    setError("");

    try {
      // Fetch all proposals in parallel with better error handling
      const [technologyResponse, demandResponse, projectResponse] = await Promise.allSettled([
        // Technology proposals (sent and received)
        Promise.allSettled([
          technologyProposeApi.list({ user: userId }, { limit: 1000 }),
          technologyProposeApi.list({ receiver: userId }, { limit: 1000 })
        ]),
        // Demand proposals (sent and received)
        Promise.allSettled([
          getProposes({ user: userId }, { limit: 1000 }),
          getProposes({ receiver: userId }, { limit: 1000 })
        ]),
        // Project proposals (sent and received)
        Promise.allSettled([
          projectProposeApi.list({ user: userId }, { limit: 1000 }),
          projectProposeApi.list({ receiver: userId }, { limit: 1000 })
        ])
      ]);

      // Process technology proposals with error handling
      let allTechnologyProposals: any[] = [];
      if (technologyResponse.status === 'fulfilled') {
        const [sentResult, receivedResult] = technologyResponse.value;
        const technologySent = (sentResult.status === 'fulfilled') ? 
          ((sentResult.value as any).docs || (sentResult.value as any).data || []) : [];
        const technologyReceived = (receivedResult.status === 'fulfilled') ? 
          ((receivedResult.value as any).docs || (receivedResult.value as any).data || []) : [];
        
        // Remove duplicates by ID
        const allTech = [...technologySent, ...technologyReceived];
        const uniqueTech = allTech.filter((item, index, self) => 
          index === self.findIndex(t => t.id === item.id)
        );
        allTechnologyProposals = uniqueTech;
      }

      // Process demand proposals with error handling
      let allDemandProposals: any[] = [];
      if (demandResponse.status === 'fulfilled') {
        const [sentResult, receivedResult] = demandResponse.value;
        const demandSent = (sentResult.status === 'fulfilled') ? 
          ((sentResult.value as any).docs || (sentResult.value as any).data || []) : [];
        const demandReceived = (receivedResult.status === 'fulfilled') ? 
          ((receivedResult.value as any).docs || (receivedResult.value as any).data || []) : [];
        
        // Remove duplicates by ID
        const allDemand = [...demandSent, ...demandReceived];
        const uniqueDemand = allDemand.filter((item, index, self) => 
          index === self.findIndex(t => t.id === item.id)
        );
        allDemandProposals = uniqueDemand;
      }

      // Process project proposals with error handling
      let allProjectProposals: any[] = [];
      if (projectResponse.status === 'fulfilled') {
        const [sentResult, receivedResult] = projectResponse.value;
        const projectSent = (sentResult.status === 'fulfilled') ? 
          ((sentResult.value as any).docs || (sentResult.value as any).data || []) : [];
        const projectReceived = (receivedResult.status === 'fulfilled') ? 
          ((receivedResult.value as any).docs || (receivedResult.value as any).data || []) : [];
        
        // Remove duplicates by ID
        const allProject = [...projectSent, ...projectReceived];
        const uniqueProject = allProject.filter((item, index, self) => 
          index === self.findIndex(t => t.id === item.id)
        );
        allProjectProposals = uniqueProject;
      }

      // Calculate stats for each type
      const technologyStats = calculateStats(allTechnologyProposals, userId);
      const demandStats = calculateStats(allDemandProposals, userId);
      const projectStats = calculateStats(allProjectProposals, userId);

      // Debug logs
      console.log("Technology stats:", technologyStats);
      console.log("Demand stats:", demandStats);
      console.log("Project stats:", projectStats);
      console.log("User ID:", userId);

      // Calculate total stats
      const totalStats: ProposalStats = {
        total: technologyStats.total + demandStats.total + projectStats.total,
        pending: technologyStats.pending + demandStats.pending + projectStats.pending,
        negotiating: technologyStats.negotiating + demandStats.negotiating + projectStats.negotiating,
        contactSigning: technologyStats.contactSigning + demandStats.contactSigning + projectStats.contactSigning,
        contractSigned: technologyStats.contractSigned + demandStats.contractSigned + projectStats.contractSigned,
        completed: technologyStats.completed + demandStats.completed + projectStats.completed,
        cancelled: technologyStats.cancelled + demandStats.cancelled + projectStats.cancelled,
        sent: technologyStats.sent + demandStats.sent + projectStats.sent,
        received: technologyStats.received + demandStats.received + projectStats.received,
        other: technologyStats.other + demandStats.other + projectStats.other,
      };
      setOverviewData({
        technology: technologyStats,
        demand: demandStats,
        project: projectStats,
        total: totalStats,
      });
    } catch (err) {
      console.error("Failed to fetch overview data:", err);
      setError("Không thể tải dữ liệu tổng quan. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (proposals: any[], userId: string): ProposalStats => {
    const stats: ProposalStats = {
      total: 0,
      pending: 0,
      negotiating: 0,
      contactSigning: 0,
      contractSigned: 0,
      completed: 0,
      cancelled: 0,
      sent: 0,
      received: 0,
      other: 0,
    };

    console.log("Calculating stats for proposals:", proposals.length, "userId:", userId);

    proposals.forEach((proposal, index) => {
      if (!proposal) return;
      
      // Debug first few proposals
      if (index < 3) {
        console.log(`Proposal ${index}:`, {
          user: proposal.user,
          receiver: proposal.receiver,
          status: proposal.status,
          userId: userId
        });
      }
      
      // Phân loại sent/received - xử lý cả string và object
      const proposalUserId = typeof proposal.user === 'string' ? proposal.user : proposal.user?.id;
      const proposalReceiverId = typeof proposal.receiver === 'string' ? proposal.receiver : proposal.receiver?.id;
      
      if (proposalUserId === userId) {
        stats.sent++;
      } else if (proposalReceiverId === userId) {
        stats.received++;
      } else {
        stats.other++;
      }
      
      switch (proposal.status) {
        case "pending":
          stats.pending++;
          break;
        case "negotiating":
          stats.negotiating++;
          break;
        case "contact_signing":
          stats.contactSigning++;
          break;
        case "contract_signed":
          stats.contractSigned++;
          break;
        case "completed":
          stats.completed++;
          break;
        case "cancelled":
          stats.cancelled++;
          break;
        default:
          stats.other++;
          break;
      }
    });

    // Tính total = tổng tất cả trừ đi cancelled và other
    stats.total = stats.pending + stats.negotiating + stats.contactSigning + stats.contractSigned + stats.completed;

    console.log("Final stats:", stats);
    return stats;
  };

  useEffect(() => {
    fetchOverviewData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-16">
        <div className="relative">
          <Spinner size="lg" className="text-primary" />
          <Activity className="h-6 w-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="mt-4 text-gray-600 font-medium">Đang tải dữ liệu tổng quan...</p>
        <p className="text-sm text-gray-500 mt-1">Vui lòng chờ trong giây lát</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-8 text-center shadow-sm">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Không thể tải dữ liệu</h3>
        <p className="text-red-600 mb-6 max-w-md mx-auto">{error}</p>
        <Button
          color="danger"
          variant="solid"
          startContent={<RefreshCw className="h-4 w-4" />}
          onPress={fetchOverviewData}
          className="font-medium"
        >
          Thử lại
        </Button>
      </div>
    );
  }

  if (!overviewData) {
    return (
      <div className="text-center py-16">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gray-100 rounded-full">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Không có dữ liệu</h3>
        <p className="text-gray-500">Chưa có đề xuất nào để hiển thị</p>
      </div>
    );
  }

  const StatCard = ({ 
    title, 
    icon: Icon, 
    stats, 
    color = "blue",
    isActive = false
  }: { 
    title: string; 
    icon: React.ElementType; 
    stats: ProposalStats; 
    color?: string;
    isActive?: boolean;
  }) => {
    const colorConfig = {
      blue: {
        bg: "bg-gradient-to-br from-blue-50 to-blue-100",
        border: "border-blue-200",
        text: "text-blue-800",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        accent: "text-blue-600"
      },
      green: {
        bg: "bg-gradient-to-br from-green-50 to-green-100",
        border: "border-green-200", 
        text: "text-green-800",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        accent: "text-green-600"
      },
      orange: {
        bg: "bg-gradient-to-br from-orange-50 to-orange-100",
        border: "border-orange-200",
        text: "text-orange-800", 
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        accent: "text-orange-600"
      },
      purple: {
        bg: "bg-gradient-to-br from-purple-50 to-purple-100",
        border: "border-purple-200",
        text: "text-purple-800",
        iconBg: "bg-purple-100", 
        iconColor: "text-purple-600",
        accent: "text-purple-600"
      }
    };

    const config = colorConfig[color as keyof typeof colorConfig];

    return (
      <Card className={`border-2 ${config.border} ${config.bg} shadow-sm hover:shadow-md transition-all duration-300 ${
        isActive 
          ? 'ring-4 ring-primary/20 shadow-lg border-primary' 
          : 'hover:scale-102'
      }`}>
        <CardBody className={isActive ? "p-8" : "p-6"}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-xl ${config.iconBg} shadow-sm`}>
                <Icon className={`h-8 w-8 ${config.iconColor}`} />
              </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className={`text-2xl font-bold ${config.text}`}>{title}: {stats.total}</h3>
                  </div>
                  <p className="text-gray-600 font-medium">Tổng số đề xuất</p>
                  <div className="flex space-x-4 mt-2 text-sm">
                    <span className="text-blue-600 font-medium">Đã gửi: {stats.sent || 0}</span>
                    <span className="text-green-600 font-medium">Nhận được: {stats.received || 0}</span>
                  </div>
                  {(stats.cancelled > 0 || stats.other > 0) && (
                    <p className="text-xs text-gray-500 mt-1">
                      * Loại trừ {stats.cancelled} đã hủy, {stats.other} khác
                    </p>
                  )}
                </div>
            </div>
          </div>
          
          <div className={`grid gap-6 ${isActive ? 'grid-cols-4' : 'grid-cols-2'}`}>
            <div className="flex items-center space-x-4 p-4 bg-white/60 rounded-xl">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className={`font-bold text-orange-700 ${isActive ? 'text-2xl' : 'text-lg'}`}>{stats.pending}</div>
                <div className="text-sm text-gray-600 font-medium">Chờ xem xét</div>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-white/60 rounded-xl">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className={`font-bold text-blue-700 ${isActive ? 'text-2xl' : 'text-lg'}`}>{stats.negotiating}</div>
                <div className="text-sm text-gray-600 font-medium">Đang đàm phán</div>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-white/60 rounded-xl">
              <div className="p-3 bg-cyan-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <div className={`font-bold text-cyan-700 ${isActive ? 'text-2xl' : 'text-lg'}`}>{stats.contactSigning + stats.contractSigned}</div>
                <div className="text-sm text-gray-600 font-medium">Ký hợp đồng</div>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-white/60 rounded-xl">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className={`font-bold text-green-700 ${isActive ? 'text-2xl' : 'text-lg'}`}>{stats.completed}</div>
                <div className="text-sm text-gray-600 font-medium">Hoàn thành</div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Thống kê toàn bộ các đề xuất của bạn</h2>
        </div>
        <Button
          variant="bordered"
          startContent={<RefreshCw className="h-4 w-4" />}
          onPress={fetchOverviewData}
          isLoading={loading}
          className="font-medium"
        >
          Làm mới
        </Button>
      </div>

      {/* Total Overview Card */}
      <Card className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 border-2 border-indigo-200 shadow-lg">
        <CardBody className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 shadow-lg">
                <BarChart3 className="h-10 w-10 text-indigo-600" />
              </div>
                <div>
                  <h3 className="text-2xl font-bold text-indigo-900">Tổng cộng</h3>
                  <p className="text-indigo-700 font-medium">Tất cả loại đề xuất (Công nghệ, nhu cầu, dự án)</p>
                  {(overviewData.total.cancelled > 0 || overviewData.total.other > 0) && (
                    <p className="text-sm text-gray-500 mt-1">
                      * Loại trừ {overviewData.total.cancelled} đã hủy, {overviewData.total.other} khác
                    </p>
                  )}
                </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-indigo-900">
                {overviewData.total.total}
              </div>
              <div className="text-sm text-indigo-600 font-medium">đề xuất</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white/80 rounded-xl shadow-sm border border-orange-100">
              <div className="p-3 bg-orange-100 rounded-lg w-fit mx-auto mb-3">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-700">{overviewData.total.pending}</div>
              <div className="text-sm text-gray-600 font-medium">Chờ xem xét</div>
            </div>
            <div className="text-center p-4 bg-white/80 rounded-xl shadow-sm border border-blue-100">
              <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-700">{overviewData.total.negotiating}</div>
              <div className="text-sm text-gray-600 font-medium">Đang đàm phán</div>
            </div>
            <div className="text-center p-4 bg-white/80 rounded-xl shadow-sm border border-cyan-100">
              <div className="p-3 bg-cyan-100 rounded-lg w-fit mx-auto mb-3">
                <AlertCircle className="h-6 w-6 text-cyan-600" />
              </div>
              <div className="text-2xl font-bold text-cyan-700">
                {overviewData.total.contactSigning + overviewData.total.contractSigned}
              </div>
              <div className="text-sm text-gray-600 font-medium">Ký hợp đồng</div>
            </div>
            <div className="text-center p-4 bg-white/80 rounded-xl shadow-sm border border-green-100">
              <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-700">{overviewData.total.completed}</div>
              <div className="text-sm text-gray-600 font-medium">Hoàn thành</div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Individual Type Card - Only show active tab */}
      <div className="w-full">
        {activeTab === "technology" && (
          <StatCard
            title="Đề xuất chuyển giao công nghệ"
            icon={Lightbulb}
            stats={overviewData.technology}
            color="blue"
            isActive={true}
          />
        )}
        {activeTab === "demand" && (
          <StatCard
            title="Đề xuất nhu cầu"
            icon={Target}
            stats={overviewData.demand}
            color="green"
            isActive={true}
          />
        )}
        {activeTab === "project" && (
          <StatCard
            title="Đề xuất dự án"
            icon={Briefcase}
            stats={overviewData.project}
            color="orange"
            isActive={true}
          />
        )}
      </div>
    </div>
  );
}

