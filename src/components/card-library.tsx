'use client';

import { useState } from 'react';
import { cards } from '@/app/lib/card-data';
import type { Card } from '@/app/lib/card-data';
import { TCGCard } from '@/components/tcg-card';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

export function CardLibrary() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.id}
            className="cursor-pointer"
            onClick={() => setSelectedCard(card)}
          >
            <TCGCard card={card} />
          </div>
        ))}
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
