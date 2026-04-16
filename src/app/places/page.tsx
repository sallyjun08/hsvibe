"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getPlaces } from "@/lib/firebase/places";
import { HWASEONG_SAMPLE_PLACES, CATEGORY_COLORS, CATEGORY_LABELS } from "@/components/map/samplePlaces";
import type { Place, PlaceCategory } from "@/types";
import type { SamplePlace } from "@/components/map/samplePlaces";

const CATEGORIES: { value: PlaceCategory | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "cafe", label: "카페" },
  { value: "restaurant", label: "맛집" },
  { value: "trail", label: "산책로" },
  { value: "culture", label: "전시·문화" },
  { value: "outdoor", label: "야외활동" },
  { value: "hidden", label: "숨겨진 명소" },
];

// Firestore Place 또는 SamplePlace를 카드 표시용으로 정규화
type DisplayPlace = {
  id: string;
  name: string;
  category: PlaceCategory;
  description: string;
  address: string;
  imageUrls?: string[];
  likes?: number;
};

function toDisplay(p: Place | SamplePlace): DisplayPlace {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description,
    address: p.address,
    imageUrls: "imageUrls" in p ? p.imageUrls : [],
    likes: "likes" in p ? p.likes : 0,
  };
}

export default function PlacesPage() {
  const [places, setPlaces] = useState<DisplayPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<PlaceCategory | "all">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const fetched = await getPlaces(activeCategory === "all" ? undefined : activeCategory);
        if (fetched.length > 0) {
          setPlaces(fetched.map(toDisplay));
        } else {
          // Firestore에 데이터 없으면 샘플 사용
          const sample = activeCategory === "all"
            ? HWASEONG_SAMPLE_PLACES
            : HWASEONG_SAMPLE_PLACES.filter((p) => p.category === activeCategory);
          setPlaces(sample.map(toDisplay));
        }
      } catch {
        // Firebase 미설정 시 샘플 데이터 표시
        const sample = activeCategory === "all"
          ? HWASEONG_SAMPLE_PLACES
          : HWASEONG_SAMPLE_PLACES.filter((p) => p.category === activeCategory);
        setPlaces(sample.map(toDisplay));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeCategory]);

  const filtered = places.filter(
    (p) =>
      !search ||
      p.name.includes(search) ||
      p.description.includes(search) ||
      p.address.includes(search)
  );

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        {/* 상단 검색/필터 */}
        <div className="bg-white border-b border-border sticky top-16 z-30">
          <div className="max-w-screen-xl mx-auto px-4 py-3 flex flex-col gap-3">
            {/* 검색창 */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="장소 이름, 설명으로 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-full bg-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            {/* 카테고리 탭 */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                    activeCategory === cat.value
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-foreground border-border hover:border-primary hover:text-primary"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 장소 그리드 */}
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-52 animate-pulse border border-border" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted">
              <p className="text-base font-medium">검색 결과가 없습니다</p>
              <p className="text-sm mt-1">다른 검색어나 카테고리를 시도해보세요</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted mb-4">총 {filtered.length}개 장소</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((place) => (
                  <Link key={place.id} href={`/places/${place.id}`}>
                    <article className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                      {/* 이미지 or 플레이스홀더 */}
                      <div
                        className="h-36 flex items-center justify-center"
                        style={{ backgroundColor: `${CATEGORY_COLORS[place.category]}18` }}
                      >
                        {place.imageUrls?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={place.imageUrls[0]} alt={place.name} className="w-full h-full object-cover" />
                        ) : (
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold"
                            style={{ backgroundColor: CATEGORY_COLORS[place.category] }}
                          >
                            {place.name[0]}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: CATEGORY_COLORS[place.category] }}
                          >
                            {CATEGORY_LABELS[place.category]}
                          </span>
                        </div>
                        <h3 className="font-bold text-foreground text-sm mt-1">{place.name}</h3>
                        <p className="text-xs text-muted mt-1 line-clamp-2">{place.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-[11px] text-muted truncate max-w-[140px]">{place.address}</p>
                          <span className="flex items-center gap-1 text-xs text-secondary font-medium">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            {place.likes ?? 0}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
