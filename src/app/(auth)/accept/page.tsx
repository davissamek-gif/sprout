"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { acceptInvite } from "@/lib/firebase/connections";
import { setUserConnectionId } from "@/lib/firebase/profile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AcceptInvitePage() {
  const params = useSearchParams();
  const router = useRouter();
  const inviteId = params.get("invite");

  const auth = useMemo(() => getFirebaseAuth(), []);
  const [uid, setUid] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Načítám…");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUid(u?.uid ?? null));
    return () => unsub();
  }, [auth]);

  async function doAccept() {
    if (!inviteId) return setStatus("Chybí invite ID.");
    if (!uid) return setStatus("Musíš být přihlášený.");
    try {
      setStatus("Přijímám pozvánku…");
      const connectionId = await acceptInvite(inviteId, uid);
      await setUserConnectionId(uid, connectionId);
      setStatus("Hotovo ✅ Přesměrovávám…");
      setTimeout(() => router.push("/dashboard"), 800);
    } catch (e: any) {
      setStatus(e?.message ?? "Nepodařilo se přijmout pozvánku.");
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Přijmout pozvánku</h1>
        <div className="text-sm text-muted-foreground">
          Invite: <span className="font-mono break-all">{inviteId ?? "—"}</span>
        </div>

        <div className="text-sm">{status}</div>

        <Button onClick={doAccept} disabled={!inviteId || !uid}>
          Přijmout
        </Button>

        {!uid && (
          <div className="text-sm text-muted-foreground">
            Nejprve se přihlas (/login) a pak se vrať na tento link.
          </div>
        )}
      </Card>
    </div>
  );
}
