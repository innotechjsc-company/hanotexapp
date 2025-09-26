import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auctionId = params.id;
    const { amount } = await request.json();
    
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid bid amount" },
        { status: 400 }
      );
    }

    // Get current auction data
    const auctionResponse = await fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_API_URL}/auctions/${auctionId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!auctionResponse.ok) {
      return NextResponse.json(
        { error: "Auction not found" },
        { status: 404 }
      );
    }

    const auction = await auctionResponse.json();
    
    // Validate bid
    const currentBid = auction.currentBid || auction.startingPrice;
    const minBid = currentBid + (auction.bidIncrement || 100000);
    
    if (amount < minBid) {
      return NextResponse.json(
        { error: `Bid must be at least ${minBid.toLocaleString()} VNĐ` },
        { status: 400 }
      );
    }

    // Check if auction is still active
    if (new Date() > new Date(auction.endTime)) {
      return NextResponse.json(
        { error: "Auction has ended" },
        { status: 400 }
      );
    }

    // Create new bid
    const newBid = {
      amount,
      bidder: "Current User", // TODO: Get from authentication
      timestamp: new Date().toISOString(),
      auctionId,
    };

    // Update auction with new bid
    const updateResponse = await fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_API_URL}/auctions/${auctionId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentBid: amount,
          bidCount: (auction.bidCount || 0) + 1,
          $push: {
            bids: newBid,
          },
        }),
      }
    );

    if (!updateResponse.ok) {
      return NextResponse.json(
        { error: "Failed to place bid" },
        { status: 500 }
      );
    }

    const updatedAuction = await updateResponse.json();

    // Transform response
    const transformedAuction = {
      id: updatedAuction.id,
      title: updatedAuction.title,
      description: updatedAuction.description,
      currentBid: updatedAuction.currentBid,
      minBid: updatedAuction.minBid || updatedAuction.startingPrice,
      bidIncrement: updatedAuction.bidIncrement || 100000,
      bidCount: updatedAuction.bidCount,
      startTime: new Date(updatedAuction.startTime),
      endTime: new Date(updatedAuction.endTime),
      timeLeft: calculateTimeLeft(new Date(updatedAuction.endTime)),
      viewers: updatedAuction.viewers || Math.floor(Math.random() * 50) + 10,
      isActive: new Date() < new Date(updatedAuction.endTime),
      location: updatedAuction.location || "Hà Nội",
      organizer: {
        name: updatedAuction.organizer?.name || "HANOTEX",
        email: updatedAuction.organizer?.email || "contact@hanotex.com",
        phone: updatedAuction.organizer?.phone || "0848567193",
      },
      documents: updatedAuction.documents || [],
      terms: updatedAuction.terms || [],
      bids: updatedAuction.bids || [],
    };

    return NextResponse.json({ 
      success: true,
      auction: transformedAuction,
      message: "Bid placed successfully"
    });
  } catch (error) {
    console.error("Error placing bid:", error);
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
