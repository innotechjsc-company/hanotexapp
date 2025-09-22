"use client";

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
      <Badge content="" color="danger" shape="circle" placement="top-right">
        <Button isIconOnly variant="light" aria-label="Thông báo">
          <Bell className="h-5 w-5" />
        </Button>
      </Badge>

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
