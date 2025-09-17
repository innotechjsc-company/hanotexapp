import { NextRequest, NextResponse } from 'next/server';

// Mock user data
const mockUsers = [
  {
    id: '1',
    email: 'admin@hanotex.com',
    profile: {
      full_name: 'Admin HANOTEX',
      company_name: 'HANOTEX Platform',
      institution_name: '',
      phone: '0123456789',
      profession: 'System Administrator'
    },
    role: 'ADMIN',
    user_type: 'INDIVIDUAL',
    is_verified: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'user@hanotex.com',
    profile: {
      full_name: 'Nguyễn Văn A',
      company_name: '',
      institution_name: '',
      phone: '0987654321',
      profession: 'Nhà nghiên cứu'
    },
    role: 'USER',
    user_type: 'INDIVIDUAL',
    is_verified: true,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    email: 'company@hanotex.com',
    profile: {
      full_name: 'Công ty ABC',
      company_name: 'Công ty TNHH ABC',
      institution_name: '',
      phone: '0123456788',
      profession: 'Doanh nghiệp'
    },
    role: 'USER',
    user_type: 'COMPANY',
    is_verified: true,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const role = searchParams.get('role');
    const userType = searchParams.get('user_type');
    const verified = searchParams.get('verified');

    let filteredUsers = [...mockUsers];

    // Apply filters
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }
    if (userType) {
      filteredUsers = filteredUsers.filter(user => user.user_type === userType);
    }
    if (verified !== null) {
      const isVerified = verified === 'true';
      filteredUsers = filteredUsers.filter(user => user.is_verified === isVerified);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit)
      }
    });
  } catch (error) {
    console.error('Users API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, user_type, profile } = body;

    // Mock user creation
    const newUser = {
      id: Date.now().toString(),
      email,
      profile,
      role: 'USER',
      user_type,
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockUsers.push(newUser);

    return NextResponse.json({
      success: true,
      data: newUser,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
