'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { NextAuthUser } from '@/types';

interface AdminHeaderProps {
  user: NextAuthUser;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-sm text-gray-600">New technology submitted for review</p>
                      <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                    </div>
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-sm text-gray-600">User verification pending</p>
                      <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600">System backup completed</p>
                      <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
