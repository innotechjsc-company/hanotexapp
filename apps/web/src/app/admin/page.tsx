import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Dashboard - Admin Panel',
  description: 'HANOTEX Admin Dashboard',
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    return <div>Unauthorized</div>;
  }

  return <AdminDashboard />;
}
