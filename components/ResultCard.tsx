"use client";

import { useState } from "react";
import { ResultatFiliere } from "@/types/orientation";
import EligibilityBadge from "./EligibilityBadge";
import ScoreDetails from "./ScoreDetails";

export default function ResultCard({ resultat }: { resultat: ResultatFiliere }) {
  const [open, setOpen] = useState(false);
  const { filiere, etablissement, score, scoreMax, categorie, explication } = resultat;
  const ratio = score !== null ? Math.min(100, Math.round((score / scoreMax) * 100)) : 0;

  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-900/60 p-5 transition hover:border-ink-600">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-paper/40">
            {etablissement.sigle} · {etablissement.ville}
          </p>
          <h3 className="mt-1 font-display text-lg font-bold text-paper">{filiere.nom}</h3>
          <p className="text-sm text-paper/50">{filiere.diplome}</p>
        </div>
        <EligibilityBadge categorie={categorie} />
      </div>

      {score !== null && (
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs text-paper/40">
            <span>Compatibilité</span>
            <span className="font-mono">{ratio}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
            <div
              className="h-full rounded-full bg-ember transition-all"
              style={{ width: `${ratio}%` }}
            />
          </div>
        </div>
      )}

      <p className="mt-4 text-sm leading-relaxed text-paper/70">{explication}</p>

      {filiere.debouches && filiere.debouches.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {filiere.debouches.slice(0, 3).map((d) => (
            <span key={d} className="rounded-full bg-ink-800 px-2.5 py-1 text-xs text-paper/60">
              {d}
            </span>
          ))}
        </div>
      )}

      {filiere.pageGuide && (
        <p className="mt-3 font-mono text-xs text-paper/40">📄 Guide officiel, page {filiere.pageGuide}</p>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-4 text-sm font-semibold text-ember transition hover:text-ember-300"
        aria-expanded={open}
      >
        {open ? "Masquer le détail du calcul ↑" : "Voir le détail du calcul ↓"}
      </button>

      {open && (
        <div className="mt-5 border-t border-ink-700 pt-5">
          <ScoreDetails resultat={resultat} />
        </div>
      )}
    </div>
  );
}
