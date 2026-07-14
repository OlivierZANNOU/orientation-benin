import { notFound } from "next/navigation";
import Link from "next/link";
import { trouverFiliereParId } from "@/lib/orientation-engine";

// Les données viennent de Neon et peuvent changer sans redéploiement : on rend cette page dynamiquement.
export const dynamic = "force-dynamic";

export default async function FiliereDetailPage({ params }: { params: { slug: string } }) {
  const result = await trouverFiliereParId(params.slug);
  if (!result) notFound();
  const { filiere, etablissement } = result;

  return (
    <section className="px-5 py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/filieres" className="text-sm font-semibold text-ember hover:text-ember-300">
          ← Toutes les filières
        </Link>

        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-paper/40">
          {etablissement.nom} ({etablissement.sigle}) · {etablissement.ville}
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-paper">{filiere.nom}</h1>
        <p className="mt-1 text-paper/60">
          {filiere.diplome} · {filiere.duree}
        </p>
        <p className="mt-4 text-paper/70">{filiere.description}</p>
        {filiere.pageGuide && (
          <p className="mt-2 font-mono text-xs text-paper/40">📄 Référence : guide officiel, page {filiere.pageGuide}</p>
        )}

        <div className="mt-8 grid gap-6 rounded-2xl border border-ink-700 bg-ink-900/60 p-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-paper/40">Séries autorisées</p>
            <p className="font-mono text-ember">{filiere.seriesAutorisees.join(", ")}</p>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-paper/40">Places disponibles</p>
            <p className="font-mono text-paper">{filiere.placesDisponibles ?? "Non communiqué"}</p>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-paper/40">Matières de classement</p>
            <ul className="space-y-1 font-mono text-sm text-paper/80">
              {filiere.matieresCoefficients.map((m) => (
                <li key={m.matiere}>
                  {m.matiere} — coeff. {m.coefficient}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-paper/40">Conditions particulières</p>
            {filiere.conditionsParticulieres.length === 0 ? (
              <p className="text-sm text-paper/50">Aucune condition particulière.</p>
            ) : (
              <ul className="space-y-1 text-sm text-paper/80">
                {filiere.conditionsParticulieres.map((c) => (
                  <li key={c.id}>• {c.description}</li>
                ))}
              </ul>
            )}
          </div>
          {filiere.debouches && filiere.debouches.length > 0 && (
            <div className="sm:col-span-2">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-paper/40">Débouchés possibles</p>
              <div className="flex flex-wrap gap-2">
                {filiere.debouches.map((d) => (
                  <span key={d} className="rounded-full bg-ink-800 px-3 py-1 text-sm text-paper/70">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <Link
          href="/orientation"
          className="mt-8 inline-block rounded-full bg-ember px-6 py-3 text-sm font-semibold text-ink-950 hover:bg-ember-300"
        >
          Voir si je suis éligible →
        </Link>
      </div>
    </section>
  );
}
