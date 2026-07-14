# ORIENT/229 — Plateforme d'aide à l'orientation des bacheliers (Bénin)
## En local (avant tout déploiement)

```bash
npm install
```
Il te faut une base Neon même en local pour tester :
1. Crée un projet sur https://neon.tech (ou fais-le plus tard via Vercel, voir plus bas)
2. Copie `.env.example` vers `.env` et colle-y ton `DATABASE_URL` / `DIRECT_URL`
3. `npm run db:push` → crée les tables dans Neon à partir de `prisma/schema.prisma`
4. `npm run db:seed` → importe les données d'exemple de `data/*.json` dans la base
5. `npm run dev` → http://localhost:3000

## Déploiement : GitHub → Vercel → Neon

1. Pousse ce projet sur GitHub (`git init`, `git add .`, `git commit`, `git push`)
2. Sur vercel.com → *Add New Project* → importe le repo. Vercel détecte Next.js tout seul.
3. **Avant de cliquer sur Deploy** (ou juste après, tu peux relancer un déploiement) : va dans l'onglet **Storage** du
   projet Vercel → *Create Database* → choisis **Neon**. Vercel crée la base et ajoute automatiquement les variables
   d'environnement `DATABASE_URL` et `DIRECT_URL` au projet — tu n'as rien à copier-coller.
4. Une fois Neon connecté, il faut créer les tables et y mettre les données. Deux options :
   - **Depuis ta machine** (le plus simple) : récupère les variables dans Vercel → *Settings* → *Environment
     Variables*, colle-les dans ton `.env` local, puis lance `npm run db:push` et `npm run db:seed`.
   - **Depuis Vercel directement** : possible via la CLI Vercel (`vercel env pull` puis les mêmes commandes), utile si
     tu changes de machine souvent.
5. Redéploie (`git push` suffit à redéclencher un build, ou clique *Redeploy* dans Vercel).

À partir de là, le site lit ses données depuis Neon via Prisma — plus aucun fichier JSON n'est utilisé au runtime
(`data/*.json` ne sert plus que de source pour le script de seed).

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

