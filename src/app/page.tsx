import Link from "next/link";
import { Shell } from "@/components/Shell";

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="card p-5">
      <div className="mb-2 text-sm font-semibold">{title}</div>
      <div className="text-sm text-neutral-600">{desc}</div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Shell>
      <section className="grid gap-6 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Společný plán, mapa a deník. <span className="text-neutral-500">Eko a vegan friendly.</span>
          </h1>
          <p className="text-neutral-600">
            Soukromí na prvním místě: sdílíš jen to, co chceš. Po tripu vznikne krásná „kniha“, do které se kdykoliv vrátíš.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/register" className="btn btn-primary">Založit účet • 69 Kč/měs.</Link>
            <Link href="/login" className="btn btn-ghost">Mám účet</Link>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="badge">🌍 Atlas míst + recenze</span>
            <span className="badge">🗺️ GPS trasy</span>
            <span className="badge">📅 Kalendář důležitých věcí</span>
            <span className="badge">📖 Trip Book archiv</span>
          </div>
        </div>

        <div className="card p-5">
          <div className="text-sm font-semibold">Jak to bude fungovat</div>
          <ol className="mt-3 space-y-2 text-sm text-neutral-600">
            <li>1) Vytvoříš kruh (pár/parta/rodina).</li>
            <li>2) Naplánuješ trip nebo projekt ze šablony.</li>
            <li>3) Přidáš místa, momenty, dokumenty a (volitelně) utráty.</li>
            <li>4) Zapneš GPS tracker a po tripu uložíš „knihu“.</li>
          </ol>
          <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
            <div className="font-medium">Private-first</div>
            <div className="mt-1 text-neutral-600">
              Veřejné jsou jen recenze a místa (pokud chceš). Kódy rezervací a finance nikdy ven.
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-3 md:grid-cols-3">
        <Feature title="Plán" desc="Kalendář, checklisty, šablony pro tripy i běžný život." />
        <Feature title="Mapa" desc="Piny, recenze, filtry vegan/eko. Soukromé i veřejné vrstvy." />
        <Feature title="Deník" desc="Momentky, fotky, nálady a po uzavření tripu krásný archiv." />
      </section>

      <section className="mt-10 card p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold">Předplatné</div>
            <div className="text-sm text-neutral-600">69 Kč / měsíc • 10% půjde na charitu (transparentně).</div>
          </div>
          <Link className="btn btn-primary" href="/register">Začít teď</Link>
        </div>
      </section>
    </Shell>
  );
}
