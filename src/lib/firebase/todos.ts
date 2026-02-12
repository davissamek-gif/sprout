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
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt?: unknown;
  createdBy: string;
};

function todosColRef(workspaceId: string) {
  const db = getFirebaseDb();
  return collection(db, "workspaces", workspaceId, "todos");
}

export function subscribeTodos(
  workspaceId: string,
  onTodos: (todos: Todo[]) => void,
  onlyIncomplete?: boolean
): Unsubscribe {
  const col = todosColRef(workspaceId);

  const q = onlyIncomplete
    ? query(col, where("completed", "==", false), orderBy("createdAt", "desc"))
    : query(col, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snap) => {
    const todos: Todo[] = snap.docs.map((d) => {
      const data = d.data() as Omit<Todo, "id">;
      return { id: d.id, ...data };
    });
    onTodos(todos);
  });
}

export async function addTodo(workspaceId: string, uid: string, text: string) {
  const col = todosColRef(workspaceId);
  const trimmed = text.trim();
  if (!trimmed) return;

  await addDoc(col, {
    text: trimmed,
    completed: false,
    createdBy: uid,
    createdAt: serverTimestamp(),
  });
}

export async function toggleTodo(
  workspaceId: string,
  todoId: string,
  completed: boolean
) {
  const db = getFirebaseDb();
  const ref = doc(db, "workspaces", workspaceId, "todos", todoId);
  await updateDoc(ref, { completed });
}

export async function deleteTodo(workspaceId: string, todoId: string) {
  const db = getFirebaseDb();
  const ref = doc(db, "workspaces", workspaceId, "todos", todoId);
  await deleteDoc(ref);
}
