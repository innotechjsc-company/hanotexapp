import { NextRequest, NextResponse } from 'next/server';

// Mock bid data
const mockBids = [
  {
    id: '1',
    auction_id: '1',
    bidder_id: '2',
    bidder_email: 'user@hanotex.com',
    bidder_name: 'Nguyễn Văn A',
    amount: 1100000000,
    currency: 'VND',
    bid_type: 'AUTOMATIC',
    status: 'ACTIVE',
    created_at: '2024-12-01T10:30:00Z',
    updated_at: '2024-12-01T10:30:00Z'
  },
  {
    id: '2',
    auction_id: '1',
    bidder_id: '3',
    bidder_email: 'company@hanotex.com',
    bidder_name: 'Công ty ABC',
    amount: 1150000000,
    currency: 'VND',
    bid_type: 'MANUAL',
    status: 'ACTIVE',
    created_at: '2024-12-01T11:15:00Z',
    updated_at: '2024-12-01T11:15:00Z'
  },
  {
    id: '3',
    auction_id: '1',
    bidder_id: '2',
    bidder_email: 'user@hanotex.com',
    bidder_name: 'Nguyễn Văn A',
    amount: 1200000000,
    currency: 'VND',
    bid_type: 'MANUAL',
    status: 'ACTIVE',
    created_at: '2024-12-01T14:20:00Z',
    updated_at: '2024-12-01T14:20:00Z'
  },
  {
    id: '4',
    auction_id: '2',
    bidder_id: '3',
    bidder_email: 'company@hanotex.com',
    bidder_name: 'Công ty ABC',
    amount: 1900000000,
    currency: 'VND',
    bid_type: 'MANUAL',
    status: 'ACTIVE',
    created_at: '2024-12-05T15:45:00Z',
    updated_at: '2024-12-05T15:45:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const auction_id = searchParams.get('auction_id');
    const bidder_id = searchParams.get('bidder_id');
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'DESC';

    let filteredBids = [...mockBids];

    // Apply filters
    if (auction_id) {
      filteredBids = filteredBids.filter(bid => bid.auction_id === auction_id);
    }
    if (bidder_id) {
      filteredBids = filteredBids.filter(bid => bid.bidder_id === bidder_id);
    }
    if (status) {
      filteredBids = filteredBids.filter(bid => bid.status === status);
    }

    // Sort
    filteredBids.sort((a, b) => {
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
    const paginatedBids = filteredBids.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedBids,
      pagination: {
        page,
        limit,
        total: filteredBids.length,
        totalPages: Math.ceil(filteredBids.length / limit)
      }
    });
  } catch (error) {
    console.error('Bids API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bids' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { auction_id, bidder_id, bidder_email, bidder_name, amount, currency, bid_type } = body;

    // Mock bid creation
    const newBid = {
      id: Date.now().toString(),
      auction_id,
      bidder_id,
      bidder_email,
      bidder_name,
      amount,
      currency: currency || 'VND',
      bid_type: bid_type || 'MANUAL',
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockBids.push(newBid);

    return NextResponse.json({
      success: true,
      data: newBid,
      message: 'Bid placed successfully'
    });
  } catch (error) {
    console.error('Bid creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to place bid' },
      { status: 500 }
    );
  }
}
