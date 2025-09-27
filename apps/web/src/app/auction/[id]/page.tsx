"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AuctionHeader from "@/components/auction/AuctionHeader";
import BiddingSection from "@/components/auction/BiddingSection";
import BidHistory from "@/components/auction/BidHistory";
import AuctionDetails from "@/components/auction/AuctionDetails";
import {
  Clock,
  AlertCircle,
  CheckCircle,
  Gavel,
  TrendingUp,
  Eye,
} from "lucide-react";
import { SectionBanner } from "@/components/ui/SectionBanner";
import { AnimatedIcon } from "@/components/ui/AnimatedIcon";
import Toast, { useToast } from "@/components/ui/Toast";
import { useAuctionWebSocket } from "@/hooks/useWebSocket";

interface Auction {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  minBid: number;
  bidIncrement: number;
  bidCount: number;
  startTime: Date;
  endTime: Date;
  timeLeft: string;
  viewers: number;
  isActive: boolean;
  isWatching: boolean;
  status: "upcoming" | "active" | "ended" | "unknown";
  location: string;
  organizer: {
    name: string;
    email: string;
    phone: string;
  };
  documents: Array<{
    id: string;
    name: string;
    url: string;
    size: string;
  }>;
  terms: string[];
  bids: Array<{
    id: string;
    amount: number;
    bidder: string;
    timestamp: Date;
    isWinning: boolean;
  }>;
}

