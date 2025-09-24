"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({
  targetDate,
  className = "",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return (
      <div className={`bg-gray-100 rounded-lg p-6 text-center ${className}`}>
        <Clock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Sự kiện đã bắt đầu
        </h3>
        <p className="text-gray-500">Thời gian đếm ngược đã kết thúc</p>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-lg p-6 ${className}`}
    >
      <div className="flex items-center justify-center mb-4">
        <Clock className="h-6 w-6 mr-2" />
        <h3 className="text-lg font-semibold">Thời gian bắt đầu</h3>
      </div>

      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="bg-white bg-opacity-20 rounded-lg p-3">
          <div className="text-2xl font-bold">{timeLeft.days}</div>
          <div className="text-sm opacity-90">ngày</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-3">
          <div className="text-2xl font-bold">{timeLeft.hours}</div>
          <div className="text-sm opacity-90">giờ</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-3">
          <div className="text-2xl font-bold">{timeLeft.minutes}</div>
          <div className="text-sm opacity-90">phút</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-3">
          <div className="text-2xl font-bold">{timeLeft.seconds}</div>
          <div className="text-sm opacity-90">giây</div>
        </div>
      </div>

      <div className="text-center mt-4 text-primary-100">
        <span className="text-sm">
          {timeLeft.days > 0 && `${timeLeft.days} ngày `}
          {timeLeft.hours} giờ {timeLeft.minutes} phút {timeLeft.seconds} giây
        </span>
      </div>
    </div>
  );
}
