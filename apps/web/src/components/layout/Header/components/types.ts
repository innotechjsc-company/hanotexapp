import type { ElementType } from "react";

export type MenuSubItem = {
  name: string;
  href: string;
};

export type MenuItem = {
  name: string;
  href: string;
  icon?: ElementType<any>;
  submenu?: MenuSubItem[];
};

export type UserMenuItem = {
  name: string;
  href?: string;
  action?: () => void;
};

