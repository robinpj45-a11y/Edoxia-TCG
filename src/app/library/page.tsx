import { CardLibrary } from '@/components/card-library';

export default function LibraryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-5xl font-bold tracking-tighter text-primary md:text-6xl lg:text-7xl">
          Bibliothèque de cartes
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          Explorez toutes les cartes disponibles dans Edoxia-TCG.
        </p>
      </header>
      <CardLibrary />
    </div>
  );
}
