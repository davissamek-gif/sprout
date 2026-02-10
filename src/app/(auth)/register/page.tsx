"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpWithEmail } from "../../../lib/auth";
import { createUserProfile } from "../../../lib/users";

export default function RegisterPage() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    console.log("SUBMIT register", { email, displayName });

    try {
      const user = await signUpWithEmail(
        email.trim(),
        password,
        displayName.trim()
      );

      console.log("REGISTER OK uid:", user.uid);

      // Create Firestore profile with 3-day trial
      await createUserProfile({ uid: user.uid, email: user.email ?? null });
      console.log("PROFILE CREATED in Firestore");

      router.push("/dashboard");
    } catch (err: any) {
      console.error("REGISTER ERROR:", err);

      const msg =
        err?.code === "auth/email-already-in-use"
          ? "Tenhle email už je zaregistrovaný."
          : err?.code === "auth/weak-password"
          ? "Heslo je moc slabé. Zkus aspoň 6 znaků."
          : err?.code === "auth/invalid-email"
          ? "Email není ve správném formátu."
          : err?.message
          ? `Chyba: ${err.message}`
          : "Registrace se nepovedla. Zkus to znovu.";

      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white/70 backdrop-blur p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Vytvořit účet</h1>
          <p className="text-sm text-black/60 mt-1">
            Sprout 🌱 — soukromý prostor pro společný život.
          </p>
          <p className="text-xs text-black/50 mt-2">
            Prvních <span className="font-medium">3 dny zdarma</span>, potom 69
            Kč / měsíc.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Jméno (volitelné)</label>
            <input
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
              placeholder="např. Kuba"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
              placeholder="kuba@email.cz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              inputMode="email"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Heslo</label>
            <input
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
            />
            <p className="mt-1 text-xs text-black/50">Minimálně 6 znaků.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black px-4 py-3 text-white font-medium disabled:opacity-60"
          >
            {loading ? "Vytvářím účet..." : "Pokračovat"}
          </button>
        </form>

        <div className="mt-6 text-sm text-black/60">
          Už máš účet?{" "}
          <button
            className="text-black underline underline-offset-4"
            onClick={() => router.push("/login")}
          >
            Přihlásit se
          </button>
        </div>
      </div>
    </div>
  );
}
