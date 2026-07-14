"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProfilCandidat, SerieBac } from "@/types/orientation";

const SERIES: SerieBac[] = ["A", "B", "C", "D", "E", "F1", "F2", "F3", "F4", "G1", "G2", "G3", "TI"];

const STEPS = ["Profil", "Notes", "Vérification"] as const;

export default function OrientationForm() {
  const router = useRouter();
  const [matieres, setMatieres] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [serie, setSerie] = useState<SerieBac | "">("");
  const [moyenneGenerale, setMoyenneGenerale] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/matieres")
      .then((r) => r.json())
      .then((data) => setMatieres(data.matieres ?? []))
      .catch(() => setErreur("Impossible de charger la liste des matières. Réessaie dans un instant."));
  }, []);

  const progression = ((step + 1) / STEPS.length) * 100;

  function suivant() {
    setErreur(null);
    if (step === 0) {
      if (!serie) return setErreur("Merci de sélectionner votre série de baccalauréat.");
      const m = parseFloat(moyenneGenerale);
      if (isNaN(m) || m < 0 || m > 20) return setErreur("Merci de saisir une moyenne générale valide (entre 0 et 20).");
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function precedent() {
    setErreur(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  function soumettre() {
    const profil: ProfilCandidat = {
      serie: serie as SerieBac,
      moyenneGenerale: parseFloat(moyenneGenerale),
      notes: Object.entries(notes)
        .filter(([, v]) => v.trim() !== "")
        .map(([matiere, v]) => ({ matiere, note: parseFloat(v) })),
    };
    sessionStorage.setItem("orientation-profil", JSON.stringify(profil));
    router.push("/resultats");
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Barre de progression façon "bulletin scolaire" */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-wide text-paper/40">
          {STEPS.map((label, i) => (
            <span key={label} className={i <= step ? "text-ember" : ""}>
              {String(i + 1).padStart(2, "0")} — {label}
            </span>
          ))}
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-800">
          <div className="h-full rounded-full bg-ember transition-all duration-500" style={{ width: `${progression}%` }} />
        </div>
      </div>

      <div className="rounded-2xl border border-ink-700 bg-ink-900/60 p-6 sm:p-8">
        {step === 0 && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <label className="mb-2 block text-sm font-medium text-paper/80">Série du baccalauréat</label>
              <select
                value={serie}
                onChange={(e) => setSerie(e.target.value as SerieBac)}
                className="w-full rounded-lg border border-ink-600 bg-ink-950 px-4 py-3 text-paper focus:border-ember"
              >
                <option value="">Sélectionnez votre série</option>
                {SERIES.map((s) => (
                  <option key={s} value={s}>
                    Série {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-paper/80">Moyenne générale au bac (/20)</label>
              <input
                type="number"
                min={0}
                max={20}
                step={0.01}
                value={moyenneGenerale}
                onChange={(e) => setMoyenneGenerale(e.target.value)}
                placeholder="ex: 13.45"
                className="w-full rounded-lg border border-ink-600 bg-ink-950 px-4 py-3 text-paper placeholder:text-paper/30 focus:border-ember"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5 animate-fade-up">
            <p className="text-sm text-paper/60">
              Renseignez vos notes dans les matières ci-dessous. Vous pouvez laisser vide les matières que vous n&apos;avez
              pas — les filières correspondantes seront simplement marquées comme non calculables.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {matieres.map((matiere) => (
                <div key={matiere}>
                  <label className="mb-1.5 block text-sm font-medium text-paper/80">{matiere}</label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    step={0.01}
                    value={notes[matiere] ?? ""}
                    onChange={(e) => setNotes((n) => ({ ...n, [matiere]: e.target.value }))}
                    placeholder="Note /20"
                    className="w-full rounded-lg border border-ink-600 bg-ink-950 px-4 py-2.5 text-paper placeholder:text-paper/30 focus:border-ember"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-fade-up">
            <p className="text-sm text-paper/60">Vérifiez vos informations avant de lancer l&apos;analyse.</p>
            <dl className="space-y-3 rounded-lg bg-ink-950 p-4 font-mono text-sm">
              <div className="flex justify-between">
                <dt className="text-paper/40">Série</dt>
                <dd className="text-paper">{serie || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-paper/40">Moyenne générale</dt>
                <dd className="text-paper">{moyenneGenerale || "—"} / 20</dd>
              </div>
              {matieres
                .filter((m) => notes[m]?.trim())
                .map((m) => (
                  <div key={m} className="flex justify-between">
                    <dt className="text-paper/40">{m}</dt>
                    <dd className="text-paper">{notes[m]} / 20</dd>
                  </div>
                ))}
            </dl>
          </div>
        )}

        {erreur && <p className="mt-4 text-sm font-medium text-ember-300">{erreur}</p>}

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={precedent}
            disabled={step === 0}
            className="text-sm font-semibold text-paper/50 transition hover:text-paper disabled:opacity-0"
          >
            ← Précédent
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={suivant}
              className="rounded-full bg-ember px-6 py-3 text-sm font-semibold text-ink-950 transition hover:bg-ember-300"
            >
              Continuer →
            </button>
          ) : (
            <button
              onClick={soumettre}
              className="rounded-full bg-ember px-6 py-3 text-sm font-semibold text-ink-950 transition hover:bg-ember-300"
            >
              Voir mes résultats →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
