import { NextRequest, NextResponse } from 'next/server';

// Mock search data
const mockTechnologies = [
  {
    id: '1',
    title: 'Hệ thống nhận dạng hình ảnh AI',
    public_summary: 'Công nghệ AI nhận dạng hình ảnh tiên tiến sử dụng deep learning',
    category_name: 'Công nghệ thông tin & Truyền thông',
    trl_level: 7,
    status: 'ACTIVE',
    asking_price: '1000000000',
    currency: 'VND',
    pricing_type: 'ASK',
    owners: [{ owner_name: 'Nguyễn Văn A', ownership_percentage: 100 }],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Công nghệ xử lý nước thải tiên tiến',
    public_summary: 'Hệ thống xử lý nước thải công nghiệp hiệu quả cao',
    category_name: 'Năng lượng & Môi trường',
    trl_level: 8,
    status: 'ACTIVE',
    asking_price: '2000000000',
    currency: 'VND',
    pricing_type: 'AUCTION',
    owners: [{ owner_name: 'Công ty ABC', ownership_percentage: 100 }],
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    title: 'Phần mềm quản lý tài nguyên doanh nghiệp',
    public_summary: 'Hệ thống ERP tích hợp AI cho doanh nghiệp vừa và nhỏ',
    category_name: 'Công nghệ thông tin & Truyền thông',
    trl_level: 9,
    status: 'ACTIVE',
    asking_price: '500000000',
    currency: 'VND',
    pricing_type: 'ASK',
    owners: [{ owner_name: 'Nguyễn Văn B', ownership_percentage: 60 }, { owner_name: 'Công ty XYZ', ownership_percentage: 40 }],
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const trl_level = searchParams.get('trl_level');
    const status = searchParams.get('status') || 'ACTIVE';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'DESC';

    let filteredTechnologies = [...mockTechnologies];

    // Text search
    if (q.trim()) {
      const searchLower = q.toLowerCase();
      filteredTechnologies = filteredTechnologies.filter(tech => 
        tech.title.toLowerCase().includes(searchLower) ||
        tech.public_summary.toLowerCase().includes(searchLower) ||
        tech.category_name.toLowerCase().includes(searchLower) ||
        tech.owners.some(owner => owner.owner_name.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (category) {
      filteredTechnologies = filteredTechnologies.filter(tech => tech.category_name === category);
    }

    // TRL level filter
    if (trl_level) {
      const [min, max] = trl_level.split('-').map(Number);
      filteredTechnologies = filteredTechnologies.filter(tech => 
        tech.trl_level >= min && tech.trl_level <= max
      );
    }

    // Status filter
    if (status) {
      filteredTechnologies = filteredTechnologies.filter(tech => tech.status === status);
    }

    // Sort
    filteredTechnologies.sort((a, b) => {
      let aValue: any = a[sort as keyof typeof a];
      let bValue: any = b[sort as keyof typeof b];

      // Handle nested sorting
      if (sort === 'price') {
        aValue = parseFloat(a.asking_price);
        bValue = parseFloat(b.asking_price);
      }

      if (order === 'ASC') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTechnologies = filteredTechnologies.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedTechnologies,
      pagination: {
        page,
        limit,
        total: filteredTechnologies.length,
        totalPages: Math.ceil(filteredTechnologies.length / limit)
      },
      search: {
        query: q,
        filters: {
          category,
          trl_level,
          status
        }
      }
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search technologies' },
      { status: 500 }
    );
  }
}
