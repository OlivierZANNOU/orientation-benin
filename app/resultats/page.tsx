"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CategorieRecommandation, ProfilCandidat, ResultatFiliere } from "@/types/orientation";
import ResultCard from "@/components/ResultCard";

const FILTRES: (CategorieRecommandation | "Toutes")[] = [
  "Toutes",
  "Très adaptée",
  "Accessible",
  "Moins favorable",
  "Non éligible",
];

export default function ResultatsPage() {
  const [profil, setProfil] = useState<ProfilCandidat | null>(null);
  const [resultats, setResultats] = useState<ResultatFiliere[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [filtre, setFiltre] = useState<(typeof FILTRES)[number]>("Toutes");
  const [domaine, setDomaine] = useState<string>("Tous");

  useEffect(() => {
    const raw = sessionStorage.getItem("orientation-profil");
    if (!raw) {
      setChargement(false);
      return;
    }
    const profilCharge: ProfilCandidat = JSON.parse(raw);
    setProfil(profilCharge);

    fetch("/api/analyser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profilCharge),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setErreur(data.error);
        else setResultats(data.resultats ?? []);
      })
      .catch(() => setErreur("Impossible de récupérer tes résultats. Réessaie dans un instant."))
      .finally(() => setChargement(false));
  }, []);

  const domaines = useMemo(() => ["Tous", ...Array.from(new Set(resultats.map((r) => r.filiere.domaine)))], [
    resultats,
  ]);

  const resultatsFiltres = resultats.filter((r) => {
    const okCategorie = filtre === "Toutes" || r.categorie === filtre;
    const okDomaine = domaine === "Tous" || r.filiere.domaine === domaine;
    return okCategorie && okDomaine;
  });

  if (chargement) return null;

  if (!profil) {
    return (
      <section className="px-5 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-paper">Aucune simulation en cours</h1>
        <p className="mt-3 text-paper/60">Commence par renseigner ton profil pour voir tes résultats.</p>
        <Link
          href="/orientation"
          className="mt-6 inline-block rounded-full bg-ember px-6 py-3 text-sm font-semibold text-ink-950 hover:bg-ember-300"
        >
          Démarrer la simulation
        </Link>
      </section>
    );
  }

  const nbTresAdaptees = resultats.filter((r) => r.categorie === "Très adaptée").length;

  if (erreur) {
    return (
      <section className="px-5 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-paper">Un problème est survenu</h1>
        <p className="mt-3 text-paper/60">{erreur}</p>
      </section>
    );
  }

  return (
    <section className="px-5 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-paper/40">
              Série {profil.serie} · Moyenne {profil.moyenneGenerale}/20
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-paper sm:text-3xl">Tes résultats</h1>
            <p className="mt-1 text-sm text-paper/60">
              {nbTresAdaptees > 0
                ? `${nbTresAdaptees} filière${nbTresAdaptees > 1 ? "s" : ""} très adaptée${nbTresAdaptees > 1 ? "s" : ""} à ton profil.`
                : "Aucune filière très adaptée trouvée — regarde les filières accessibles ci-dessous."}
            </p>
          </div>
          <Link href="/orientation" className="text-sm font-semibold text-ember hover:text-ember-300">
            Modifier mon profil →
          </Link>
        </div>

        {/* Filtres */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {FILTRES.map((f) => (
              <button
                key={f}
                onClick={() => setFiltre(f)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  filtre === f ? "bg-ember text-ink-950" : "bg-ink-800 text-paper/60 hover:text-paper"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <select
            value={domaine}
            onChange={(e) => setDomaine(e.target.value)}
            className="ml-auto rounded-full border border-ink-600 bg-ink-950 px-4 py-1.5 text-xs font-semibold text-paper/80"
          >
            {domaines.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {resultatsFiltres.length === 0 ? (
          <p className="rounded-2xl border border-ink-700 bg-ink-900/60 p-8 text-center text-paper/50">
            Aucune filière ne correspond à ces filtres.
          </p>
        ) : (
          <div className="space-y-10">
            {Object.entries(
              resultatsFiltres.reduce<Record<string, typeof resultatsFiltres>>((groupes, r) => {
                const cle = r.etablissement.sigle;
                (groupes[cle] ||= []).push(r);
                return groupes;
              }, {})
            ).map(([sigle, resultatsGroupe]) => (
              <div key={sigle}>
                <h2 className="mb-4 flex items-baseline gap-2 font-display text-lg font-bold text-paper">
                  {sigle}
                  <span className="font-mono text-xs font-normal text-paper/40">
                    {resultatsGroupe[0].etablissement.nom} · {resultatsGroupe[0].etablissement.ville}
                  </span>
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {resultatsGroupe.map((r) => (
                    <ResultCard key={r.filiere.id} resultat={r} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
