"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getPlaceById, likePlace } from "@/lib/firebase/places";
import { HWASEONG_SAMPLE_PLACES, CATEGORY_COLORS, CATEGORY_LABELS } from "@/components/map/samplePlaces";
import { useAuth } from "@/contexts/AuthContext";
import type { Place } from "@/types";

const MOOD_LABELS: Record<string, string> = {
  romantic: "로맨틱",
  calm: "잔잔한",
  active: "활동적인",
  family: "가족 여행",
  solo: "혼자서도 좋은",
  "pet-friendly": "반려동물 동반",
};

export default function PlaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPlaceById(id);
        if (data) {
          setPlace(data);
          setLikeCount(data.likes);
        } else {
          // 샘플 데이터에서 찾기
          const sample = HWASEONG_SAMPLE_PLACES.find((p) => p.id === id);
          if (sample) {
            setPlace({ ...sample, imageUrls: [], likes: 0, authorId: "", authorName: "화성 바이브" } as unknown as Place);
          } else {
            router.replace("/places");
          }
        }
      } catch {
        const sample = HWASEONG_SAMPLE_PLACES.find((p) => p.id === id);
        if (sample) {
          setPlace({ ...sample, imageUrls: [], likes: 0, authorId: "", authorName: "화성 바이브" } as unknown as Place);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, router]);

  const handleLike = async () => {
    if (!user) { router.push("/auth"); return; }
    if (liked) return;
    setLiked(true);
    setLikeCount((c) => c + 1);
    try {
      await likePlace(user.uid, id);
    } catch {
      setLiked(false);
      setLikeCount((c) => c - 1);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-border border-t-primary animate-spin" />
        </div>
      </>
    );
  }

  if (!place) return null;

  const color = CATEGORY_COLORS[place.category] ?? "#0055A5";

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        {/* 헤더 이미지 */}
        <div
          className="w-full h-56 sm:h-72 flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          {place.imageUrls?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={place.imageUrls[0]} alt={place.name} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-4xl font-bold"
              style={{ backgroundColor: color }}
            >
              {place.name[0]}
            </div>
          )}
        </div>

        {/* 본문 */}
        <div className="max-w-screen-md mx-auto px-4 py-6">
          {/* 뒤로 가기 */}
          <Link href="/places" className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary mb-4 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            장소 목록
          </Link>

          <div className="bg-white rounded-2xl border border-border p-6">
            {/* 카테고리 배지 + 이름 */}
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
              style={{ backgroundColor: color }}
            >
              {CATEGORY_LABELS[place.category]}
            </span>
            <h1 className="text-2xl font-bold text-foreground mt-3">{place.name}</h1>

            {/* 주소 */}
            <p className="text-sm text-muted mt-1 flex items-center gap-1">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {place.address}
            </p>

            {/* 설명 */}
            <p className="text-sm text-foreground leading-relaxed mt-4">{place.description}</p>

            {/* 무드 태그 */}
            {place.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {place.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 bg-surface border border-border rounded-full text-muted">
                    {MOOD_LABELS[tag] ?? tag}
                  </span>
                ))}
              </div>
            )}

            {/* 구분선 */}
            <div className="my-5 h-px bg-border" />

            {/* 찜하기 + 등록자 */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted">
                등록자: <span className="font-medium text-foreground">{place.authorName || "화성 바이브"}</span>
              </div>
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                  liked
                    ? "bg-secondary/10 border-secondary text-secondary"
                    : "border-border text-muted hover:border-secondary hover:text-secondary"
                }`}
              >
                <svg className="w-4 h-4" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                찜하기 {likeCount > 0 && likeCount}
              </button>
            </div>
          </div>

          {/* 지도 (좌표 정보가 있을 때) */}
          {place.lat && place.lng && (
            <div className="mt-4 bg-white rounded-2xl border border-border p-4">
              <h2 className="text-sm font-semibold text-foreground mb-3">위치</h2>
              <div
                className="w-full h-40 rounded-xl flex items-center justify-center text-sm text-muted"
                style={{ backgroundColor: `${color}10` }}
              >
                <span>지도: {place.lat.toFixed(4)}, {place.lng.toFixed(4)}</span>
              </div>
              <a
                href={`https://map.kakao.com/link/map/${place.name},${place.lat},${place.lng}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center justify-center gap-2 w-full py-2 border border-border rounded-xl text-sm text-foreground hover:bg-surface transition-colors"
              >
                카카오맵에서 보기
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
