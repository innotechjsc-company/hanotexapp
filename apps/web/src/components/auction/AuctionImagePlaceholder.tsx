"use client";

import { 
  Cpu, 
  Microscope, 
  Zap, 
  Atom, 
  Heart, 
  Wheat, 
  Building, 
  Car,
  Smartphone,
  Database,
  Network,
  Brain,
  Beaker,
  Code,
  Shield,
  Globe,
  Wifi,
  Laptop,
  Cloud,
  Lock,
  CheckCircle,
  Play,
  ChevronRight,
  Gavel,
  Star,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Filter,
  Search
} from "lucide-react";

interface AuctionImagePlaceholderProps {
  category: string;
  title?: string;
  className?: string;
}

// Category to icon mapping
const getCategoryIcon = (category: string) => {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('thông tin') || categoryLower.includes('ict') || categoryLower.includes('phần mềm') || categoryLower.includes('nhúng')) {
    return { icon: Cpu, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-100' };
  }
  if (categoryLower.includes('sinh học') || categoryLower.includes('y dược') || categoryLower.includes('y tế')) {
    return { icon: Microscope, color: 'from-green-500 to-green-600', bgColor: 'bg-green-100' };
  }
  if (categoryLower.includes('năng lượng') || categoryLower.includes('môi trường')) {
    return { icon: Zap, color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-100' };
  }
  if (categoryLower.includes('vật liệu') || categoryLower.includes('cơ khí')) {
    return { icon: Atom, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-100' };
  }
  if (categoryLower.includes('nông nghiệp') || categoryLower.includes('thực phẩm')) {
    return { icon: Wheat, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-100' };
  }
  if (categoryLower.includes('xây dựng') || categoryLower.includes('kiến trúc')) {
    return { icon: Building, color: 'from-gray-500 to-gray-600', bgColor: 'bg-gray-100' };
  }
  if (categoryLower.includes('giao thông') || categoryLower.includes('vận tải')) {
    return { icon: Car, color: 'from-indigo-500 to-indigo-600', bgColor: 'bg-indigo-100' };
  }
  if (categoryLower.includes('ai') || categoryLower.includes('trí tuệ nhân tạo') || categoryLower.includes('machine learning')) {
    return { icon: Brain, color: 'from-pink-500 to-pink-600', bgColor: 'bg-pink-100' };
  }
  if (categoryLower.includes('blockchain') || categoryLower.includes('crypto')) {
    return { icon: Shield, color: 'from-cyan-500 to-cyan-600', bgColor: 'bg-cyan-100' };
  }
  if (categoryLower.includes('iot') || categoryLower.includes('internet of things')) {
    return { icon: Wifi, color: 'from-teal-500 to-teal-600', bgColor: 'bg-teal-100' };
  }
  if (categoryLower.includes('cloud') || categoryLower.includes('đám mây')) {
    return { icon: Cloud, color: 'from-sky-500 to-sky-600', bgColor: 'bg-sky-100' };
  }
  if (categoryLower.includes('mobile') || categoryLower.includes('di động')) {
    return { icon: Smartphone, color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-100' };
  }
  if (categoryLower.includes('database') || categoryLower.includes('cơ sở dữ liệu')) {
    return { icon: Database, color: 'from-amber-500 to-amber-600', bgColor: 'bg-amber-100' };
  }
  if (categoryLower.includes('network') || categoryLower.includes('mạng')) {
    return { icon: Network, color: 'from-violet-500 to-violet-600', bgColor: 'bg-violet-100' };
  }
  if (categoryLower.includes('software') || categoryLower.includes('phần mềm')) {
    return { icon: Code, color: 'from-rose-500 to-rose-600', bgColor: 'bg-rose-100' };
  }
  if (categoryLower.includes('security') || categoryLower.includes('bảo mật')) {
    return { icon: Lock, color: 'from-red-500 to-red-600', bgColor: 'bg-red-100' };
  }
  
  // Default fallback
  return { icon: Gavel, color: 'from-slate-500 to-slate-600', bgColor: 'bg-slate-100' };
};

export default function AuctionImagePlaceholder({ 
  category, 
  title, 
  className = "w-full h-48" 
}: AuctionImagePlaceholderProps) {
  const { icon: Icon, color, bgColor } = getCategoryIcon(category);
  
  return (
    <div className={`${className} ${bgColor} flex items-center justify-center relative overflow-hidden`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full -translate-x-8 -translate-y-8"></div>
      </div>
      
      {/* Main icon */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className={`p-6 rounded-2xl bg-gradient-to-br ${color} shadow-lg mb-3`}>
          <Icon className="h-12 w-12 text-white" />
        </div>
        
        {/* Category text */}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700 mb-1">
            {category}
          </p>
          {title && (
            <p className="text-xs text-gray-500 line-clamp-2 max-w-32">
              {title}
            </p>
          )}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full opacity-30"></div>
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-white rounded-full opacity-20"></div>
      <div className="absolute top-1/3 right-6 w-1.5 h-1.5 bg-white rounded-full opacity-25"></div>
    </div>
  );
}
