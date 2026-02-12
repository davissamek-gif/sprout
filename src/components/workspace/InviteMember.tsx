"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { inviteMemberToWorkspace } from "@/lib/firebase/workspaces";

type Props = {
  workspaceId: string;
  uid: string; // inviter uid
};

export default function InviteMember({ workspaceId, uid }: Props) {
  const [inviteUid, setInviteUid] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onInvite = async () => {
    setStatus(null);
    const target = inviteUid.trim();
    if (!target) {
      setStatus("Zadej UID, které chceš pozvat.");
      return;
    }
    if (target === uid) {
      setStatus("Nemůžeš pozvat sám sebe 🙂");
      return;
    }

    setBusy(true);
    try {
      await inviteMemberToWorkspace(workspaceId, target, uid);
      setInviteUid("");
      setStatus("✅ Člen byl přidán do workspace.");
    } catch (e: any) {
      console.error("Invite error:", e);
      setStatus(e?.message ? `❌ ${e.message}` : "❌ Pozvání se nepovedlo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-neutral-50 p-3">
        <p className="text-xs text-neutral-500">Workspace ID</p>
        <p className="text-sm font-mono text-neutral-900">{workspaceId}</p>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="UID člena (např. YZDp6w...)"
          value={inviteUid}
          onChange={(e) => setInviteUid(e.target.value)}
        />
        <Button onClick={onInvite} disabled={busy || !workspaceId}>
          {busy ? "Přidávám…" : "Pozvat"}
        </Button>
      </div>

      {status && <p className="text-sm text-neutral-700">{status}</p>}
    </div>
  );
}
