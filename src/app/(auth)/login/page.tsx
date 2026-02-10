"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmail } from "../../../lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    console.log("SUBMIT login", { email });

    try {
      const user = await signInWithEmail(email.trim(), password);
      console.log("LOGIN OK uid:", user.uid);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("LOGIN ERROR:", err);

      const msg =
        err?.code === "auth/invalid-credential"
          ? "Špatný email nebo heslo."
          : err?.code === "auth/user-not-found"
          ? "Účet s tímto emailem neexistuje."
          : err?.code === "auth/wrong-password"
          ? "Špatné heslo."
          : err?.code === "auth/invalid-email"
          ? "Email není ve správném formátu."
          : err?.message
          ? `Chyba: ${err.message}`
          : "Přihlášení se nepovedlo. Zkus to znovu.";

      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white/70 backdrop-blur p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Přihlásit se</h1>
          <p className="text-sm text-black/60 mt-1">
            Sprout 🌱 — vítej zpátky.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
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
              autoComplete="current-password"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black px-4 py-3 text-white font-medium disabled:opacity-60"
          >
            {loading ? "Přihlašuji..." : "Přihlásit se"}
          </button>
        </form>

        <div className="mt-6 text-sm text-black/60">
          Nemáš účet?{" "}
          <button
            className="text-black underline underline-offset-4"
            onClick={() => router.push("/register")}
          >
            Vytvořit účet
          </button>
        </div>

        <div className="mt-2 text-xs text-black/50">
          Tip: pokud jsi testoval registraci, přihlas se stejným emailem a heslem.
        </div>
      </div>
    </div>
  );
}
