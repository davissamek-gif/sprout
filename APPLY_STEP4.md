# Sprout – Step 4 patch (fix TS errors + To‑Do works)

## Co to řeší
- Button nyní podporuje props `size` a `asChild` (aby TS neřval).
- Firebase client je čistý singleton (`getFirebaseApp/Auth/Db`).
- `todos.ts` exportuje: `addTodo`, `toggleTodo`, `deleteTodo`, `subscribeTodos`.
- `Todo` má `completed: boolean`.
- Dashboard importuje správnou komponentu: `@/components/todo/TodoList`.

## Jak to použít
1) Rozbal ZIP do projektu **sprout** (přepiš soubory).
2) Pokud máš duplicitní soubor:
   - smaž `src/components/TodoList.tsx` (nech jen `src/components/todo/TodoList.tsx`)
3) Restartuj dev server.

## DŮLEŽITÉ (práva ve Firestore)
Chyba `Missing or insufficient permissions` znamená, že Firestore rules nedovolují zapisovat do `users/{uid}` a `users/{uid}/todos`.

V další zprávě ti pošlu hotové **Firestore rules** (copy/paste), aby registrace + To‑Do fungovalo pro každého uživatele.
