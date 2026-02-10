"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "../../lib/firebase/client";

export default function PaywallPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace("/login");
        return;
      }
      setUid(u.uid);
    });
    return () => unsub();
  }, [router]);

  async function startCheckout() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Checkout failed");
      if (!data?.url) throw new Error("Missing checkout url");

      window.location.href = data.url;
    } catch (e: any) {
      console.error(e);
      setErr(e?.message ?? "Checkout failed");
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Sprout Pro</h1>
        <p className="mt-2 text-sm text-neutral-700">
          3 dny zdarma, potom 69 Kč / měsíc. 10% jde na charity 🌱
        </p>

        {err && (
          <div className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {err}
          </div>
        )}

        <button
          className="mt-6 w-full rounded-xl bg-neutral-900 px-3 py-2 text-white disabled:opacity-60"
          onClick={startCheckout}
          disabled={loading || !uid}
        >
          {loading ? "Opening Stripe…" : "Start free trial"}
        </button>

        <button
          className="mt-3 w-full rounded-xl border border-neutral-300 px-3 py-2"
          onClick={() => router.push("/dashboard")}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
