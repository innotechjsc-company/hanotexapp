"use client";

import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center group">
      <div className="w-28 h-16 min-w-[112px] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
        <img src="/logo.png" alt="HANOTEX Logo" className="w-full h-full object-contain" />
      </div>
    </Link>
  );
}

