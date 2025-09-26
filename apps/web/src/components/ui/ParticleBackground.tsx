"use client";
import React, { useMemo } from "react";

interface ParticleBackgroundProps {
  particleCount?: number;
  colors?: string[];
  speed?: number; // 0.1 - 1.0 multiplier
}

export default function ParticleBackground({
  particleCount = 24,
  colors = ["#3b82f6", "#60a5fa", "#93c5fd"],
  speed = 0.4,
}: ParticleBackgroundProps) {
  const particles = useMemo(() => {
    const arr = Array.from({ length: particleCount }).map((_, i) => {
      const size = Math.random() * 3 + 2; // 2-5px
      const left = Math.random() * 100; // vw
      const top = Math.random() * 100; // vh
      const color = colors[i % colors.length];
      const duration = 10 - speed * 6 + Math.random() * 6; // 4s - 16s
      const delay = Math.random() * 5; // 0-5s
      const amp = 10 + Math.random() * 20; // amplitude in px
      const dir = Math.random() > 0.5 ? 1 : -1; // up/down
      return { size, left, top, color, duration, delay, amp, dir };
    });
    return arr;
  }, [particleCount, colors, speed]);

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {particles.map((p, idx) => (
        <span
          key={idx}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            opacity: 0.35,
            filter: "blur(0.2px)",
            animation: `pb-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            transform: `translateY(0px)`,
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes pb-float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

