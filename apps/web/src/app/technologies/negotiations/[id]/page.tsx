"use client";

import { NegotiationDetailsScreen } from "@/screens/negotiation-details-screen";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/store/auth";
import { useEffect } from "react";
import { Spin, Alert } from "antd";

export default function NegotiationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const currentUser = useUser();
  const proposalId = params.id as string;

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (currentUser && !currentUser.id) {
      router.push("/auth/login");
    }
  }, [currentUser, router]);

  // Show loading while checking authentication
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Show error if user is not authenticated
  if (!currentUser.id) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert
          message="Yêu cầu đăng nhập"
          description="Vui lòng đăng nhập để xem trang này"
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return <NegotiationDetailsScreen proposalId={proposalId} />;
}
