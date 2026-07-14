import { prisma } from "./db";
import { Etablissement, Filiere, ProfilCandidat, ResultatFiliere } from "@/types/orientation";
import { estEligible, evaluerConditions, serieEstAutorisee } from "./eligibility";
import { calculerScore } from "./calculations";
import { determinerCategorie, trierResultats } from "./ranking";

// Les colonnes Json de Prisma remontent en `unknown` ; on les recadre vers nos types
// applicatifs définis dans types/orientation.ts (c'est la seule couche qui fait confiance à la forme des données).
function versFiliere(row: {
  id: string;
  nom: string;
  etablissementId: string;
  diplome: string;
  duree: string;
  domaine: string;
  seriesAutorisees: unknown;
  matieresCoefficients: unknown;
  conditionsParticulieres: unknown;
  debouches: unknown;
  placesDisponibles: number | null;
  description: string;
  pageGuide: number | null;
}): Filiere {
  return {
    id: row.id,
    nom: row.nom,
    etablissementId: row.etablissementId,
    diplome: row.diplome,
    duree: row.duree,
    domaine: row.domaine,
    seriesAutorisees: row.seriesAutorisees as Filiere["seriesAutorisees"],
    matieresCoefficients: row.matieresCoefficients as Filiere["matieresCoefficients"],
    conditionsParticulieres: row.conditionsParticulieres as Filiere["conditionsParticulieres"],
    debouches: (row.debouches as string[] | null) ?? undefined,
    placesDisponibles: row.placesDisponibles ?? undefined,
    description: row.description,
    pageGuide: row.pageGuide ?? undefined,
  };
}

function versEtablissement(row: { id: string; nom: string; sigle: string; ville: string; type: string }): Etablissement {
  return { ...row, type: row.type as Etablissement["type"] };
}

/** Analyse le profil d'un candidat contre toutes les filières de la base Neon. */
export async function analyserProfil(profil: ProfilCandidat): Promise<ResultatFiliere[]> {
  const rows = await prisma.filiere.findMany({ include: { etablissement: true } });

  const resultats: ResultatFiliere[] = rows.map((row) => {
    const filiere = versFiliere(row);
    const etablissement = versEtablissement(row.etablissement);

    const serieOk = serieEstAutorisee(profil, filiere);
    const conditionsEvaluees = evaluerConditions(profil, filiere);
    const eligible = estEligible(profil, filiere);
    const { matieresUtilisees, score, scoreMax, formuleTexte } = calculerScore(profil, filiere);
    const categorie = determinerCategorie(eligible, score, scoreMax);
    const conditionsNonRemplies = conditionsEvaluees.filter((c) => !c.remplie).map((c) => c.description);
    const explication = construireExplication(serieOk, eligible, conditionsNonRemplies, score, scoreMax, filiere.nom);

    return {
      filiere,
      etablissement,
      eligible,
      score,
      scoreMax,
      categorie,
      serieAutorisee: serieOk,
      conditionsEvaluees,
      matieresUtilisees,
      formuleTexte,
      explication,
    };
  });

  return trierResultats(resultats);
}

function construireExplication(
  serieOk: boolean,
  eligible: boolean,
  conditionsNonRemplies: string[],
  score: number | null,
  scoreMax: number,
  nomFiliere: string
): string {
  if (!serieOk) return `Votre série de baccalauréat n'est pas autorisée pour la filière ${nomFiliere}.`;
  if (!eligible)
    return `Vous remplissez la condition de série, mais pas la ou les conditions suivantes : ${conditionsNonRemplies.join(", ")}.`;
  if (score === null)
    return `Vous êtes éligible à ${nomFiliere}, mais certaines notes nécessaires au calcul du score n'ont pas été renseignées.`;
  const ratio = Math.round((score / scoreMax) * 100);
  return `Vous êtes éligible à ${nomFiliere} avec un score de ${score}/${scoreMax} (soit ${ratio}% du score maximum), calculé selon la formule officielle du guide.`;
}

export async function listerFilieres(): Promise<{ filiere: Filiere; etablissement: Etablissement }[]> {
  const rows = await prisma.filiere.findMany({ include: { etablissement: true } });
  return rows.map((row) => ({ filiere: versFiliere(row), etablissement: versEtablissement(row.etablissement) }));
}

export async function trouverFiliereParId(
  id: string
): Promise<{ filiere: Filiere; etablissement: Etablissement } | null> {
  const row = await prisma.filiere.findUnique({ where: { id }, include: { etablissement: true } });
  if (!row) return null;
  return { filiere: versFiliere(row), etablissement: versEtablissement(row.etablissement) };
}

/** Liste des matières distinctes utilisées à travers toutes les filières (pour construire le formulaire). */
export async function listerMatieres(): Promise<string[]> {
  const rows = await prisma.filiere.findMany({ select: { matieresCoefficients: true, conditionsParticulieres: true } });
  const set = new Set<string>();
  rows.forEach((r) => {
    (r.matieresCoefficients as { matiere: string }[]).forEach((m) => set.add(m.matiere));
    (r.conditionsParticulieres as { champ: string }[]).forEach((c) => {
      if (c.champ !== "moyenneGenerale") set.add(c.champ);
    });
  });
  return Array.from(set).sort();
}
