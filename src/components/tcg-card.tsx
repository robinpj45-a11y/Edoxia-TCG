'use client';

import Image from 'next/image';
import type { Card, Rarity } from '@/app/lib/card-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

type TCGCardProps = {
  card: Card;
  imageUrl?: string;
};

const rarityStyles: Record<Rarity, string> = {
  Commun: 'border-foreground/20 hover:border-primary hover:shadow-primary/20',
  Rare: 'border-sky-400 shadow-sky-400/20 hover:shadow-sky-400/40',
  'Super-Rare':
    'border-fuchsia-500 shadow-fuchsia-500/20 hover:shadow-fuchsia-500/40',
  'Ultra-Rare':
    'border-amber-400 shadow-amber-400/20 hover:shadow-amber-400/40',
  Légendaire: 'border-red-600 shadow-red-600/30 hover:shadow-red-600/50',
};

const rarityTextStyles: Record<Rarity, string> = {
  Commun: 'text-white/70',
  Rare: 'text-sky-400',
  'Super-Rare': 'text-fuchsia-500',
  'Ultra-Rare': 'text-amber-400',
  Légendaire: 'text-red-500 font-bold',
};

export function TCGCard({ card, imageUrl: previewImageUrl }: TCGCardProps) {
  const {
    name,
    type,
    description,
    imageId,
    imageUrl: cardImageUrl,
    rarity,
    isFramed,
  } = card;
  const image = PlaceHolderImages.find((img) => img.id === imageId);

  const displayImageUrl = previewImageUrl || cardImageUrl || image?.imageUrl;
  const displayImageHint =
    previewImageUrl || cardImageUrl ? 'custom upload' : image?.imageHint;

  return (
    <div
      className={cn(
        'group relative aspect-[3/4.5] w-full overflow-hidden rounded-xl border-2 shadow-lg transition-all duration-300 ease-in-out hover:scale-105',
        rarity && !isFramed && (rarityStyles[rarity] || rarityStyles['Commun']),
        isFramed &&
          'border-4 border-amber-400 shadow-xl shadow-amber-400/30 hover:shadow-amber-400/50'
      )}
    >
      {displayImageUrl && (
        <Image
          src={displayImageUrl}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          data-ai-hint={displayImageHint}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
        />
      )}

      {/* Card Info */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/40 to-transparent px-4 pb-4 pt-16 text-white">
        <div className="flex items-baseline justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
            {type}
          </p>
          <p
            className={cn(
              'text-xs font-semibold uppercase tracking-wider',
              rarity && rarityTextStyles[rarity]
                ? rarityTextStyles[rarity]
                : rarityTextStyles['Commun']
            )}
          >
            {rarity}
          </p>
        </div>
        <h3 className="font-headline text-2xl font-bold leading-tight tracking-tighter">
          {name}
        </h3>
        <p className="mt-1 text-sm text-white/90">{description}</p>
      </div>
    </div>
  );
}
