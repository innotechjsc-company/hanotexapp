"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from "lucide-react";

interface TechShowcaseProps {
  technologies: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    trl: number;
    owner: string;
    featured?: boolean;
  }>;
}

export default function TechShowcase({ technologies }: TechShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const featuredTechs = technologies.filter(tech => tech.featured);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredTechs.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, featuredTechs.length]);

  const currentTech = featuredTechs[currentIndex];

  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Công nghệ nổi bật
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Khám phá những công nghệ đột phá đang được niêm yết trên sàn giao dịch
          </p>
        </div>

        {/* Main Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Featured Technology Display */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
            <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden">
              {/* Technology Image/Video */}
              <div className="aspect-video relative bg-gradient-to-br from-gray-800 to-gray-900">
                <Image
                  src={currentTech?.image || "/images/tech-placeholder.jpg"}
                  alt={currentTech?.title || "Technology showcase"}
                  fill
                  className="object-cover"
                />
                
                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-20 h-20 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8 text-white" />
                    ) : (
                      <Play className="h-8 w-8 text-white ml-1" />
                    )}
                  </button>
                </div>

                {/* Control Bar */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full hover:bg-white/30 transition-colors duration-300"
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4 text-white" />
                      ) : (
                        <Volume2 className="h-4 w-4 text-white" />
                      )}
                    </button>
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="p-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full hover:bg-white/30 transition-colors duration-300"
                    >
                      <Maximize className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-sm font-medium">
                      {currentIndex + 1} / {featuredTechs.length}
                    </span>
                    <button
                      onClick={() => setCurrentIndex(0)}
                      className="p-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full hover:bg-white/30 transition-colors duration-300"
                    >
                      <RotateCcw className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Technology Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30">
                    {currentTech?.category}
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full border border-green-500/30">
                    TRL {currentTech?.trl}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">
                  {currentTech?.title}
                </h3>
                
                <p className="text-blue-100 mb-4">
                  {currentTech?.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-blue-200">
                    Bởi: <span className="font-semibold text-white">{currentTech?.owner}</span>
                  </div>
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Thumbnails */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-6">Công nghệ khác</h3>
            <div className="space-y-3">
              {featuredTechs.map((tech, index) => (
                <div
                  key={tech.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`group cursor-pointer p-4 rounded-2xl border transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-white/20 border-white/40"
                      : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden">
                      <Image
                        src={tech.image || "/images/tech-placeholder.jpg"}
                        alt={tech.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-1">{tech.title}</h4>
                      <p className="text-blue-200 text-sm mb-2">{tech.description}</p>
                      <div className="flex items-center space-x-3">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30">
                          {tech.category}
                        </span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded border border-green-500/30">
                          TRL {tech.trl}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technology Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "AI & ML", count: 45, color: "from-blue-500 to-cyan-500" },
            { name: "Biotech", count: 32, color: "from-green-500 to-emerald-500" },
            { name: "Digital", count: 67, color: "from-purple-500 to-pink-500" },
            { name: "Energy", count: 28, color: "from-yellow-500 to-orange-500" }
          ].map((category, index) => (
            <Link
              key={category.name}
              href={`/technologies?search=${encodeURIComponent(category.name)}`}
              className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl font-bold text-white">{category.count}</span>
              </div>
              <h3 className="text-white font-semibold mb-2">{category.name}</h3>
              <p className="text-blue-200 text-sm">{category.count} công nghệ</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
