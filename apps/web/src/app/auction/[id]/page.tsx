"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
// Fallback components
interface FallbackHeaderProps {
  title: string;
  bidCount: number;
  timeLeft: string;
  viewers: number;
  isWatching: boolean;
  onWatch: () => void;
}

const FallbackHeader = ({
  title,
  bidCount,
  timeLeft,
  viewers,
  isWatching,
  onWatch,
}: FallbackHeaderProps) => (
  <div className="bg-white p-6 border-b">
    <h1 className="text-2xl font-bold">{title}</h1>
    <div className="flex space-x-4 mt-2 text-sm text-gray-600">
      <span>Lượt đấu giá: {bidCount}</span>
      <span>Thời gian còn lại: {timeLeft}</span>
      <span>Người xem: {viewers}</span>
    </div>
  </div>
);

interface FallbackBiddingProps {
  currentBid: number;
  minBid: number;
  onBid?: (amount: number) => void;
}

const FallbackBidding = ({
  currentBid,
  minBid,
  onBid,
}: FallbackBiddingProps) => (
  <div className="bg-white p-6 rounded-lg border">
    <h3 className="text-xl font-semibold mb-4">Đấu giá</h3>
    <div className="mb-4">
      <p>
        Giá hiện tại: <strong>{currentBid?.toLocaleString() || 0} VNĐ</strong>
      </p>
      <p>
        Giá tối thiểu: <strong>{minBid?.toLocaleString() || 0} VNĐ</strong>
      </p>
    </div>
    <button
      onClick={() => onBid && onBid(minBid)}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Đặt giá {minBid?.toLocaleString() || 0} VNĐ
    </button>
  </div>
);

interface FallbackDetailsProps {
  description: string;
  location: string;
  organizer: Organizer;
}

const FallbackDetails = ({
  description,
  location,
  organizer,
}: FallbackDetailsProps) => (
  <div className="bg-white p-6 rounded-lg border">
    <h3 className="text-xl font-semibold mb-4">Chi tiết đấu giá</h3>
    <div className="space-y-2">
      <p>
        <strong>Mô tả:</strong> {description || "Chưa có mô tả"}
      </p>
      <p>
        <strong>Địa điểm:</strong> {location || "Chưa rõ"}
      </p>
      <p>
        <strong>Tổ chức:</strong> {organizer?.name || "Chưa rõ"}
      </p>
    </div>
  </div>
);

interface FallbackBidHistoryProps {
  bids: Array<{
    id: string;
    amount: number;
    bidder: string;
    timestamp: Date;
    isWinning: boolean;
  }>;
}

const FallbackBidHistory = ({ bids }: FallbackBidHistoryProps) => (
  <div className="bg-white p-6 rounded-lg border">
    <h3 className="text-xl font-semibold mb-4">Lịch sử đấu giá</h3>
    {bids && bids.length > 0 ? (
      <div className="space-y-2">
        {bids.slice(0, 5).map((bid, index: number) => (
          <div key={bid.id || index} className="flex justify-between">
            <span>{bid.bidder}</span>
            <span>{bid.amount.toLocaleString()} VNĐ</span>
          </div>
        ))}
      </div>
    ) : (
      <p>Chưa có lịch sử đấu giá</p>
    )}
  </div>
);

interface FallbackResultsProps {
  bids: Array<{
    id: string;
    amount: number;
    bidder: string;
    timestamp: Date;
    isWinning: boolean;
  }>;
}

const FallbackResults = ({ bids }: FallbackResultsProps) => (
  <div className="bg-white p-6 rounded-lg border">
    <h3 className="text-xl font-semibold mb-4">Kết quả đấu giá</h3>
    <p>Đấu giá đã kết thúc</p>
  </div>
);

