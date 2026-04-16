"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Header from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { createPlace } from "@/lib/firebase/places";
import type { PlaceCategory, MoodTag, Accessibility, Parking } from "@/types";

const CATEGORIES: { value: PlaceCategory; label: string }[] = [
  { value: "cafe", label: "☕ 카페" },
  { value: "restaurant", label: "🍽 맛집" },
  { value: "trail", label: "🌿 산책로" },
  { value: "culture", label: "🎨 전시·문화" },
  { value: "outdoor", label: "⛰ 야외활동" },
  { value: "hidden", label: "✨ 숨겨진 명소" },
];

const MOODS: { value: MoodTag; label: string }[] = [
  { value: "romantic", label: "로맨틱" },
  { value: "calm", label: "잔잔한" },
  { value: "active", label: "활동적인" },
  { value: "family", label: "가족 여행" },
  { value: "solo", label: "혼자서도 좋은" },
  { value: "pet-friendly", label: "반려동물 동반" },
];

export default function NewPlacePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<PlaceCategory>("hidden");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [tags, setTags] = useState<MoodTag[]>([]);
  const [accessibility, setAccessibility] = useState<Accessibility>({ walking: 3, car: 3 });
  const [parking, setParking] = useState<Parking>({ available: false, info: "" });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 미로그인 시 로그인 페이지로
  useEffect(() => {
    if (!loading && !user) router.replace("/auth");
  }, [user, loading, router]);

  // 이미지 미리보기
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 4);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  // 무드 태그 토글
  const toggleTag = (tag: MoodTag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Daum 주소 검색
  const openPostcode = () => {
    if (!window.daum?.Postcode) return;
    new window.daum.Postcode({
      oncomplete: (data) => {
        setAddress(data.address);
        // 카카오 Geocoder로 좌표 변환
        if (window.kakao?.maps) {
          window.kakao.maps.load(() => {
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.addressSearch(data.address, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK && result[0]) {
                setLat(result[0].y);
                setLng(result[0].x);
              }
            });
          });
        }
      },
    }).open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name || !description || !address) {
      setError("이름, 설명, 주소는 필수입니다.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const id = await createPlace(
        {
          name,
          category,
          description,
          address,
          lat: parseFloat(lat) || 0,
          lng: parseFloat(lng) || 0,
          tags,
          authorId: user.uid,
          authorName: user.displayName ?? "익명",
          imageUrls: [],
          accessibility,
          parking: { available: parking.available, info: parking.info || undefined },
        },
        images
      );
      router.push(`/places/${id}`);
    } catch (err) {
      console.error(err);
      setError("장소 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) return null;

  return (
    <>
      {/* Daum 주소 검색 + Kakao Geocoder */}
      <Script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="afterInteractive" />
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`}
        strategy="afterInteractive"
        onLoad={() => window.kakao.maps.load(() => {})}
      />

      <Header />
      <main className="flex-1 bg-surface">
        <div className="max-w-screen-sm mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-foreground mb-6">새 장소 등록</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* 장소 이름 */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                장소 이름 <span className="text-secondary">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 제부도 카페, 숨겨진 산책로"
                className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-primary transition-colors"
                maxLength={50}
              />
            </div>

            {/* 카테고리 */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                카테고리 <span className="text-secondary">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`py-2 px-3 rounded-xl text-sm font-medium border transition-colors ${
                      category === cat.value
                        ? "bg-primary text-white border-primary"
                        : "bg-white border-border text-foreground hover:border-primary"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 설명 */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                설명 <span className="text-secondary">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="이 장소만의 매력을 설명해주세요"
                rows={4}
                className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-primary transition-colors resize-none"
                maxLength={300}
              />
              <p className="text-xs text-muted text-right mt-1">{description.length}/300</p>
            </div>

            {/* 주소 */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                주소 <span className="text-secondary">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="주소를 입력하거나 검색하세요"
                  className="flex-1 px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-primary transition-colors"
                  readOnly
                />
                <button
                  type="button"
                  onClick={openPostcode}
                  className="px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition-colors whitespace-nowrap"
                >
                  주소 검색
                </button>
              </div>
              {lat && lng && (
                <p className="text-xs text-muted mt-1">
                  좌표: {parseFloat(lat).toFixed(4)}, {parseFloat(lng).toFixed(4)}
                </p>
              )}
            </div>

            {/* 무드 태그 */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">무드 태그</label>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => toggleTag(mood.value)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      tags.includes(mood.value)
                        ? "bg-secondary text-white border-secondary"
                        : "bg-white border-border text-muted hover:border-secondary"
                    }`}
                  >
                    {mood.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 접근성 점수 */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">접근성 점수</label>
              <div className="flex flex-col gap-4 bg-surface rounded-xl p-4">
                {(["walking", "car"] as const).map((type) => {
                  const label = type === "walking" ? "🚶 뚜벅이 접근성" : "🚗 자차 편의성";
                  const val = accessibility[type];
                  return (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-foreground">{label}</span>
                        <span className="text-sm font-bold text-primary">{val} / 5</span>
                      </div>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setAccessibility((prev) => ({ ...prev, [type]: n }))}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                              val >= n
                                ? "bg-primary text-white border-primary"
                                : "bg-white border-border text-muted"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 주차 정보 */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">주차 정보</label>
              <div className="flex flex-col gap-3 bg-surface rounded-xl p-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={parking.available}
                    onChange={(e) => setParking((p) => ({ ...p, available: e.target.checked }))}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-foreground">주차 가능</span>
                </label>
                {parking.available && (
                  <input
                    type="text"
                    value={parking.info}
                    onChange={(e) => setParking((p) => ({ ...p, info: e.target.value }))}
                    placeholder="예: 무료 주차장 200대, 유료 1시간 1,000원"
                    className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-primary transition-colors bg-white"
                    maxLength={100}
                  />
                )}
              </div>
            </div>

            {/* 사진 업로드 */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">사진 (최대 4장)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 border-2 border-dashed border-border rounded-xl text-sm text-muted hover:border-primary hover:text-primary transition-colors"
              >
                + 사진 추가
              </button>
              {previews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {previews.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={src} alt="" className="w-full aspect-square object-cover rounded-lg" />
                  ))}
                </div>
              )}
            </div>

            {/* 에러 메시지 */}
            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-secondary text-white font-bold rounded-full hover:bg-secondary-dark transition-colors disabled:opacity-60"
            >
              {submitting ? "등록 중..." : "장소 등록하기"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
