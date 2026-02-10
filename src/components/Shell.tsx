import Link from "next/link";
import { Brand } from "./Brand";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-6">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link href="/" className="hover:opacity-90">
          <Brand />
        </Link>
        <nav className="flex items-center gap-2">
          <Link className="btn btn-ghost" href="/login">Přihlásit</Link>
          <Link className="btn btn-primary" href="/register">Začít</Link>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl py-8">{children}</main>
      <footer className="mx-auto w-full max-w-5xl pb-10 pt-6 text-xs text-neutral-500">
        © {new Date().getFullYear()} Sprout. 10% z předplatného může jít na charitu (nastavitelné později).
      </footer>
    </div>
  );
}
