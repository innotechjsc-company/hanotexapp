import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import UserManagement from '@/components/admin/UserManagement';

export const metadata: Metadata = {
  title: 'User Management - Admin Panel',
  description: 'HANOTEX User Management',
};

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    redirect('/auth/login');
  }

  return <UserManagement />;
}
