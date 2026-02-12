"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addMemberByUid,
  createWorkspace,
  getActiveWorkspaceId,
  setActiveWorkspaceId,
  subscribeMyWorkspaces,
  type Workspace,
} from "@/lib/firebase/workspaces";

export default function WorkspacePanel(props: { uid: string }) {
  const { uid } = props;

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [addUid, setAddUid] = useState("");
  const active = useMemo(
    () => workspaces.find((w) => w.id === activeId) ?? null,
    [workspaces, activeId]
  );

  // load list
  useEffect(() => {
    const unsub = subscribeMyWorkspaces(uid, (ws) => setWorkspaces(ws));
    return () => unsub();
  }, [uid]);

  // pick active on first load
  useEffect(() => {
    if (workspaces.length === 0) return;

    const stored = getActiveWorkspaceId();
    const validStored = stored && workspaces.some((w) => w.id === stored);

    const next = validStored ? stored : workspaces[0].id;
    setActiveId(next);
    setActiveWorkspaceId(next);
  }, [workspaces]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;

    const id = await createWorkspace(uid, name);
    setNewName("");
    setActiveId(id);
    setActiveWorkspaceId(id);
  }

  async function onAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!activeId) return;
    const memberUid = addUid.trim();
    if (!memberUid) return;

    await addMemberByUid(activeId, memberUid);
    setAddUid("");
  }

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Workspace</h2>
          <p className="text-sm text-white/60">
            Sdílený prostor pro tebe a tvůj tým.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={activeId ?? ""}
            onChange={(e) => {
              const id = e.target.value;
              setActiveId(id);
              setActiveWorkspaceId(id);
            }}
            className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-white/25"
          >
            {workspaces.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <form onSubmit={onCreate} className="rounded-xl border border-white/10 bg-black/20 p-4">
          <p className="text-sm font-medium">Vytvořit nový workspace</p>
          <div className="mt-3 flex gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Např. Sprout Team"
              className="flex-1 rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-sm outline-none placeholder:text-white/40 focus:border-white/25"
            />
            <button
              type="submit"
              className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-black hover:bg-white/90"
            >
              Create
            </button>
          </div>
        </form>

        <form onSubmit={onAddMember} className="rounded-xl border border-white/10 bg-black/20 p-4">
          <p className="text-sm font-medium">Přidat člena (UID)</p>
          <p className="mt-1 text-xs text-white/55">
            MVP varianta: kamarád se zaregistruje → pošle ti svoje UID → ty ho přidáš.
          </p>
          <div className="mt-3 flex gap-2">
            <input
              value={addUid}
              onChange={(e) => setAddUid(e.target.value)}
              placeholder="UID kamaráda"
              className="flex-1 rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-sm outline-none placeholder:text-white/40 focus:border-white/25"
            />
            <button
              type="submit"
              disabled={!activeId}
              className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-50"
            >
              Add
            </button>
          </div>
          {active && (
            <p className="mt-3 text-xs text-white/55">
              Aktivní workspace: <span className="text-white/80">{active.name}</span> • členů:{" "}
              <span className="text-white/80">{active.memberIds.length}</span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
