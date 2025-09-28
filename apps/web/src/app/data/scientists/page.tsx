"use client";

import { useState, useMemo } from "react";
import {
  Layout,
  Card,
  Table,
  Typography,
  Row,
  Col,
  Statistic,
  Input,
  Select,
  Space,
  Button,
  Tag,
  Avatar,
  Tooltip,
  message,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  FilterOutlined,
  ExportOutlined,
  ReloadOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { User, UserRole } from "@/types/users";
import { useUsersPayload } from "@/hooks/useUsersPayload";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { createSimpleRoomChat } from "@/api/roomChat";
import { addUserToRoom, findRoomBetweenUsers } from "@/api/roomUser";
import { sendMessage } from "@/api/roomMessage";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function ScientistsPage() {
  // State management
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | undefined>();
  const [verifiedFilter, setVerifiedFilter] = useState<boolean | undefined>();
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>();
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  // Hooks
  const router = useRouter();
  const { user } = useAuthStore();

  // Fetch users data - only INDIVIDUAL users with USER role (scientists)
  const { users, loading, error, pagination, refetch } = useUsersPayload({
    page,
    limit,
    user_type: "INDIVIDUAL", // Only fetch INDIVIDUAL users
    role: roleFilter || "USER", // Default to USER role, can be overridden by filter
    is_verified: verifiedFilter,
    search,
  });

  // Statistics calculations
  const statistics = useMemo(() => {
    if (!users.length) {
      return {
        total: 0,
        verified: 0,
        unverified: 0,
        active: 0,
        inactive: 0,
        admins: 0,
        regularUsers: 0,
      };
    }

    return {
      total: pagination.total || users.length,
      verified: users.filter((user) => user.is_verified).length,
      unverified: users.filter((user) => !user.is_verified).length,
      active: users.filter((user) => user.is_active).length,
      inactive: users.filter((user) => !user.is_active).length,
      admins: users.filter((user) => user.role === "ADMIN").length,
      regularUsers: users.filter((user) => user.role === "USER").length,
    };
  }, [users, pagination.total]);

  // Handle creating chat and navigating to messages
  const handleStartChat = async (scientist: User) => {
    if (!user?.id || !scientist.id) {
      message.error("Vui lòng đăng nhập để sử dụng tính năng chat");
      return;
    }

    if (String(user.id) === String(scientist.id)) {
      message.warning("Bạn không thể chat với chính mình");
      return;
    }

    try {
      setIsCreatingChat(true);
      message.loading("Đang tạo cuộc trò chuyện...", 0);

      // 1. Check if room already exists between these two users
      const existingRoomId = await findRoomBetweenUsers(user.id, scientist.id);

      if (existingRoomId) {
        // Room already exists, navigate to existing chat
        message.destroy();
        message.success("Chuyển đến cuộc trò chuyện");
        router.push(`/messages?roomId=${existingRoomId}`);
        return;
      }

      // 2. No existing room, create new room chat
      const roomTitle = `${scientist.full_name || scientist.email}`;
      const roomChat = await createSimpleRoomChat(roomTitle);

      // 3. Add both users to room
      await addUserToRoom(roomChat.id, user.id);
      await addUserToRoom(roomChat.id, scientist.id);

      // 4. Send initial message
      await sendMessage(
        roomChat.id,
        user.id,
        `Xin chào ${scientist.full_name || scientist.email}, tôi muốn kết nối với bạn.`
      );

      // 5. Navigate to messages page
      message.destroy();
      message.success("Đã tạo cuộc trò chuyện thành công!");
      router.push(`/messages?roomId=${roomChat.id}`);
    } catch (error) {
      console.error("Error creating/finding chat:", error);
      message.destroy();
      message.error("Có lỗi xảy ra khi tạo cuộc trò chuyện. Vui lòng thử lại.");
    } finally {
      setIsCreatingChat(false);
    }
  };

  // Table columns configuration
  const columns: ColumnsType<User> = [
    {
      title: "Thông tin cá nhân",
      key: "personal_info",
      width: 350,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar size={40} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>
              {record.full_name || "Chưa cập nhật"}
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>
              <MailOutlined style={{ marginRight: 4 }} />
              {record.email}
            </div>
            {record.phone && (
              <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                <PhoneOutlined style={{ marginRight: 4 }} />
                {record.phone}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Nghề nghiệp",
      dataIndex: "profession",
      key: "profession",
      width: 200,
      render: (text) => <Text>{text || "Chưa cập nhật"}</Text>,
    },
    {
      title: "Xác minh",
      dataIndex: "is_verified",
      key: "is_verified",
      width: 100,
      render: (verified: boolean) => (
        <Tag
          icon={verified ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={verified ? "green" : "red"}
        >
          {verified ? "Đã xác minh" : "Chưa xác minh"}
        </Tag>
      ),
    },
    {
      title: "Ngày tham gia",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date) => {
        if (!date) return "Không có thông tin";
        return new Date(date).toLocaleDateString("vi-VN");
      },
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => {
        const isCurrentUser = user?.id && String(user.id) === String(record.id);
        const canContact = user?.id && !isCurrentUser;

        return (
          <Space>
            <Tooltip
              title={
                isCurrentUser ? "Đây là tài khoản của bạn" : "Liên hệ qua chat"
              }
              color="#666"
            >
              <Button
                type="primary"
                size="small"
                icon={<MessageOutlined />}
                onClick={() => handleStartChat(record)}
                disabled={!canContact || isCreatingChat}
                loading={isCreatingChat}
              >
                {isCurrentUser ? "Bạn" : "Liên hệ"}
              </Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  // Handle search
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page when searching
  };

  // Handle filter changes
  const handleRoleFilter = (value: UserRole | undefined) => {
    setRoleFilter(value);
    setPage(1);
  };

  const handleVerifiedFilter = (value: boolean | undefined) => {
    setVerifiedFilter(value);
    setPage(1);
  };

  // Handle export (placeholder)
  const handleExport = () => {
    message.info(
      "Chức năng xuất dữ liệu sẽ được phát triển trong phiên bản tiếp theo"
    );
  };

  // Handle refresh
  const handleRefresh = () => {
    refetch();
    message.success("Đã làm mới dữ liệu");
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setRoleFilter(undefined);
    setVerifiedFilter(undefined);
    setActiveFilter(undefined);
    setPage(1);
  };

  if (error) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        <Content style={{ padding: "24px" }}>
          <Card>
            <div style={{ textAlign: "center", padding: "40px" }}>
              <CloseCircleOutlined
                style={{ fontSize: 48, color: "#ff4d4f", marginBottom: 16 }}
              />
              <Title level={4} style={{ color: "#ff4d4f" }}>
                Không thể tải dữ liệu
              </Title>
              <Text type="secondary">{error}</Text>
              <br />
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                style={{ marginTop: 16 }}
              >
                Thử lại
              </Button>
            </div>
          </Card>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Content style={{ padding: "24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Title
            level={2}
            style={{
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <UserOutlined style={{ color: "#1890ff" }} />
            Danh sách nhà khoa học
          </Title>
          <Text type="secondary">
            Quản lý thông tin các nhà khoa học và nhà nghiên cứu trong hệ thống
          </Text>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tổng số nhà khoa học"
                value={statistics.total}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Đã xác minh"
                value={statistics.verified}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Chưa xác minh"
                value={statistics.unverified}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: "#fa541c" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Đang hoạt động"
                value={statistics.active}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content Card */}
        <Card>
          {/* Toolbar */}
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <Space wrap size={12}>
              <Search
                placeholder="Tìm theo tên, email, số điện thoại..."
                allowClear
                style={{ width: 300 }}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                onSearch={handleSearch}
                prefix={<SearchOutlined />}
              />
              <Select
                placeholder="Lọc theo vai trò"
                allowClear
                style={{ width: 150 }}
                value={roleFilter}
                onChange={handleRoleFilter}
              >
                <Option value="USER">Người dùng</Option>
                <Option value="ADMIN">Quản trị viên</Option>
                <Option value="MODERATOR">Điều hành</Option>
                <Option value="SUPPORT">Hỗ trợ</Option>
              </Select>
              <Select
                placeholder="Trạng thái xác minh"
                allowClear
                style={{ width: 160 }}
                value={verifiedFilter}
                onChange={handleVerifiedFilter}
              >
                <Option value={true}>Đã xác minh</Option>
                <Option value={false}>Chưa xác minh</Option>
              </Select>
              <Button
                icon={<FilterOutlined />}
                onClick={clearFilters}
                title="Xóa tất cả bộ lọc"
              >
                Xóa lọc
              </Button>
            </Space>

            <Space>
              <Tooltip title="Làm mới dữ liệu" color="#666">
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  loading={loading}
                />
              </Tooltip>
              <Tooltip title="Xuất dữ liệu" color="#666">
                <Button icon={<ExportOutlined />} onClick={handleExport} />
              </Tooltip>
            </Space>
          </div>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={users}
            rowKey={(record) => record.id || record.email}
            loading={loading}
            pagination={{
              current: page,
              pageSize: limit,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} nhà khoa học`,
              onChange: (newPage, newPageSize) => {
                setPage(newPage);
                if (newPageSize !== limit) {
                  setLimit(newPageSize);
                }
              },
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
            scroll={{ x: 1200 }}
          />
        </Card>
      </Content>
    </Layout>
  );
}
