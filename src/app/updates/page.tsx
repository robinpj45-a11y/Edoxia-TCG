export default function UpdatesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-5xl font-bold tracking-tighter text-primary md:text-6xl lg:text-7xl">
          Mises à jour
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          Toute l'actualité et les mises à jour du jeu.
        </p>
      </header>
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-headline text-2xl font-bold">
            Prochaine mise à jour : V1.1
          </h2>
          <p className="mb-4 text-muted-foreground">
            La prochaine mise à jour arrive bientôt avec de nouvelles cartes et
            des équilibrages !
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>10+ nouvelles cartes de créatures.</li>
            <li>Nouveau type d'artefact : les reliques.</li>
            <li>Ajustements sur le coût en mana de plusieurs sorts.</li>
            <li>Améliorations de l'interface et corrections de bugs.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
