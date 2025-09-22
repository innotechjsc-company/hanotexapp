"use client";

import Link from "next/link";
import type { MenuItem } from "./types";

type Props = {
  items: MenuItem[];
  isActive: (href: string) => boolean;
  onItemClick?: () => void;
};

export default function MobileMenu({ items, isActive, onItemClick }: Props) {
  return (
    <nav className="space-y-2 px-2 py-4">
      {items.map((item) => (
        <div key={item.name}>
          <Link
            href={item.href}
            onClick={onItemClick}
            className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              isActive(item.href)
                ? "bg-default-100 text-primary-700"
                : "text-foreground hover:bg-default-50"
            }`}
          >
            {item.icon ? <item.icon className="h-5 w-5 mr-3" /> : null}
            {item.name}
          </Link>

          {item.submenu?.length ? (
            <div className="ml-8 mt-1 space-y-1">
              {item.submenu.map((sub) => (
                <Link
                  key={sub.name}
                  href={sub.href}
                  onClick={onItemClick}
                  className="block px-4 py-2 text-sm text-default-600 hover:text-primary-700 hover:bg-default-50 rounded-lg"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </nav>
  );
}

