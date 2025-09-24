/**
 * Authenticated wrapper for NegotiationDetailsScreen
 * Đảm bảo user đã đăng nhập trước khi hiển thị màn hình đàm phán
 */

"use client";

import React from "react";
import { Spin, Alert, Button } from "antd";
import { Typography } from "antd";
import { useAuth } from "@/store/auth";
import { NegotiationDetailsScreen } from "../index";

const { Text } = Typography;

interface AuthenticatedNegotiationScreenProps {
  proposalId: string;
}

export const AuthenticatedNegotiationScreen: React.FC<
  AuthenticatedNegotiationScreenProps
> = ({ proposalId }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4">
            <Text>Đang kiểm tra thông tin đăng nhập...</Text>
          </div>
        </div>
      </div>
    );
  }

  // Show error if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-white p-10">
        <Alert
          message="Yêu cầu đăng nhập"
          description="Bạn cần đăng nhập để xem thông tin đàm phán này."
          type="warning"
          showIcon
          action={
            <Button 
              type="primary" 
              onClick={() => window.location.href = '/login'}
            >
              Đăng nhập
            </Button>
          }
        />
      </div>
    );
  }

  // Render the main screen if authenticated
  return <NegotiationDetailsScreen proposalId={proposalId} />;
};
