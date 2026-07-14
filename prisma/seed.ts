import { PrismaClient } from "@prisma/client";
import etablissements from "../data/etablissements.json";
import filieres from "../data/filieres.json";

const prisma = new PrismaClient();

async function main() {
  console.log(`Import de ${etablissements.length} établissements...`);
  for (const e of etablissements) {
    await prisma.etablissement.upsert({
      where: { id: e.id },
      update: e,
      create: e,
    });
  }

  console.log(`Import de ${filieres.length} filières...`);
  for (const f of filieres) {
    const { etablissementId, ...reste } = f;
    await prisma.filiere.upsert({
      where: { id: f.id },
      update: { ...reste, etablissementId },
      create: { ...reste, etablissementId },
    });
  }

  console.log("Import terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
