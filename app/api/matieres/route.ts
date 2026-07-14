import { NextResponse } from "next/server";
import { listerMatieres } from "@/lib/orientation-engine";

export async function GET() {
  const matieres = await listerMatieres();
  return NextResponse.json({ matieres });
}
