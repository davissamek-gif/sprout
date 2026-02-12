"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addTodo,
  deleteTodo,
  subscribeTodos,
  toggleTodo,
  type Todo,
} from "@/lib/firebase/todos";

export default function TodoList(props: { workspaceId: string; uid: string }) {
  const { workspaceId, uid } = props;

  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [onlyIncomplete, setOnlyIncomplete] = useState(false);

  useEffect(() => {
    if (!workspaceId) return;
    const unsub = subscribeTodos(workspaceId, setTodos, onlyIncomplete);
    return () => unsub();
  }, [workspaceId, onlyIncomplete]);

  const stats = useMemo(() => {
    const total = todos.length;
    const done = todos.filter((t) => t.completed).length;
    return { total, done, left: total - done };
  }, [todos]);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    await addTodo(workspaceId, uid, text);
    setText("");
  }

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">To‑do</h2>
          <p className="text-sm text-white/60">
            Hotovo: {stats.done} • Zbývá: {stats.left} • Celkem: {stats.total}
          </p>
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={onlyIncomplete}
            onChange={(e) => setOnlyIncomplete(e.target.checked)}
          />
          Zobrazit jen nedodělané
        </label>
      </div>

      <form onSubmit={onAdd} className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Napiš úkol…"
          className="flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-white/25"
        />
        <button
          type="submit"
          className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-black hover:bg-white/90"
        >
          Přidat
        </button>
      </form>

      <ul className="mt-4 space-y-2">
        {todos.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2"
          >
            <label className="flex flex-1 items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={t.completed}
                onChange={(e) => toggleTodo(workspaceId, t.id, e.target.checked)}
              />
              <span
                className={
                  "text-sm " +
                  (t.completed ? "text-white/45 line-through" : "text-white/90")
                }
              >
                {t.text}
              </span>
            </label>

            <button
              type="button"
              onClick={() => deleteTodo(workspaceId, t.id)}
              className="rounded-lg px-2 py-1 text-xs text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Smazat"
              title="Smazat"
            >
              ✕
            </button>
          </li>
        ))}

        {todos.length === 0 && (
          <li className="rounded-xl border border-dashed border-white/10 bg-black/10 p-6 text-center text-sm text-white/60">
            Zatím tu nic není. Přidej první úkol.
          </li>
        )}
      </ul>
    </div>
  );
}
