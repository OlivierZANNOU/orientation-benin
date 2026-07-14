// Séries de baccalauréat reconnues au Bénin
export type SerieBac = "A" | "B" | "C" | "D" | "E" | "F1" | "F2" | "F3" | "F4" | "G1" | "G2" | "G3" | "TI";

// Une note saisie par le candidat pour une matière donnée
export interface NoteMatiere {
  matiere: string; // ex: "Mathématiques"
  note: number; // note sur 20
}

// Le profil académique saisi par l'utilisateur (Étape 1)
export interface ProfilCandidat {
  serie: SerieBac;
  moyenneGenerale: number; // moyenne générale au bac, sur 20
  notes: NoteMatiere[]; // notes détaillées par matière
  mention?: "Passable" | "Assez Bien" | "Bien" | "Très Bien";
}

// Une matière comptant dans le calcul du score d'une filière, avec son coefficient
export interface MatiereCoefficient {
  matiere: string;
  coefficient: number;
}

// Une condition particulière d'éligibilité (ex: moyenne minimale en maths)
export interface ConditionParticuliere {
  id: string;
  description: string; // texte lisible, ex: "Moyenne ≥ 12 en Mathématiques"
  // Validateur simple: le champ concerné + l'opérateur + la valeur seuil
  champ: "moyenneGenerale" | string; // "moyenneGenerale" ou le nom exact d'une matière
  operateur: ">=" | ">" | "<=" | "<" | "==";
  valeur: number;
}

// Une filière telle que définie par le guide officiel d'orientation
export interface Filiere {
  id: string;
  nom: string;
  etablissementId: string;
  diplome: string; // ex: "Licence en Informatique"
  duree: string; // ex: "3 ans"
  seriesAutorisees: SerieBac[];
  matieresCoefficients: MatiereCoefficient[];
  conditionsParticulieres: ConditionParticuliere[];
  placesDisponibles?: number;
  description: string;
  domaine: string; // ex: "Sciences & Technologies"
  debouches?: string[]; // métiers/débouchés possibles après la formation
  pageGuide?: number; // numéro de page dans le guide officiel d'orientation (PDF source)
}

export interface Etablissement {
  id: string;
  nom: string;
  sigle: string;
  ville: string;
  type: "Public" | "Privé";
}

// Catégorie de recommandation attribuée à une filière pour un candidat donné
export type CategorieRecommandation =
  | "Très adaptée"
  | "Accessible"
  | "Moins favorable"
  | "Non éligible";

// Détail d'une condition évaluée, pour la transparence des résultats
export interface ConditionEvaluee {
  description: string;
  remplie: boolean;
}

// Le résultat complet du moteur d'orientation pour une filière donnée
export interface ResultatFiliere {
  filiere: Filiere;
  etablissement: Etablissement;
  eligible: boolean;
  score: number | null; // null si non calculable (ex: série non autorisée)
  scoreMax: number; // score maximum théorique (base 20 pondérée)
  categorie: CategorieRecommandation;
  serieAutorisee: boolean;
  conditionsEvaluees: ConditionEvaluee[];
  matieresUtilisees: { matiere: string; note: number | null; coefficient: number }[];
  formuleTexte: string; // ex: "(Maths × 2 + Physique × 1) ÷ 3"
  explication: string; // phrase de synthèse expliquant le résultat
}
