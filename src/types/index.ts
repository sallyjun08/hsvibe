import { Timestamp } from "firebase/firestore";

// ─── 기본 열거형 ────────────────────────────────────────────────

export type PlaceCategory =
  | "cafe"
  | "restaurant"
  | "trail"
  | "culture"
  | "outdoor"
  | "hidden";

export type TransportType = "walking" | "car";

export type MoodTag =
  | "romantic"
  | "calm"
  | "active"
  | "family"
  | "solo"
  | "pet-friendly";

// ─── 세부 타입 ───────────────────────────────────────────────────

/** 접근성 점수 (1~5, 5가 최고) */
export interface Accessibility {
  walking: number; // 뚜벅이 접근성 (대중교통·도보)
  car: number;     // 자차 편의성 (도로·주차)
}

/** 주차 정보 */
export interface Parking {
  available: boolean;
  info?: string; // 예: "무료 주차장 200대", "유료 1시간 1,000원"
}

// ─── 장소 ───────────────────────────────────────────────────────

/**
 * Firestore: places/{placeId}
 * Storage:   images/places/{placeId}/{filename}
 */
export interface Place {
  id: string;
  name: string;
  description: string;
  category: PlaceCategory;
  address: string;
  lat: number;
  lng: number;
  imageUrls: string[];
  tags: MoodTag[];
  accessibility: Accessibility;
  parking: Parking;
  authorId: string;
  authorName: string;
  likes: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Firestore: places/{placeId}/likes/{userId} */
export interface PlaceLike {
  userId: string;
  createdAt: Timestamp;
}

// ─── 데이트 코스 ─────────────────────────────────────────────────

/**
 * Firestore: courses/{courseId}
 */
export interface Course {
  id: string;
  title: string;
  description: string;
  transport: TransportType;
  moods: MoodTag[];
  placeIds: string[];
  estimatedDuration: number; // 분 단위
  authorId: string;
  authorName: string;
  likes: number;
  createdAt: Timestamp;
}

// ─── 사용자 ─────────────────────────────────────────────────────

/**
 * Firestore: users/{userId}
 * - userId = Firebase Auth UID
 */
export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  myPlaceIds: string[];   // 내가 등록한 장소 ID 목록
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
