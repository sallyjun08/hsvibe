import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase는 클라이언트에서만 초기화 (SSR 빌드 시 API 키 없음)
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (typeof window !== "undefined" || process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  // 빌드/SSR 단계 - 더미 초기화 방지를 위해 지연 처리
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app = null as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  auth = null as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db = null as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  storage = null as any;
}

export { auth, db, storage };
export default app;
