"use client";

import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export type UserProfile = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  createdAt: number; // ms
  connectionId?: string | null; // shared space id (for couples/groups)
};

export async function ensureUserProfile(profile: UserProfile) {
  const ref = doc(db, "users", profile.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, profile, { merge: true });
  } else {
    await setDoc(
      ref,
      {
        email: profile.email ?? null,
        displayName: profile.displayName ?? null,
        photoURL: profile.photoURL ?? null,
      },
      { merge: true }
    );
  }
}

export function subscribeUserProfile(uid: string, cb: (p: UserProfile | null) => void) {
  const ref = doc(db, "users", uid);
  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) return cb(null);
    cb(snap.data() as UserProfile);
  });
}

export async function setUserConnectionId(uid: string, connectionId: string | null) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { connectionId: connectionId ?? null });
}
