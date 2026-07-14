export default function Footer() {
  return (
    <footer className="border-t border-ink-700 px-5 py-8 text-sm text-paper/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-display font-bold text-paper/80">ORIENT/229</span> — outil d&apos;aide à l&apos;orientation,
          basé sur le guide officiel.
        </p>
        <p className="text-paper/40">
          Une recommandation n&apos;est pas une garantie d&apos;admission. Vérifiez toujours les informations auprès des
          établissements concernés.
        </p>
      </div>
    </footer>
  );
}
