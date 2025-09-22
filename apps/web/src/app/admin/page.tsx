"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { useIsAuthenticated, useUser } from "@/store/auth";
import NoSSR from "@/components/ui/NoSSR";

export const dynamic = "force-dynamic";

function AdminPageContent() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();

  useEffect(() => {
    if (
      !isAuthenticated ||
      !["ADMIN", "SUPER_ADMIN"].includes(user?.role || "")
    ) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, user, router]);

  if (
    !isAuthenticated ||
    !["ADMIN", "SUPER_ADMIN"].includes(user?.role || "")
  ) {
    return <div>Unauthorized</div>;
  }

  return <AdminDashboard />;
}

export default function AdminPage() {
  return (
    <NoSSR fallback={<div>Loading...</div>}>
      <AdminPageContent />
    </NoSSR>
  );
}
