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
  Tooltip,
  message,
} from "antd";
import {
  BankOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  FilterOutlined,
  ExportOutlined,
  ReloadOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { ResearchInstitution, InstitutionType } from "@/types/research-institutions";
import { useResearchInstitutions } from "@/hooks/useResearchInstitutions";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function InstitutionsPage() {
  // State management
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<InstitutionType | undefined>();
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>();

  // Fetch institutions data
  const { institutions, loading, error, pagination, refetch } = useResearchInstitutions({
    page,
    limit,
    institution_type: typeFilter,
    is_active: activeFilter,
    search,
  });

  // Statistics calculations
  const statistics = useMemo(() => {
    if (!institutions.length) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        university: 0,
        researchInstitute: 0,
        governmentLab: 0,
        privateRnd: 0,
        internationalOrg: 0,
      };
    }

    return {
      total: pagination.total || institutions.length,
      active: institutions.filter((inst) => inst.is_active).length,
      inactive: institutions.filter((inst) => !inst.is_active).length,
      university: institutions.filter((inst) => inst.institution_type === "UNIVERSITY").length,
      researchInstitute: institutions.filter((inst) => inst.institution_type === "RESEARCH_INSTITUTE").length,
      governmentLab: institutions.filter((inst) => inst.institution_type === "GOVERNMENT_LAB").length,
      privateRnd: institutions.filter((inst) => inst.institution_type === "PRIVATE_RND").length,
      internationalOrg: institutions.filter((inst) => inst.institution_type === "INTERNATIONAL_ORG").length,
    };
  }, [institutions, pagination.total]);

  //
  const getInstitutionTypeLabel = (type: InstitutionType) => {
    const typeLabels = {
      UNIVERSITY: "Trường đại học",
      RESEARCH_INSTITUTE: "Viện nghiên cứu",
      GOVERNMENT_LAB: "Phòng thí nghiệm chính phủ",
      PRIVATE_RND: "R&D tư nhân",
      INTERNATIONAL_ORG: "Tổ chức quốc tế",
    };
    return typeLabels[type];
  };

  // Get institution type color
  const getInstitutionTypeColor = (type: InstitutionType) => {
    const typeColors = {
      UNIVERSITY: "blue",
      RESEARCH_INSTITUTE: "green",
      GOVERNMENT_LAB: "orange",
      PRIVATE_RND: "purple",
      INTERNATIONAL_ORG: "cyan",
    };
    return typeColors[type];
  };

  // Table columns configuration
  const columns: ColumnsType<ResearchInstitution> = [
    {
      title: "Thông tin viện",
      key: "institution_info",
      width: 350,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>
            {record.institution_name}
          </div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 2 }}>
            <BankOutlined style={{ marginRight: 4 }} />
            Mã: {record.institution_code}
          </div>
          <div style={{ fontSize: 12, color: "#666" }}>
            Cơ quan quản lý: {record.governing_body}
          </div>
        </div>
      ),
    },
    {
      title: "Loại hình",
      dataIndex: "institution_type",
      key: "institution_type",
      width: 150,
      render: (type: InstitutionType) => (
        <Tag color={getInstitutionTypeColor(type)}>
          {getInstitutionTypeLabel(type)}
        </Tag>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact_info",
      width: 200,
      render: (_, record) => (
        <div>
          {record.contact_info?.contact_email && (
            <div style={{ fontSize: 12, color: "#666", marginBottom: 2 }}>
              <MailOutlined style={{ marginRight: 4 }} />
              {record.contact_info.contact_email}
            </div>
          )}
          {record.contact_info?.contact_phone && (
            <div style={{ fontSize: 12, color: "#666", marginBottom: 2 }}>
              <PhoneOutlined style={{ marginRight: 4 }} />
              {record.contact_info.contact_phone}
            </div>
          )}
          {record.contact_info?.website && (
            <div style={{ fontSize: 12, color: "#666" }}>
              <GlobalOutlined style={{ marginRight: 4 }} />
              <a href={record.contact_info.website} target="_blank" rel="noopener noreferrer">
                Website
              </a>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      width: 100,
      render: (active: boolean) => (
        <Tag
          icon={active ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={active ? "green" : "red"}
        >
          {active ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
  ];

  // Handle search
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  // Handle filter changes
  const handleTypeFilter = (value: InstitutionType | undefined) => {
    setTypeFilter(value);
    setPage(1);
  };

  const handleActiveFilter = (value: boolean | undefined) => {
    setActiveFilter(value);
    setPage(1);
  };

  // Handle export
  const handleExport = () => {
    message.info("Chức năng xuất dữ liệu sẽ được phát triển trong phiên bản tiếp theo");
  };

  // Handle refresh
  const handleRefresh = () => {
    refetch();
    message.success("Đã làm mới dữ liệu");
  };

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setTypeFilter(undefined);
    setActiveFilter(undefined);
    setPage(1);
  };

  if (error) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        <Content style={{ padding: "24px" }}>
          <Card>
            <div style={{ textAlign: "center", padding: "40px" }}>
              <CloseCircleOutlined style={{ fontSize: 48, color: "#ff4d4f", marginBottom: 16 }} />
              <Title level={4} style={{ color: "#ff4d4f" }}>
                Không thể tải dữ liệu
              </Title>
              <Text type="secondary">{error}</Text>
              <br />
              <Button type="primary" icon={<ReloadOutlined />} onClick={handleRefresh} style={{ marginTop: 16 }}>
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
            <BankOutlined style={{ color: "#1890ff" }} />
            Danh sách các viện nghiên cứu
          </Title>
          <Text type="secondary">
            Quản lý thông tin các viện nghiên cứu, trường đại học và tổ chức nghiên cứu
          </Text>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tổng số viện"
                value={statistics.total}
                prefix={<BankOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Đang hoạt động"
                value={statistics.active}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Trường đại học"
                value={statistics.university}
                prefix={<BankOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Viện nghiên cứu"
                value={statistics.researchInstitute}
                prefix={<BankOutlined />}
                valueStyle={{ color: "#52c41a" }}
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
                placeholder="Tìm theo tên, mã viện, cơ quan quản lý..."
                allowClear
                style={{ width: 300 }}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                onSearch={handleSearch}
                prefix={<SearchOutlined />}
              />
              <Select
                placeholder="Lọc theo loại hình"
                allowClear
                style={{ width: 180 }}
                value={typeFilter}
                onChange={handleTypeFilter}
              >
                <Option value="UNIVERSITY">Trường đại học</Option>
                <Option value="RESEARCH_INSTITUTE">Viện nghiên cứu</Option>
                <Option value="GOVERNMENT_LAB">PTN Chính phủ</Option>
                <Option value="PRIVATE_RND">R&D Tư nhân</Option>
                <Option value="INTERNATIONAL_ORG">Tổ chức quốc tế</Option>
              </Select>
              <Select
                placeholder="Trạng thái hoạt động"
                allowClear
                style={{ width: 160 }}
                value={activeFilter}
                onChange={handleActiveFilter}
              >
                <Option value={true}>Đang hoạt động</Option>
                <Option value={false}>Không hoạt động</Option>
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
                <Button
                  icon={<ExportOutlined />}
                  onClick={handleExport}
                />
              </Tooltip>
            </Space>
          </div>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={institutions}
            rowKey={(record) => record.id || record.institution_code}
            loading={loading}
            pagination={{
              current: page,
              pageSize: limit,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} viện nghiên cứu`,
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