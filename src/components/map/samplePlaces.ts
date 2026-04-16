import type { PlaceCategory, MoodTag, Accessibility, Parking } from "@/types";

export interface SamplePlace {
  id: string;
  name: string;
  category: PlaceCategory;
  tags: MoodTag[];
  lat: number;
  lng: number;
  description: string;
  address: string;
  accessibility: Accessibility;
  parking: Parking;
}

export const HWASEONG_SAMPLE_PLACES: SamplePlace[] = [
  {
    id: "1",
    name: "동탄 호수공원",
    category: "outdoor",
    tags: ["romantic", "calm", "family", "pet-friendly"],
    lat: 37.2052,
    lng: 127.0744,
    description: "동탄2신도시 중심의 대형 호수공원. 산책로, 자전거길, 카페, 분수 쇼가 있어 화성 최고 핫플.",
    address: "경기도 화성시 동탄대로 537",
    accessibility: { walking: 5, car: 4 },
    parking: { available: true, info: "공영 주차장 무료 2시간, 이후 10분당 200원" },
  },
  {
    id: "2",
    name: "융건릉",
    category: "culture",
    tags: ["calm", "solo", "family"],
    lat: 37.2015,
    lng: 126.9818,
    description: "사도세자와 정조대왕의 능. 유네스코 세계문화유산. 소나무 숲길이 아름다운 힐링 명소.",
    address: "경기도 화성시 효행로481번길 30",
    accessibility: { walking: 3, car: 5 },
    parking: { available: true, info: "무료 주차장 (대형버스 가능)" },
  },
  {
    id: "3",
    name: "제부도",
    category: "outdoor",
    tags: ["romantic", "calm", "active", "family"],
    lat: 37.2125,
    lng: 126.6500,
    description: "하루 두 번 열리는 바닷길로 유명한 화성의 작은 섬. 낙조와 해산물이 일품.",
    address: "경기도 화성시 서신면 제부리",
    accessibility: { walking: 1, car: 5 },
    parking: { available: true, info: "입구 공영주차장 유료 (소형 3,000원/일)" },
  },
  {
    id: "4",
    name: "궁평항",
    category: "outdoor",
    tags: ["romantic", "family", "calm"],
    lat: 37.1545,
    lng: 126.6228,
    description: "서해안 최고의 낙조 명소. 신선한 해산물과 탁 트인 서해 뷰가 일품.",
    address: "경기도 화성시 서신면 궁평항로 1049-21",
    accessibility: { walking: 1, car: 5 },
    parking: { available: true, info: "궁평항 주차장 무료" },
  },
  {
    id: "5",
    name: "전곡항 마리나",
    category: "outdoor",
    tags: ["romantic", "family", "active"],
    lat: 37.2872,
    lng: 126.6527,
    description: "요트와 보트가 가득한 서해 마리나 항구. 카페와 레스토랑이 즐비하며 이국적인 분위기.",
    address: "경기도 화성시 우정읍 전곡리 1074",
    accessibility: { walking: 1, car: 5 },
    parking: { available: true, info: "마리나 주차장 무료 (주말 혼잡)" },
  },
  {
    id: "6",
    name: "당성",
    category: "hidden",
    tags: ["active", "solo", "calm"],
    lat: 37.2162,
    lng: 126.7020,
    description: "삼국시대 산성으로 서해를 조망할 수 있는 숨겨진 등산 코스. 정상에서 제부도가 보인다.",
    address: "경기도 화성시 서신면 상안리 산32",
    accessibility: { walking: 2, car: 4 },
    parking: { available: true, info: "입구 소규모 무료 주차 (10대)" },
  },
  {
    id: "7",
    name: "남양성모성지",
    category: "culture",
    tags: ["calm", "solo", "family"],
    lat: 37.2002,
    lng: 126.7755,
    description: "한국 천주교 순교 성지. 조용한 산책로와 성당이 있어 종교 관계없이 힐링 명소.",
    address: "경기도 화성시 남양읍 남양성지로 112",
    accessibility: { walking: 3, car: 5 },
    parking: { available: true, info: "성지 내 무료 주차장" },
  },
  {
    id: "8",
    name: "어섬",
    category: "hidden",
    tags: ["calm", "romantic", "solo"],
    lat: 37.1948,
    lng: 126.6310,
    description: "화성호 안의 작은 섬. 가을 갈대밭과 철새 도래지로 유명. 사진 명소.",
    address: "경기도 화성시 우정읍 화성호 내",
    accessibility: { walking: 2, car: 4 },
    parking: { available: false, info: "인근 갓길 주차 (협소)" },
  },
  {
    id: "9",
    name: "화성 우리꽃식물원",
    category: "outdoor",
    tags: ["family", "calm", "pet-friendly"],
    lat: 37.2235,
    lng: 126.8110,
    description: "국내 자생 식물 900여 종을 한눈에 볼 수 있는 전문 식물원. 사계절 방문 가능.",
    address: "경기도 화성시 팔탄면 희망로 446",
    accessibility: { walking: 2, car: 5 },
    parking: { available: true, info: "식물원 주차장 무료" },
  },
  {
    id: "10",
    name: "동탄 센트럴파크",
    category: "outdoor",
    tags: ["calm", "family", "pet-friendly"],
    lat: 37.2270,
    lng: 127.0693,
    description: "동탄1신도시 중심의 도시 공원. 잔디광장과 분수대, 카페거리가 피크닉과 산책에 제격.",
    address: "경기도 화성시 반송동 산4-1",
    accessibility: { walking: 5, car: 3 },
    parking: { available: true, info: "주변 공영주차장 유료 (10분당 100원)" },
  },
  {
    id: "11",
    name: "화성 공룡알 화석산지",
    category: "hidden",
    tags: ["family", "active", "solo"],
    lat: 37.2050,
    lng: 126.7670,
    description: "세계 최대 규모 공룡알 화석산지(천연기념물 414호). 전망대에서 서해와 화성호 조망 가능.",
    address: "경기도 화성시 송산면 공룡로 11",
    accessibility: { walking: 2, car: 5 },
    parking: { available: true, info: "화석산지 주차장 무료" },
  },
  {
    id: "12",
    name: "롤링힐스 호텔 카페",
    category: "cafe",
    tags: ["romantic", "calm"],
    lat: 37.2065,
    lng: 127.0780,
    description: "동탄의 대표 호텔 내 카페. 호수 뷰와 고급스러운 인테리어로 데이트 명소. 애프터눈 티 인기.",
    address: "경기도 화성시 동탄반석로 160",
    accessibility: { walking: 4, car: 4 },
    parking: { available: true, info: "호텔 주차장 2시간 무료" },
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

// 접근성 점수 라벨 (1~5)
export const ACCESSIBILITY_LABELS = ["", "매우 불편", "불편", "보통", "편리", "매우 편리"];
