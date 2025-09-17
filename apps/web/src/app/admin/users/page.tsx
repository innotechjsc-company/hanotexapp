import { Metadata } from "next";
import { redirect } from "next/navigation";
import UserManagement from "@/components/admin/UserManagement";
import { useIsAuthenticated, useUser } from "@/store/auth";

export const metadata: Metadata = {
  title: "User Management - Admin Panel",
  description: "HANOTEX User Management",
};

export default async function AdminUsersPage() {
  const isAuthenticated = await useIsAuthenticated();
  const user = await useUser();

  if (
    !isAuthenticated ||
    !["ADMIN", "SUPER_ADMIN"].includes(user?.role || "")
  ) {
    redirect("/auth/login");
  }

  return <UserManagement />;
}
