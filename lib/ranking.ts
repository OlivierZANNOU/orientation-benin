import { CategorieRecommandation } from "@/types/orientation";

/**
 * Détermine la catégorie de recommandation d'une filière pour un candidat,
 * en fonction de son éligibilité et de son score par rapport au score maximum théorique.
 *
 * Seuils (proportion du score sur 20) :
 *  - ≥ 65% du score max  → "Très adaptée"
 *  - ≥ 45% du score max  → "Accessible"
 *  - < 45%               → "Moins favorable"
 *  - non éligible        → "Non éligible" (quel que soit le score)
 */
export function determinerCategorie(
  eligible: boolean,
  score: number | null,
  scoreMax: number
): CategorieRecommandation {
  if (!eligible) return "Non éligible";
  if (score === null) return "Moins favorable";

  const ratio = score / scoreMax;
  if (ratio >= 0.65) return "Très adaptée";
  if (ratio >= 0.45) return "Accessible";
  return "Moins favorable";
}

/** Ordre d'affichage des catégories, de la plus favorable à la moins favorable. */
export const ORDRE_CATEGORIES: CategorieRecommandation[] = [
  "Très adaptée",
  "Accessible",
  "Moins favorable",
  "Non éligible",
];

/** Trie une liste de résultats : d'abord par catégorie, puis par score décroissant. */
export function trierResultats<T extends { categorie: CategorieRecommandation; score: number | null }>(
  resultats: T[]
): T[] {
  return [...resultats].sort((a, b) => {
    const diffCategorie = ORDRE_CATEGORIES.indexOf(a.categorie) - ORDRE_CATEGORIES.indexOf(b.categorie);
    if (diffCategorie !== 0) return diffCategorie;
    return (b.score ?? -1) - (a.score ?? -1);
  });
}
