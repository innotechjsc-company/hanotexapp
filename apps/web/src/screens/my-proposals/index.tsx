"use client";

import React, { useState } from "react";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";
import { Card, CardBody, Tabs, Tab, Button } from "@heroui/react";
import { ArrowLeft, Lightbulb, Target, Briefcase } from "lucide-react";
import TechnologyProposalsTab from "./components/TechnologyProposalsTab";
import DemandProposalsTab from "./components/DemandProposalsTab";
import ProjectProposalsTab from "./components/ProjectProposalsTab";

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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
          <CardBody>
            <Tabs
              aria-label="Proposals tabs"
              className="w-full"
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(key as string)}
              variant="underlined"
              classNames={{
                tabList:
                  "w-full relative rounded-none p-0 border-b border-divider",
                cursor: "w-full bg-primary",
                tab: "max-w-fit px-0 h-12 rounded-md group-data-[selected=true]:bg-primary/10 group-data-[selected=true]:text-primary",
                tabContent:
                  "group-data-[selected=true]:text-primary font-medium",
              }}
            >
              <Tab
                key="technology"
                title={
                  <div className="flex items-center space-x-2" style={{ backgroundColor: activeTab === "technology" ? "#3b82f6" : "transparent", borderRadius: "8px", padding: "4px 8px" }}>
                    <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: activeTab === "technology" ? "#ffffff" : "#000000" }} />
                    <span className="text-sm sm:text-base" style={{ color: activeTab === "technology" ? "#ffffff" : "#000000" }}>
                      Đề xuất chuyển giao công nghệ
                    </span>
                  </div>
                }
              >
                <div className="py-6">
                  <TechnologyProposalsTab userId={user.id} />
                </div>
              </Tab>

              <Tab
                key="demand"
                title={
                  <div className="flex items-center space-x-2" style={{ backgroundColor: activeTab === "demand" ? "#3b82f6" : "transparent", borderRadius: "8px", padding: "4px 8px" }}>
                    <Target className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: activeTab === "demand" ? "#ffffff" : "#000000" }} />
                    <span className="text-sm sm:text-base" style={{ color: activeTab === "demand" ? "#ffffff" : "#000000" }}>
                      Đề xuất nhu cầu
                    </span>
                  </div>
                }
              >
                <div className="py-6">
                  <DemandProposalsTab userId={user.id} />
                </div>
              </Tab>

              <Tab
                key="project"
                title={
                  <div className="flex items-center space-x-2" style={{ backgroundColor: activeTab === "project" ? "#3b82f6" : "transparent", borderRadius: "8px", padding: "4px 8px" }}  >
                    <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: activeTab === "project" ? "#ffffff" : "#000000" }} />
                    <span className="text-sm sm:text-base" style={{ color: activeTab === "project" ? "#ffffff" : "#000000" }}>
                      Đề xuất dự án
                    </span>
                  </div>
                }
              >
                <div className="py-6">
                  <ProjectProposalsTab userId={user.id} />
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
