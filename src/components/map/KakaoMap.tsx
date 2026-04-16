"use client";

import Script from "next/script";
import { useRef, useCallback, useState } from "react";
import {
  HWASEONG_SAMPLE_PLACES,
  CATEGORY_COLORS,
  type SamplePlace,
} from "./samplePlaces";

// 화성시청 좌표
const HWASEONG_CENTER = { lat: 37.1996, lng: 126.8312 };
const DEFAULT_LEVEL = 10;

interface KakaoMapProps {
  activeCategory?: string;
}

export default function KakaoMap({ activeCategory = "전체" }: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markersRef = useRef<kakao.maps.CustomOverlay[]>([]);
  const infoWindowRef = useRef<kakao.maps.CustomOverlay | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 마커 오버레이 HTML 생성
  const createMarkerContent = (place: SamplePlace, isActive = false) => {
    const color = CATEGORY_COLORS[place.category] ?? "#0055A5";
    const size = isActive ? "w-4 h-4" : "w-3 h-3";
    return `
      <div class="cursor-pointer flex flex-col items-center" data-id="${place.id}">
        <div class="rounded-full border-2 border-white shadow-md ${size} transition-all"
          style="background-color: ${color}">
        </div>
        <div class="text-[10px] font-bold mt-0.5 bg-white px-1 rounded shadow-sm whitespace-nowrap"
          style="color: ${color}">
          ${place.name}
        </div>
      </div>
    `;
  };

  // InfoWindow 내용 생성
  const createInfoContent = (place: SamplePlace) => {
    const color = CATEGORY_COLORS[place.category] ?? "#0055A5";
    return `
      <div class="bg-white rounded-xl shadow-lg p-3 w-56 text-sm font-sans">
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-block w-2 h-2 rounded-full flex-shrink-0" style="background-color:${color}"></span>
          <span class="font-bold text-gray-900 truncate">${place.name}</span>
        </div>
        <p class="text-gray-500 text-xs leading-relaxed mb-2">${place.description}</p>
        <p class="text-gray-400 text-[10px]">${place.address}</p>
      </div>
    `;
  };

  // 마커 전체 렌더링
  const renderMarkers = useCallback(
    (map: kakao.maps.Map, category: string) => {
      // 기존 마커 제거
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      if (infoWindowRef.current) {
        infoWindowRef.current.setMap(null);
        infoWindowRef.current = null;
      }

      const filtered =
        category === "전체"
          ? HWASEONG_SAMPLE_PLACES
          : HWASEONG_SAMPLE_PLACES.filter((p) => {
              const labelMap: Record<string, string> = {
                카페: "cafe",
                맛집: "restaurant",
                산책로: "trail",
                "전시·문화": "culture",
                야외활동: "outdoor",
                "숨겨진 명소": "hidden",
              };
              return p.category === labelMap[category];
            });

      filtered.forEach((place) => {
        const position = new window.kakao.maps.LatLng(place.lat, place.lng);
        const overlay = new window.kakao.maps.CustomOverlay({
          position,
          content: createMarkerContent(place),
          yAnchor: 1.2,
          clickable: true,
        });
        overlay.setMap(map);

        // 마커 클릭 이벤트 (이벤트 위임)
        window.kakao.maps.event.addListener(overlay, "click", () => {
          // 기존 InfoWindow 닫기
          if (infoWindowRef.current) {
            infoWindowRef.current.setMap(null);
          }
          const infoOverlay = new window.kakao.maps.CustomOverlay({
            position,
            content: createInfoContent(place),
            yAnchor: 2.6,
            zIndex: 10,
          });
          infoOverlay.setMap(map);
          infoWindowRef.current = infoOverlay;
          map.panTo(position);
        });

        markersRef.current.push(overlay);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // 카카오맵 초기화
  const handleScriptLoad = useCallback(() => {
    window.kakao.maps.load(() => {
      if (!containerRef.current) return;

      const options: kakao.maps.MapOptions = {
        center: new window.kakao.maps.LatLng(
          HWASEONG_CENTER.lat,
          HWASEONG_CENTER.lng
        ),
        level: DEFAULT_LEVEL,
      };

      const map = new window.kakao.maps.Map(containerRef.current, options);
      mapRef.current = map;

      renderMarkers(map, activeCategory);
      setIsLoading(false);

      // 지도 클릭 시 InfoWindow 닫기
      window.kakao.maps.event.addListener(map, "click", () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.setMap(null);
          infoWindowRef.current = null;
        }
      });
    });
  }, [activeCategory, renderMarkers]);

  // 내 위치로 이동
  const moveToMyLocation = () => {
    if (!mapRef.current || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = new window.kakao.maps.LatLng(
          coords.latitude,
          coords.longitude
        );
        mapRef.current!.panTo(pos);
        mapRef.current!.setLevel(5, { animate: true });
      },
      () => alert("위치 정보를 가져올 수 없습니다.")
    );
  };

  // 화성시 전체 보기
  const resetView = () => {
    if (!mapRef.current) return;
    mapRef.current.setLevel(DEFAULT_LEVEL, { animate: true });
    mapRef.current.panTo(
      new window.kakao.maps.LatLng(HWASEONG_CENTER.lat, HWASEONG_CENTER.lng)
    );
  };

  return (
    <div className="relative w-full h-full">
      {/* 카카오맵 SDK 로드 */}
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`}
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />

      {/* 지도 컨테이너 */}
      <div ref={containerRef} className="w-full h-full" />

      {/* 로딩 스켈레톤 */}
      {isLoading && (
        <div className="absolute inset-0 bg-surface flex flex-col items-center justify-center gap-3 z-10">
          <div className="w-10 h-10 rounded-full border-3 border-border border-t-primary animate-spin" />
          <p className="text-sm text-muted">지도를 불러오는 중...</p>
        </div>
      )}

      {/* 지도 컨트롤 버튼 */}
      {!isLoading && (
        <div className="absolute bottom-6 right-4 flex flex-col gap-2 z-10">
          <button
            onClick={moveToMyLocation}
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-surface transition-colors border border-border"
            title="내 위치"
          >
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
              />
            </svg>
          </button>
          <button
            onClick={resetView}
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-surface transition-colors border border-border"
            title="화성시 전체 보기"
          >
            <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>
        </div>
      )}

      {/* API 키 미설정 안내 */}
      {!process.env.NEXT_PUBLIC_KAKAO_MAP_KEY && (
        <div className="absolute inset-0 bg-surface/90 flex flex-col items-center justify-center gap-3 z-20">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm text-center">
            <p className="text-sm font-semibold text-foreground mb-2">카카오맵 API 키가 필요합니다</p>
            <p className="text-xs text-muted leading-relaxed">
              <a href="https://developers.kakao.com" className="text-primary underline" target="_blank" rel="noreferrer">
                developers.kakao.com
              </a>
              에서 앱을 생성하고<br />
              <code className="bg-surface px-1 rounded text-[11px]">.env.local</code>에{" "}
              <code className="bg-surface px-1 rounded text-[11px]">NEXT_PUBLIC_KAKAO_MAP_KEY</code>를 설정하세요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
