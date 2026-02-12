import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/client";

/**
 * Najde aktivní workspace pro aktuálního usera.
 * Očekává, že v users/{uid} je field `workspaceId` nebo `activeWorkspaceId`.
 */
export async function getMyWorkspaceId(): Promise<string> {
  const auth = getFirebaseAuth();
  const db = getFirebaseDb();

  const user = auth.currentUser;
  if (!user) throw new Error("Nejsi přihlášený.");

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) throw new Error("Profil uživatele ve Firestore neexistuje.");

  const data = snap.data() as any;
  const workspaceId = data.workspaceId || data.activeWorkspaceId;
  if (!workspaceId) {
    throw new Error(
      "U profilu chybí workspaceId. (Zkus se odhlásit/přihlásit, nebo mi pošli obsah users/{uid}.)"
    );
  }
  return workspaceId as string;
}

/**
 * Přidá uživatele (UID) do members subkolekce aktuálního workspace.
 * Neřeší email pozvánky – rovnou vytvoří členství.
 */
export async function inviteMemberByUid(inviteeUid: string): Promise<void> {
  const auth = getFirebaseAuth();
  const db = getFirebaseDb();
  const me = auth.currentUser;
  if (!me) throw new Error("Nejsi přihlášený.");

  const workspaceId = await getMyWorkspaceId();

  // workspaces/{workspaceId}/members/{uid}
  const memberRef = doc(db, "workspaces", workspaceId, "members", inviteeUid);
  await setDoc(
    memberRef,
    {
      uid: inviteeUid,
      role: "member",
      invitedBy: me.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

// Invites a member to a specific workspace (does not rely on Firebase Auth).
export async function inviteMemberToWorkspace(
  workspaceId: string,
  inviteeUid: string,
  inviterUid: string
) {
  const db = getFirebaseDb();

  // 1) Ensure the inviter is actually a member/admin of this workspace
  const inviterMemberRef = doc(db, "workspaces", workspaceId, "members", inviterUid);
  const inviterSnap = await getDoc(inviterMemberRef);
  if (!inviterSnap.exists()) {
    throw new Error("Inviter is not a member of this workspace.");
  }

  // 2) Add invitee membership
  const inviteeMemberRef = doc(db, "workspaces", workspaceId, "members", inviteeUid);
  await setDoc(inviteeMemberRef, { role: "member", addedAt: serverTimestamp() }, { merge: true });

  // 3) Update invitee profile active workspace (lightweight convenience)
  const userRef = doc(db, "users", inviteeUid);
  await setDoc(userRef, { workspaceId, activeWorkspaceId: workspaceId }, { merge: true });
}
