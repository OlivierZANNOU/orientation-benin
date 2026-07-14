"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/orientation", label: "Simuler" },
  { href: "/filieres", label: "Filières" },
  { href: "/#comment-ca-marche", label: "Comment ça marche" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-700 bg-ink-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-baseline gap-1.5 font-display" onClick={() => setOpen(false)}>
          <span className="text-lg font-bold tracking-tight text-paper">ORIENT</span>
          <span className="text-lg font-bold tracking-tight text-ember">/229</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-paper/70 transition hover:text-paper"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/orientation"
            className="rounded-full bg-ember px-5 py-2 text-sm font-semibold text-ink-950 transition hover:bg-ember-300"
          >
            Commencer
          </Link>
        </nav>

        <button
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-0.5 w-6 bg-paper transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span className={`h-0.5 w-6 bg-paper transition-opacity ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-0.5 w-6 bg-paper transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-ink-700 bg-ink-950 px-5 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-paper/80 transition hover:bg-ink-900 hover:text-paper"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/orientation"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-ember px-5 py-3 text-center text-base font-semibold text-ink-950"
          >
            Commencer la simulation
          </Link>
        </nav>
      )}
    </header>
  );
}
