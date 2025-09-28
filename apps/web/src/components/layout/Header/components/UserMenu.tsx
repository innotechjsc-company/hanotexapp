"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, Badge, Button, Dropdown, Menu, Spin } from "antd";
import type { MenuProps } from "antd";
import { Bell, Search as SearchIcon } from "lucide-react";
import { getUserIconByType, userMenuItemsBase } from "./constants";
import { UserType } from "@/types";
import { useUser } from "@/store/auth";
import { getNotifications } from "@/api/noti";
import { Notification } from "@/types/notification";
import NotificationItem from "./NotificationItem";

type Props = {
  user?: {
    full_name?: string;
    email?: string;
    user_type?: string;
  } | null;
  onLogout: () => void;
  onOpenSearch: () => void;
};

function getUserType(type: UserType) {
  switch (type) {
    case "INDIVIDUAL":
      return "Cá nhân";
    case "COMPANY":
      return "Công ty";
    case "RESEARCH_INSTITUTION":
      return "Viện nghiên cứu";
  }
}
export default function UserMenu({ onLogout, onOpenSearch }: Props) {
  const router = useRouter();
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notificationTab, setNotificationTab] = useState<"system" | "other">(
    "other"
  );

  const user = useUser();

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await getNotifications(
        { user: user.id },
        { limit: 100 }
      );
      setNotifications(response.docs || []);
    } catch (err) {
      setError("Không thể tải thông báo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isNotiOpen) {
      fetchNotifications();
    }
  }, [isNotiOpen, fetchNotifications]);

  // Tải thông báo khi component mount để hiển thị số lượng chưa đọc
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Gọi fetchNotifications cứ 10 giây một lần
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000); // 10 giây

    // Cleanup interval khi component unmount
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const systemNotifications = notifications.filter((n) => n.type === "system");
  const otherNotifications = notifications.filter((n) => n.type !== "system");

  // Tính số lượng thông báo chưa đọc
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const DisplayIcon = getUserIconByType(user?.user_type);

  return (
    <div className="flex items-center gap-1">
      {/* Search */}
      <Button
        type="text"
        icon={<SearchIcon className="h-5 w-5" />}
        onClick={onOpenSearch}
        aria-label="Tìm kiếm"
      />

      {/* Notifications */}
      <Dropdown
        placement="bottomRight"
        onOpenChange={setIsNotiOpen}
        dropdownRender={() => (
          <div className="w-96 bg-white rounded-lg shadow-lg border">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Thông báo
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setNotificationTab("other")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    notificationTab === "other"
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  Hệ thống
                </button>
                <button
                  onClick={() => setNotificationTab("system")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    notificationTab === "system"
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  Khác
                </button>
              </div>
            </div>
            <div className="p-2 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="text-center text-gray-500 p-4">
                  <Spin size="small" /> Đang tải...
                </div>
              ) : error ? (
                <div className="text-center text-red-500 p-4">{error}</div>
              ) : (
                <>
                  {notificationTab === "system" && (
                    <>
                      {systemNotifications.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p className="text-sm">Không có thông báo hệ thống</p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {systemNotifications.map((n) => (
                            <NotificationItem key={n.id} notification={n} />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  {notificationTab === "other" && (
                    <>
                      {otherNotifications.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p className="text-sm">Không có thông báo khác</p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {otherNotifications.map((n) => (
                            <NotificationItem key={n.id} notification={n} />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      >
        <Badge count={unreadCount} size="small">
          <Button
            type="text"
            icon={<Bell className="h-5 w-5" />}
            aria-label="Thông báo"
          />
        </Badge>
      </Dropdown>

      {/* User dropdown */}
      <Dropdown
        placement="bottomRight"
        dropdownRender={() => (
          <div className="w-64 bg-white rounded-lg shadow-lg border">
            <Menu
              items={[
                {
                  key: "profile-info",
                  type: "group",
                  label: (
                    <div className="flex items-center gap-3 py-2">
                      <Avatar
                        style={{ backgroundColor: "#1890ff" }}
                        icon={<DisplayIcon className="h-5 w-5" />}
                        size="small"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold truncate">
                          {user?.full_name || "Người dùng"}
                        </span>
                        <span className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                  ),
                },
                ...userMenuItemsBase.map((item) => ({
                  key: item.href!,
                  label: (
                    <Link href={item.href!} className="block">
                      {item.name}
                    </Link>
                  ),
                })),
                {
                  type: "divider",
                },
                {
                  key: "logout",
                  label: <span className="text-red-500">Đăng xuất</span>,
                  onClick: onLogout,
                },
              ]}
              onClick={({ key }) => {
                if (key === "logout") {
                  onLogout();
                  return;
                }
                if (typeof key === "string" && key !== "profile-info") {
                  router.push(key);
                }
              }}
            />
          </div>
        )}
      >
        <Button type="text" className="px-2">
          <div className="flex items-center gap-3">
            <Avatar
              style={{ backgroundColor: "#1890ff" }}
              icon={<DisplayIcon className="h-5 w-5" />}
              size="small"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-semibold truncate">
                {user?.full_name || "Người dùng"}
              </span>
              <span className="text-xs text-gray-500 capitalize truncate">
                {getUserType(user?.user_type as UserType)}
              </span>
            </div>
          </div>
        </Button>
      </Dropdown>
    </div>
  );
}
