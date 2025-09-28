"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AuctionHeader from "@/components/auction/AuctionHeader";
import BiddingSection from "@/components/auction/BiddingSection";
import BidHistory from "@/components/auction/BidHistory";
import AuctionDetails from "@/components/auction/AuctionDetails";
import AuctionResultsList from "@/components/auction/AuctionResultsList";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/store/auth";
import toast from "react-hot-toast";
import { getAuctionById } from "@/api/auctions";
import { getBidsByAuction, createBid } from "@/api/bids";
import { Auction, AuctionStatus, Bid, ID, DateTimeString } from "@/types";

// Extended interface for UI components with computed fields
interface UIAuction extends Omit<Auction, 'description' | 'organizer' | 'terms' | 'bids' | 'startTime' | 'endTime' | 'status'> {
  // Required UI fields
  id: string;
  title: string;
  description: string; // Converted from rich text to plain text
  startTime: Date;
  endTime: Date;
  timeLeft: string; // Computed field
  isActive: boolean; // Computed field
  status: "upcoming" | "active" | "ended"; // Simplified status
  location: string;
  viewers: number;
  bidCount: number;
  currentBid: number;
  bidIncrement: number;
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
  terms: string[]; // Simplified from object array to string array
  bids: Array<{
    id: string;
    amount: number;
    bidder: string;
    timestamp: Date;
    isWinning: boolean;
  }>;
}

// Enhanced time-based utility functions
const getAuctionTimeStatus = (startTime: Date, endTime: Date) => {
  const now = new Date();
  const isStarted = now >= startTime;
  const isEnded = now > endTime;
  
  return {
    isStarted,
    isEnded,
    isPending: !isStarted,
    isActive: isStarted && !isEnded,
    currentTime: now
  };
};

