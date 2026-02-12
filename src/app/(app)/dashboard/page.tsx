"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Shell } from "@/components/Shell";
import TodoList from "@/components/todo/TodoList";
import InviteMember from "@/components/workspaces/InviteMember";

import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/client";

type UserProfile = {
  workspaceId?: string;
  activeWorkspaceId?: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 1) Auth guard
  useEffect(() => {
    const auth = getFirebaseAuth();

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.replace("/login");
        return;
      }
      setUser(u);
    });

    return () => unsub();
  }, [router]);

  // 2) Load workspaceId from Firestore users/{uid}
  useEffect(() => {
    const run = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const db = getFirebaseDb();
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          // profil neexistuje => pošleme na register / nebo necháme prázdné
          setWorkspaceId(null);
          setLoading(false);
          return;
        }

        const data = snap.data() as UserProfile;
        const wid = data.activeWorkspaceId || data.workspaceId || null;
        setWorkspaceId(wid);
      } catch (e) {
        console.error("Dashboard load user profile error:", e);
        setWorkspaceId(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [user]);

  return (
    <Shell>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Dashboard</h1>
              <p className="mt-1 text-sm text-neutral-600">
                Přehled účtu + úkoly + pozvání člena do vašeho workspace.
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-neutral-500">UID</p>
              <p className="text-xs font-mono text-neutral-800">
                {user?.uid ?? "—"}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-neutral-50 p-3">
              <p className="text-xs text-neutral-500">Workspace</p>
              <p className="text-sm font-medium text-neutral-900">
                {loading ? "Načítám…" : workspaceId ?? "Nenalezeno"}
              </p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-3">
              <p className="text-xs text-neutral-500">Stav</p>
              <p className="text-sm font-medium text-neutral-900">
                {user ? "Přihlášen" : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* TODO */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">To-do list</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Úkoly jsou sdílené v rámci workspace.
          </p>

          <div className="mt-4">
            {loading ? (
              <p className="text-sm text-neutral-600">Načítám…</p>
            ) : !user || !workspaceId ? (
              <p className="text-sm text-red-600">
                Chybí UID nebo workspaceId. Zkontroluj dokument{" "}
                <span className="font-mono">users/{user?.uid}</span> ve Firestore.
              </p>
            ) : (
              <TodoList workspaceId={workspaceId} uid={user.uid} />
            )}
          </div>
        </div>

        {/* INVITE */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Pozvat člena</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Zadej UID kamaráda a přidáš ho do stejného workspace.
          </p>

          <div className="mt-4">
            {loading ? (
              <p className="text-sm text-neutral-600">Načítám…</p>
            ) : !user || !workspaceId ? (
              <p className="text-sm text-red-600">
                Chybí UID nebo workspaceId. Zkontroluj dokument{" "}
                <span className="font-mono">users/{user?.uid}</span> ve Firestore.
              </p>
            ) : (
              <InviteMember workspaceId={workspaceId} uid={user.uid} />
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}
