"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("LOGIN ERROR:", err);
      setError(err?.message ?? "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Přihlášení</CardTitle>
          <CardDescription>Vrať se zpět do Sprout.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            <Input placeholder="Heslo" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
            {error ? <div className="text-sm text-red-600">{error}</div> : null}
            <Button type="submit" disabled={busy || !email.trim() || !password}>
              {busy ? "Přihlašuji…" : "Přihlásit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
