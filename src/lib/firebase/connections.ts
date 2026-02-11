"use client";

import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export type Connection = {
  id: string;
  createdAt?: any;
  createdBy: string;
  members: string[]; // uids
  name?: string | null;
};

export async function createConnection(createdByUid: string, name?: string) {
  const ref = await addDoc(collection(db, "connections"), {
    createdAt: serverTimestamp(),
    createdBy: createdByUid,
    members: [createdByUid],
    name: name ?? null,
  });
  return ref.id;
}

export function subscribeConnection(connectionId: string, cb: (c: Connection | null) => void) {
  const ref = doc(db, "connections", connectionId);
  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) return cb(null);
    cb({ id: snap.id, ...(snap.data() as any) } as Connection);
  });
}

export async function createInvite(connectionId: string, createdByUid: string, email: string) {
  const emailLower = email.trim().toLowerCase();
  const ref = await addDoc(collection(db, "invites"), {
    connectionId,
    createdBy: createdByUid,
    emailLower,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function acceptInvite(inviteId: string, acceptingUid: string) {
  const inviteRef = doc(db, "invites", inviteId);
  const inviteSnap = await getDoc(inviteRef);
  if (!inviteSnap.exists()) throw new Error("Invite neexistuje.");

  const invite = inviteSnap.data() as any;
  if (invite.status !== "pending") throw new Error("Pozvánka už není aktivní.");

  const connectionId: string = invite.connectionId;
  const connectionRef = doc(db, "connections", connectionId);

  await updateDoc(connectionRef, { members: arrayUnion(acceptingUid) });
  await updateDoc(inviteRef, {
    status: "accepted",
    acceptedBy: acceptingUid,
    acceptedAt: serverTimestamp(),
  });

  return connectionId;
}
