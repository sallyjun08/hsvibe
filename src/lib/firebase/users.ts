import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import type { User } from "@/types";
import type { User as FirebaseUser } from "firebase/auth";

/**
 * 로그인 직후 호출 — 유저 문서가 없으면 생성, 있으면 displayName/photoURL 갱신
 */
export async function upsertUser(firebaseUser: FirebaseUser): Promise<void> {
  const ref = doc(db, "users", firebaseUser.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: firebaseUser.displayName ?? "익명",
      email: firebaseUser.email ?? "",
      photoURL: firebaseUser.photoURL ?? null,
      bio: "",
      myPlaceIds: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    // 표시 이름/사진이 바뀌었을 수 있으므로 동기화
    await updateDoc(ref, {
      displayName: firebaseUser.displayName ?? snap.data().displayName,
      photoURL: firebaseUser.photoURL ?? snap.data().photoURL,
      updatedAt: serverTimestamp(),
    });
  }
}

/**
 * 유저 프로필 조회
 */
export async function getUserById(userId: string): Promise<User | null> {
  const snap = await getDoc(doc(db, "users", userId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as User;
}

/**
 * 장소 등록 후 users/{userId}.myPlaceIds 에 추가
 * - arrayUnion으로 중복 없이 추가
 */
export async function addPlaceToUser(userId: string, placeId: string): Promise<void> {
  await updateDoc(doc(db, "users", userId), {
    myPlaceIds: arrayUnion(placeId),
    updatedAt: serverTimestamp(),
  });
}

/**
 * 프로필(닉네임, 소개) 업데이트
 */
export async function updateUserProfile(
  userId: string,
  data: { displayName?: string; bio?: string }
): Promise<void> {
  await updateDoc(doc(db, "users", userId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
