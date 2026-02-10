"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "../../../lib/firebase/client";

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const auth = getFirebaseAuth();
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log("LOGIN OK uid:", res.user.uid);
      router.replace("/dashboard");
    } catch (e: any) {
      console.error("LOGIN ERROR:", e);
      setErr(e?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-1 text-sm text-neutral-600">Sprout 🌱</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-500"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-500"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {err && (
            <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              {err}
            </div>
          )}

          <button
            className="w-full rounded-xl bg-neutral-900 px-3 py-2 text-white disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Logging in…" : "Login"}
          </button>

          <button
            className="w-full rounded-xl border border-neutral-300 px-3 py-2"
            type="button"
            onClick={() => router.push("/register")}
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
