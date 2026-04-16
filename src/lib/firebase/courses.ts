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
import { db } from "./config";
import type { Course, TransportType, MoodTag } from "@/types";

export async function getCourses(filters?: {
  transport?: TransportType;
  mood?: MoodTag;
}): Promise<Course[]> {
  const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];
  if (filters?.transport) {
    constraints.unshift(where("transport", "==", filters.transport));
  }

  const q = query(collection(db, "courses"), ...constraints);
  const snap = await getDocs(q);
  let courses = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Course);

  if (filters?.mood) {
    courses = courses.filter((c) => c.moods.includes(filters.mood!));
  }

  return courses;
}

export async function getCourseById(id: string): Promise<Course | null> {
  const snap = await getDoc(doc(db, "courses", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Course;
}

export async function createCourse(
  data: Omit<Course, "id" | "likes" | "createdAt">
): Promise<string> {
  const docRef = await addDoc(collection(db, "courses"), {
    ...data,
    likes: 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function likeCourse(courseId: string): Promise<void> {
  await updateDoc(doc(db, "courses", courseId), {
    likes: increment(1),
  });
}
