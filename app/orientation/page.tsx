import OrientationForm from "@/components/OrientationForm";

export const metadata = {
  title: "Simulation d'orientation — ORIENT/229",
};

export default function OrientationPage() {
  return (
    <section className="px-5 py-16">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="font-display text-3xl font-bold text-paper sm:text-4xl">Ta simulation d&apos;orientation</h1>
        <p className="mt-3 text-paper/60">
          Trois étapes rapides. Aucune donnée n&apos;est envoyée à un serveur externe — tout reste dans ton navigateur.
        </p>
      </div>
      <OrientationForm />
    </section>
  );
}
