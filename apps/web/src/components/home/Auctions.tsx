"use client";

import { useState, useEffect } from "react";
import { Cpu, Rocket, Zap, type LucideIcon } from "lucide-react";
import { getAuctions } from "@/api/auctions";

// --- DATA TYPES ---
interface LiveAuction {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  currentPrice: number;
  endTime: Date;
}

interface UpcomingAuction {
  icon: string;
  title: string;
  time: string;
}

interface AuctionData {
  liveAuctions: LiveAuction[];
  upcomingAuctions: UpcomingAuction[];
}

// --- UTILITY FUNCTIONS ---
const calculateAuctionStatus = (
  startTime: string | Date | undefined,
  endTime: string | Date | undefined
): "upcoming" | "active" | "ended" | "cancelled" => {
  if (!startTime || !endTime) return "cancelled";
  const now = new Date().getTime();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (now < start) return "upcoming";
  if (now >= start && now < end) return "active";
  return "ended";
};

const getRandomAuctionImage = (auctionId: string): string => {
  const imageIndex = (parseInt(auctionId.slice(-2), 16) % 7) + 1; // Simple hash for consistent images
  return `https://picsum.photos/400/300?random=${imageIndex}`;
};

const formatPrice = (price: number): string => {
  if (price >= 1_000_000_000) {
    return `${(price / 1_000_000_000).toFixed(1)} tỷ VND`;
  }
  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toFixed(1)} triệu VND`;
  }
  return `${price.toLocaleString("vi-VN")} VND`;
};

// --- DYNAMIC ICON COMPONENT ---
const iconMap: { [key: string]: LucideIcon } = { Cpu, Rocket, Zap };
const DynamicIcon = ({ name }: { name: string }) => {
  const Icon = iconMap[name];
  return Icon ? <Icon className="h-6 w-6" /> : null;
};

// --- CUSTOM HOOKS ---
const useCountdown = (endDate: Date) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;
      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
        return;
      }
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft({
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate]);
  return timeLeft;
};

// --- CHILD COMPONENTS ---
const CountdownTimer = ({ endTime }: { endTime: Date }) => {
  const { hours, minutes, seconds } = useCountdown(endTime);
  return (
    <span className="text-red-500 font-bold">{`${hours}:${minutes}:${seconds}`}</span>
  );
};

const LoadingSkeleton = () => (
  <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2 bg-white/10 animate-pulse rounded-2xl p-8">
      <div className="h-8 bg-gray-400/50 rounded w-3/4 mb-6"></div>
      <div className="h-40 bg-gray-500/20 rounded-xl p-6 mt-6"></div>
      <div className="h-40 bg-gray-500/20 rounded-xl p-6 mt-6"></div>
    </div>
    <div className="space-y-8">
      <div className="bg-white/10 animate-pulse rounded-2xl p-6 h-48"></div>
      <div className="bg-white/10 animate-pulse rounded-2xl p-6 h-48"></div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
export default function AuctionsSection() {
  const [data, setData] = useState<AuctionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await getAuctions(
          {},
          { limit: 10, sort: "-createdAt" }
        );
        const auctionsList = response.docs || [];

        const processedAuctions = auctionsList.map((auction: any) => {
          const status = calculateAuctionStatus(
            auction.start_time,
            auction.end_time
          );
          return { ...auction, status };
        });

        const liveAuctions = processedAuctions
          .filter((a) => a.status === "active")
          .slice(0, 2)
          .map((a) => ({
            id: a.id,
            title: a.title || "Không có tiêu đề",
            description: a.description || "Không có mô tả",
            imageUrl: getRandomAuctionImage(a.id),
            currentPrice: a.current_price || a.start_price || 0,
            endTime: new Date(a.end_time),
          }));

        const upcomingAuctions = processedAuctions
          .filter((a) => a.status === "upcoming")
          .slice(0, 2)
          .map((a) => ({
            icon: "Cpu", // Default icon, can be customized later
            title: a.title || "Không có tiêu đề",
            time: `Bắt đầu: ${new Date(a.start_time).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`,
          }));

        setData({ liveAuctions, upcomingAuctions });
      } catch (err) {
        setError("Không thể tải dữ liệu đấu giá.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Static data for stats section as per design
  const auctionStats = [
    { label: "Phiên đấu giá hoạt động", value: "24" },
    { label: "Người tham gia", value: "1,456" },
    { label: "Giá trị trung bình", value: "2.1 tỷ" },
    { label: "Thành công trong tuần", value: "18" },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Đấu giá Công nghệ
          </h2>
          <p className="text-lg text-purple-200 max-w-3xl mx-auto">
            Tham gia đấu giá để sở hữu những công nghệ tiên tiến và sản phẩm
            khoa học độc quyền
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="lg:col-span-3 text-center text-red-400 bg-red-900/50 rounded-xl p-8">
              <p>{error}</p>
            </div>
          ) : (
            data && (
              <>
                <div className="lg:col-span-2 bg-white text-gray-900 rounded-2xl p-8 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">
                      Phiên đấu giá đang diễn ra
                    </h3>
                    {data.liveAuctions.length > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="space-y-6">
                    {data.liveAuctions.length > 0 ? (
                      data.liveAuctions.map((auction) => (
                        <div
                          key={auction.id}
                          className="bg-gray-50 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6"
                        >
                          <img
                            src={auction.imageUrl}
                            alt={auction.title}
                            className="w-full sm:w-40 h-32 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-lg mb-1">
                              {auction.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                              {auction.description}
                            </p>
                            <div className="flex justify-between items-end">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Giá hiện tại
                                </p>
                                <p className="text-2xl font-bold text-purple-700">
                                  {formatPrice(auction.currentPrice)}
                                </p>
                              </div>
                              <button className="bg-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                                Đặt giá thầu
                              </button>
                            </div>
                          </div>
                          <div className="text-right sm:text-center">
                            <p className="text-xs text-gray-500">
                              Thời gian còn lại
                            </p>
                            <CountdownTimer endTime={auction.endTime} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        Không có phiên đấu giá nào đang diễn ra.
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-purple-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Thống kê đấu giá</h3>
                    <ul className="space-y-3">
                      {auctionStats.map((stat) => (
                        <li
                          key={stat.label}
                          className="flex justify-between items-center text-purple-200"
                        >
                          <span>{stat.label}</span>
                          <span className="font-bold text-white">
                            {stat.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-purple-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Đấu giá sắp tới</h3>
                    <ul className="space-y-4">
                      {data.upcomingAuctions.length > 0 ? (
                        data.upcomingAuctions.map((item) => (
                          <li key={item.title} className="flex items-center">
                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                              <DynamicIcon name={item.icon} />
                            </div>
                            <div>
                              <p className="font-semibold">{item.title}</p>
                              <p className="text-sm text-purple-300">
                                {item.time}
                              </p>
                            </div>
                          </li>
                        ))
                      ) : (
                        <p className="text-purple-300">
                          Chưa có phiên đấu giá nào sắp tới.
                        </p>
                      )}
                    </ul>
                  </div>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </section>
  );
}
