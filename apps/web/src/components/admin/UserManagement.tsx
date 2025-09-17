'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Building,
  UserCheck,
  UserX,
  Download,
  Upload
} from 'lucide-react';
import { createColumnHelper } from '@tanstack/react-table';
import DataTable from '@/components/ui/DataTable';
import { User, UserType, UserRole } from '@/types';

interface UserManagementProps {
  className?: string;
}

const columnHelper = createColumnHelper<User>();

export default function UserManagement({ className = '' }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | ''>('');
  const [filterType, setFilterType] = useState<UserType | ''>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'unverified' | 'active' | 'inactive'>('all');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'john.doe@example.com',
        user_type: 'INDIVIDUAL',
        role: 'USER',
        is_verified: true,
        is_active: true,
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z',
        profile: {
          id: '1',
          user_id: '1',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z',
          full_name: 'John Doe',
          phone: '+84 123 456 789',
          profession: 'Software Engineer',
        }
      },
      {
        id: '2',
        email: 'techcorp@company.com',
        user_type: 'COMPANY',
        role: 'USER',
        is_verified: false,
        is_active: true,
        created_at: '2024-01-20T14:15:00Z',
        updated_at: '2024-01-20T14:15:00Z',
        profile: {
          id: '2',
          user_id: '2',
          created_at: '2024-01-20T14:15:00Z',
          updated_at: '2024-01-20T14:15:00Z',
          company_name: 'TechCorp Vietnam',
          tax_code: '0123456789',
          legal_representative: 'Jane Smith',
          contact_email: 'contact@techcorp.com',
        }
      },
      {
        id: '3',
        email: 'research@university.edu',
        user_type: 'RESEARCH_INSTITUTION',
        role: 'USER',
        is_verified: true,
        is_active: true,
        created_at: '2024-01-25T09:45:00Z',
        updated_at: '2024-01-25T09:45:00Z',
        profile: {
          id: '3',
          user_id: '3',
          created_at: '2024-01-25T09:45:00Z',
          updated_at: '2024-01-25T09:45:00Z',
          institution_name: 'Hanoi University of Technology',
          institution_code: 'HUST001',
          governing_body: 'Ministry of Education',
          research_group: 'AI Research Lab',
        }
      },
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const columns = useMemo(() => [
    columnHelper.accessor('email', {
      header: 'Email',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.original.email}</p>
            <p className="text-sm text-gray-500">
              {row.original.user_type === 'INDIVIDUAL' && (row.original.profile as any)?.full_name}
              {row.original.user_type === 'COMPANY' && (row.original.profile as any)?.company_name}
              {row.original.user_type === 'RESEARCH_INSTITUTION' && (row.original.profile as any)?.institution_name}
            </p>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('user_type', {
      header: 'Type',
      cell: ({ getValue }) => {
        const type = getValue();
        const colors = {
          INDIVIDUAL: 'bg-blue-100 text-blue-800',
          COMPANY: 'bg-green-100 text-green-800',
          RESEARCH_INSTITUTION: 'bg-purple-100 text-purple-800',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type]}`}>
            {type.replace('_', ' ')}
          </span>
        );
      },
    }),
    columnHelper.accessor('role', {
      header: 'Role',
      cell: ({ getValue }) => {
        const role = getValue();
        const colors = {
          USER: 'bg-gray-100 text-gray-800',
          ADMIN: 'bg-red-100 text-red-800',
          SUPER_ADMIN: 'bg-yellow-100 text-yellow-800',
          MODERATOR: 'bg-blue-100 text-blue-800',
          SUPPORT: 'bg-green-100 text-green-800',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[role]}`}>
            {role}
          </span>
        );
      },
    }),
    columnHelper.accessor('is_verified', {
      header: 'Verified',
      cell: ({ getValue }) => {
        const verified = getValue();
        return (
          <div className="flex items-center space-x-1">
            {verified ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm ${verified ? 'text-green-600' : 'text-red-600'}`}>
              {verified ? 'Verified' : 'Unverified'}
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor('is_active', {
      header: 'Status',
      cell: ({ getValue }) => {
        const active = getValue();
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {active ? 'Active' : 'Inactive'}
          </span>
        );
      },
    }),
    columnHelper.accessor('created_at', {
      header: 'Joined',
      cell: ({ getValue }) => {
        const date = new Date(getValue());
        return (
          <div>
            <p className="text-sm text-gray-900">{date.toLocaleDateString()}</p>
            <p className="text-xs text-gray-500">{date.toLocaleTimeString()}</p>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button className="p-1 text-gray-400 hover:text-blue-600">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-green-600">
            <Edit className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    }),
  ], []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.profile as any)?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.profile as any)?.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.profile as any)?.institution_name?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = !filterRole || user.role === filterRole;
      const matchesType = !filterType || user.user_type === filterType;
      
      let matchesStatus = true;
      if (filterStatus === 'verified') matchesStatus = user.is_verified;
      else if (filterStatus === 'unverified') matchesStatus = !user.is_verified;
      else if (filterStatus === 'active') matchesStatus = user.is_active;
      else if (filterStatus === 'inactive') matchesStatus = !user.is_active;
      
      return matchesSearch && matchesRole && matchesType && matchesStatus;
    });
  }, [users, searchQuery, filterRole, filterType, filterStatus]);

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action}`, selectedUsers);
    // Implement bulk actions
  };

  const handleVerifyUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, is_verified: true } : user
    ));
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, is_active: !user.is_active } : user
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage users, roles, and permissions</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Upload className="h-4 w-4 mr-2" />
            Import Users
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.is_verified).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Building className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Companies</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.user_type === 'COMPANY').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <UserX className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => !u.is_active).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as UserRole | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Roles</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="MODERATOR">Moderator</option>
              <option value="SUPPORT">Support</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as UserType | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="INDIVIDUAL">Individual</option>
              <option value="COMPANY">Company</option>
              <option value="RESEARCH_INSTITUTION">Research Institution</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <DataTable
        data={filteredUsers}
        columns={columns}
        searchable={false}
        filterable={false}
        exportable={true}
        pagination={true}
        pageSize={10}
      />
    </div>
  );
}
