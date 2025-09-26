"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { Bell, Search as SearchIcon } from "lucide-react";
import { getUserIconByType, userMenuItemsBase } from "./constants";
import { UserType } from "@/types";
import { useUser } from "@/store/auth";

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
  const [notificationTab, setNotificationTab] = useState<"unread" | "read">(
    "unread"
  );

  const user = useUser();
  const DisplayIcon = getUserIconByType(user?.user_type);

  const menuItems: Array<
    | { key: string; kind: "header" }
    | { key: string; kind: "link"; name: string; href: string }
    | { key: string; kind: "logout" }
  > = [
    { key: "profile-info", kind: "header" as const },
    ...userMenuItemsBase.map((i) => ({
      key: i.href!,
      kind: "link" as const,
      name: i.name,
      href: i.href!,
    })),
    { key: "logout", kind: "logout" as const },
  ];

  return (
    <div className="flex items-center gap-1">
      {/* Search */}
      <Button
        isIconOnly
        variant="light"
        aria-label="Tìm kiếm"
        onPress={onOpenSearch}
      >
        <SearchIcon className="h-5 w-5" />
      </Button>

      {/* Notifications */}
      <Dropdown placement="bottom-end">
        <Badge content="" color="danger" shape="circle" placement="top-right">
          <DropdownTrigger>
            <Button isIconOnly variant="light" aria-label="Thông báo">
              <Bell className="h-5 w-5" />
            </Button>
          </DropdownTrigger>
        </Badge>
        <DropdownMenu
          aria-label="Notifications"
          className="w-96"
          closeOnSelect={false}
        >
          <DropdownItem key="header" isReadOnly className="h-auto p-0">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Thông báo
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setNotificationTab("unread")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    notificationTab === "unread"
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  Thông báo hệ thống
                </button>
                <button
                  onClick={() => setNotificationTab("read")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    notificationTab === "read"
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  Thông báo khác
                </button>
              </div>
            </div>
          </DropdownItem>
          <DropdownItem key="content" isReadOnly className="h-auto p-0">
            <div className="p-4 max-h-96 overflow-y-auto">
              {notificationTab === "unread" ? (
                <div className="text-center text-gray-500 py-8">
                  <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">Không có thông báo chưa đọc</p>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">Không có thông báo đã đọc</p>
                </div>
              )}
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {/* User dropdown */}
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button variant="light" className="px-2">
            <div className="flex items-center gap-3">
              <Avatar
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                icon={<DisplayIcon className="h-5 w-5" />}
                size="sm"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-sm font-semibold truncate">
                  {user?.full_name || "Người dùng"}
                </span>
                <span className="text-xs text-default-500 capitalize truncate">
                  {getUserType(user?.user_type as UserType)}
                </span>
              </div>
            </div>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="User menu"
          className="w-64"
          items={menuItems}
          onAction={(key) => {
            if (key === "logout") {
              onLogout();
              return;
            }
            if (typeof key === "string") router.push(key);
          }}
        >
          {(item) => {
            if (item.kind === "header") {
              return (
                <DropdownItem key={item.key} isReadOnly className="h-14 gap-2">
                  <div className="flex items-center gap-3">
                    <Avatar
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                      icon={<DisplayIcon className="h-5 w-5" />}
                      size="sm"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold truncate">
                        {user?.full_name || "Người dùng"}
                      </span>
                      <span className="text-xs text-default-500 truncate">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                </DropdownItem>
              );
            }

            if (item.kind === "link") {
              return (
                <DropdownItem key={item.key} textValue={item.name}>
                  <Link className="w-full block" href={item.href}>
                    {item.name}
                  </Link>
                </DropdownItem>
              );
            }

            return (
              <DropdownItem
                key={item.key}
                className="text-danger hover:bg-danger/10"
              >
                Đăng xuất
              </DropdownItem>
            );
          }}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
