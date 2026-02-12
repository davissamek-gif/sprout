"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const auth = getFirebaseAuth();
      const db = getFirebaseDb();

      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (name.trim()) await updateProfile(cred.user, { displayName: name.trim() });

      await setDoc(doc(db, "users", cred.user.uid), {
        email: cred.user.email,
        displayName: name.trim() || null,
        createdAt: serverTimestamp(),
      });

      console.log("REGISTER OK uid:", cred.user.uid);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("REGISTER ERROR:", err);
      setError(err?.message ?? "Register failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Vytvořit účet</CardTitle>
          <CardDescription>Začni tímhle – pak pozvánky do týmu a společný To‑Do.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <Input placeholder="Jméno (volitelné)" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            <Input
              placeholder="Heslo (min. 6 znaků)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            {error ? <div className="text-sm text-red-600">{error}</div> : null}
            <Button type="submit" disabled={busy || !email.trim() || password.length < 6}>
              {busy ? "Vytvářím…" : "Registrovat"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
