'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  Gavel, 
  TrendingUp,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { LineChart, BarChart, DoughnutChart, RevenueChart } from '@/components/ui/Charts';
import { TechnologyMap, UserDistributionMap } from '@/components/ui/Map';

interface DashboardStats {
  totalUsers: number;
  totalTechnologies: number;
  totalAuctions: number;
  totalRevenue: number;
  pendingApprovals: number;
  activeUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalTechnologies: 0,
    totalAuctions: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setStats({
        totalUsers: 1247,
        totalTechnologies: 89,
        totalAuctions: 23,
        totalRevenue: 125000,
        pendingApprovals: 12,
        activeUsers: 892,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Technologies',
      value: stats.totalTechnologies.toLocaleString(),
      icon: Building2,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Auctions',
      value: stats.totalAuctions.toLocaleString(),
      icon: Gavel,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: '+23%',
      changeType: 'positive' as const,
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals.toLocaleString(),
      icon: AlertCircle,
      color: 'bg-red-500',
      change: '-5%',
      changeType: 'negative' as const,
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      icon: Activity,
      color: 'bg-indigo-500',
      change: '+18%',
      changeType: 'positive' as const,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to HANOTEX Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Technologies */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Technologies</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { name: 'AI-Powered Image Recognition', status: 'Pending', time: '2 hours ago' },
                { name: 'Blockchain Supply Chain', status: 'Approved', time: '4 hours ago' },
                { name: 'IoT Smart Agriculture', status: 'Under Review', time: '6 hours ago' },
                { name: 'Machine Learning Analytics', status: 'Approved', time: '1 day ago' },
              ].map((tech, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tech.name}</p>
                    <p className="text-xs text-gray-500">{tech.time}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      tech.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : tech.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {tech.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { service: 'API Server', status: 'Operational', uptime: '99.9%' },
                { service: 'Database', status: 'Operational', uptime: '99.8%' },
                { service: 'File Storage', status: 'Operational', uptime: '100%' },
                { service: 'Email Service', status: 'Operational', uptime: '99.7%' },
                { service: 'Payment Gateway', status: 'Operational', uptime: '99.9%' },
              ].map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{service.service}</p>
                      <p className="text-xs text-gray-500">Uptime: {service.uptime}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {service.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart />
        <BarChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DoughnutChart />
        <RevenueChart />
        <div className="lg:col-span-1">
          <TechnologyMap />
        </div>
      </div>

      <UserDistributionMap />

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <div className="text-center">
                <Building2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Review Technologies</p>
                <p className="text-xs text-gray-500">12 pending</p>
              </div>
            </button>
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
              <div className="text-center">
                <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Manage Users</p>
                <p className="text-xs text-gray-500">5 pending verification</p>
              </div>
            </button>
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <div className="text-center">
                <Gavel className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Monitor Auctions</p>
                <p className="text-xs text-gray-500">3 active</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
