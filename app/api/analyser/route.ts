import { NextRequest, NextResponse } from "next/server";
import { analyserProfil } from "@/lib/orientation-engine";
import { ProfilCandidat } from "@/types/orientation";

export async function POST(request: NextRequest) {
  const profil = (await request.json()) as ProfilCandidat;

  if (!profil?.serie || typeof profil.moyenneGenerale !== "number") {
    return NextResponse.json({ error: "Profil invalide." }, { status: 400 });
  }

  const resultats = await analyserProfil(profil);
  return NextResponse.json({ resultats });
}
