import { NextRequest, NextResponse } from "next/server";
import { getPayloadApiUrl } from "@/lib/api-config";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auctionId = params.id;
    
    // Fetch from CMS API
    const cmsApiUrl = getPayloadApiUrl(`/auctions/${auctionId}`);
    console.log('Fetching auction from CMS API URL:', cmsApiUrl);
    console.log('Environment NEXT_PUBLIC_PAYLOAD_API_URL:', process.env.NEXT_PUBLIC_PAYLOAD_API_URL);
    
    const cmsResponse = await fetch(cmsApiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!cmsResponse.ok) {
      console.error('CMS API Response Error:', {
        status: cmsResponse.status,
        statusText: cmsResponse.statusText,
        url: cmsApiUrl
      });
      const errorText = await cmsResponse.text();
      console.error('CMS API Error Response:', errorText);
      
      return NextResponse.json(
        { error: "Auction not found" },
        { status: 404 }
      );
    }

    const auction = await cmsResponse.json();
    
    console.log('Individual auction data from CMS:', JSON.stringify(auction, null, 2));

    // Get bids from CMS API
    const bidsApiUrl = getPayloadApiUrl(`/auctions/${auctionId}/bids`);
    console.log('Fetching bids from CMS:', bidsApiUrl);
    
    let auctionBids: any[] = [];
    try {
      const bidsResponse = await fetch(bidsApiUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (bidsResponse.ok) {
        const bidsData = await bidsResponse.json();
        auctionBids = bidsData.success ? bidsData.data.bids : [];
        console.log(`Retrieved ${auctionBids.length} bids from CMS`);
      } else {
        console.warn('Failed to fetch bids from CMS, using empty array');
      }
    } catch (error) {
      console.warn('Error fetching bids from CMS:', error);
    }
    
    // Category mapping from CMS codes to display names
    const categoryMap: { [key: string]: string } = {
      'it': 'Công nghệ thông tin',
      'biotech': 'Công nghệ sinh học',
      'energy': 'Công nghệ năng lượng',
      'materials': 'Công nghệ vật liệu',
      'medical': 'Công nghệ y tế',
      'agriculture': 'Công nghệ nông nghiệp',
    };

    // Extract plain text from rich text description
    const getDescriptionText = (richText: any): string => {
      if (!richText || !richText.root || !richText.root.children) {
        return 'Không có mô tả';
      }
      
      try {
        const extractText = (children: any[]): string => {
          return children.map((child: any) => {
            if (child.type === 'text') {
              return child.text || '';
            } else if (child.children) {
              return extractText(child.children);
            }
            return '';
          }).join('');
        };
        
        return extractText(richText.root.children);
      } catch (error) {
        return 'Không có mô tả';
      }
    };
    
    // Transform data for frontend
    const transformedAuction = {
      id: auction.id || '',
      title: auction.title || 'Đấu giá không có tiêu đề',
      description: getDescriptionText(auction.description),
      startingPrice: auction.startingPrice || 0,
      currentBid: auction.currentBid || auction.startingPrice || 0,
      minBid: auction.minBid || auction.startingPrice || 0,
      bidIncrement: auction.bidIncrement || 100000,
      bidCount: auctionBids.length,
      startTime: auction.startTime ? new Date(auction.startTime) : new Date(),
      endTime: auction.endTime ? new Date(auction.endTime) : new Date(),
      timeLeft: auction.startTime && auction.endTime ? 
        calculateTimeLeft(auction.startTime, auction.endTime) : 'Không xác định',
      viewers: auction.viewers || Math.floor(Math.random() * 50) + 10,
      isActive: auction.startTime && auction.endTime ? 
        (new Date() >= new Date(auction.startTime) && new Date() < new Date(auction.endTime)) : false,
      status: auction.startTime && auction.endTime ? getAuctionStatus(auction.startTime, auction.endTime) : 'unknown',
      isWatching: false,
      location: auction.location || "Hà Nội",
      category: categoryMap[auction.category] || auction.category || "Công nghệ thông tin",
      organizer: {
        name: auction.organizer?.name || "HANOTEX",
        email: auction.organizer?.email || "contact@hanotex.com",
        phone: auction.organizer?.phone || "0848567193",
      },
      documents: (auction.documents || []).map((doc: any) => ({
        id: doc.id || Math.random().toString(),
        name: doc.name || 'Tài liệu',
        url: doc.file?.url || '#',
        size: doc.file?.filesize ? `${(doc.file.filesize / 1024 / 1024).toFixed(2)} MB` : 'N/A',
      })),
      terms: (auction.terms || []).map((termObj: any) => termObj.term || termObj).filter(Boolean),
      bids: auctionBids.map((bid: any) => ({
        id: bid.id || Math.random().toString(),
        amount: bid.amount || 0,
        bidder: bid.bidder || 'Ẩn danh',
        timestamp: bid.timestamp ? new Date(bid.timestamp) : new Date(),
        isWinning: bid.isWinning || false,
      })),
    };

    return NextResponse.json(transformedAuction);
  } catch (error) {
    console.error("Error fetching auction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function calculateTimeLeft(startTime: string, endTime: string): string {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  let targetTime: Date;
  let prefix: string;
  
  if (now < start) {
    // Auction hasn't started yet - show time until start
    targetTime = start;
    prefix = "Bắt đầu sau ";
  } else if (now >= start && now < end) {
    // Auction is active - show time until end
    targetTime = end;
    prefix = "Kết thúc sau ";
  } else {
    // Auction has ended
    return "Đã kết thúc";
  }
  
  const diff = targetTime.getTime() - now.getTime();
  
  if (diff <= 0) {
    return now < start ? "Đã bắt đầu" : "Đã kết thúc";
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${prefix}${days} ngày ${hours} giờ`;
  } else if (hours > 0) {
    return `${prefix}${hours} giờ ${minutes} phút`;
  } else {
    return `${prefix}${minutes} phút`;
  }
}

function getAuctionStatus(startTime: string, endTime: string): string {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  if (now < start) {
    return 'upcoming'; // Sắp diễn ra
  } else if (now >= start && now < end) {
    return 'active'; // Đang diễn ra
  } else {
    return 'ended'; // Đã kết thúc
  }
}
