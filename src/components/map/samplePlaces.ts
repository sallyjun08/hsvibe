import type { PlaceCategory, MoodTag } from "@/types";

export interface SamplePlace {
  id: string;
  name: string;
  category: PlaceCategory;
  tags: MoodTag[];
  lat: number;
  lng: number;
  description: string;
  address: string;
}

export const HWASEONG_SAMPLE_PLACES: SamplePlace[] = [
  {
    id: "1",
    name: "제부도",
    category: "outdoor",
    tags: ["romantic", "calm", "active"],
    lat: 37.2136,
    lng: 126.6497,
    description: "썰물 때 열리는 바닷길로 유명한 화성의 작은 섬. 일몰 명소.",
    address: "경기도 화성시 서신면 제부리",
  },
  {
    id: "2",
    name: "융건릉",
    category: "culture",
    tags: ["calm", "solo", "family"],
    lat: 37.2018,
    lng: 126.9817,
    description: "사도세자와 정조대왕의 능. 유네스코 세계문화유산.",
    address: "경기도 화성시 효행로481번길 30",
  },
  {
    id: "3",
    name: "궁평항",
    category: "outdoor",
    tags: ["romantic", "calm", "family"],
    lat: 37.1542,
    lng: 126.6225,
    description: "서해안 일몰이 아름다운 항구. 신선한 해산물과 낙조 명소.",
    address: "경기도 화성시 서신면 궁평항로 1049-21",
  },
  {
    id: "4",
    name: "당성",
    category: "hidden",
    tags: ["active", "solo", "calm"],
    lat: 37.2167,
    lng: 126.7017,
    description: "서해를 바라보는 삼국시대 산성. 등산로와 역사 탐방 코스.",
    address: "경기도 화성시 서신면 상안리 산32",
  },
  {
    id: "5",
    name: "남양성모성지",
    category: "culture",
    tags: ["calm", "solo", "family"],
    lat: 37.2003,
    lng: 126.7756,
    description: "한국 천주교 성지. 조용한 산책로와 성당이 있는 힐링 명소.",
    address: "경기도 화성시 남양읍 남양성지로 112",
  },
  {
    id: "6",
    name: "전곡항",
    category: "outdoor",
    tags: ["family", "active", "romantic"],
    lat: 37.2878,
    lng: 126.6522,
    description: "요트와 보트가 가득한 마리나 항구. 카페와 레스토랑이 즐비.",
    address: "경기도 화성시 우정읍 전곡리",
  },
  {
    id: "7",
    name: "어섬",
    category: "hidden",
    tags: ["calm", "romantic", "solo"],
    lat: 37.1947,
    lng: 126.6311,
    description: "화성호 안에 있는 작은 섬. 갈대밭과 철새 도래지로 유명.",
    address: "경기도 화성시 우정읍 화성호",
  },
  {
    id: "8",
    name: "화성 우리꽃식물원",
    category: "outdoor",
    tags: ["family", "calm", "pet-friendly"],
    lat: 37.2233,
    lng: 126.8108,
    description: "국내 자생 식물을 한눈에 볼 수 있는 식물원. 사계절 전시.",
    address: "경기도 화성시 팔탄면 희망로 446",
  },
];

// 카테고리별 포인트 색상
export const CATEGORY_COLORS: Record<string, string> = {
  cafe: "#FF6B00",
  restaurant: "#e74c3c",
  trail: "#27ae60",
  culture: "#8e44ad",
  outdoor: "#0055A5",
  hidden: "#f39c12",
};

export const CATEGORY_LABELS: Record<string, string> = {
  cafe: "카페",
  restaurant: "맛집",
  trail: "산책로",
  culture: "전시·문화",
  outdoor: "야외활동",
  hidden: "숨겨진 명소",
};
