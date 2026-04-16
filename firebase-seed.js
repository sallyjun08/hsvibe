/**
 * 화성 바이브 — Firestore 샘플 데이터 시드 스크립트
 *
 * 사용 방법:
 *   1. npm install -D firebase-admin
 *   2. Firebase Console → 프로젝트 설정 → 서비스 계정 → 새 비공개 키 생성
 *   3. 다운로드한 JSON 파일을 프로젝트 루트에 serviceAccountKey.json 으로 저장
 *      (절대 Git에 커밋하지 마세요 — .gitignore에 추가됨)
 *   4. node firebase-seed.js
 */

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

// ── 샘플 장소 데이터 (화성시 핫플) ─────────────────────────────

const PLACES = [
  {
    name: "동탄 호수공원",
    description:
      "동탄2신도시 중심의 대형 호수공원. 산책로, 자전거길, 카페, 분수 쇼가 있어 사계절 내내 붐비는 화성 최고 핫플.",
    category: "outdoor",
    address: "경기도 화성시 동탄대로 537",
    lat: 37.2052,
    lng: 127.0744,
    imageUrls: [],
    tags: ["romantic", "calm", "family", "pet-friendly"],
    accessibility: { walking: 5, car: 4 },
    parking: { available: true, info: "공영 주차장 무료 (2시간), 이후 10분당 200원" },
    authorId: "seed",
    authorName: "화성 바이브",
    likes: 142,
  },
  {
    name: "융건릉",
    description:
      "조선 22대 정조대왕과 사도세자의 능. 유네스코 세계문화유산 조선왕릉 중 하나. 소나무 숲길이 아름다운 힐링 명소.",
    category: "culture",
    address: "경기도 화성시 효행로481번길 30",
    lat: 37.2015,
    lng: 126.9818,
    imageUrls: [],
    tags: ["calm", "solo", "family"],
    accessibility: { walking: 3, car: 5 },
    parking: { available: true, info: "무료 주차장 (대형버스 가능)" },
    authorId: "seed",
    authorName: "화성 바이브",
    likes: 98,
  },
  {
    name: "제부도",
    description:
      "하루 두 번 열리는 바닷길로 유명한 화성의 작은 섬. 낙조가 아름답고 조개구이, 해산물이 맛있다. 드라이브 필수 코스.",
    category: "outdoor",
    address: "경기도 화성시 서신면 제부리",
    lat: 37.2125,
    lng: 126.6500,
    imageUrls: [],
    tags: ["romantic", "calm", "active", "family"],
    accessibility: { walking: 1, car: 5 },
    parking: { available: true, info: "제부도 입구 공영주차장 (유료, 소형 3,000원/일)" },
    authorId: "seed",
    authorName: "화성 바이브",
    likes: 215,
  },
  {
    name: "궁평항",
    description:
      "서해안 최고의 낙조 명소 중 하나. 작은 어항이지만 신선한 해산물과 탁 트인 서해 뷰가 일품. 일몰 사진 명소.",
    category: "outdoor",
    address: "경기도 화성시 서신면 궁평항로 1049-21",
    lat: 37.1545,
    lng: 126.6228,
    imageUrls: [],
    tags: ["romantic", "family", "calm"],
    accessibility: { walking: 1, car: 5 },
    parking: { available: true, info: "궁평항 주차장 무료" },
    authorId: "seed",
    authorName: "화성 바이브",
    likes: 187,
  },
  {
    name: "전곡항 마리나",
    description:
      "요트와 보트가 가득한 서해 마리나 항구. 수상 레저, 카페, 레스토랑이 즐비하며 이국적인 분위기가 매력적.",
    category: "outdoor",
    address: "경기도 화성시 우정읍 전곡리 1074",
    lat: 37.2872,
    lng: 126.6527,
    imageUrls: [],
    tags: ["romantic", "family", "active"],
    accessibility: { walking: 1, car: 5 },
    parking: { available: true, info: "마리나 주차장 무료 (주말 혼잡)" },
    authorId: "seed",
    authorName: "화성 바이브",
    likes: 134,
  },
  {
    name: "당성 (唐城)",
    description:
      "삼국시대 산성으로 서해를 조망할 수 있는 숨겨진 등산 코스. 정상에서 제부도와 서해가 한눈에 보인다.",
    category: "hidden",
    address: "경기도 화성시 서신면 상안리 산32",
    lat: 37.2162,
    lng: 126.7020,
    imageUrls: [],
    tags: ["active", "solo", "calm"],
    accessibility: { walking: 2, car: 4 },
    parking: { available: true, info: "당성 입구 소규모 무료 주차장 (10대)" },
    authorId: "seed",
    authorName: "화성 바이브",
    likes: 56,
  },
  {
    name: "남양성모성지",
    description:
      "한국 천주교 103위 성인 중 한 분이 순교한 성지. 조용한 산책로와 성당, 기도의 집이 있어 종교 관계없이 힐링 명소로 유명.",
    category: "culture",
    address: "경기도 화성시 남양읍 남양성지로 112",
    lat: 37.2002,
    lng: 126.7755,
    imageUrls: [],
    tags: ["calm", "solo", "family"],
    accessibility: { walking: 3, car: 5 },
    parking: { available: true, info: "성지 내 무료 주차장" },
    authorId: "seed",
    authorName: "화성 바이브",
    likes: 72,
  },
  {
    name: "동탄 센트럴파크",
    description:
      "동탄1신도시 중심의 도시 공원. 잔디광장, 분수대, 카페거리가 조성되어 있어 피크닉과 저녁 산책에 제격.",
    category: "outdoor",
    address: "경기도 화성시 반송동 산4-1",
    lat: 37.2270,
    lng: 127.0693,
    imageUrls: [],
    tags: ["calm", "family", "pet-friendly"],
    accessibility: { walking: 5, car: 3 },
    parking: { available: true, info: "주변 공영주차장 (유료, 10분당 100원)" },
    authorId: "seed",
    authorName: "화성 바이브",
    likes: 118,
  },
  {
    name: "어섬",
    description:
      "화성호 안에 위치한 작은 섬. 갈대밭과 철새 도래지로 유명하며, 가을철 갈대 군락이 장관. 사진 명소.",
    category: "hidden",
    address: "경기도 화성시 우정읍 화성호 내",
    lat: 37.1948,
    lng: 126.6310,
    imageUrls: [],
    tags: ["calm", "romantic", "solo"],
    accessibility: { walking: 2, car: 4 },
    parking: { available: false, info: "인근 갓길 주차 (협소)" },
    authorId: "seed",
    authorName: "화성 바이브",
    likes: 43,
  },
  {
    name: "화성 우리꽃식물원",
    description:
      "국내 자생 식물 900여 종을 한곳에서 볼 수 있는 전문 식물원. 온실과 야외 정원이 잘 조성되어 있어 사계절 방문 가능.",
    category: "outdoor",
    address: "경기도 화성시 팔탄면 희망로 446",
    lat: 37.2235,
    lng: 126.8110,
    imageUrls: [],
    tags: ["family", "calm", "pet-friendly"],
    accessibility: { walking: 2, car: 5 },
    parking: { available: true, info: "식물원 주차장 무료" },
    authorId: "seed",
    authorName: "화성 바이브",
    likes: 89,
  },
  {
    name: "화성 공룡알 화석산지",
    description:
      "세계 최대 규모의 공룡알 화석 산지(천연기념물 414호). 전망대에서 서해와 화성호 조망 가능. 아이들과 가기 좋은 숨겨진 명소.",
    category: "hidden",
    address: "경기도 화성시 송산면 공룡로 11",
    lat: 37.2050,
    lng: 126.7670,
    imageUrls: [],
    tags: ["family", "active", "solo"],
    accessibility: { walking: 2, car: 5 },
    parking: { available: true, info: "공룡알 화석지 주차장 무료" },
    authorId: "seed",
    authorName: "화성 바이브",
    likes: 61,
  },
  {
    name: "동탄 롤링힐스 호텔 카페",
    description:
      "동탄의 대표 호텔 내 카페. 탁 트인 호수 뷰와 고급스러운 인테리어로 데이트 명소. 애프터눈 티 세트가 인기.",
    category: "cafe",
    address: "경기도 화성시 동탄반석로 160",
    lat: 37.2065,
    lng: 127.0780,
    imageUrls: [],
    tags: ["romantic", "calm"],
    accessibility: { walking: 4, car: 4 },
    parking: { available: true, info: "호텔 주차장 (2시간 무료 검증 필요)" },
    authorId: "seed",
    authorName: "화성 바이브",
    likes: 103,
  },
];

// ── 샘플 유저 데이터 ───────────────────────────────────────────

const USERS = [
  {
    id: "seed_user_1",
    displayName: "화성탐험가",
    email: "explorer@hsvibe.kr",
    photoURL: null,
    bio: "화성시 구석구석을 탐험하는 로컬 가이드",
    myPlaceIds: [],
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  },
];

// ── 시드 실행 ───────────────────────────────────────────────────

async function seed() {
  console.log("🌱 화성 바이브 시드 데이터 업로드 시작...\n");

  const batch = db.batch();

  // places 업로드
  for (const place of PLACES) {
    const ref = db.collection("places").doc();
    batch.set(ref, {
      ...place,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`  📍 ${place.name}`);
  }

  // users 업로드
  for (const user of USERS) {
    const { id, ...userData } = user;
    const ref = db.collection("users").doc(id);
    batch.set(ref, userData);
    console.log(`  👤 ${user.displayName}`);
  }

  await batch.commit();
  console.log(`\n✅ 완료! ${PLACES.length}개 장소, ${USERS.length}명 유저 업로드됨`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ 시드 실패:", err);
  process.exit(1);
});
