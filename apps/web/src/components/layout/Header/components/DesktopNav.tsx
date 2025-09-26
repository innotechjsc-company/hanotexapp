"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";
import type { MenuItem } from "./types";

type Props = {
  items: MenuItem[];
  isActive: (href: string) => boolean;
};

export default function DesktopNav({ items, isActive }: Props) {
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  return (
    <NavbarContent className="hidden lg:flex gap-2" justify="center">
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        const isHovered = hoveredItem === item.name;

        if (item.submenu?.length) {
          return (
            <NavbarItem key={item.name} className="relative">
              <div
                className="relative"
                onMouseEnter={() => {
                  if (hoverTimeout) {
                    clearTimeout(hoverTimeout);
                    setHoverTimeout(null);
                  }
                  setHoveredItem(item.name);
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => {
                    setHoveredItem(null);
                  }, 150); // 150ms delay
                  setHoverTimeout(timeout);
                }}
              >
                <Button
                  variant={active ? "flat" : "light"}
                  color={active ? "primary" : "default"}
                  className="px-3 py-2 rounded-xl font-semibold"
                  startContent={Icon ? <Icon className="h-5 w-5" /> : null}
                  endContent={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isHovered ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                >
                  {item.name}
                </Button>
                
                {/* Hover Dropdown */}
                {isHovered && (
                  <div className="absolute top-full left-0 w-64 z-50 mt-1">
                    {/* Larger invisible bridge to prevent dropdown from closing */}
                    <div className="h-3 w-full"></div>
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-slide-in-from-top">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150"
                          onClick={() => setHoveredItem(null)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </NavbarItem>
          );
        }

        return (
          <NavbarItem key={item.name} isActive={active} className="relative">
            <div className="relative">
              <Button
                as={Link}
                href={item.href}
                variant={active ? "flat" : "light"}
                color={active ? "primary" : "default"}
                className="px-3 py-2 rounded-xl font-semibold"
                startContent={Icon ? <Icon className="h-5 w-5" /> : null}
              >
                {item.name}
              </Button>
            </div>
          </NavbarItem>
        );
      })}
    </NavbarContent>
  );
}

