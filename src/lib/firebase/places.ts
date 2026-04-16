import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  increment,
  serverTimestamp,
  type QueryConstraint,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./config";
import type { Place, PlaceCategory } from "@/types";

export async function getPlaces(category?: PlaceCategory): Promise<Place[]> {
  const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];
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

export async function createPlace(
  data: Omit<Place, "id" | "likes" | "createdAt" | "updatedAt">,
  imageFiles: File[]
): Promise<string> {
  const imageUrls = await Promise.all(
    imageFiles.map(async (file) => {
      const storageRef = ref(storage, `places/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return getDownloadURL(snapshot.ref);
    })
  );

  const docRef = await addDoc(collection(db, "places"), {
    ...data,
    imageUrls,
    likes: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function likePlace(placeId: string): Promise<void> {
  await updateDoc(doc(db, "places", placeId), {
    likes: increment(1),
  });
}
