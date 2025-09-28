"use client";

import React, { useState } from "react";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";
import { Card, CardBody, Tabs, Tab, Button } from "@heroui/react";
import { ArrowLeft, Lightbulb, Target, Briefcase, BarChart3 } from "lucide-react";
import TechnologyProposalsTab from "./components/TechnologyProposalsTab";
import DemandProposalsTab from "./components/DemandProposalsTab";
import ProjectProposalsTab from "./components/ProjectProposalsTab";
import OverviewTab from "./components/OverviewTab";

export default function MyProposalsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("technology");

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) {
    return null; // or loading spinner
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Card className="rounded-none shadow-sm border-b">
        <CardBody className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                Đề xuất của tôi
              </h1>
              <p className="text-default-600">Quản lý các đề xuất của bạn</p>
            </div>
          </div>
        </CardBody>
      </Card>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="rounded-xl shadow-sm border border-gray-200">  
          <CardBody className="p-6">
            <OverviewTab userId={user.id} activeTab={activeTab} />
          </CardBody>
        </Card>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="rounded-xl shadow-sm border border-gray-200">
          <CardBody className="p-0">
            <Tabs
              aria-label="Proposals tabs"
              className="w-full"
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(key as string)}
              variant="underlined"
              classNames={{
                tabList:
                  "w-full relative rounded-none p-0 border-b border-gray-200 bg-gray-50/50",
                cursor: "w-full bg-primary",
                tab: "max-w-fit px-6 h-14 rounded-t-lg group-data-[selected=true]:bg-white group-data-[selected=true]:text-primary group-data-[selected=true]:shadow-sm group-data-[selected=true]:border group-data-[selected=true]:border-b-0 group-data-[selected=true]:border-gray-200",
                tabContent:
                  "group-data-[selected=true]:text-primary font-semibold text-gray-600",
                panel: "p-6"
              }}
            >

              <Tab
                key="technology"
                title={
                  <div className="flex items-center space-x-3" style={{ backgroundColor: activeTab === "technology" ? "#3b82f6" : "transparent", borderRadius: "8px", padding: "4px 8px" }} >
                    <Lightbulb className="h-5 w-5" style={{ color: activeTab === "technology" ? "#ffffff" : "#000000" }} />
                    <span className="font-medium" style={{ color: activeTab === "technology" ? "#ffffff" : "#000000" }}>
                      Đề xuất chuyển giao công nghệ
                    </span>
                  </div>
                }
              >
                <TechnologyProposalsTab userId={user.id} />
              </Tab>

              <Tab
                key="demand"
                title={
                  <div className="flex items-center space-x-3" style={{ backgroundColor: activeTab === "demand" ? "#3b82f6" : "transparent", borderRadius: "8px", padding: "4px 8px" }} >
                    <Target className="h-5 w-5" style={{ color: activeTab === "demand" ? "#ffffff" : "#000000" }}   />
                    <span className="font-medium" style={{ color: activeTab === "demand" ? "#ffffff" : "#000000" }} >
                      Đề xuất nhu cầu
                    </span>
                  </div>
                }
              >
                <DemandProposalsTab userId={user.id} />
              </Tab>

              <Tab
                key="project"
                title={
                  <div className="flex items-center space-x-3" style={{ backgroundColor: activeTab === "project" ? "#3b82f6" : "transparent", borderRadius: "8px", padding: "4px 8px" }}  >
                    <Briefcase className="h-5 w-5" style={{ color: activeTab === "project" ? "#ffffff" : "#000000" }} />
                    <span className="font-medium" style={{ color: activeTab === "project" ? "#ffffff" : "#000000" }} >
                      Đề xuất dự án
                    </span>
                  </div>
                }
              >
                <ProjectProposalsTab userId={user.id} />
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
