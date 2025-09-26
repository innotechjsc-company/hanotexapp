"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import SearchModal from "@/components/ui/SearchModal";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
} from "@heroui/react";

import Logo from "./components/Logo";
import DesktopNav from "./components/DesktopNav";
import AuthButtons from "./components/AuthButtons";
import UserMenu from "./components/UserMenu";
import MobileMenu from "./components/MobileMenu";
import { mainMenuItems } from "./components/constants";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50">
      <Navbar
        isBordered
        maxWidth="2xl"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className="bg-white/90 backdrop-blur-md"
      >
        <NavbarContent justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
            className="lg:hidden"
          />
          <NavbarBrand>
            <Logo />
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent justify="center" className="hidden lg:flex">
          <DesktopNav items={mainMenuItems} isActive={isActive} />
        </NavbarContent>

        <NavbarContent justify="end" className="gap-2">
          {isAuthenticated ? (
            <UserMenu
              user={user}
              onLogout={logout}
              onOpenSearch={() => setIsSearchModalOpen(true)}
            />
          ) : (
            <AuthButtons />
          )}
        </NavbarContent>

        <NavbarMenu>
          <MobileMenu
            items={mainMenuItems}
            isActive={isActive}
            onItemClick={() => setIsMenuOpen(false)}
          />
        </NavbarMenu>
      </Navbar>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </header>
  );
}
