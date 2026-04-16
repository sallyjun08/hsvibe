"use client";

import Script from "next/script";
import { useRef, useCallback, useState, useEffect } from "react";
import { CATEGORY_COLORS } from "./samplePlaces";
import type { PlaceCategory } from "@/types";

// 화성시청 기준 좌표
const HWASEONG_CENTER = { lat: 37.1996, lng: 126.8312 };
const DEFAULT_LEVEL = 10;
const LONG_PRESS_MS = 700;

export interface MapPlaceData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: PlaceCategory;
  description: string;
  address: string;
  accessibility?: { walking: number; car: number };
}

interface KakaoMapProps {
  places: MapPlaceData[];
  onLongPress?: (lat: number, lng: number) => void;
}

export default function KakaoMap({ places, onLongPress }: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markersRef = useRef<kakao.maps.CustomOverlay[]>([]);
  const infoWindowRef = useRef<kakao.maps.CustomOverlay | null>(null);
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressStartRef = useRef<{ x: number; y: number } | null>(null);
  const pressIndicatorRef = useRef<kakao.maps.CustomOverlay | null>(null);

  // places는 렌더 중에 항상 최신값을 ref에 보관 (SDK 로드 콜백 안에서 참조)
  const placesRef = useRef<MapPlaceData[]>(places);
  placesRef.current = places;

  const [isLoading, setIsLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  // ── 마커 생성 HTML ───────────────────────────────────────────
  const makeMarkerHTML = (place: MapPlaceData) => {
    const color = CATEGORY_COLORS[place.category] ?? "#0055A5";
    return `
      <div class="cursor-pointer flex flex-col items-center select-none" style="pointer-events:auto">
        <div style="width:14px;height:14px;border-radius:50%;background:${color};
             border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.25)"></div>
        <div style="font-size:10px;font-weight:700;margin-top:2px;background:white;
             padding:1px 4px;border-radius:4px;box-shadow:0 1px 4px rgba(0,0,0,.15);
             color:${color};white-space:nowrap;max-width:80px;overflow:hidden;text-overflow:ellipsis">
          ${place.name}
        </div>
      </div>`;
  };

  const makeInfoHTML = (place: MapPlaceData) => {
    const color = CATEGORY_COLORS[place.category] ?? "#0055A5";
    const acc = place.accessibility;
    const accHtml = acc
      ? `<div style="display:flex;gap:8px;margin-top:6px;font-size:10px;color:#6b7280">
           <span>🚶 ${acc.walking}/5</span>
           <span>🚗 ${acc.car}/5</span>
         </div>`
      : "";
    return `
      <div style="background:white;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,.12);
           padding:12px;width:220px;font-family:sans-serif;position:relative">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
          <span style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0;display:inline-block"></span>
          <span style="font-weight:700;font-size:13px;color:#111;overflow:hidden;
               text-overflow:ellipsis;white-space:nowrap">${place.name}</span>
        </div>
        <p style="font-size:11px;color:#6b7280;line-height:1.5;margin:0 0 4px">${place.description}</p>
        <p style="font-size:10px;color:#9ca3af;margin:0">${place.address}</p>
        ${accHtml}
      </div>`;
  };

  // ── 마커 렌더링 (places 배열 기반) ──────────────────────────
  const renderMarkers = useCallback((map: kakao.maps.Map, list: MapPlaceData[]) => {
    // 기존 마커 제거
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    if (infoWindowRef.current) {
      infoWindowRef.current.setMap(null);
      infoWindowRef.current = null;
    }

    list.forEach((place) => {
      const position = new window.kakao.maps.LatLng(place.lat, place.lng);
      const overlay = new window.kakao.maps.CustomOverlay({
        position,
        content: makeMarkerHTML(place),
        yAnchor: 1.2,
        clickable: true,
        zIndex: 3,
      });
      overlay.setMap(map);

      window.kakao.maps.event.addListener(overlay, "click", () => {
        if (infoWindowRef.current) infoWindowRef.current.setMap(null);
        const info = new window.kakao.maps.CustomOverlay({
          position,
          content: makeInfoHTML(place),
          yAnchor: 2.5,
          zIndex: 5,
        });
        info.setMap(map);
        infoWindowRef.current = info;
        map.panTo(position);
      });

      markersRef.current.push(overlay);
    });
  }, []); // eslint-disable-line

  // ── places 변경 시 마커 재렌더링 ────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    renderMarkers(mapRef.current, places);
  }, [places, mapReady, renderMarkers]);

  // ── 롱프레스 헬퍼 ───────────────────────────────────────────
  const clearLongPress = useCallback(() => {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    pressTimerRef.current = null;
    if (pressIndicatorRef.current) {
      pressIndicatorRef.current.setMap(null);
      pressIndicatorRef.current = null;
    }
  }, []);

  const startLongPress = useCallback((clientX: number, clientY: number) => {
    clearLongPress();
    pressStartRef.current = { x: clientX, y: clientY };

    pressTimerRef.current = setTimeout(() => {
      const map = mapRef.current;
      const container = containerRef.current;
      if (!map || !container) return;

      const rect = container.getBoundingClientRect();
      const point = new window.kakao.maps.Point(clientX - rect.left, clientY - rect.top);
      const latlng = map.getProjection().coordsFromContainerPoint(point);

      // 오렌지 핀 표시
      const indicator = new window.kakao.maps.CustomOverlay({
        position: latlng,
        content: `<div style="width:20px;height:20px;border-radius:50%;
                   background:#FF6B00;border:3px solid white;
                   box-shadow:0 2px 8px rgba(255,107,0,.6)"></div>`,
        yAnchor: 0.5,
        zIndex: 20,
      });
      indicator.setMap(map);
      pressIndicatorRef.current = indicator;

      onLongPress?.(latlng.getLat(), latlng.getLng());

      // 1.5초 후 핀 제거
      setTimeout(() => {
        indicator.setMap(null);
        if (pressIndicatorRef.current === indicator) pressIndicatorRef.current = null;
      }, 1500);
    }, LONG_PRESS_MS);
  }, [clearLongPress, onLongPress]);

  // ── SDK 로드 & 지도 초기화 ───────────────────────────────────
  const handleScriptLoad = useCallback(() => {
    window.kakao.maps.load(() => {
      if (!containerRef.current || mapRef.current) return;

      const map = new window.kakao.maps.Map(containerRef.current, {
        center: new window.kakao.maps.LatLng(HWASEONG_CENTER.lat, HWASEONG_CENTER.lng),
        level: DEFAULT_LEVEL,
      });
      mapRef.current = map;

      renderMarkers(map, placesRef.current);
      setIsLoading(false);
      setMapReady(true);

      // 지도 클릭 → InfoWindow 닫기
      window.kakao.maps.event.addListener(map, "click", () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.setMap(null);
          infoWindowRef.current = null;
        }
      });

      // ── 롱프레스 이벤트 (DOM 수준) ───────────────────────
      const el = containerRef.current!;

      // 데스크탑
      el.addEventListener("mousedown", (e) => startLongPress(e.clientX, e.clientY));
      el.addEventListener("mouseup", clearLongPress);
      el.addEventListener("mousemove", (e) => {
        if (!pressStartRef.current) return;
        const dx = Math.abs(e.clientX - pressStartRef.current.x);
        const dy = Math.abs(e.clientY - pressStartRef.current.y);
        if (dx > 8 || dy > 8) clearLongPress();
      });

      // 모바일
      el.addEventListener("touchstart", (e) => {
        const t = e.touches[0];
        startLongPress(t.clientX, t.clientY);
      }, { passive: true });
      el.addEventListener("touchend", clearLongPress);
      el.addEventListener("touchmove", clearLongPress);
    });
  }, [renderMarkers, startLongPress, clearLongPress]);

  // ── 내 위치 ─────────────────────────────────────────────────
  const moveToMyLocation = () => {
    if (!mapRef.current || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = new window.kakao.maps.LatLng(coords.latitude, coords.longitude);
        mapRef.current!.panTo(pos);
        mapRef.current!.setLevel(4, { animate: true });
      },
      () => alert("위치 정보를 가져올 수 없습니다.")
    );
  };

  // ── 화성시 전체 보기 ─────────────────────────────────────────
  const resetView = () => {
    mapRef.current?.setLevel(DEFAULT_LEVEL, { animate: true });
    mapRef.current?.panTo(
      new window.kakao.maps.LatLng(HWASEONG_CENTER.lat, HWASEONG_CENTER.lng)
    );
  };

  // ── 렌더 ────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-full">
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`}
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />

      {/* 지도 영역 */}
      <div ref={containerRef} className="w-full h-full" />

      {/* 로딩 */}
      {isLoading && (
        <div className="absolute inset-0 bg-surface flex flex-col items-center justify-center gap-3 z-10">
          <div className="w-10 h-10 rounded-full border-[3px] border-border border-t-primary animate-spin" />
          <p className="text-sm text-muted">지도를 불러오는 중...</p>
        </div>
      )}

      {/* 롱프레스 안내 토스트 */}
      {mapReady && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <p className="bg-black/50 text-white text-xs px-3 py-1.5 rounded-full">
            지도를 길게 눌러 장소를 등록하세요
          </p>
        </div>
      )}

      {/* 우측 컨트롤 */}
      {mapReady && (
        <div className="absolute bottom-24 right-4 flex flex-col gap-2 z-10">
          <button
            onClick={moveToMyLocation}
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-surface transition-colors border border-border"
            title="내 위치"
          >
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </button>
          <button
            onClick={resetView}
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-surface transition-colors border border-border"
            title="화성시 전체 보기"
          >
            <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      )}

      {/* API 키 미설정 안내 */}
      {!process.env.NEXT_PUBLIC_KAKAO_MAP_KEY && (
        <div className="absolute inset-0 bg-surface/90 flex items-center justify-center z-20 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">카카오맵 API 키 필요</p>
            <p className="text-xs text-muted leading-relaxed">
              <a href="https://developers.kakao.com" className="text-primary underline" target="_blank" rel="noreferrer">
                developers.kakao.com
              </a>에서 앱 생성 후<br />
              <code className="bg-surface px-1 rounded">.env.local</code>에{" "}
              <code className="bg-surface px-1 rounded">NEXT_PUBLIC_KAKAO_MAP_KEY</code> 추가
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
