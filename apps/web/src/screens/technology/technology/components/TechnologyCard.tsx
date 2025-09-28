"use client";

import { Card, Button, Tag, Typography, Space, Tooltip } from "antd";
import Link from "next/link";
import type { ViewMode } from "../hooks/useTechnologyList";
import { Technology } from "@/types";

const { Text, Paragraph } = Typography;

interface TechnologyCardProps {
  item: Technology;
  viewMode: ViewMode;
  trlChipColor: (level?: number) => "default" | "warning" | "success";
  statusChipColor: (status?: string) => "success" | "warning" | "default";
}

// Helper function to convert chip colors to Ant Design Tag colors
function getAntdTagColor(color: "default" | "warning" | "success"): string {
  switch (color) {
    case "success":
      return "green";
    case "warning":
      return "orange";
    case "default":
    default:
      return "blue";
  }
}

function getCategoryName(item: any): string | undefined {
  return (
    item?.category_name ||
    (item?.category &&
      typeof item.category === "object" &&
      item.category.name) ||
    undefined
  );
}

function getOwnerName(item: any): string | undefined {
  if (item?.owner?.name) return item.owner.name;
  if (Array.isArray(item?.owners) && item.owners[0]?.owner_name)
    return item.owners[0].owner_name;
  return undefined;
}

function getTerritoryInfo(item: any): string | undefined {
  // Try to get territory/scope information
  const protectionScope = item?.legal_certification?.protection_scope;
  if (Array.isArray(protectionScope) && protectionScope.length > 0) {
    return protectionScope.map((scope: any) => scope.scope).join(", ");
  }
  return undefined;
}

function getOwnerType(item: any): string | undefined {
  if (Array.isArray(item?.owners) && item.owners[0]?.owner_type) {
    const ownerType = item.owners[0].owner_type;
    const typeMap: Record<string, string> = {
      'individual': 'Cá nhân',
      'company': 'Doanh nghiệp',
      'research_institution': 'Viện/Trường'
    };
    return typeMap[ownerType] || ownerType;
  }
  return undefined;
}

function getUpdatedAt(item: any): string | undefined {
  const date =
    item?.updated_at || item?.updatedAt || item?.created_at || item?.createdAt;
  return date ? new Date(date).toLocaleDateString("vi-VN") : undefined;
}

function getPricing(item: any) {
  const price =
    item?.asking_price ??
    item?.pricing?.asking_price ??
    item?.pricing?.price_from;
  const currency = item?.currency ?? item?.pricing?.currency;
  const type = item?.pricing_type ?? item?.pricing?.pricing_type;
  return { price, currency, type } as {
    price?: number;
    currency?: string;
    type?: string;
  };
}

function getThumb(item: any): string | undefined {
  // Try common fields: cover, image, documents[0]
  const cover = item?.cover?.url || item?.cover?.src;
  const image = item?.image?.url || item?.image?.src;
  const doc0 = Array.isArray(item?.documents)
    ? item.documents[0]?.url || item.documents[0]?.src
    : undefined;
  return (cover || image || doc0) as string | undefined;
}

