import { Filiere, ProfilCandidat } from "@/types/orientation";

export interface DetailCalcul {
  matieresUtilisees: { matiere: string; note: number | null; coefficient: number }[];
  score: number | null;
  scoreMax: number;
  formuleTexte: string;
}

/**
 * Calcule le score de classement d'un candidat pour une filière donnée,
 * selon la formule : Σ(note × coefficient) ÷ Σ(coefficient)
 * Cette formule reproduit le principe des moyennes pondérées du guide officiel.
 * Si une matière requise n'a pas été renseignée par le candidat, le score n'est pas calculable.
 */
export function calculerScore(profil: ProfilCandidat, filiere: Filiere): DetailCalcul {
  const matieresUtilisees = filiere.matieresCoefficients.map(({ matiere, coefficient }) => {
    const noteTrouvee = profil.notes.find((n) => n.matiere.toLowerCase() === matiere.toLowerCase());
    return { matiere, note: noteTrouvee ? noteTrouvee.note : null, coefficient };
  });

  const sommeCoefficients = filiere.matieresCoefficients.reduce((acc, m) => acc + m.coefficient, 0);
  const scoreMax = 20; // toutes les notes sont sur 20, donc la moyenne pondérée reste sur 20

  const toutesNotesPresentes = matieresUtilisees.every((m) => m.note !== null);
  const score = toutesNotesPresentes
    ? matieresUtilisees.reduce((acc, m) => acc + (m.note as number) * m.coefficient, 0) / sommeCoefficients
    : null;

  const formuleTexte = `(${filiere.matieresCoefficients
    .map((m) => `${m.matiere} × ${m.coefficient}`)
    .join(" + ")}) ÷ ${sommeCoefficients}`;

  return {
    matieresUtilisees,
    score: score !== null ? Math.round(score * 100) / 100 : null,
    scoreMax,
    formuleTexte,
  };
}
