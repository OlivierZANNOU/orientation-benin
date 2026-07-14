import { ResultatFiliere } from "@/types/orientation";

export default function ScoreDetails({ resultat }: { resultat: ResultatFiliere }) {
  const { conditionsEvaluees, matieresUtilisees, formuleTexte, score, scoreMax, serieAutorisee } = resultat;

  return (
    <div className="space-y-5 text-sm">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-paper/40">Série de baccalauréat</p>
        <p className={serieAutorisee ? "text-paper/80" : "text-paper/40"}>
          {serieAutorisee ? "✓ Votre série est autorisée pour cette filière." : "✕ Votre série n'est pas autorisée."}
        </p>
      </div>

      {conditionsEvaluees.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-paper/40">Conditions particulières</p>
          <ul className="space-y-1.5">
            {conditionsEvaluees.map((c, i) => (
              <li key={i} className={c.remplie ? "text-paper/80" : "text-paper/40"}>
                {c.remplie ? "✓" : "✕"} {c.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-paper/40">Matières utilisées pour le score</p>
        <div className="overflow-hidden rounded-lg border border-ink-700">
          <table className="w-full text-left">
            <thead className="bg-ink-900 text-xs uppercase tracking-wide text-paper/40">
              <tr>
                <th className="px-3 py-2 font-medium">Matière</th>
                <th className="px-3 py-2 font-medium">Note</th>
                <th className="px-3 py-2 font-medium">Coeff.</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {matieresUtilisees.map((m, i) => (
                <tr key={i} className="border-t border-ink-700">
                  <td className="px-3 py-2">{m.matiere}</td>
                  <td className="px-3 py-2">{m.note ?? "—"}</td>
                  <td className="px-3 py-2">×{m.coefficient}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-paper/40">Formule appliquée</p>
        <p className="rounded-lg bg-ink-900 px-3 py-2 font-mono text-ember-300">{formuleTexte}</p>
      </div>

      {score !== null && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-paper/40">Score obtenu</p>
          <p className="font-mono text-2xl font-bold text-paper">
            {score}
            <span className="text-base font-normal text-paper/40"> / {scoreMax}</span>
          </p>
        </div>
      )}
    </div>
  );
}