export default function TechnologyCard({
  item,
  viewMode,
  trlChipColor,
  statusChipColor,
}: TechnologyCardProps) {
  const normalizedStatus = String(item?.status ?? "").toUpperCase();
  const categoryName = getCategoryName(item);
  const ownerName = getOwnerName(item);
  const ownerType = getOwnerType(item);
  const territoryInfo = getTerritoryInfo(item);
  const { price, currency } = getPricing(item);
  const thumb = getThumb(item);
  const href = item?.id ? `/technologies/${item.id}` : "#";

  const StatusLabel =
    normalizedStatus === "ACTIVE"
      ? "Sẵn sàng"
      : normalizedStatus === "PENDING"
        ? "Chờ duyệt"
        : (item?.status ?? "");

  const formattedPrice = price
    ? new Intl.NumberFormat("vi-VN").format(Number(price))
    : null;

  if (viewMode === "list") {
    return (
      <Card
        hoverable
        className="w-full overflow-hidden"
        bodyStyle={{ padding: 16 }}
      >
        <Space direction="vertical" size="middle" className="w-full">
          {/* Tags Row */}
          <div className="flex flex-col gap-2">
            {/* Category Tag */}
            <div className="flex justify-start">
              {categoryName && (
                <Tooltip title={categoryName}>
                  <Tag color="blue" className="max-w-full">
                    <Text
                      ellipsis={{ tooltip: true }}
                      style={{ maxWidth: 200, margin: 0 }}
                    >
                      {categoryName}
                    </Text>
                  </Tag>
                </Tooltip>
              )}
            </div>
            
            {/* Status, TRL and Owner Tags */}
            <div className="flex justify-between items-center gap-2">
              <Space wrap>
                <Tag color={getAntdTagColor(statusChipColor(item.status))}>
                  {StatusLabel}
                </Tag>
                {item.trl_level && (
                  <Tag color={getAntdTagColor(trlChipColor(Number(item.trl_level)))}>
                    TRL {item.trl_level}
                  </Tag>
                )}
                {ownerType && (
                  <Tag color="default">
                    {ownerType}
                  </Tag>
                )}
              </Space>
              {ownerName && (
                <Tooltip title={ownerName}>
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, maxWidth: 150 }}
                    ellipsis
                  >
                    {ownerName}
                  </Text>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Title */}
          <Text strong style={{ fontSize: 16, lineHeight: '1.4' }}>
            <Link href={href} className="hover:text-blue-600 transition-colors">
              <Tooltip title={item.title}>
                <Text
                  ellipsis={{ rows: 2, tooltip: true }}
                  style={{ margin: 0, fontWeight: 600 }}
                >
                  {item.title}
                </Text>
              </Tooltip>
            </Link>
          </Text>

          {/* Description */}
          {item.description && (
            <Paragraph
              type="secondary"
              ellipsis={{ rows: 2, tooltip: true }}
              style={{ marginBottom: 8 }}
            >
              {item.description}
            </Paragraph>
          )}

          {/* Territory Information */}
          {territoryInfo && (
            <div>
              <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                Phạm vi áp dụng:
              </Text>
              <Tooltip title={territoryInfo}>
                <Text
                  type="secondary"
                  style={{ fontSize: 12 }}
                  ellipsis
                >
                  {territoryInfo}
                </Text>
              </Tooltip>
            </div>
          )}

          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <div>
              {formattedPrice ? (
                <Text strong style={{ color: '#1890ff' }}>
                  {formattedPrice} {currency}
                </Text>
              ) : (
                <Text type="secondary">
                  Thương lượng
                </Text>
              )}
            </div>
            <Link href={href}>
              <Button type="primary" size="small">
                Xem chi tiết
              </Button>
            </Link>
          </div>
        </Space>
      </Card>
    );
  }

  // Grid mode
  return (
    <Card
      hoverable
      className="h-full overflow-hidden"
      style={{ 
        height: 380, // Fixed height for consistent card layout
        display: 'flex',
        flexDirection: 'column'
      }}
      bodyStyle={{
        padding: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Main Content Area */}
      <div 
        style={{
          padding: 16,
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Tags Section */}
        <div className="flex flex-col gap-2 mb-3">
          {/* Category and Status Row */}
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              {categoryName && (
                <Tooltip title={categoryName}>
                  <Tag color="blue" className="w-full text-center">
                    <Text
                      ellipsis={{ tooltip: true }}
                      style={{ maxWidth: '100%', margin: 0 }}
                    >
                      {categoryName}
                    </Text>
                  </Tag>
                </Tooltip>
              )}
            </div>
            <div className="flex-shrink-0">
              <Tag color={getAntdTagColor(statusChipColor(item.status))}>
                {StatusLabel}
              </Tag>
            </div>
          </div>
          
          {/* TRL and Owner Type Row */}
          <div className="flex justify-start items-center gap-2">
            <Space size="small" wrap>
              {item.trl_level && (
                <Tag color={getAntdTagColor(trlChipColor(item.trl_level))}>
                  TRL {item.trl_level}
                </Tag>
              )}
              {ownerType && (
                <Tag color="default">
                  {ownerType}
                </Tag>
              )}
            </Space>
          </div>
        </div>

        {/* Title */}
        <div style={{ minHeight: 48, marginBottom: 12 }}>
          <Link href={href} className="hover:text-blue-600 transition-colors">
            <Tooltip title={item.title}>
              <Text
                strong
                style={{ 
                  fontSize: 16,
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  margin: 0
                }}
              >
                {item.title}
              </Text>
            </Tooltip>
          </Link>
        </div>

        {/* Description - Flexible height */}
        <div style={{ flex: 1, marginBottom: 12 }}>
          {item.description && (
            <Paragraph
              type="secondary"
              ellipsis={{ rows: 3, tooltip: true }}
              style={{ marginBottom: 0, fontSize: 14 }}
            >
              {item.description}
            </Paragraph>
          )}
        </div>

        {/* Additional Information */}
        <div style={{ minHeight: 40 }}>
          <Space direction="vertical" size="small" className="w-full">
            {ownerName && (
              <div>
                <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                  Đơn vị sở hữu:
                </Text>
                <Tooltip title={ownerName}>
                  <Text
                    style={{ fontSize: 12 }}
                    ellipsis
                  >
                    {ownerName}
                  </Text>
                </Tooltip>
              </div>
            )}
            
            {territoryInfo && (
              <div>
                <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                  Phạm vi áp dụng:
                </Text>
                <Tooltip title={territoryInfo}>
                  <Text
                    style={{ fontSize: 12 }}
                    ellipsis
                  >
                    {territoryInfo}
                  </Text>
                </Tooltip>
              </div>
            )}
          </Space>
        </div>
      </div>

      {/* Fixed Footer with Price and Action - Always at bottom */}
      <div 
        style={{
          padding: '12px 16px',
          borderTop: '1px solid #f0f0f0',
          backgroundColor: '#fafafa',
          marginTop: 'auto'
        }}
        className="flex items-center justify-between"
      >
        <div className="min-w-0 flex-1">
          {formattedPrice ? (
            <Text strong style={{ color: '#1890ff' }}>
              <Tooltip title={`${formattedPrice} ${currency}`}>
                <span style={{ 
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {formattedPrice} {currency}
                </span>
              </Tooltip>
            </Text>
          ) : (
            <Text type="secondary">
              Thương lượng
            </Text>
          )}
        </div>
        <Link href={href}>
          <Button type="primary" size="small">
            Chi tiết
          </Button>
        </Link>
      </div>
    </Card>
  );
}
