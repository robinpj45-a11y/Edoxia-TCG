import { cards } from '@/app/lib/card-data';
import { TCGCard } from '@/components/tcg-card';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-5xl font-bold tracking-tighter text-primary md:text-6xl lg:text-7xl">
          Edoxia-TCG
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          A mystical trading card game of strategy and power.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {cards.map((card) => (
          <TCGCard key={card.id} card={card} />
        ))}
      </div>
    </main>
  );
}
