import { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { useIsAuthenticated, useUser } from "@/store/auth";

export const metadata: Metadata = {
  title: "Admin Panel - HANOTEX",
  description: "HANOTEX Admin Panel - Quản lý hệ thống",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();

  if (
    !isAuthenticated ||
    !["ADMIN", "SUPER_ADMIN"].includes(user?.role || "")
  ) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
