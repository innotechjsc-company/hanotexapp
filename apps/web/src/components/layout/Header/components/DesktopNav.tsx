"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import type { MenuItem } from "./types";

type Props = {
  items: MenuItem[];
  isActive: (href: string) => boolean;
};

export default function DesktopNav({ items, isActive }: Props) {
  const router = useRouter();

  return (
    <NavbarContent className="hidden lg:flex gap-2" justify="center">
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        if (item.submenu?.length) {
          return (
            <NavbarItem key={item.name} className="relative">
              <Dropdown>
                <DropdownTrigger>
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
                        className="h-4 w-4"
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
                </DropdownTrigger>
                <DropdownMenu
                  aria-label={item.name}
                  onAction={(key) => {
                    if (typeof key === "string") router.push(key);
                  }}
                  className="max-w-64"
                >
                  {item.submenu.map((sub) => (
                    <DropdownItem key={sub.href} textValue={sub.name}>
                      <Link className="w-full block" href={sub.href}>
                        {sub.name}
                      </Link>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          );
        }

        return (
          <NavbarItem key={item.name} isActive={active}>
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
          </NavbarItem>
        );
      })}
    </NavbarContent>
  );
}

