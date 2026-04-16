import { Timestamp } from "firebase/firestore";

// 장소 카테고리
export type PlaceCategory =
  | "cafe"
  | "restaurant"
  | "trail"
  | "culture"
  | "outdoor"
  | "hidden";

// 이동수단
export type TransportType = "walking" | "car";

// 무드 태그
export type MoodTag =
  | "romantic"
  | "calm"
  | "active"
  | "family"
  | "solo"
  | "pet-friendly";

// 장소
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
  authorId: string;
  authorName: string;
  likes: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 데이트 코스
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

// 사용자
export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: Timestamp;
}

// 찜 (좋아요)
export interface Like {
  userId: string;
  targetId: string;
  targetType: "place" | "course";
  createdAt: Timestamp;
}
