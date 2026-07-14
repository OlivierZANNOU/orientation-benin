import { CategorieRecommandation } from "@/types/orientation";

const STYLES: Record<CategorieRecommandation, string> = {
  "Très adaptée": "bg-ember text-ink-950",
  "Accessible": "bg-ember-100 text-ember-700",
  "Moins favorable": "bg-ink-700 text-paper/80",
  "Non éligible": "bg-transparent text-paper/40 ring-1 ring-inset ring-ink-600",
};

export default function EligibilityBadge({ categorie }: { categorie: CategorieRecommandation }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STYLES[categorie]}`}
    >
      {categorie}
    </span>
  );
}
