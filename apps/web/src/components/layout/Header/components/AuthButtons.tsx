"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { LogIn, UserPlus } from "lucide-react";

export default function AuthButtons() {
  return (
    <div className="flex items-center gap-2">
      <Button
        as={Link}
        href="/auth/login"
        variant="light"
        className="font-semibold"
        startContent={<LogIn className="h-5 w-5" />}
      >
        <span className="hidden sm:inline">Đăng nhập</span>
      </Button>

      <Button
        as={Link}
        href="/auth/register"
        className="font-semibold bg-primary-600 text-white hover:bg-primary-600"
        startContent={<UserPlus className="h-5 w-5" />}
      >
        <span className="hidden sm:inline">Đăng ký</span>
      </Button>
    </div>
  );
}
