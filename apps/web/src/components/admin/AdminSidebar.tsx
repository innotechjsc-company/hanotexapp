'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Gavel, 
  FileText, 
  Settings, 
  BarChart3,
  Shield,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Technologies', href: '/admin/technologies', icon: Building2 },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Auctions', href: '/admin/auctions', icon: Gavel },
  { name: 'Categories', href: '/admin/categories', icon: FileText },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Help', href: '/admin/help', icon: HelpCircle },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className={cn(
      "bg-white shadow-lg transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-xl font-bold text-gray-800">HANOTEX Admin</h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 transition-colors",
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 px-3">
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center px-3 py-2">
              <Shield className="h-5 w-5 text-green-600 mr-3" />
              {!collapsed && (
                <div>
                  <p className="text-sm font-medium text-gray-900">System Status</p>
                  <p className="text-xs text-green-600">All systems operational</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
