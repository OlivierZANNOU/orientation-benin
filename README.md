# ORIENT/229 — Plateforme d'aide à l'orientation des bacheliers (Bénin)

## Structure

- `prisma/schema.prisma` — le schéma de la base (Établissements, Filières)
- `prisma/seed.ts` — importe `data/*.json` dans Neon (à lancer une fois, ou à chaque mise à jour du guide)
- `lib/db.ts` — client Prisma partagé
- `lib/orientation-engine.ts` — le moteur de règles, lit maintenant Neon au lieu du JSON
- `app/api/analyser/route.ts` — reçoit un profil candidat, retourne les résultats calculés côté serveur
- `app/api/matieres/route.ts` — liste des matières pour construire le formulaire dynamiquement
- `components/OrientationForm.tsx` — formulaire en 3 étapes
- `app/resultats/page.tsx` — résultats groupés par université, avec filtres

## Comment ajouter/corriger une filière une fois en production

Deux façons :
- **Modifier `data/filieres.json`** puis relancer `npm run db:seed` (le plus simple pour l'instant, tant qu'il n'y a
  pas d'espace admin)
- **Directement dans Neon** via `npm run db:studio` (interface graphique Prisma Studio) ou le tableau de bord Neon

Le formulaire de simulation détecte automatiquement les nouvelles matières présentes dans la base — rien à changer
dans le code du formulaire.

## Prochaines étapes suggérées

- Construire le pipeline d'extraction du guide PDF (projet à part) qui alimente `prisma/seed.ts` ou écrit directement
  dans Neon, avec le numéro de page de chaque filière (`pageGuide`).
- Espace admin pour éditer les filières sans passer par le JSON.
- Comptes utilisateurs (Neon + NextAuth ou Supabase Auth) pour sauvegarder les simulations.

