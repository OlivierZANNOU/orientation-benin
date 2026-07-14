import { ConditionEvaluee, ConditionParticuliere, Filiere, ProfilCandidat } from "@/types/orientation";

/**
 * Récupère la valeur d'un "champ" du profil candidat : soit la moyenne générale,
 * soit la note d'une matière précise.
 */
function getValeurChamp(profil: ProfilCandidat, champ: string): number | null {
  if (champ === "moyenneGenerale") return profil.moyenneGenerale;
  const note = profil.notes.find((n) => n.matiere.toLowerCase() === champ.toLowerCase());
  return note ? note.note : null;
}

function evaluerOperateur(valeur: number, operateur: ConditionParticuliere["operateur"], seuil: number): boolean {
  switch (operateur) {
    case ">=":
      return valeur >= seuil;
    case ">":
      return valeur > seuil;
    case "<=":
      return valeur <= seuil;
    case "<":
      return valeur < seuil;
    case "==":
      return valeur === seuil;
  }
}

/** Vérifie si la série du candidat est autorisée pour cette filière. */
export function serieEstAutorisee(profil: ProfilCandidat, filiere: Filiere): boolean {
  return filiere.seriesAutorisees.includes(profil.serie);
}

/**
 * Évalue chaque condition particulière d'une filière et retourne le détail,
 * pour permettre une explication transparente à l'utilisateur.
 */
export function evaluerConditions(profil: ProfilCandidat, filiere: Filiere): ConditionEvaluee[] {
  return filiere.conditionsParticulieres.map((condition) => {
    const valeur = getValeurChamp(profil, condition.champ);
    // Si la donnée n'existe pas dans le profil (matière non renseignée), on considère la condition non remplie
    const remplie = valeur !== null && evaluerOperateur(valeur, condition.operateur, condition.valeur);
    return { description: condition.description, remplie };
  });
}

/** Un candidat est éligible si sa série est autorisée ET que toutes les conditions particulières sont remplies. */
export function estEligible(profil: ProfilCandidat, filiere: Filiere): boolean {
  if (!serieEstAutorisee(profil, filiere)) return false;
  const conditions = evaluerConditions(profil, filiere);
  return conditions.every((c) => c.remplie);
}
