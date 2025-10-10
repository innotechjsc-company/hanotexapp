"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ArrowRight,
  TrendingUp,
  Users,
  Award,
  Zap,
  Plus,
  Target,
  Rocket,
  Globe,
  Lightbulb,
  Cpu,
  Database,
  Microscope,
  Beaker,
  Code,
  Shield,
  Network,
  Brain,
  Atom,
  Wifi,
  Smartphone,
  Laptop,
  Server,
  Cloud,
  Lock,
  CheckCircle,
  Play,
  ChevronRight,
} from "lucide-react";
import AnimatedIcon from "@/components/ui/AnimatedIcon";
import ParticleBackground from "@/components/ui/ParticleBackground";

// Custom hook for counter animation
const useCountUp = (
  end: number,
  duration: number = 2000,
  shouldStart: boolean = false
) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) {
      setCount(0);
      return;
    }

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, shouldStart]);

  return count;
};

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (typeof window !== "undefined") {
        window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      }
    }
  };

  // Intersection Observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
        rootMargin: "0px 0px -50px 0px", // Trigger slightly before element is fully visible
      }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  const stats = [
    {
      icon: TrendingUp,
      label: "Công nghệ",
      description:
        "Nguồn công nghệ xác thực từ viện – trường – doanh nghiệp Việt Nam",
      value: 500,
      suffix: "+",
      color: "from-red-500 to-red-600",
      animation: "bounce" as const,
      duration: 2000,
    },
    {
      icon: Users,
      label: "Người dùng",
      value: 2500,
      description: "Mạng lưới chuyên gia – tổ chức – nhà đầu tư đang hoạt động",
      suffix: "+",
      color: "from-red-600 to-red-700",
      animation: "pulse" as const,
      duration: 2500,
    },
    {
      icon: Award,
      label: "Giao dịch",
      description: "Giao dịch công nghệ, kết nối",
      subDescription: "nhu cầu, đấu giá, chuyển giao",
      value: 150,
      suffix: "+",
      color: "from-red-500 to-red-700",
      animation: "float" as const,
      duration: 1800,
    },
    {
      icon: Zap,
      label: "TRL Level",
      description: "Đa dạng mức độ sẵn sàng",
      subDescription: "công nghệ",
      value: 9,
      suffix: "",
      prefix: "1-",
      color: "from-red-400 to-red-600",
      animation: "rotate" as const,
      duration: 1500,
    },
  ];

  // Counter hooks for each stat
  const techCount = useCountUp(stats[0].value, stats[0].duration, statsVisible);
  const userCount = useCountUp(stats[1].value, stats[1].duration, statsVisible);
  const transactionCount = useCountUp(
    stats[2].value,
    stats[2].duration,
    statsVisible
  );
  const trlCount = useCountUp(stats[3].value, stats[3].duration, statsVisible);

  // Format display values
  const displayValues = [
    `${techCount}${stats[0].suffix}`,
    `${userCount.toLocaleString()}${stats[1].suffix}`,
    `${transactionCount}${stats[2].suffix}`,
    `${stats[3].prefix}${trlCount}`,
  ];

  const techIcons = [
    { icon: Cpu, color: "text-blue-500", delay: 0 },
    { icon: Database, color: "text-green-500", delay: 200 },
    { icon: Microscope, color: "text-purple-500", delay: 400 },
    { icon: Beaker, color: "text-orange-500", delay: 600 },
    { icon: Code, color: "text-pink-500", delay: 800 },
    { icon: Shield, color: "text-red-500", delay: 1000 },
    { icon: Network, color: "text-indigo-500", delay: 1200 },
    { icon: Brain, color: "text-teal-500", delay: 1400 },
    { icon: Atom, color: "text-yellow-500", delay: 1600 },
    { icon: Wifi, color: "text-cyan-500", delay: 1800 },
    { icon: Smartphone, color: "text-emerald-500", delay: 2000 },
    { icon: Laptop, color: "text-violet-500", delay: 2200 },
  ];

  const features = [
    {
      icon: Rocket,
      title: "Đăng ký & Định danh",
      subTitle: "tài sản KH&CN",
      description:
        "Niêm yết và xác thực công nghệ – sản phẩm – kết quả nghiên cứu",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      href: "/technologies",
    },
    {
      icon: Target,
      title: "Tìm đối tác – Kết nối",
      subTitle: "cơ hội",
      description:
        "Khám phá nhu cầu chuyển giao, thương mại hóa, hợp tác đầu tư",
      color: "bg-gradient-to-r from-green-500 to-green-600",
      href: "/demands",
    },
    {
      icon: Award,
      title: "Giao dịch & Đấu giá công nghệ",
      description: "Tham gia đấu giá minh bạch,",
      subDescription: "bảo hộ pháp lý và định giá quốc tế",
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      href: "/auctions",
    },
    {
      icon: Users,
      title: "Mạng lưới chuyên gia KH&CN",
      description: "Tư vấn, phản biện, đồng hành",
      subDescription: "phát triển giải pháp công nghệ",
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      href: "/contact",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">
        {/* Particle Background */}
        <ParticleBackground
          particleCount={30}
          colors={["#2563EB", "#3b82f6", "#60a5fa", "#93c5fd"]}
          speed={0.3}
        />

        {/* Background Images with Parallax Effect */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=2125&h=1200&fit=crop')",
            }}
          />
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=2125&h=1200&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-blue-700/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Animated Tech Icons Background */}
        <div className="absolute inset-0 overflow-hidden">
          {techIcons.map((tech, index) => (
            <div
              key={index}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${tech.delay}ms`,
                animationDuration: `${3000 + Math.random() * 2000}ms`,
              }}
            >
              <div
                className={`${tech.color} opacity-20 hover:opacity-40 transition-opacity duration-300`}
              >
                <tech.icon className="h-8 w-8 md:h-12 md:w-12" />
              </div>
            </div>
          ))}
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full animate-pulse" />
          <div className="absolute top-40 right-20 w-24 h-24 bg-blue-400/20 rounded-full animate-pulse animation-delay-200" />
          <div className="absolute bottom-32 left-20 w-16 h-16 bg-blue-600/20 rounded-full animate-pulse animation-delay-400" />
          <div className="absolute bottom-20 right-10 w-28 h-28 bg-blue-300/20 rounded-full animate-pulse animation-delay-600" />

          <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-white/5 rounded-lg rotate-45 animate-spin-slow" />
          <div className="absolute top-2/3 right-1/3 w-16 h-16 bg-white/5 rounded-lg rotate-12 animate-spin-slow animation-delay-1000" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo and Brand */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <AnimatedIcon animation="bounce" delay={500}>
                    <Rocket className="h-12 w-12 text-white" />
                  </AnimatedIcon>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    {`Sàn Giao Dịch Công Nghệ Hà Nội`.toUpperCase()}
                  </h2>
                </div>
              </div>
            </div>
            <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8">
              HANOTEX là sàn giao dịch công nghệ Hà Nội do UBND Thành phố Hà Nội
              chỉ đạo phát triển, được Sở Khoa học và Công nghệ Hà Nội chủ trì
              triển khai, nhằm kết nối toàn diện giữa công nghệ, tài chính,
              chuyên gia và chính sách, thúc đẩy thương mại hóa kết quả nghiên
              cứu và phát triển thị trường KH&CN Thủ đô.{" "}
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="max-w-4xl mx-auto mb-16">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative bg-white border border-gray-200 rounded-2xl p-2 shadow-lg">
                  <div className="flex items-center">
                    <Search className="absolute left-6 text-blue-600 h-6 w-6 z-10" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm công nghệ, nhu cầu, chuyên gia, giải pháp đổi mới sáng tạo…"
                      className="w-full pl-16 pr-40 py-5 text-xl bg-transparent text-blue-900 placeholder-blue-700 focus:outline-none focus:ring-0"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      Tìm kiếm
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative cursor-pointer"
                style={{ animationDelay: `${index * 200}ms` }}
                onClick={() => router.push(feature.href)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 h-full">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl md:text-xl font-semibold text-white mb-2">
                    {feature.title}
                    <br />
                    {feature.subTitle}
                  </h3>
                  <p className="text-white/80 text-sm">{feature.description}</p>
                  <p className="text-white/80 text-sm">
                    {feature.subDescription}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link
              href="/technologies/register"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white hover:text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
              <div className="relative flex items-center">
                <Plus className="h-6 w-6 mr-3" />
                <div className="flex flex-col items-center text-center leading-tight">
                  <p>Gửi công nghệ lên sàn</p>
                  <p className="text-sm">
                    Định danh – Niêm yết – Kết nối đầu tư
                  </p>
                </div>
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <Link
              href="/demands/register"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 hover:text-gray-900 bg-yellow-400 border-2 border-yellow-500 rounded-2xl hover:bg-yellow-500 hover:border-yellow-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center">
                <Target className="h-6 w-6 mr-3" />
                <div className="flex flex-col items-center text-center leading-tight">
                  <p>Đăng nhu cầu kết nối</p>
                  <p className="text-sm">
                    Tìm giải pháp công nghệ phù hợp doanh nghiệp
                  </p>
                </div>
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Technology Categories Section */}
      <section className="relative bg-gradient-to-br from-red-900 via-red-800 to-red-700 overflow-hidden py-20">
        {/* Particle Background */}
        <ParticleBackground
          particleCount={40}
          colors={["#DC2626", "#EF4444", "#F87171", "#FCA5A5"]}
          speed={0.2}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-3xl lg:text-5xl font-bold text-white mb-6">
              H
              {`Ệ SINH THÁI CÔNG NGHỆ TIÊN TIẾN ĐANG CHỜ BẠN`.toLocaleLowerCase()}
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              HANOTEX là nền tảng trung gian công nghệ do thành phố trực tiếp
              định hướng, nơi doanh nghiệp và cá nhân tìm thấy lợi thế cạnh
              tranh bằng kết nối và đổi mới.
            </p>
          </div>

          {/* Stats with Enhanced Design */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-red-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                  <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 group-hover:bg-white/20 transition-all duration-300">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} mb-3 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <AnimatedIcon
                        animation={stat.animation}
                        delay={index * 200}
                        size="lg"
                        className="text-white"
                      >
                        <stat.icon className="h-8 w-8" />
                      </AnimatedIcon>
                    </div>
                    <div className="flex items-baseline justify-center gap-2 leading-tight whitespace-nowrap text-center">
                      <span className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-red-200 via-white to-red-200 bg-clip-text text-transparent drop-shadow-sm">
                        {displayValues[index]}
                      </span>
                      <span className="text-white/80 text-xs md:text-sm font-semibold uppercase tracking-wide">
                        {stat.label}
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-white/70 text-xs md:text-sm leading-snug">
                        {stat.description}
                      </p>
                      <p className="text-white/70 text-xs md:text-sm leading-snug">
                        {stat.subDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* White Section - Call to Action */}
      {/* <section className="relative bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Sẵn sàng bắt đầu hành trình công nghệ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Tham gia ngay hôm nay để khám phá, kết nối và phát triển cùng cộng
            đồng công nghệ Hà Nội
          </p>

          {/* CTA Buttons with alternating colors */}
      {/* <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16"> */}
      {/* <Link
              href="/auth/register"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Users className="h-6 w-6 mr-3" />
              Đăng ký tài khoản
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-red-600 rounded-2xl hover:bg-red-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Lightbulb className="h-6 w-6 mr-3" />
              Tìm hiểu thêm
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </div> */}

      {/* Features Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Nền tảng tin cậy",
                description: "Được hỗ trợ bởi thành phố Hà Nội",
                icon: Shield,
                color: "text-blue-600",
              },
              {
                title: "Đổi mới sáng tạo",
                description: "Thúc đẩy những ý tưởng đột phá",
                icon: Lightbulb,
                color: "text-red-600",
              },
              {
                title: "Kết nối toàn cầu",
                description: "Mạng lưới đối tác quốc tế",
                icon: Globe,
                color: "text-blue-600",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group text-center p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div> */}
      {/* </div> */}
      {/* </section>  */}
    </div>
  );
}
