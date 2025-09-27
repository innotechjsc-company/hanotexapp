"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
} from "@heroui/react";
import Link from "next/link";
import type { ViewMode } from "../hooks/useTechnologyList";
import { Technology } from "@/types";

interface TechnologyCardProps {
  item: Technology;
  viewMode: ViewMode;
  trlChipColor: (level?: number) => "default" | "warning" | "success";
  statusChipColor: (status?: string) => "success" | "warning" | "default";
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
        shadow="sm"
        className="w-full overflow-hidden hover:shadow-lg transition-all"
      >
        <div className="flex flex-col sm:flex-row">
          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            {/* Header with chips - improved layout */}
            <div className="flex flex-col gap-2 mb-3">
              {/* First row: Category only */}
              <div className="flex justify-start">
                {categoryName && (
                  <Chip 
                    size="sm" 
                    variant="flat" 
                    color="primary"
                    className="max-w-full"
                  >
                    <span className="truncate block" title={categoryName}>
                      {categoryName}
                    </span>
                  </Chip>
                )}
              </div>
              
              {/* Second row: Status, TRL and Owner info */}
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <Chip
                    size="sm"
                    variant="flat"
                    color={statusChipColor(item.status)}
                    className="whitespace-nowrap"
                  >
                    {StatusLabel}
                  </Chip>
                  {item.trl_level && (
                    <Chip
                      size="sm"
                      variant="flat"
                      color={trlChipColor(Number(item.trl_level))}
                    >
                      TRL {item.trl_level}
                    </Chip>
                  )}
                  {ownerType && (
                    <span className="text-xs text-default-500 bg-default-100 px-2 py-1 rounded">
                      {ownerType}
                    </span>
                  )}
                </div>
                {ownerName && (
                  <span className="text-xs text-default-600 truncate max-w-[150px]" title={ownerName}>
                    {ownerName}
                  </span>
                )}
              </div>
            </div>

            <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
              <Link
                href={href}
                className="hover:text-primary transition-colors"
              >
                {item.title}
              </Link>
            </h3>

            {item.description && (
              <p className="text-sm text-default-600 mb-3 line-clamp-2">
                {item.description}
              </p>
            )}

            {/* Territory information */}
            {territoryInfo && (
              <div className="mb-3">
                <p className="text-xs text-default-500 mb-1">Phạm vi áp dụng:</p>
                <p className="text-xs text-default-600 line-clamp-1" title={territoryInfo}>
                  {territoryInfo}
                </p>
              </div>
            )}

            <div className="flex items-end justify-between mt-auto">
              <div className="min-w-0">
                {formattedPrice ? (
                  <p className="font-bold text-primary truncate">
                    {formattedPrice} {currency}
                  </p>
                ) : (
                  <p className="text-sm font-medium text-default-600">
                    Thương lượng
                  </p>
                )}
              </div>
              <Button as={Link} href={href} color="primary" size="sm">
                Xem chi tiết
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid mode
  return (
    <Card
      shadow="sm"
      className="h-full overflow-hidden hover:shadow-lg transition-all flex flex-col"
    >
      <CardBody className="p-4 flex-1">
        {/* Header with chips - improved layout */}
        <div className="flex flex-col gap-2 mb-3">
          {/* First row: Category and Status */}
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0" style={{ maxWidth: 'calc(100% - 90px)' }}>
              {categoryName && (
                <Chip
                  size="sm"
                  variant="flat"
                  color="primary"
                  className="w-full"
                >
                  <span className="truncate block" title={categoryName}>
                    {categoryName}
                  </span>
                </Chip>
              )}
            </div>
            <div className="flex-shrink-0" style={{ minWidth: '70px' }}>
              <Chip
                size="sm"
                variant="flat"
                color={statusChipColor(item.status)}
                className="whitespace-nowrap w-full"
              >
                {StatusLabel}
              </Chip>
            </div>
          </div>
          
          {/* Second row: TRL and Owner info */}
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              {item.trl_level && (
                <Chip size="sm" variant="flat" color={trlChipColor(item.trl_level)}>
                  TRL {item.trl_level}
                </Chip>
              )}
              {ownerType && (
                <span className="text-xs text-default-500 bg-default-100 px-2 py-1 rounded">
                  {ownerType}
                </span>
              )}
            </div>
          </div>
        </div>

        <h3 className="font-semibold text-foreground line-clamp-2 mb-2 min-h-[2.5rem]">
          <Link href={href} className="hover:text-primary transition-colors">
            {item.title}
          </Link>
        </h3>

        {item.description && (
          <p className="text-sm text-default-600 mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Additional info */}
        <div className="space-y-2 mb-3">
          {ownerName && (
            <div>
              <p className="text-xs text-default-500 mb-1">Đơn vị sở hữu:</p>
              <p className="text-xs text-default-600 truncate" title={ownerName}>
                {ownerName}
              </p>
            </div>
          )}
          
          {territoryInfo && (
            <div>
              <p className="text-xs text-default-500 mb-1">Phạm vi áp dụng:</p>
              <p className="text-xs text-default-600 line-clamp-1" title={territoryInfo}>
                {territoryInfo}
              </p>
            </div>
          )}
        </div>
      </CardBody>
      <CardFooter className="p-4 flex items-center justify-between bg-content2">
        <div className="min-w-0">
          {formattedPrice ? (
            <p className="font-bold text-primary truncate">
              {formattedPrice} {currency}
            </p>
          ) : (
            <p className="text-sm font-medium text-default-600">Thương lượng</p>
          )}
        </div>
        <Button as={Link} href={href} color="primary" size="sm">
          Chi tiết
        </Button>
      </CardFooter>
    </Card>
  );
}
