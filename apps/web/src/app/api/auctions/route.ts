import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch from CMS API
    const cmsApiUrl = `http://localhost:4000/api/auctions`;
    console.log('Fetching auctions from CMS API URL:', cmsApiUrl);
    console.log('Environment NEXT_PUBLIC_PAYLOAD_API_URL:', process.env.NEXT_PUBLIC_PAYLOAD_API_URL);
    
    const cmsResponse = await fetch(cmsApiUrl,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!cmsResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch auctions" },
        { status: 500 }
      );
    }

    const data = await cmsResponse.json();
    const auctions = data.docs || [];
    
    console.log('CMS API URL:', `${process.env.NEXT_PUBLIC_PAYLOAD_API_URL}/auctions`);
    console.log('Raw auction data from CMS:', JSON.stringify(auctions[0], null, 2));

    // Category mapping from CMS codes to display names
    const categoryMap: { [key: string]: string } = {
      'it': 'Công nghệ thông tin',
      'biotech': 'Công nghệ sinh học',
      'energy': 'Công nghệ năng lượng',
      'materials': 'Công nghệ vật liệu',
      'medical': 'Công nghệ y tế',
      'agriculture': 'Công nghệ nông nghiệp',
    };

    // Transform data for frontend
    const transformedAuctions = auctions.map((auction: any) => ({
      id: auction.id || '',
      title: auction.title || 'Đấu giá không có tiêu đề',
      currentBid: auction.currentBid || auction.startingPrice || 0,
      bidCount: auction.bids?.length || 0,
      timeLeft: auction.endTime ? calculateTimeLeft(new Date(auction.endTime)) : 'Không xác định',
      viewers: auction.viewers || Math.floor(Math.random() * 50) + 10,
      isActive: auction.endTime ? new Date() < new Date(auction.endTime) : false,
      image: auction.image?.url || null,
      category: categoryMap[auction.category] || auction.category || "Công nghệ thông tin",
      endTime: auction.endTime ? new Date(auction.endTime) : new Date(),
    }));

    return NextResponse.json(transformedAuctions);
  } catch (error) {
    console.error("Error fetching auctions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("Creating auction with data:", body);
    
    // Transform data for CMS
    const cmsData = {
      title: body.title,
      description: {
        root: {
          type: "root",
          children: [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  text: body.description,
                },
              ],
            },
          ],
        },
      },
      category: body.category,
      startingPrice: Number(body.startingPrice),
      bidIncrement: Number(body.bidIncrement),
      startTime: new Date(body.startTime).toISOString(),
      endTime: new Date(body.endTime).toISOString(),
      location: body.location,
      organizer: body.organizer,
      terms: Array.isArray(body.terms) ? body.terms.map((term: string) => ({ term })) : [{ term: "Thanh toán theo quy định" }],
      status: "upcoming",
      viewers: 0,
      bidCount: 0,
      currentBid: Number(body.startingPrice),
      minBid: Number(body.startingPrice) + Number(body.bidIncrement),
    };
    
    console.log("Sending to CMS:", cmsData);
    
    // Create auction in CMS
    const cmsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_API_URL}/auctions?depth=1`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(cmsData),
      }
    );

    console.log("CMS Response status:", cmsResponse.status);
    
    if (!cmsResponse.ok) {
      const errorData = await cmsResponse.json();
      console.error("CMS Error:", errorData);
      return NextResponse.json(
        { error: errorData.message || "Failed to create auction" },
        { status: 500 }
      );
    }

    const auction = await cmsResponse.json();
    console.log("Auction created:", auction);
    
    return NextResponse.json({ 
      success: true,
      id: auction.id,
      message: "Auction created successfully"
    });
  } catch (error) {
    console.error("Error creating auction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function calculateTimeLeft(endTime: Date): string {
  const now = new Date();
  const diff = endTime.getTime() - now.getTime();
  
  if (diff <= 0) {
    return "Đã kết thúc";
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days} ngày ${hours} giờ`;
  } else if (hours > 0) {
    return `${hours} giờ ${minutes} phút`;
  } else {
    return `${minutes} phút`;
  }
}