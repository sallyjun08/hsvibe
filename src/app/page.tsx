"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import KakaoMap from "@/components/map/KakaoMap";
import Link from "next/link";

const CATEGORIES = ["전체", "카페", "맛집", "산책로", "전시·문화", "야외활동", "숨겨진 명소"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("전체");

  return (
    <>
      <Header />

      {/* 카테고리 필터 바 */}
      <div className="sticky top-16 z-40 bg-white border-b border-border">
        <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                activeCategory === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-foreground border-border hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 지도 (나머지 화면 전체) */}
      <main className="flex-1 relative">
        <KakaoMap activeCategory={activeCategory} />

        {/* 장소 등록 플로팅 버튼 */}
        <Link
          href="/places/new"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-5 py-2.5 bg-secondary text-white text-sm font-bold rounded-full shadow-lg hover:bg-secondary-dark transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          장소 등록
        </Link>
      </main>
    </>
  );
}
