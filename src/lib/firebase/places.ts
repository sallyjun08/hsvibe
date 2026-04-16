import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  addDoc,
  doc,
  updateDoc,
  increment,
  runTransaction,
  serverTimestamp,
  type QueryConstraint,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./config";
import type { Place, PlaceCategory } from "@/types";

// ── 조회 ─────────────────────────────────────────────────────────

/** 쿼터 절약: 기본 최대 50개, 카테고리 필터 지원 */
export async function getPlaces(
  category?: PlaceCategory,
  pageLimit = 50
): Promise<Place[]> {
  const constraints: QueryConstraint[] = [
    orderBy("createdAt", "desc"),
    limit(pageLimit),
  ];
  if (category) constraints.unshift(where("category", "==", category));

  const q = query(collection(db, "places"), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Place);
}

export async function getPlaceById(id: string): Promise<Place | null> {
  const snap = await getDoc(doc(db, "places", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Place;
}

/** 특정 유저가 등록한 장소 */
export async function getPlacesByAuthor(authorId: string): Promise<Place[]> {
  const q = query(
    collection(db, "places"),
    where("authorId", "==", authorId),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Place);
}

// ── 생성 ─────────────────────────────────────────────────────────

/**
 * 장소 등록 + 이미지 Storage 업로드
 * Storage 경로: images/places/{placeId}/{index}_{filename}
 */
export async function createPlace(
  data: Omit<Place, "id" | "likes" | "createdAt" | "updatedAt">,
  imageFiles: File[]
): Promise<string> {
  // 먼저 문서 ID를 확보한 뒤 Storage 경로에 사용
  const placeRef = doc(collection(db, "places"));

  const imageUrls = await Promise.all(
    imageFiles.slice(0, 4).map(async (file, idx) => {
      const ext = file.name.split(".").pop() ?? "jpg";
      const storageRef = ref(
        storage,
        `images/places/${placeRef.id}/${idx + 1}.${ext}`
      );
      const snapshot = await uploadBytes(storageRef, file);
      return getDownloadURL(snapshot.ref);
    })
  );

  await setDoc(placeRef, {
    ...data,
    imageUrls,
    likes: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return placeRef.id;
}

// ── 찜하기 (중복 방지) ───────────────────────────────────────────

/**
 * 트랜잭션으로 찜 추가 + likes 카운트 동시 증가
 * 이미 찜한 경우 false 반환
 */
export async function likePlace(
  userId: string,
  placeId: string
): Promise<boolean> {
  const likeRef = doc(db, "places", placeId, "likes", userId);
  const placeRef = doc(db, "places", placeId);

  return runTransaction(db, async (tx) => {
    const likeSnap = await tx.get(likeRef);
    if (likeSnap.exists()) return false; // 이미 찜함

    tx.set(likeRef, { userId, createdAt: serverTimestamp() });
    tx.update(placeRef, { likes: increment(1) });
    return true;
  });
}

/**
 * 찜 취소 + likes 카운트 감소
 */
export async function unlikePlace(
  userId: string,
  placeId: string
): Promise<void> {
  const likeRef = doc(db, "places", placeId, "likes", userId);
  const placeRef = doc(db, "places", placeId);

  await runTransaction(db, async (tx) => {
    const likeSnap = await tx.get(likeRef);
    if (!likeSnap.exists()) return;

    tx.delete(likeRef);
    tx.update(placeRef, { likes: increment(-1) });
  });
}

/**
 * 유저가 특정 장소를 찜했는지 확인 (읽기 1회)
 */
export async function hasLikedPlace(
  userId: string,
  placeId: string
): Promise<boolean> {
  const snap = await getDoc(doc(db, "places", placeId, "likes", userId));
  return snap.exists();
}

// ── 수정/삭제 ────────────────────────────────────────────────────

export async function updatePlace(
  placeId: string,
  data: Partial<Omit<Place, "id" | "authorId" | "createdAt">>
): Promise<void> {
  await updateDoc(doc(db, "places", placeId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePlace(placeId: string): Promise<void> {
  await deleteDoc(doc(db, "places", placeId));
}
