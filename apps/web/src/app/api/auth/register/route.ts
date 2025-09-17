import { NextRequest, NextResponse } from 'next/server';

// Mock user database - in real app, this would be a database
let mockUsers = [
  {
    id: 'user-1',
    email: '123@gmail.com',
    password: '123456', // In real app, this would be hashed
    profile: {
      full_name: 'Nguyễn Văn A',
      company_name: '',
      institution_name: '',
      phone: '0123456789',
      profession: 'Nhà nghiên cứu'
    },
    role: 'USER',
    user_type: 'INDIVIDUAL',
    is_verified: false,
    created_at: '2024-01-01T00:00:00Z'
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, user_type, profile } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email đã được sử dụng' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password, // In real app, hash this password
      profile: {
        full_name: profile?.full_name || '',
        company_name: profile?.company_name || '',
        institution_name: profile?.institution_name || '',
        phone: profile?.phone || '',
        profession: profile?.profession || ''
      },
      role: 'USER',
      user_type: user_type || 'INDIVIDUAL',
      is_verified: false,
      created_at: new Date().toISOString()
    };

    mockUsers.push(newUser);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Đăng ký thất bại' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return registration statistics or public info
    return NextResponse.json({
      success: true,
      data: {
        totalUsers: mockUsers.length,
        userTypes: {
          INDIVIDUAL: mockUsers.filter(u => u.user_type === 'INDIVIDUAL').length,
          COMPANY: mockUsers.filter(u => u.user_type === 'COMPANY').length,
          RESEARCH_INSTITUTION: mockUsers.filter(u => u.user_type === 'RESEARCH_INSTITUTION').length
        }
      }
    });
  } catch (error) {
    console.error('Registration stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch registration stats' },
      { status: 500 }
    );
  }
}
