'use client';

import { useState } from 'react';
import type { Card } from '@/app/lib/card-data';
import { TCGCard } from '@/components/tcg-card';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export function CardLibrary() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const firestore = useFirestore();

  const cardsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'cards');
  }, [firestore]);

  const { data: cards, isLoading } = useCollection<Card>(cardsCollectionRef);

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
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {cards && cards.length > 0 ? (
          cards.map((card) => (
            <div
              key={card.id}
              className="cursor-pointer"
              onClick={() => setSelectedCard(card)}
            >
              <TCGCard card={card} />
            </div>
          ))
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
