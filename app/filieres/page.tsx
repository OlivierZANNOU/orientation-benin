import Link from "next/link";
import { listerFilieres } from "@/lib/orientation-engine";

export const metadata = {
  title: "Toutes les filières — ORIENT/229",
};

export default async function FilieresPage() {
  const filieres = await listerFilieres();

  return (
    <section className="px-5 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-3xl font-bold text-paper">Toutes les filières</h1>
        <p className="mt-2 text-paper/60">
          {filieres.length} filières enregistrées, issues du guide officiel d&apos;orientation.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {filieres.map(({ filiere, etablissement }) => (
            <Link
              key={filiere.id}
              href={`/filieres/${filiere.id}`}
              className="rounded-2xl border border-ink-700 bg-ink-900/60 p-5 transition hover:border-ember"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-paper/40">
                {etablissement.sigle} · {etablissement.ville}
              </p>
              <h2 className="mt-1 font-display text-lg font-bold text-paper">{filiere.nom}</h2>
              <p className="mt-1 text-sm text-paper/50">{filiere.diplome}</p>
              <p className="mt-3 text-xs font-mono text-ember">
                Séries : {filiere.seriesAutorisees.join(", ")}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
