import { NextRequest, NextResponse } from 'next/server';

// Mock auction data
const mockAuctions = [
  {
    id: '1',
    technology_id: '1',
    technology_title: 'Hệ thống nhận dạng hình ảnh AI',
    auction_type: 'ENGLISH',
    start_price: 1000000000,
    reserve_price: 1500000000,
    current_price: 1200000000,
    currency: 'VND',
    start_time: '2024-12-01T09:00:00Z',
    end_time: '2024-12-15T17:00:00Z',
    status: 'ACTIVE',
    bid_count: 5,
    highest_bidder: 'user@hanotex.com',
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-11-15T00:00:00Z'
  },
  {
    id: '2',
    technology_id: '2',
    technology_title: 'Công nghệ xử lý nước thải tiên tiến',
    auction_type: 'DUTCH',
    start_price: 2000000000,
    reserve_price: 1000000000,
    current_price: 1800000000,
    currency: 'VND',
    start_time: '2024-12-05T10:00:00Z',
    end_time: '2024-12-20T16:00:00Z',
    status: 'ACTIVE',
    bid_count: 3,
    highest_bidder: 'company@hanotex.com',
    created_at: '2024-11-05T00:00:00Z',
    updated_at: '2024-11-20T00:00:00Z'
  },
  {
    id: '3',
    technology_id: '3',
    technology_title: 'Phần mềm quản lý tài nguyên doanh nghiệp',
    auction_type: 'SEALED',
    start_price: 500000000,
    reserve_price: 300000000,
    current_price: 450000000,
    currency: 'VND',
    start_time: '2024-11-20T09:00:00Z',
    end_time: '2024-12-10T17:00:00Z',
    status: 'COMPLETED',
    bid_count: 8,
    highest_bidder: 'user@hanotex.com',
    created_at: '2024-10-20T00:00:00Z',
    updated_at: '2024-12-10T00:00:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const auction_type = searchParams.get('auction_type');
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'DESC';

    let filteredAuctions = [...mockAuctions];

    // Apply filters
    if (status) {
      filteredAuctions = filteredAuctions.filter(auction => auction.status === status);
    }
    if (auction_type) {
      filteredAuctions = filteredAuctions.filter(auction => auction.auction_type === auction_type);
    }

    // Sort
    filteredAuctions.sort((a, b) => {
      const aValue = a[sort as keyof typeof a];
      const bValue = b[sort as keyof typeof b];
      
      if (order === 'ASC') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAuctions = filteredAuctions.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedAuctions,
      pagination: {
        page,
        limit,
        total: filteredAuctions.length,
        totalPages: Math.ceil(filteredAuctions.length / limit)
      }
    });
  } catch (error) {
    console.error('Auctions API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch auctions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { technology_id, auction_type, start_price, reserve_price, start_time, end_time } = body;

    // Mock auction creation
    const newAuction = {
      id: Date.now().toString(),
      technology_id,
      auction_type,
      start_price,
      reserve_price,
      current_price: start_price,
      currency: 'VND',
      start_time,
      end_time,
      status: 'SCHEDULED',
      bid_count: 0,
      highest_bidder: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockAuctions.push(newAuction);

    return NextResponse.json({
      success: true,
      data: newAuction,
      message: 'Auction created successfully'
    });
  } catch (error) {
    console.error('Auction creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create auction' },
      { status: 500 }
    );
  }
}
