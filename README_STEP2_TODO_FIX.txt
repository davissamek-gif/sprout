Sprout — Krok 2 (To‑do list) HOTOVO

Tenhle ZIP obsahuje OPRAVENÉ soubory pro:
- chybějící UI komponenty (button/card/input)
- TypeScript error: implicit any (e)
- todos.ts: používá getFirebaseDb() (takže už nečeká export db z ./client jako proměnnou)

Jak to použít:
1) Rozbal ZIP přímo do rootu projektu `sprout/` (sloučit se složkou `src/`).
   Povol přepsání souborů.
2) Pokud by ti IDE pořád psalo, že nezná alias @/, zkontroluj `tsconfig.json`:
   compilerOptions.paths musí obsahovat:
     "@/*": ["./src/*"]

Použití v UI:
- Na stránce dashboard importuj:
    import TodoList from "@/components/TodoList";
  a vlož <TodoList /> kam chceš.

Poznámka:
- V `src/lib/firebase/client.ts` exporty `auth` a `db` jsou FUNKCE (lazy).
  Bezpečnější je používat:
    import { getFirebaseAuth, getFirebaseDb } from "@/src/lib/firebase/client";
