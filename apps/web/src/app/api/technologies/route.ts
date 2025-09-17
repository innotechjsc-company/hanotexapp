import { NextRequest, NextResponse } from 'next/server';

// Mock data for testing
const mockTechnologies = [
  {
    id: '1',
    title: 'Hệ thống quản lý năng lượng thông minh',
    public_summary: 'Công nghệ quản lý năng lượng tiên tiến sử dụng AI để tối ưu hóa việc sử dụng điện năng trong các tòa nhà thông minh.',
    trl_level: 7,
    status: 'ACTIVE',
    category: '1',
    category_name: 'Công nghệ thông tin & Truyền thông',
    asking_price: '1000000000',
    currency: 'VND',
    pricing_type: 'ASK',
    owners: [{ owner_name: 'Viện Công nghệ Hà Nội', ownership_percentage: 100 }],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T15:30:00Z',
    owner: {
      id: '1',
      name: 'Viện Công nghệ Hà Nội',
      type: 'INSTITUTION'
    }
  },
  {
    id: '2',
    title: 'Pin lithium-ion công nghệ cao',
    public_summary: 'Pin lithium-ion với khả năng lưu trữ năng lượng cao, thời gian sạc nhanh và tuổi thọ dài.',
    trl_level: 8,
    status: 'ACTIVE',
    category: '2',
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-18T14:20:00Z',
    owner: {
      id: '2',
      name: 'Công ty TNHH Pin Việt',
      type: 'COMPANY'
    }
  },
  {
    id: '3',
    title: 'Vật liệu composite siêu nhẹ',
    public_summary: 'Vật liệu composite mới với trọng lượng siêu nhẹ nhưng độ bền cao, ứng dụng trong ngành hàng không và ô tô.',
    trl_level: 6,
    status: 'PENDING',
    category: '1',
    created_at: '2024-01-05T11:00:00Z',
    updated_at: '2024-01-12T16:45:00Z',
    owner: {
      id: '3',
      name: 'Đại học Bách Khoa Hà Nội',
      type: 'INSTITUTION'
    }
  },
  {
    id: '4',
    title: 'Hệ thống IoT giám sát môi trường',
    public_summary: 'Hệ thống IoT để giám sát chất lượng không khí, nước và đất trong thời gian thực.',
    trl_level: 5,
    status: 'ACTIVE',
    category: '2',
    created_at: '2024-01-08T08:00:00Z',
    updated_at: '2024-01-15T12:30:00Z',
    owner: {
      id: '4',
      name: 'Viện Môi trường Việt Nam',
      type: 'INSTITUTION'
    }
  },
  {
    id: '5',
    title: 'Công nghệ sản xuất pin mặt trời hiệu suất cao',
    public_summary: 'Công nghệ sản xuất pin mặt trời với hiệu suất chuyển đổi năng lượng lên đến 25%.',
    trl_level: 7,
    status: 'ACTIVE',
    category: '2',
    created_at: '2024-01-12T13:00:00Z',
    updated_at: '2024-01-19T10:15:00Z',
    owner: {
      id: '5',
      name: 'Công ty Năng lượng Xanh',
      type: 'COMPANY'
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const trl_level = searchParams.get('trl_level') || '';
    const status = searchParams.get('status') || 'ACTIVE';
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'DESC';

    // Filter technologies
    let filteredTechnologies = mockTechnologies.filter(tech => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch = 
          tech.title.toLowerCase().includes(searchLower) ||
          tech.public_summary.toLowerCase().includes(searchLower) ||
          tech.owner.name.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (category && tech.category !== category) return false;

      // TRL level filter
      if (trl_level) {
        const [min, max] = trl_level.split('-').map(Number);
        if (tech.trl_level < min || tech.trl_level > max) return false;
      }

      // Status filter
      if (status && tech.status !== status) return false;

      return true;
    });

    // Sort technologies
    filteredTechnologies.sort((a, b) => {
      let aValue: any = a[sort as keyof typeof a];
      let bValue: any = b[sort as keyof typeof b];

      if (sort === 'created_at' || sort === 'updated_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (order === 'ASC') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return NextResponse.json({
      success: true,
      data: filteredTechnologies,
      pagination: {
        page: 1,
        limit: 20,
        total: filteredTechnologies.length,
        totalPages: Math.ceil(filteredTechnologies.length / 20)
      }
    });
  } catch (error) {
    console.error('Error fetching technologies:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch technologies' },
      { status: 500 }
    );
  }
}