const calculateTimeLeft = (startTime: Date, endTime: Date): string => {
  const now = new Date().getTime();
  const start = startTime.getTime();
  const end = endTime.getTime();
  
  // If auction hasn't started yet, show time until start
  if (now < start) {
    const timeToStart = start - now;
    const days = Math.floor(timeToStart / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeToStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeToStart % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `Bắt đầu sau ${days} ngày ${hours} giờ`;
    if (hours > 0) return `Bắt đầu sau ${hours} giờ ${minutes} phút`;
    return `Bắt đầu sau ${minutes} phút`;
  }
  
  // If auction is active, show time until end
  const timeLeft = end - now;
  if (timeLeft <= 0) return 'Đã kết thúc';

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  if (days > 0) return `${days} ngày ${hours} giờ`;
  if (hours > 0) return `${hours} giờ ${minutes} phút`;
  if (minutes > 0) return `${minutes} phút ${seconds} giây`;
  return `${seconds} giây`;
};

const getAuctionStatus = (startTime: Date, endTime: Date): "upcoming" | "active" | "ended" => {
  const { isPending, isActive, isEnded } = getAuctionTimeStatus(startTime, endTime);
  
  if (isEnded) return 'ended';
  if (isActive) return 'active';
  return 'upcoming';
};

// Helper function to convert rich text object to string
const extractTextFromRichText = (richText: unknown): string => {
  if (!richText) return '';
  if (typeof richText === 'string') return richText;
  if (typeof richText === 'object' && richText && 'root' in richText) {
    // Handle Lexical/PayloadCMS rich text format
    try {
      const extractText = (node: unknown): string => {
        if (!node) return '';
        if (typeof node === 'string') return node;
        if (typeof node === 'object' && node && 'text' in node) {
          return String(node.text);
        }
        if (typeof node === 'object' && node && 'children' in node && Array.isArray(node.children)) {
          return node.children.map(extractText).join('');
        }
        return '';
      };
      return extractText((richText as { root: unknown }).root);
    } catch (error) {
      console.warn('Error extracting text from rich text:', error);
      return '';
    }
  }
  return String(richText);
};

// Transform CMS data to UI format with enhanced time logic
const transformAuctionData = (data: Auction): UIAuction => {
  const endTime = new Date(data.endTime || data.end_time || Date.now());
  const startTime = new Date(data.startTime || data.start_time || Date.now());
  
  // Calculate time-based status
  const timeStatus = getAuctionTimeStatus(startTime, endTime);
  const calculatedStatus = getAuctionStatus(startTime, endTime);
  
  return {
    // Copy all original Auction fields
    ...data,
    
    // Override with UI-specific transformations
    description: extractTextFromRichText(data.description),
    startTime,
    endTime,
    timeLeft: calculateTimeLeft(startTime, endTime),
    isActive: timeStatus.isActive,
    status: calculatedStatus,
    organizer: {
      name: typeof data.organizer === 'string' ? data.organizer : 
            (typeof data.organizer === 'object' && data.organizer && 'name' in data.organizer ? 
             String((data.organizer as any).name) : 'Không rõ'),
      email: typeof data.organizer === 'object' && data.organizer && 'email' in data.organizer ? 
             String((data.organizer as any).email) : '',
      phone: typeof data.organizer === 'object' && data.organizer && 'phone' in data.organizer ? 
             String((data.organizer as any).phone) : ''
    },
    documents: [], // Keep empty for now
    terms: Array.isArray(data.terms) ? data.terms.map(t => {
      if (typeof t === 'string') return t;
      if (typeof t === 'object' && t && 'term' in t) return String(t.term);
      return String(t);
    }).filter(t => t.trim() !== '') : [],
    bids: [], // Will be populated separately
    
    // Ensure required fields have fallback values
    id: data.id || '',
    title: data.title || 'Không có tiêu đề',
    location: data.location || '',
    viewers: data.viewers || 0,
    bidCount: data.bidCount || 0,
    currentBid: data.currentBid || data.current_price || data.startingPrice || data.start_price || 0,
    minBid: data.startingPrice || data.start_price || 0,
    bidIncrement: data.bidIncrement || 100000
  };
};

const transformBidData = (bid: Bid) => ({
  id: String(bid.id || ''),
  amount: Number(bid.amount || bid.bid_amount || 0),
  bidder: String(bid.bidder_name || 'Ẩn danh'),
  timestamp: new Date(bid.bid_time || bid.created_at || bid.createdAt || Date.now()),
  isWinning: Boolean(bid.is_winning || false)
});

export default function AuctionPage() {
  const params = useParams();
  const router = useRouter();
  const auctionId = params.id as string;
  const { isAuthenticated, isLoading: authLoading, token } = useAuth();

  const [auction, setAuction] = useState<UIAuction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch auction and bids data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Set authentication token
      if (token) {
        const { payloadApiClient } = await import('@/api/client');
        payloadApiClient.setToken(token);
      }

      // Fetch auction data
      const auctionData = await getAuctionById(auctionId);
      const transformedAuction = transformAuctionData(auctionData);

      // Fetch bids data
      try {
        const bidsResponse = await getBidsByAuction(auctionId, { 
          limit: 50, 
          sort: "-bid_time" 
        });
        
        if (bidsResponse.data && Array.isArray(bidsResponse.data)) {
          const transformedBids = bidsResponse.data.map(transformBidData);
          const maxBid = Math.max(0, ...transformedBids.map(bid => bid.amount));
          
          transformedAuction.bids = transformedBids;
          transformedAuction.bidCount = transformedBids.length;
          if (maxBid > (transformedAuction.currentBid || 0)) {
            transformedAuction.currentBid = maxBid;
          }
        }
      } catch (bidsError) {
        console.warn("Could not load bids:", bidsError);
      }
      
      setAuction(transformedAuction);
      
    } catch (err) {
      console.error("Error fetching auction:", err);
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dữ liệu";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Main effect - load data when authenticated
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        toast.error("Vui lòng đăng nhập để xem chi tiết đấu giá");
        router.push("/auth/login");
        return;
      }
      
      if (auctionId) {
        fetchData();
      }
    }
  }, [authLoading, isAuthenticated, auctionId]);

  // Real-time clock updates
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second
    
    return () => clearInterval(clockInterval);
  }, []);
  
  // Enhanced auto refresh logic
  useEffect(() => {
    if (!auction) return;
    
    const timeStatus = getAuctionTimeStatus(auction.startTime, auction.endTime);
    
    // More frequent updates for active auctions or when close to start/end
    let refreshInterval = 30000; // Default 30 seconds
    
    if (timeStatus.isActive) {
      const timeToEnd = auction.endTime.getTime() - currentTime.getTime();
      if (timeToEnd < 5 * 60 * 1000) { // Last 5 minutes
        refreshInterval = 10000; // 10 seconds
      } else if (timeToEnd < 30 * 60 * 1000) { // Last 30 minutes
        refreshInterval = 15000; // 15 seconds
      }
    } else if (timeStatus.isPending) {
      const timeToStart = auction.startTime.getTime() - currentTime.getTime();
      if (timeToStart < 5 * 60 * 1000) { // 5 minutes before start
        refreshInterval = 10000; // 10 seconds
      }
    }
    
    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [auction, currentTime]);

  // Bidding handlers with time-based validation
  const handleBid = async (amount: number) => {
    if (!isAuthenticated || !token) {
      toast.error("Vui lòng đăng nhập để đặt giá");
      router.push("/auth/login");
      return;
    }

    if (!auction) {
      toast.error("Không tìm thấy thông tin đấu giá");
      return;
    }
    
    // Time-based validation
    const timeStatus = getAuctionTimeStatus(auction.startTime, auction.endTime);
    
    if (timeStatus.isPending) {
      toast.error("Phên đấu giá chưa bắt đầu!");
      return;
    }
    
    if (timeStatus.isEnded) {
      toast.error("Phên đấu giá đã kết thúc!");
      return;
    }

    const minBid = (auction.currentBid || 0) + (auction.bidIncrement || 100000);
    if (amount < minBid) {
      toast.error(`Giá đấu phải ít nhất ${minBid.toLocaleString()} VNĐ`);
      return;
    }

    try {
      const { payloadApiClient } = await import('@/api/client');
      payloadApiClient.setToken(token);
      
      await createBid({
        auction_id: auctionId,
        amount,
        bid_type: 'MANUAL'
      });
      
      toast.success("Đặt giá thành công!");
      await fetchData();
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi đặt giá";
      toast.error(errorMessage);
    }
  };

  const handleAutoBid = async (maxAmount: number) => {
    if (!isAuthenticated || !token) {
      toast.error("Vui lòng đăng nhập để đặt giá tự động");
      router.push("/auth/login");
      return;
    }

    if (!auction) {
      toast.error("Không tìm thấy thông tin đấu giá");
      return;
    }
    
    // Time-based validation
    const timeStatus = getAuctionTimeStatus(auction.startTime, auction.endTime);
    
    if (timeStatus.isPending) {
      toast.error("Phên đấu giá chưa bắt đầu!");
      return;
    }
    
    if (timeStatus.isEnded) {
      toast.error("Phên đấu giá đã kết thúc!");
      return;
    }

    const minBid = (auction.currentBid || 0) + (auction.bidIncrement || 100000);
    if (maxAmount < minBid) {
      toast.error(`Giá đấu tự động phải ít nhất ${minBid.toLocaleString()} VNĐ`);
      return;
    }

    try {
      const { payloadApiClient } = await import('@/api/client');
      payloadApiClient.setToken(token);
      
      await createBid({
        auction_id: auctionId,
        amount: maxAmount,
        bid_type: 'AUTO'
      });
      
      toast.success(`Đã đặt giá tự động: ${maxAmount.toLocaleString()} VNĐ`);
      await fetchData();
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi đặt giá tự động";
      toast.error(errorMessage);
    }
  };

  const handleWatch = () => {
    setIsWatching(!isWatching);
    toast.success(isWatching ? "Đã bỏ theo dõi" : "Đã theo dõi đấu giá");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: auction?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép link vào clipboard");
    }
  };

  const handleReport = () => {
    toast("Chức năng báo cáo đang được phát triển", { icon: "ℹ️" });
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {authLoading
              ? "Đang kiểm tra xác thực..."
              : "Đang tải thông tin đấu giá..."}
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!authLoading && !isAuthenticated) {
    return null;
  }

  // Error state
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
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Real-time calculations for display
  const currentTimeStatus = auction ? getAuctionTimeStatus(auction.startTime, auction.endTime) : null;
  const currentTimeLeft = auction ? calculateTimeLeft(auction.startTime, auction.endTime) : '';
  const currentStatus = auction ? getAuctionStatus(auction.startTime, auction.endTime) : 'upcoming';

  return (
    <div className="min-h-screen bg-gray-50">
      <AuctionHeader
        title={auction.title || ''}
        bidCount={auction.bidCount || 0}
        timeLeft={currentTimeLeft}
        viewers={auction.viewers || 0}
        isWatching={isWatching}
        onWatch={handleWatch}
      />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 2xl:grid-cols-7 xl:grid-cols-5 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="2xl:col-span-4 xl:col-span-3 lg:col-span-3 space-y-6">
            {currentStatus === 'ended' ? (
              <AuctionResultsList bids={auction.bids} />
            ) : currentStatus === 'upcoming' ? (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                <Clock className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Phiên đấu giá chưa bắt đầu
                </h3>
                <p className="text-gray-600 mb-4">
                  Phiên đấu giá sẽ bắt đầu vào {auction.startTime.toLocaleString('vi-VN')}
                </p>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {currentTimeLeft}
                </div>
                <div className="text-sm text-gray-500">
                  Cập nhật mỗi giây
                </div>
              </div>
            ) : (
              <BiddingSection
                currentBid={auction.currentBid || 0}
                minBid={(auction.currentBid || 0) + (auction.bidIncrement || 100000)}
                bidIncrement={auction.bidIncrement || 100000}
                timeLeft={currentTimeLeft}
                isActive={currentTimeStatus?.isActive || false}
                status={currentStatus}
                onBid={handleBid}
                onAutoBid={handleAutoBid}
              />
            )}

            <AuctionDetails
              description={auction.description || ''}
              startTime={auction.startTime}
              endTime={auction.endTime}
              location={auction.location || ''}
              organizer={auction.organizer}
              documents={auction.documents || []}
              terms={auction.terms || []}
            />
          </div>

          {/* Sidebar */}
          <div className="2xl:col-span-3 xl:col-span-2 lg:col-span-1 space-y-8">
            <BidHistory bids={auction.bids} />

            {/* Status Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-8">
                Trạng thái đấu giá
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-base text-gray-600">
                    Trạng thái
                  </span>
                  <div className="flex items-center space-x-3">
                    {currentStatus === 'ended' ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-red-500" />
                        <span className="text-base font-semibold text-red-600">
                          Đã kết thúc
                        </span>
                      </>
                    ) : currentStatus === 'upcoming' ? (
                      <>
                        <Clock className="h-5 w-5 text-blue-500" />
                        <span className="text-base font-semibold text-blue-600">
                          Sắp diễn ra
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-5 w-5 text-green-500" />
                        <span className="text-base font-semibold text-green-600">
                          Đang diễn ra
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-base text-gray-600">
                    Lượt đấu giá
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    {auction.bidCount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-base text-gray-600">
                    Người xem
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    {auction.viewers}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 min-w-0 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-8">
                Thao tác nhanh
              </h3>

              <div className="space-y-6">
                <button
                  onClick={handleWatch}
                  className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-lg border transition-colors whitespace-nowrap ${
                    isWatching
                      ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-base font-semibold">
                    {isWatching ? "Bỏ theo dõi" : "Theo dõi đấu giá"}
                  </span>
                </button>

                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  <span className="text-base font-semibold">
                    Chia sẻ đấu giá
                  </span>
                </button>

                <button
                  onClick={handleReport}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  <span className="text-base font-semibold">
                    Báo cáo vi phạm
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}