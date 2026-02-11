"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Trash2, Plus } from "lucide-react";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { addTodo, deleteTodo, subscribeTodos, toggleTodo, type Todo } from "@/lib/firebase/todos";
import { createConnection } from "@/lib/firebase/connections";
import { ensureUserProfile, setUserConnectionId, subscribeUserProfile } from "@/lib/firebase/profile";

export default function TodoList() {
  const auth = useMemo(() => getFirebaseAuth(), []);
  const [uid, setUid] = useState<string | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUid(null);
        setConnectionId(null);
        return;
      }
      setUid(user.uid);
      await ensureUserProfile({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: Date.now(),
        connectionId: null,
      });
    });
    return () => unsub();
  }, [auth]);

  useEffect(() => {
    if (!uid) return;
    const unsub = subscribeUserProfile(uid, (p) => setConnectionId(p?.connectionId ?? null));
    return () => unsub();
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    if (connectionId) return;
    (async () => {
      const newId = await createConnection(uid, "My Sprout Space");
      await setUserConnectionId(uid, newId);
      setConnectionId(newId);
    })();
  }, [uid, connectionId]);

  useEffect(() => {
    if (!connectionId) return;
    const unsub = subscribeTodos(connectionId, setTodos);
    return () => unsub();
  }, [connectionId]);

  async function createTodo() {
    if (!connectionId) return;
    const value = text.trim();
    if (!value) return;
    await addTodo(value, connectionId);
    setText("");
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">📝 To-Do</h2>
          <div className="text-xs text-muted-foreground">
            Sdílený prostor: <span className="font-mono">{connectionId ?? "…"}</span>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {todos.filter((t) => t.completed).length}/{todos.length} splněno
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Přidat úkol…"
          value={text}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") createTodo();
          }}
        />
        <Button onClick={createTodo} className="gap-2">
          <Plus className="h-4 w-4" />
          Přidat
        </Button>
      </div>

      <div className="space-y-2">
        {todos.map((t) => (
          <div key={t.id} className="flex items-center justify-between rounded-lg border p-3">
            <button
              onClick={() => connectionId && toggleTodo(t.id, !t.completed, connectionId)}
              className="flex-1 text-left"
              title="Označit jako hotovo"
            >
              <span className={t.completed ? "line-through text-muted-foreground" : ""}>{t.text}</span>
            </button>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="h-9 w-9 p-0"
                onClick={() => connectionId && toggleTodo(t.id, !t.completed, connectionId)}
                aria-label="Hotovo"
                title="Hotovo"
              >
                <Check className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                className="h-9 w-9 p-0"
                onClick={() => connectionId && deleteTodo(t.id, connectionId)}
                aria-label="Smazat"
                title="Smazat"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {todos.length === 0 && (
          <div className="text-sm text-muted-foreground border rounded-lg p-4">
            Zatím tu nic není. Přidej první úkol ✨
          </div>
        )}
      </div>
    </Card>
  );
}
