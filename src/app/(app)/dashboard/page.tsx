"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../../../lib/firebase/firebase";
import { db } from "../../../lib/firebase/firebase";
import { signOutUser } from "../../../lib/auth";

type SubscriptionStatus = "trial" | "active" | "expired";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [trialEndsAt, setTrialEndsAt] = useState<Date | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      setEmail(user.email ?? null);

      // Load user profile from Firestore
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) {
        console.error("User profile missing");
        await signOutUser();
        router.replace("/login");
        return;
      }

      const data = snap.data();
      const trialEnd =
        data.trialEndsAt?.toDate?.() ?? new Date(data.trialEndsAt);

      const now = new Date();

      let nextStatus: SubscriptionStatus = data.subscriptionStatus;

      // Auto-expire trial
      if (nextStatus === "trial" && trialEnd < now) {
        nextStatus = "expired";
      }

      // Redirect if expired
      if (nextStatus === "expired") {
        router.replace("/paywall");
        return;
      }

      setStatus(nextStatus);
      setTrialEndsAt(trialEnd);
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  async function handleLogout() {
    await signOutUser();
    router.replace("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-sm text-black/60">Načítám…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-black/70">
            Přihlášen jako: <span className="font-medium">{email}</span>
          </p>

          {status === "trial" && trialEndsAt && (
            <p className="mt-2 text-sm text-black/60">
              Trial končí:{" "}
              <span className="font-medium">
                {trialEndsAt.toLocaleDateString()}
              </span>
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleLogout}
              className="rounded-xl bg-black px-4 py-2 text-sm text-white"
            >
              Odhlásit se
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Vítej ve Sprout 🌱</h2>
          <p className="mt-2 text-sm text-black/70">
            Tady brzy začne plánování, deník, mapy a společné projekty.
          </p>
        </div>
      </div>
    </div>
  );
}
