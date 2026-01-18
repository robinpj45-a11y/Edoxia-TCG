'use client';

import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Card } from '@/app/lib/card-data';
import { TCGCard } from '@/components/tcg-card';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { rarityOrder } from '@/app/lib/rarity-data';

export default function MyCollectionPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  // Fetch all cards from the global collection
  const allCardsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'cards');
  }, [firestore]);
  const { data: allCards, isLoading: isLoadingAllCards } = useCollection<Card>(allCardsCollectionRef);


  // Fetch user's owned card IDs
  const userCardsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'cardCollection');
  }, [firestore, user]);

  const { data: userCardDocs, isLoading: isLoadingCollection } = useCollection<{ cardId: string }>(userCardsCollectionRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const ownedCards = useMemo(() => {
    if (!allCards || !userCardDocs) return [];
    const ownedCardIds = userCardDocs.map((c) => c.cardId);
    return allCards.filter((card) => ownedCardIds.includes(card.id));
  }, [allCards, userCardDocs]);

  const groupedOwnedCards = useMemo(() => {
    if (ownedCards.length === 0) return {};
    const groups: Record<string, Card[]> = {};

    for (const card of ownedCards) {
        if (!card.rarity) continue; 
        if (!groups[card.rarity]) {
            groups[card.rarity] = [];
        }
        groups[card.rarity].push(card);
    }
    return groups;
  }, [ownedCards]);


  const isLoading = isUserLoading || isLoadingCollection || isLoadingAllCards;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Chargement de votre collection...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-5xl font-bold tracking-tighter text-primary md:text-6xl lg:text-7xl">
          Ma Collection
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          Voici les cartes que vous possédez, classées par rareté.
        </p>
      </header>
      {ownedCards.length > 0 ? (
        <div className="space-y-16">
          {rarityOrder.map(rarity =>
            groupedOwnedCards[rarity] && groupedOwnedCards[rarity].length > 0 && (
              <div key={rarity}>
                <h2 className="mb-8 font-headline text-4xl font-bold tracking-tighter text-center">{rarity}</h2>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {groupedOwnedCards[rarity].map((card) => (
                    <div key={card.id}>
                      <TCGCard card={card} />
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-muted-foreground">Votre collection est vide pour le moment.</p>
          <p className="mt-2">
            <Link href="/library" className="text-primary hover:underline">
              Explorez la bibliothèque
            </Link> pour découvrir de nouvelles cartes.
          </p>
        </div>
      )}
    </div>
  );
}
