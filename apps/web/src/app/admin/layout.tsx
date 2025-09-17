import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export const metadata: Metadata = {
  title: 'Admin Panel - HANOTEX',
  description: 'HANOTEX Admin Panel - Quản lý hệ thống',
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
  const session = await getServerSession(authOptions);

  if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={session.user} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
