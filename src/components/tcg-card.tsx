'use client';

import Image from 'next/image';
import type { Card } from '@/app/lib/card-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type TCGCardProps = {
  card: Card;
};

export function TCGCard({ card }: TCGCardProps) {
  const { name, cost, attack, defense, type, description, imageId } = card;
  const image = PlaceHolderImages.find((img) => img.id === imageId);

  return (
    <div className="group relative aspect-[3/4.5] w-full overflow-hidden rounded-xl border-2 border-foreground/20 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary hover:shadow-primary/20">
      {image && (
        <Image
          src={image.imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          data-ai-hint={image.imageHint}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
        />
      )}

      {/* Stats */}
      {type === 'Creature' && (
        <>
          <div className="absolute top-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/90 text-destructive-foreground shadow-md backdrop-blur-sm">
            <span className="font-headline text-xl font-bold">{attack}</span>
          </div>
          <div className="absolute top-16 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/90 text-accent-foreground shadow-md backdrop-blur-sm">
            <span className="font-headline text-xl font-bold">{defense}</span>
          </div>
        </>
      )}
      <div className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-md backdrop-blur-sm">
        <span className="font-headline text-xl font-bold">{cost}</span>
      </div>

      {/* Card Info */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/70 to-transparent px-4 pb-4 pt-8 text-primary-foreground">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/70">
          {type}
        </p>
        <h3 className="font-headline text-2xl font-bold leading-tight tracking-tighter">
          {name}
        </h3>
        <p className="mt-1 text-sm text-primary-foreground/90">
          {description}
        </p>
      </div>
    </div>
  );
}
