'use client';

import Image from 'next/image';
import { Gem, Shield, Swords } from 'lucide-react';
import type { Card } from '@/app/lib/card-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

type TCGCardProps = {
  card: Card;
};

const typeStyles: Record<Card['type'], string> = {
  Creature: 'border-chart-2',
  Spell: 'border-accent',
  Artifact: 'border-border',
};

export function TCGCard({ card }: TCGCardProps) {
  const { name, cost, attack, defense, type, description, imageId } = card;
  const image = PlaceHolderImages.find((img) => img.id === imageId);

  return (
    <div className="group transform transition-transform duration-300 ease-in-out hover:scale-105 hover:z-10">
      <div
        className={cn(
          'flex h-full flex-col overflow-hidden rounded-lg border-2 bg-card shadow-lg transition-shadow duration-300 group-hover:shadow-primary/20',
          typeStyles[type]
        )}
      >
        <div className="flex items-center justify-between p-3">
          <h3 className="font-headline text-lg font-bold">{name}</h3>
          <div className="flex items-center gap-1 text-lg font-bold">
            <span className="text-primary">{cost}</span>
            <Gem className="h-4 w-4 text-primary" />
          </div>
        </div>

        {image && (
          <div className="relative w-full" style={{ aspectRatio: '1.5' }}>
            <Image
              src={image.imageUrl}
              alt={image.description}
              fill
              className="object-cover"
              data-ai-hint={image.imageHint}
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            />
          </div>
        )}

        <div className="flex flex-grow flex-col justify-between p-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{type}</p>
            <p className="mt-1 text-sm">{description}</p>
          </div>
        </div>

        {type === 'Creature' && (
          <div className="mt-auto flex items-center justify-end gap-4 border-t-2 bg-muted/20 p-3">
            <div className="flex items-center gap-1.5 text-lg font-bold">
              <Swords className="h-5 w-5 text-destructive" />
              <span>{attack}</span>
            </div>
            <div className="flex items-center gap-1.5 text-lg font-bold">
              <Shield className="h-5 w-5 text-accent" />
              <span>{defense}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