export default function AuctionPage() {
  const params = useParams();
  const auctionId = params.id as string;

  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  // WebSocket for real-time updates
  const {
    bids: wsBids,
    currentPrice: wsCurrentPrice,
    auctionStatus: wsAuctionStatus,
    placeBid: wsPlaceBid,
    isConnected: wsConnected,
  } = useAuctionWebSocket(auctionId);

  useEffect(() => {
    fetchAuction();
  }, [auctionId]);

  // Sync WebSocket bid updates with auction state
  useEffect(() => {
    if (wsBids.length > 0 && auction) {
      // Update auction with real-time bid data
      setAuction((prev) =>
        prev
          ? {
              ...prev,
              currentBid: wsCurrentPrice || prev.currentBid,
              bidCount: wsBids.length,
              bids: wsBids.map((bid) => ({
                id: bid.id || `ws_${Date.now()}`,
                amount: bid.bidAmount || bid.amount,
                bidder: bid.bidder || "Anonymous",
                timestamp: new Date(bid.timestamp || Date.now()),
                isWinning: bid.isWinning || false,
              })),
            }
          : null
      );

      // Save to localStorage for persistence
      if (wsBids.length > 0) {
        localStorage.setItem(
          `auction_bids_${auctionId}`,
          JSON.stringify(wsBids)
        );
      }

      // Show notification for new bids (not your own)
      const latestBid = wsBids[0];
      if (latestBid && latestBid.bidder !== "Current User") {
        showToast(
          `Có người đấu giá mới: ${(latestBid.bidAmount || latestBid.amount).toLocaleString()} VNĐ`,
          "info"
        );
      }
    }
  }, [wsBids, wsCurrentPrice, auctionId]);

  // Check auction status and winner
  useEffect(() => {
    if (!auction) return;

    const checkAuctionStatus = () => {
      const now = new Date();
      const endTime = new Date(auction.endTime);

      if (now > endTime && auction.isActive) {
        // Auction has ended, determine winner
        const winner = determineWinner();
        if (winner) {
          showToast(
            `Đấu giá đã kết thúc! Người thắng: ${winner.bidder} với giá ${winner.amount.toLocaleString()} VNĐ`,
            "success"
          );
        } else {
          showToast("Đấu giá đã kết thúc! Không có người đấu giá.", "info");
        }

        // Update auction status
        setAuction((prev) => (prev ? { ...prev, isActive: false } : null));
      }
    };

    // Check immediately
    checkAuctionStatus();

    // Check every 30 seconds
    const interval = setInterval(checkAuctionStatus, 30000);

    return () => clearInterval(interval);
  }, [auction]);

  const determineWinner = () => {
    if (!auction || !auction.bids || auction.bids.length === 0) {
      return null;
    }

    // Get highest bid
    const highestBid = auction.bids.reduce((highest, current) => {
      return current.amount > highest.amount ? current : highest;
    }, auction.bids[0]);

    return highestBid;
  };

  const fetchAuction = async () => {
    try {
      setLoading(true);
      // Fetch from CMS API
      const response = await fetch(`/api/auctions/${auctionId}`);
      if (!response.ok) {
        throw new Error("Không thể tải thông tin đấu giá");
      }
      const data = await response.json();

      // Load bid history from localStorage
      const storedBids = localStorage.getItem(`auction_bids_${auctionId}`);
      if (storedBids) {
        try {
          const parsedBids = JSON.parse(storedBids);
          data.bids = parsedBids.map((bid: any) => ({
            ...bid,
            timestamp: new Date(bid.timestamp),
          }));
          data.bidCount = parsedBids.length;

          // Update currentBid from latest bid
          if (parsedBids.length > 0) {
            const latestBid = parsedBids[parsedBids.length - 1];
            data.currentBid = latestBid.amount;
          }
        } catch (e) {
          console.warn("Failed to parse stored bids:", e);
        }
      }

      setAuction(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleBid = async (amount: number) => {
    try {
      const response = await fetch(`/api/auctions/${auctionId}/bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể thực hiện đấu giá");
      }

      const result = await response.json();

      if (result.success) {
        // Update auction data
        const updatedAuction = result.auction;
        setAuction(updatedAuction);

        // Save bid to localStorage for persistence
        const newBid = {
          id: `bid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          amount: amount,
          bidder: "Current User", // TODO: Get from authentication
          timestamp: new Date().toISOString(),
          isWinning: true,
        };

        // Get existing bids from localStorage
        const storedBids = localStorage.getItem(`auction_bids_${auctionId}`);
        let allBids = [];

        if (storedBids) {
          try {
            allBids = JSON.parse(storedBids);
            // Mark all previous bids as not winning
            allBids = allBids.map((bid: any) => ({ ...bid, isWinning: false }));
          } catch (e) {
            console.warn("Failed to parse stored bids:", e);
            allBids = [];
          }
        }

        // Add new bid
        allBids.push(newBid);

        // Save updated bids to localStorage
        localStorage.setItem(
          `auction_bids_${auctionId}`,
          JSON.stringify(allBids)
        );

        console.log("Bid history updated:", {
          totalBids: allBids.length,
          latestBid: newBid,
          allBids: allBids,
        });

        // Update auction state with bid history
        setAuction((prev) =>
          prev
            ? {
                ...prev,
                currentBid: amount,
                bidCount: allBids.length,
                bids: allBids.map((bid: any) => ({
                  ...bid,
                  timestamp: new Date(bid.timestamp),
                })),
              }
            : null
        );

        // Show success notification
        showToast(
          `Đấu giá thành công! Giá hiện tại: ${amount.toLocaleString()} VNĐ`,
          "success"
        );

        // Dispatch custom event to notify other pages
        window.dispatchEvent(
          new CustomEvent("bidPlaced", {
            detail: { auctionId, amount, bidCount: allBids.length },
          })
        );
      } else {
        throw new Error(result.message || "Đấu giá không thành công");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra";
      showToast(errorMessage, "error");
    }
  };

  const handleAutoBid = async (maxAmount: number) => {
    try {
      const response = await fetch(`/api/auctions/${auctionId}/auto-bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maxAmount }),
      });

      if (!response.ok) {
        throw new Error("Không thể thiết lập đấu giá tự động");
      }

      alert("Đấu giá tự động đã được kích hoạt");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  };

  const handleWatch = () => {
    setIsWatching(!isWatching);
    // TODO: Implement watch functionality
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: auction?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Đã sao chép link vào clipboard");
    }
  };

  const handleReport = () => {
    // TODO: Implement report functionality
    alert("Chức năng báo cáo đang được phát triển");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin đấu giá...</p>
        </div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Không thể tải đấu giá
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAuction}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuctionHeader
        title={auction.title}
        currentBid={auction.currentBid}
        bidCount={auction.bidCount}
        timeLeft={auction.timeLeft}
        viewers={auction.viewers}
        isWatching={isWatching}
        onWatch={handleWatch}
        onShare={handleShare}
        onReport={handleReport}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <BiddingSection
              currentBid={auction.currentBid || 0}
              minBid={
                (auction.currentBid || 0) + (auction.bidIncrement || 100000)
              }
              bidIncrement={auction.bidIncrement || 100000}
              timeLeft={auction.timeLeft || "Không xác định"}
              isActive={auction.isActive || false}
              status={auction.status}
              onBid={handleBid}
              onAutoBid={handleAutoBid}
            />

            <AuctionDetails
              description={auction.description}
              startTime={auction.startTime}
              endTime={auction.endTime}
              location={auction.location}
              organizer={auction.organizer}
              documents={auction.documents}
              terms={auction.terms}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <BidHistory bids={auction.bids || []} />

            {/* Status Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Trạng thái đấu giá
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trạng thái</span>
                  <div className="flex items-center space-x-2">
                    {auction.isActive ? (
                      <>
                        <Clock className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">
                          Đang diễn ra
                        </span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-600">
                          Đã kết thúc
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Lượt đấu giá</span>
                  <span className="text-sm font-medium text-gray-900">
                    {auction.bidCount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Người xem</span>
                  <span className="text-sm font-medium text-gray-900">
                    {auction.viewers}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thao tác nhanh
              </h3>

              <div className="space-y-3">
                <button
                  onClick={handleWatch}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md border transition-colors ${
                    isWatching
                      ? "bg-red-50 border-red-200 text-red-700"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>{isWatching ? "Bỏ theo dõi" : "Theo dõi đấu giá"}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>Chia sẻ đấu giá</span>
                </button>

                <button
                  onClick={handleReport}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>Báo cáo vi phạm</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
