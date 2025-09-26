import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auctionId = params.id;
    const { maxAmount } = await request.json();
    
    if (!maxAmount || maxAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid max amount" },
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
    
    // Check if auction is still active
    if (new Date() > new Date(auction.endTime)) {
      return NextResponse.json(
        { error: "Auction has ended" },
        { status: 400 }
      );
    }

    // Validate max amount
    const currentBid = auction.currentBid || auction.startingPrice;
    if (maxAmount <= currentBid) {
      return NextResponse.json(
        { error: "Max amount must be higher than current bid" },
        { status: 400 }
      );
    }

    // Create auto-bid record
    const autoBid = {
      maxAmount,
      bidder: "Current User", // TODO: Get from authentication
      createdAt: new Date().toISOString(),
      auctionId,
      isActive: true,
    };

    // Store auto-bid in auction
    const updateResponse = await fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_API_URL}/auctions/${auctionId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          $push: {
            autoBids: autoBid,
          },
        }),
      }
    );

    if (!updateResponse.ok) {
      return NextResponse.json(
        { error: "Failed to set auto-bid" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: "Auto-bid set successfully",
      autoBid: {
        maxAmount,
        isActive: true,
      }
    });
  } catch (error) {
    console.error("Error setting auto-bid:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
