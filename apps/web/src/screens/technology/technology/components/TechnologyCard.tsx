"use client";

import { Button, Card, Tag, Tooltip } from "antd";
import Link from "next/link";
import type { ViewMode } from "../hooks/useTechnologyList";
import { Technology } from "@/types";

interface TechnologyCardProps {
  item: Technology;
  viewMode: ViewMode;
  trlChipColor: (level?: number) => "danger" | "warning" | "success";
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
        className="w-full overflow-hidden transition-all"
        style={{ height: 180, display: "flex", flexDirection: "column" }}
        bodyStyle={{ padding: 12, display: "flex", flexDirection: "column", height: "100%" }}
      >
        <div className="flex h-full flex-col sm:flex-row">
          <div className="flex h-full flex-1 flex-col">
            <div className="mb-1 flex items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {categoryName && (
                  <Tooltip title={categoryName}>
                    <Tag
                      color="blue"
                      style={{
                        maxWidth: 160,
                        display: "inline-block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        padding: "0 6px",
                        fontSize: 12,
                      }}
                    >
                      {categoryName}
                    </Tag>
                  </Tooltip>
                )}
                {item.trl_level && (
                  <Tag
                    color={
                      trlChipColor(Number(item.trl_level)) === "danger"
                        ? "red"
                        : trlChipColor(Number(item.trl_level)) === "warning"
                          ? "orange"
                          : "green"
                    }
                    style={{ padding: "0 6px", fontSize: 12 }}
                  >
                    TRL {item.trl_level}
                  </Tag>
                )}
              </div>
              <Tag
                color={
                  statusChipColor(item.status) === "success"
                    ? "green"
                    : statusChipColor(item.status) === "warning"
                      ? "orange"
                      : "default"
                }
                className="shrink-0"
                style={{ padding: "0 6px", fontSize: 12 }}
              >
                {StatusLabel}
              </Tag>
            </div>

            <h3
              className="mb-1 font-semibold text-foreground"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              } as any}
            >
              <Link href={href} className="transition-colors hover:text-primary">
                {item.title}
              </Link>
            </h3>

            {item.description && (
              <p
                className="mb-3 text-sm text-default-600"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                } as any}
              >
                {item.description}
              </p>
            )}

            <div className="mt-auto flex items-end justify-between">
              <div className="min-w-0">
                {formattedPrice ? (
                  <p className="truncate font-bold text-primary">
                    {formattedPrice} {currency}
                  </p>
                ) : (
                  <p className="text-sm font-medium text-default-600">
                    Thương lượng
                  </p>
                )}
              </div>
              <Link href={href}>
                <Button type="primary" size="small">
                  Xem chi tiết
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid mode
  return (
    <Card
      hoverable
      className="flex flex-col overflow-hidden transition-all"
      style={{ height: 240 }}
      bodyStyle={{ padding: 12, display: "flex", flexDirection: "column", flex: "1 1 auto" }}
    >
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          {categoryName && (
            <Tooltip title={categoryName}>
              <Tag
                color="blue"
                className="max-w-max"
                style={{
                  maxWidth: 160,
                  display: "inline-block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  padding: "0 6px",
                  fontSize: 12,
                }}
              >
                {categoryName}
              </Tag>
            </Tooltip>
          )}
          {item.trl_level && (
            <Tag
              color={
                trlChipColor(Number(item.trl_level)) === "danger"
                  ? "red"
                  : trlChipColor(Number(item.trl_level)) === "warning"
                    ? "orange"
                    : "green"
              }
              style={{ padding: "0 6px", fontSize: 12 }}
            >
              TRL {item.trl_level}
            </Tag>
          )}
        </div>

        <h3
          className="mb-1 min-h-[2.5rem] font-semibold text-foreground"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          } as any}
        >
          <Link href={href} className="transition-colors hover:text-primary">
            {item.title}
          </Link>
        </h3>

        {item.description && (
          <p
            className="min-h-[4.5rem] text-sm text-default-600"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            } as any}
          >
            {item.description}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between bg-gray-50 p-3">
        <div className="min-w-0">
          {formattedPrice ? (
            <p className="truncate font-bold text-primary">
              {formattedPrice} {currency}
            </p>
          ) : (
            <p className="text-sm font-medium text-default-600">Thương lượng</p>
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
