import Link from "next/link";
import { listerFilieres } from "@/lib/orientation-engine";

export default async function HomePage() {
  const filieres = await listerFilieres();
  const nbEtablissements = new Set(filieres.map((f) => f.etablissement.id)).size;

  return (
    <>
      {/* Hero */}
      <section className="bg-noticeboard relative overflow-hidden border-b border-ink-700 px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ember">
            Guide officiel d&apos;orientation · Bénin
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight text-paper sm:text-6xl">
            Ton bac en main.
            <br />
            <span className="text-ember">Ta filière en clair.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-paper/60 sm:text-lg">
            Saisis ta série et tes notes. Le moteur d&apos;orientation calcule automatiquement ton éligibilité et ton score
            pour chaque filière — et t&apos;explique précisément pourquoi.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/orientation"
              className="w-full rounded-full bg-ember px-8 py-4 text-center font-semibold text-ink-950 transition hover:bg-ember-300 sm:w-auto"
            >
              Démarrer ma simulation
            </Link>
            <Link
              href="/filieres"
              className="w-full rounded-full border border-ink-600 px-8 py-4 text-center font-semibold text-paper/80 transition hover:border-ember hover:text-paper sm:w-auto"
            >
              Parcourir les filières
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 divide-x divide-ink-700 border-t border-ink-700 pt-8 text-center">
          <div>
            <p className="font-display text-2xl font-bold text-paper sm:text-3xl">{filieres.length}</p>
            <p className="mt-1 text-xs text-paper/40">filières analysées</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-paper sm:text-3xl">{nbEtablissements}</p>
            <p className="mt-1 text-xs text-paper/40">établissements</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-paper sm:text-3xl">100%</p>
            <p className="mt-1 text-xs text-paper/40">gratuit &amp; transparent</p>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" className="px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl font-bold text-paper sm:text-3xl">Comment ça marche</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                titre: "Comprendre",
                texte: "Chaque filière affiche clairement ses conditions, ses matières de classement et ses coefficients.",
              },
              {
                titre: "Calculer",
                texte: "Le moteur applique automatiquement les formules officielles du guide à tes notes.",
              },
              {
                titre: "Orienter",
                texte: "Tu obtiens un classement de filières, des plus adaptées aux moins favorables, avec explication.",
              },
            ].map((item) => (
              <div key={item.titre} className="rounded-2xl border border-ink-700 bg-ink-900/60 p-6">
                <h3 className="font-display text-lg font-bold text-ember">{item.titre}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper/60">{item.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rappel fiabilité */}
      <section className="border-t border-ink-700 px-5 py-14">
        <div className="mx-auto max-w-3xl rounded-2xl border border-ember-700/40 bg-ember/5 p-6 text-sm text-paper/70">
          <p>
            <span className="font-semibold text-ember">À noter :</span> cette plateforme est un outil d&apos;aide à la
            décision. Une recommandation n&apos;est pas une garantie d&apos;admission — le nombre de places, le nombre de
            candidats et les décisions des autorités compétentes entrent aussi en jeu.
          </p>
        </div>
      </section>
    </>
  );
}
