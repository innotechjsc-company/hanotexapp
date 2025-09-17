import { Metadata } from "next";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { useIsAuthenticated, useUser } from "@/store/auth";

export const metadata: Metadata = {
  title: "Dashboard - Admin Panel",
  description: "HANOTEX Admin Dashboard",
};

export default async function AdminPage() {
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();

  if (
    !isAuthenticated ||
    !["ADMIN", "SUPER_ADMIN"].includes(user?.role || "")
  ) {
    return <div>Unauthorized</div>;
  }

  return <AdminDashboard />;
}
