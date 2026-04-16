"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCourses } from "@/lib/firebase/courses";
import { HWASEONG_SAMPLE_PLACES, CATEGORY_COLORS } from "@/components/map/samplePlaces";
import type { Course, TransportType, MoodTag } from "@/types";

// Firestore에 데이터 없을 때 사용할 샘플 코스
const SAMPLE_COURSES: Omit<Course, "createdAt">[] = [
  {
    id: "c1",
    title: "서해 감성 드라이브 코스",
    description: "화성시 서해안을 따라 달리며 바다, 일몰, 항구를 즐기는 로맨틱 드라이브 코스.",
    transport: "car",
    moods: ["romantic", "calm"],
    placeIds: ["7", "3", "1"],
    estimatedDuration: 240,
    authorId: "",
    authorName: "화성 바이브",
    likes: 18,
  },
  {
    id: "c2",
    title: "화성 역사 문화 산책",
    description: "세계문화유산 융건릉에서 시작해 남양성모성지까지. 걸어서 만나는 화성의 깊은 역사.",
    transport: "walking",
    moods: ["calm", "solo", "family"],
    placeIds: ["2", "5"],
    estimatedDuration: 180,
    authorId: "",
    authorName: "화성 바이브",
    likes: 12,
  },
  {
    id: "c3",
    title: "활동적인 야외 탐험 코스",
    description: "당성 등산부터 식물원 산책, 전곡항 마리나까지. 온종일 화성의 자연을 만끽하는 코스.",
    transport: "car",
    moods: ["active", "family"],
    placeIds: ["4", "8", "6"],
    estimatedDuration: 300,
    authorId: "",
    authorName: "화성 바이브",
    likes: 9,
  },
  {
    id: "c4",
    title: "혼자 떠나는 힐링 코스",
    description: "어섬 갈대밭에서 자연을 느끼고 남양성모성지에서 고요한 시간을 보내는 솔로 여행.",
    transport: "walking",
    moods: ["solo", "calm"],
    placeIds: ["7", "5"],
    estimatedDuration: 150,
    authorId: "",
    authorName: "화성 바이브",
    likes: 7,
  },
];

const MOOD_LABELS: Record<string, string> = {
  romantic: "로맨틱",
  calm: "잔잔한",
  active: "활동적인",
  family: "가족 여행",
  solo: "혼자서도 좋은",
  "pet-friendly": "반려동물 동반",
};

type TransportFilter = "all" | TransportType;
type MoodFilter = "all" | MoodTag;

export default function CoursesPage() {
  const [courses, setCourses] = useState<Omit<Course, "createdAt">[]>([]);
  const [loading, setLoading] = useState(true);
  const [transport, setTransport] = useState<TransportFilter>("all");
  const [mood, setMood] = useState<MoodFilter>("all");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const fetched = await getCourses({
          transport: transport === "all" ? undefined : transport,
          mood: mood === "all" ? undefined : mood,
        });
        setCourses(fetched.length > 0 ? fetched : SAMPLE_COURSES);
      } catch {
        setCourses(SAMPLE_COURSES);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [transport, mood]);

  const filtered = courses.filter((c) => {
    const matchTransport = transport === "all" || c.transport === transport;
    const matchMood = mood === "all" || c.moods.includes(mood as MoodTag);
    return matchTransport && matchMood;
  });

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        {/* 필터 바 */}
        <div className="bg-white border-b border-border sticky top-16 z-30">
          <div className="max-w-screen-xl mx-auto px-4 py-3 flex flex-wrap gap-3">
            {/* 이동수단 */}
            <div className="flex gap-2">
              {(["all", "walking", "car"] as TransportFilter[]).map((t) => {
                const label = t === "all" ? "전체" : t === "walking" ? "🚶 뚜벅이" : "🚗 자차";
                return (
                  <button
                    key={t}
                    onClick={() => setTransport(t)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      transport === t
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-foreground border-border hover:border-primary hover:text-primary"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* 무드 */}
            <div className="flex gap-2 overflow-x-auto">
              {(["all", "romantic", "calm", "active", "family", "solo"] as MoodFilter[]).map((m) => {
                const label = m === "all" ? "모든 무드" : MOOD_LABELS[m];
                return (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      mood === m
                        ? "bg-secondary text-white border-secondary"
                        : "bg-white text-muted border-border hover:border-secondary hover:text-secondary"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 코스 목록 */}
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          {loading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-40 animate-pulse border border-border" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted">
              <p className="text-base font-medium">해당 조건의 코스가 없습니다</p>
              <p className="text-sm mt-1">다른 이동수단이나 무드를 선택해보세요</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map((course) => {
                const coursePlaces = course.placeIds
                  .map((pid) => HWASEONG_SAMPLE_PLACES.find((p) => p.id === pid))
                  .filter(Boolean);

                return (
                  <article key={course.id} className="bg-white rounded-2xl border border-border p-5 hover:shadow-md transition-shadow">
                    {/* 상단: 제목 + 배지 */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-foreground text-base leading-snug">{course.title}</h3>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          course.transport === "car"
                            ? "bg-primary/10 text-primary"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {course.transport === "car" ? "🚗 자차" : "🚶 뚜벅이"}
                        </span>
                      </div>
                    </div>

                    {/* 설명 */}
                    <p className="text-sm text-muted mt-2 leading-relaxed">{course.description}</p>

                    {/* 장소 흐름 */}
                    <div className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-1">
                      {coursePlaces.map((place, idx) => {
                        if (!place) return null;
                        const color = CATEGORY_COLORS[place.category];
                        return (
                          <div key={place.id} className="flex items-center gap-1.5 flex-shrink-0">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: color }}>
                              <span className="opacity-70">{idx + 1}</span>
                              {place.name}
                            </div>
                            {idx < coursePlaces.length - 1 && (
                              <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* 하단: 무드 태그 + 소요시간 + 찜 */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <div className="flex flex-wrap gap-1.5">
                        {course.moods.map((m) => (
                          <span key={m} className="text-[11px] px-2 py-0.5 bg-surface border border-border rounded-full text-muted">
                            {MOOD_LABELS[m]}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-muted">
                          약 {Math.floor(course.estimatedDuration / 60)}시간
                          {course.estimatedDuration % 60 > 0 && ` ${course.estimatedDuration % 60}분`}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-secondary font-medium">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          {course.likes}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