// Lazy load components with fallbacks
const AuctionHeader = lazy(() =>
  import("@/components/auction/AuctionHeader").catch(() => ({
    default: FallbackHeader,
  }))
);
const BiddingSection = lazy(() =>
  import("@/components/auction/BiddingSection").catch(() => ({
    default: FallbackBidding,
  }))
);
const BidHistory = lazy(() =>
  import("@/components/auction/BidHistory").catch(() => ({
    default: FallbackBidHistory,
  }))
);
const AuctionDetails = lazy(() =>
  import("@/components/auction/AuctionDetails").catch(() => ({
    default: FallbackDetails,
  }))
);
const AuctionResultsList = lazy(() =>
  import("@/components/auction/AuctionResultsList").catch(() => ({
    default: FallbackResults,
  }))
);
import { Clock, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/store/auth";
import toast from "react-hot-toast";
import { Auction, Organizer, Document, Term } from "@/types/auctions";
import { Bid } from "@/types/bids";
import { getAuctionById } from "@/api/auctions";
import { getBidsByAuction, createBid } from "@/api/bids";
import { payloadApiClient } from "@/api/client";
// Types and interfaces for auction data

// Extended interface for UI components with computed fields
interface UIAuction
  extends Omit<
    Auction,
    "startTime" | "endTime" | "description" | "documents" | "terms" | "bids"
  > {
  // Required UI fields with proper typing
  id: string;
  description: string; // Converted from rich text to plain text
  startTime: Date; // Converted from DateTimeString to Date
  endTime: Date; // Converted from DateTimeString to Date
  timeLeft: string; // Computed field
  isActive: boolean; // Computed field
  documents: Array<{
    id: string;
    name: string;
    url: string;
    size: string;
  }>; // Transformed from Document[] for UI
  terms: string[]; // Simplified from Term[] to string array
  bids: Array<{
    id: string;
    amount: number;
    bidder: string;
    timestamp: Date;
    isWinning: boolean;
  }>; // Transformed from BidHistory[] for UI
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
    currentTime: now,
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
    const hours = Math.floor(
      (timeToStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeToStart % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `Bắt đầu sau ${days} ngày ${hours} giờ`;
    if (hours > 0) return `Bắt đầu sau ${hours} giờ ${minutes} phút`;
    return `Bắt đầu sau ${minutes} phút`;
  }

  // If auction is active, show time until end
  const timeLeft = end - now;
  if (timeLeft <= 0) return "Đã kết thúc";

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  if (days > 0) return `${days} ngày ${hours} giờ`;
  if (hours > 0) return `${hours} giờ ${minutes} phút`;
  if (minutes > 0) return `${minutes} phút ${seconds} giây`;
  return `${seconds} giây`;
};

const getAuctionStatus = (
  startTime: Date,
  endTime: Date
): "upcoming" | "active" | "ended" => {
  const { isPending, isActive, isEnded } = getAuctionTimeStatus(
    startTime,
    endTime
  );

  if (isEnded) return "ended";
  if (isActive) return "active";
  return "upcoming";
};

// Helper function to convert rich text object to string
const extractTextFromRichText = (richText: unknown): string => {
  if (!richText) return "";
  if (typeof richText === "string") return richText;
  if (typeof richText === "object" && richText && "root" in richText) {
    // Handle Lexical/PayloadCMS rich text format
    try {
      const extractText = (node: unknown): string => {
        if (!node) return "";
        if (typeof node === "string") return node;
        if (typeof node === "object" && node && "text" in node) {
          return String(node.text);
        }
        if (
          typeof node === "object" &&
          node &&
          "children" in node &&
          Array.isArray(node.children)
        ) {
          return node.children.map(extractText).join("");
        }
        return "";
      };
      return extractText((richText as { root: unknown }).root);
    } catch (error) {
      console.warn("Error extracting text from rich text:", error);
      return "";
    }
  }
  return String(richText);
};

// Transform CMS data to UI format with enhanced time logic
const transformAuctionData = (auctionData: any): UIAuction => {
  // Data is now returned directly from API function
  // No need to unwrap from data property

  const endTime = new Date(auctionData.endTime || Date.now());
  const startTime = new Date(auctionData.startTime || Date.now());

  // Calculate time-based status
  const timeStatus = getAuctionTimeStatus(startTime, endTime);
  const calculatedStatus = getAuctionStatus(startTime, endTime);

  return {
    // Map base Auction fields
    id: String(auctionData.id || ""),
    title: auctionData.title || "Không có tiêu đề",
    description: extractTextFromRichText(auctionData.description),
    category: auctionData.category || "it", // Default category
    startingPrice: auctionData.startingPrice || 0,
    currentBid: auctionData.currentBid || auctionData.startingPrice || 0,
    minBid: auctionData.minBid || auctionData.startingPrice || 0,
    bidIncrement: auctionData.bidIncrement || 100000,
    location: auctionData.location || "",
    image: auctionData.image || undefined,
    organizer: {
      name: auctionData.organizer?.name || "Không rõ",
      email: auctionData.organizer?.email || "",
      phone: auctionData.organizer?.phone || "",
    },
    status: calculatedStatus,
    viewers: auctionData.viewers || 0,
    bidCount: auctionData.bidCount || 0,
    createdAt: auctionData.createdAt,
    updatedAt: auctionData.updatedAt,

    // UI-specific computed fields
    startTime,
    endTime,
    timeLeft: calculateTimeLeft(startTime, endTime),
    isActive: timeStatus.isActive,

    // Transformed complex fields
    documents: Array.isArray(auctionData.documents)
      ? auctionData.documents.map((doc: Document | any) => ({
          id: String(doc.id || Math.random()),
          name: doc.name || "Document",
          url: typeof doc.file === "string" ? doc.file : doc.file?.url || "",
          size: "N/A",
        }))
      : [],
    terms: Array.isArray(auctionData.terms)
      ? auctionData.terms
          .map((t: Term | any) => {
            if (typeof t === "string") return t;
            if (typeof t === "object" && t && "term" in t)
              return String(t.term);
            return String(t);
          })
          .filter((t: string) => t.trim() !== "")
      : [],
    bids: [], // Will be populated separately
  };
};

const transformBidData = (bid: Bid | any) => ({
  id: String(bid.id || ""),
  amount: Number(bid.amount || 0),
  bidder: String(bid.bidder_name || "Ẩn danh"),
  timestamp: new Date(bid.bid_time || bid.created_at || Date.now()),
  isWinning: Boolean(bid.is_winning || false),
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [isPlacingAutoBid, setIsPlacingAutoBid] = useState(false);

  // Fetch auction and bids data
  const fetchData = async (isInitialLoad = false) => {
    try {
      // Only show loading spinner on initial load, not on refresh
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      // Set authentication token if available
      if (token) {
        payloadApiClient.setToken(token);
      }

      // Fetch auction data using API function
      const auctionData = await getAuctionById(auctionId);
      const transformedAuction = transformAuctionData(auctionData);

      // Fetch bids data using API function
      try {
        const bidsResponse = await getBidsByAuction(auctionId, {
          limit: 50,
          sort: "-bid_time",
        });

        if (bidsResponse.docs && Array.isArray(bidsResponse.docs)) {
          const transformedBids = bidsResponse.docs.map(transformBidData);
          
          const maxBid = Math.max(
            0,
            ...transformedBids.map((bid: any) => bid.amount)
          );

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
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Error fetching auction:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dữ liệu";
      setError(errorMessage);
      // Only show error toast on initial load, not on refresh
      if (isInitialLoad) {
        toast.error(errorMessage);
      }
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  };

  // Main effect - load data (with or without authentication)
  useEffect(() => {
    if (auctionId) {
      fetchData(true); // Initial load
    }
  }, [auctionId]);

  // Real-time clock updates
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(clockInterval);
  }, []);

  // Auto refresh data every 5 seconds
  useEffect(() => {
    if (!auction) return;

    const interval = setInterval(() => {
      fetchData(false); // Refresh, not initial load
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [auction]);

  // Bidding handlers with time-based validation
  const handleBid = async (amount: number) => {
    // Ensure user is authenticated before proceeding
    if (!isAuthenticated || !token) {
      toast.error("Bạn cần đăng nhập để tham gia đấu giá");
      router.push("/auth/login");
      return;
    }

    if (!auction) {
      toast.error("Không tìm thấy thông tin đấu giá");
      return;
    }

    // Time-based validation - only check if auction is active
    const timeStatus = getAuctionTimeStatus(auction.startTime, auction.endTime);

    if (timeStatus.isPending) {
      toast.error("Phiên đấu giá chưa bắt đầu!");
      return;
    }

    if (timeStatus.isEnded) {
      toast.error("Phiên đấu giá đã kết thúc!");
      return;
    }

    // Validate bid amount
    const minBid = (auction.currentBid || 0) + (auction.bidIncrement || 100000);
    if (amount < minBid) {
      toast.error(`Giá đấu phải ít nhất ${minBid.toLocaleString()} VNĐ`);
      return;
    }

    setIsPlacingBid(true);
    
    try {
      // Set authentication token
      if (token) {
        payloadApiClient.setToken(token);
      }

      // Create bid using API function
      await createBid({
        auction_id: auctionId,
        amount,
        bid_type: "MANUAL",
      });

      toast.success("Đặt giá thành công! Chúc bạn may mắn!");
      await fetchData(false); // Refresh after bid
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Có lỗi xảy ra khi đặt giá";
      toast.error(errorMessage);
    } finally {
      setIsPlacingBid(false);
    }
  };

  const handleAutoBid = async (maxAmount: number) => {
    // Ensure user is authenticated before proceeding
    if (!isAuthenticated || !token) {
      toast.error("Bạn cần đăng nhập để sử dụng đấu giá tự động");
      router.push("/auth/login");
      return;
    }

    if (!auction) {
      toast.error("Không tìm thấy thông tin đấu giá");
      return;
    }

    // Time-based validation - only check if auction is active
    const timeStatus = getAuctionTimeStatus(auction.startTime, auction.endTime);

    if (timeStatus.isPending) {
      toast.error("Phiên đấu giá chưa bắt đầu!");
      return;
    }

    if (timeStatus.isEnded) {
      toast.error("Phiên đấu giá đã kết thúc!");
      return;
    }

    // Validate auto-bid amount
    const minBid = (auction.currentBid || 0) + (auction.bidIncrement || 100000);
    if (maxAmount < minBid) {
      toast.error(
        `Giá đấu tự động phải ít nhất ${minBid.toLocaleString()} VNĐ`
      );
      return;
    }

    setIsPlacingAutoBid(true);
    
    try {
      // Set authentication token
      if (token) {
        payloadApiClient.setToken(token);
      }

      // Create auto bid using API function
      await createBid({
        auction_id: auctionId,
        amount: maxAmount,
        bid_type: "AUTO",
      });

      toast.success(
        `Đấu giá tự động đã kích hoạt: ${maxAmount.toLocaleString()} VNĐ`
      );
      await fetchData(false); // Refresh after auto bid
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi đặt giá tự động";
      toast.error(errorMessage);
    } finally {
      setIsPlacingAutoBid(false);
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
            onClick={() => fetchData(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Real-time calculations for display
  const currentTimeStatus = auction
    ? getAuctionTimeStatus(auction.startTime, auction.endTime)
    : null;
  const currentTimeLeft = auction
    ? calculateTimeLeft(auction.startTime, auction.endTime)
    : "";
  const currentStatus = auction
    ? getAuctionStatus(auction.startTime, auction.endTime)
    : "upcoming";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Refresh indicator */}
      {isRefreshing && (
        <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-1 text-sm z-50">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Đang cập nhật dữ liệu...</span>
          </div>
        </div>
      )}

      <Suspense
        fallback={<div className="p-4 text-center">Loading header...</div>}
      >
        <AuctionHeader
          title={auction.title || ""}
          bidCount={auction.bidCount || 0}
          timeLeft={currentTimeLeft}
          viewers={auction.viewers || 0}
          isWatching={isWatching}
          onWatch={handleWatch}
        />
      </Suspense>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 2xl:grid-cols-7 xl:grid-cols-5 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="2xl:col-span-4 xl:col-span-3 lg:col-span-3 space-y-6">
            {currentStatus === "ended" ? (
              <Suspense
                fallback={
                  <div className="p-4 text-center">Loading results...</div>
                }
              >
                <AuctionResultsList bids={auction.bids} />
              </Suspense>
            ) : currentStatus === "upcoming" ? (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                <Clock className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Phiên đấu giá chưa bắt đầu
                </h3>
                <p className="text-gray-600 mb-4">
                  Phiên đấu giá sẽ bắt đầu vào{" "}
                  {auction.startTime.toLocaleString("vi-VN")}
                </p>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {currentTimeLeft}
                </div>
                <div className="text-sm text-gray-500">Cập nhật mỗi giây</div>
              </div>
            ) : (
              <Suspense
                fallback={
                  <div className="p-4 text-center">Loading bidding...</div>
                }
              >
                <BiddingSection
                  currentBid={auction.currentBid || 0}
                  minBid={
                    (auction.currentBid || 0) + (auction.bidIncrement || 100000)
                  }
                  bidIncrement={auction.bidIncrement || 100000}
                  timeLeft={currentTimeLeft}
                  isActive={currentTimeStatus?.isActive || false}
                  status={currentStatus}
                  onBid={handleBid}
                  onAutoBid={handleAutoBid}
                  isPlacingBid={isPlacingBid}
                  isPlacingAutoBid={isPlacingAutoBid}
                />
              </Suspense>
            )}

            <Suspense
              fallback={
                <div className="p-4 text-center">Loading details...</div>
              }
            >
              <AuctionDetails
                description={auction.description || ""}
                startTime={auction.startTime}
                endTime={auction.endTime}
                location={auction.location || ""}
                organizer={auction.organizer}
                documents={auction.documents || []}
                terms={auction.terms || []}
              />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="2xl:col-span-3 xl:col-span-2 lg:col-span-1 space-y-8">
            <Suspense
              fallback={
                <div className="p-4 text-center">Loading bid history...</div>
              }
            >
              <BidHistory bids={auction.bids} />
            </Suspense>

            {/* Status Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-8">
                Trạng thái đấu giá
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-base text-gray-600">Trạng thái</span>
                  <div className="flex items-center space-x-3">
                    {currentStatus === "ended" ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-red-500" />
                        <span className="text-base font-semibold text-red-600">
                          Đã kết thúc
                        </span>
                      </>
                    ) : currentStatus === "upcoming" ? (
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
                  <span className="text-base text-gray-600">Lượt đấu giá</span>
                  <span className="text-base font-semibold text-gray-900">
                    {auction.bidCount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-base text-gray-600">Người xem</span>
                  <span className="text-base font-semibold text-gray-900">
                    {auction.viewers}
                  </span>
                </div>

                {lastRefresh && (
                  <div className="flex items-center justify-between">
                    <span className="text-base text-gray-600">
                      Cập nhật cuối
                    </span>
                    <span className="text-sm text-gray-500">
                      {lastRefresh.toLocaleTimeString("vi-VN")}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-base text-gray-600">
                    Tự động cập nhật
                  </span>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isRefreshing
                          ? "bg-blue-500 animate-pulse"
                          : "bg-green-500"
                      }`}
                    ></div>
                    <span className="text-sm text-gray-500">Mỗi 5 giây</span>
                  </div>
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
