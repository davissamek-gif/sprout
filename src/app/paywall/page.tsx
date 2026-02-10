"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOutUser } from "../../lib/auth";

export default function PaywallPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    await signOutUser();
    router.replace("/");
  }

  async function handleGoToCheckout() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      if (!res.ok) throw new Error("Checkout request failed");

      const data = await res.json();
      if (!data?.url) throw new Error("Missing checkout URL");

      window.location.href = data.url;
    } catch (e: any) {
      console.error(e);
      setError("Nepovedlo se otevřít platbu. Zkus to prosím znovu.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-black/10 bg-white/80 backdrop-blur p-8 shadow-sm">
        <div className="text-center">
          <div className="text-4xl mb-4">🌱</div>
          <h1 className="text-2xl font-semibold">Trial skončil</h1>
          <p className="mt-3 text-black/70">
            Děkujeme, že jsi vyzkoušel <span className="font-medium">Sprout</span>.
            Teď je čas pokračovat a odemknout celý společný prostor.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <h2 className="font-semibold">Co získáš</h2>
            <ul className="mt-3 space-y-2 text-sm text-black/70">
              <li>• Společný plánovač a kalendář</li>
              <li>• Mapy, místa a trasy</li>
              <li>• Krásný společný deník a archiv</li>
              <li>• Statistiky a sdílené profily</li>
              <li>• Eco & vegan-friendly komunita</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-black/60">Cena</p>
                <p className="text-xl font-semibold">69 Kč / měsíc</p>
              </div>
              <div className="text-xs text-black/50 text-right">
                10 % věnujeme<br />na charitu 🌍
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <button
            onClick={handleGoToCheckout}
            disabled={loading}
            className="w-full rounded-2xl bg-black px-6 py-4 text-white font-medium disabled:opacity-60"
          >
            {loading ? "Otevírám platbu…" : "Pokračovat na platbu"}
          </button>

          <button
            onClick={handleLogout}
            className="w-full rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm"
          >
            Odhlásit se
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-black/50">
          Můžeš se kdykoliv vrátit. Žádné skryté poplatky.
        </p>
      </div>
    </div>
  );
}
