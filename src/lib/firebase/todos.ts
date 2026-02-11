"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt?: any;
};

function todosCol(connectionId: string) {
  return collection(db, "connections", connectionId, "todos");
}

export async function addTodo(text: string, connectionId: string) {
  await addDoc(todosCol(connectionId), {
    text,
    completed: false,
    createdAt: serverTimestamp(),
  });
}

export async function toggleTodo(todoId: string, completed: boolean, connectionId: string) {
  await updateDoc(doc(db, "connections", connectionId, "todos", todoId), { completed });
}

export async function deleteTodo(todoId: string, connectionId: string) {
  await deleteDoc(doc(db, "connections", connectionId, "todos", todoId));
}

export function subscribeTodos(connectionId: string, cb: (todos: Todo[]) => void) {
  const q = query(todosCol(connectionId), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const items: Todo[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    cb(items);
  });
}
