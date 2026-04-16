import { GoogleAuthProvider, signInWithPopup, signOut as fbSignOut } from "firebase/auth";
import { auth } from "./config";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export const signOut = () => fbSignOut(auth);
