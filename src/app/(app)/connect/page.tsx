"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { subscribeUserProfile, setUserConnectionId } from "@/lib/firebase/profile";
import { createInvite, subscribeConnection, type Connection } from "@/lib/firebase/connections";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ConnectPage() {
  const auth = useMemo(() => getFirebaseAuth(), []);
  const [uid, setUid] = useState<string | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);

  const [email, setEmail] = useState("");
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUid(u?.uid ?? null));
    return () => unsub();
  }, [auth]);

  useEffect(() => {
    if (!uid) return;
    const unsub = subscribeUserProfile(uid, (p) => setConnectionId(p?.connectionId ?? null));
    return () => unsub();
  }, [uid]);

  useEffect(() => {
    if (!connectionId) return;
    const unsub = subscribeConnection(connectionId, setConnection);
    return () => unsub();
  }, [connectionId]);

  async function sendInvite() {
    if (!uid || !connectionId) return;
    setStatus(null);
    setInviteLink(null);
    try {
      const inviteId = await createInvite(connectionId, uid, email);
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const link = `${baseUrl}/accept?invite=${inviteId}`;
      setInviteLink(link);
      setStatus("Pozvánka vytvořena ✅ Pošli link druhému člověku.");
    } catch (e: any) {
      setStatus(e?.message ?? "Něco se nepovedlo.");
    }
  }

  async function disconnect() {
    if (!uid) return;
    await setUserConnectionId(uid, null);
    setStatus("Odpojeno. (MVP) Po refresh se ti vytvoří nový osobní prostor.");
  }

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <Card className="p-6 space-y-2">
        <h1 className="text-2xl font-semibold">Propojení</h1>
        <p className="text-sm text-muted-foreground">
          Vytvoř pozvánku pro druhého člověka. Oba pak sdílíte To‑Do a další věci v jednom prostoru.
        </p>
      </Card>

      <Card className="p-6 space-y-3">
        <div className="text-sm">
          <div className="text-muted-foreground">Aktuální prostor</div>
          <div className="font-mono">{connectionId ?? "—"}</div>
        </div>

        <div className="text-sm">
          <div className="text-muted-foreground">Členové</div>
          <div>{connection?.members?.length ?? 0}</div>
        </div>

        <div className="pt-2 border-t" />

        <div className="space-y-2">
          <div className="text-sm font-medium">Pozvat člena e‑mailem</div>
          <div className="flex gap-2">
            <Input
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="email@domena.cz"
            />
            <Button onClick={sendInvite}>Vytvořit pozvánku</Button>
          </div>

          {inviteLink && (
            <div className="text-sm">
              <div className="text-muted-foreground">Invite link</div>
              <div className="font-mono break-all">{inviteLink}</div>
            </div>
          )}

          {status && <div className="text-sm">{status}</div>}
        </div>

        <div className="pt-2 border-t" />
        <Button variant="secondary" onClick={disconnect}>
          Odpojit (MVP)
        </Button>
      </Card>
    </div>
  );
}
