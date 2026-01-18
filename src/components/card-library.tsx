'use client';

import { useState, useMemo } from 'react';
import type { Card, Rarity } from '@/app/lib/card-data';
import { TCGCard } from '@/components/tcg-card';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Edit } from 'lucide-react';

const rarityOrder: Rarity[] = ['Commun', 'Rare', 'Super-Rare', 'Ultra-Rare', 'Légendaire'];

export function CardLibrary() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const firestore = useFirestore();
  const { user } = useUser();
  const isAdmin = user?.email === 'test@edoxia.com';

  const cardsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'cards');
  }, [firestore]);

  const { data: cards, isLoading } = useCollection<Card>(cardsCollectionRef);

  const groupedCards = useMemo(() => {
    if (!cards) return {};
    const groups: Record<string, Card[]> = {};

    for (const card of cards) {
        if (!card.rarity) continue;
        if (!groups[card.rarity]) {
            groups[card.rarity] = [];
        }
        groups[card.rarity].push(card);
    }
    return groups;
  }, [cards]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4.5] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-16">
        {cards && cards.length > 0 ? (
          rarityOrder.map(rarity => 
            groupedCards[rarity] && groupedCards[rarity].length > 0 && (
            <div key={rarity}>
              <h2 className="mb-8 font-headline text-4xl font-bold tracking-tighter text-center">{rarity}</h2>
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {groupedCards[rarity].map((card) => (
                  <div key={card.id} className="space-y-3">
                    <div
                      className="cursor-pointer"
                      onClick={() => setSelectedCard(card)}
                    >
                      <TCGCard card={card} />
                    </div>
                    {isAdmin && (
                        <Button asChild variant="outline" className="w-full">
                            <Link href={`/card-editor/${card.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Éditer la carte
                            </Link>
                        </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            )
          )
        ) : (
          <div className="text-center col-span-full py-12">
            <p className="text-muted-foreground">La bibliothèque de cartes est vide.</p>
            <p className="mt-2 text-sm">Les administrateurs peuvent ajouter des cartes via l'outil de création.</p>
          </div>
        )}
      </div>

      <Dialog
        open={!!selectedCard}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedCard(null);
          }
        }}
      >
        <DialogContent className="w-full max-w-md bg-transparent p-0 border-0 shadow-none">
          {selectedCard && (
            <>
              <DialogTitle className="sr-only">{selectedCard.name}</DialogTitle>
              <TCGCard card={selectedCard} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
