'use client';

import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { cards } from '@/app/lib/card-data';
import { TCGCard } from '@/components/tcg-card';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function MyCollectionPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

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

  if (isUserLoading || isLoadingCollection) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Chargement de votre collection...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const ownedCardIds = userCardDocs?.map((c) => c.cardId) || [];
  const ownedCards = cards.filter((card) => ownedCardIds.includes(card.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-5xl font-bold tracking-tighter text-primary md:text-6xl lg:text-7xl">
          Ma Collection
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          Voici les cartes que vous possédez.
        </p>
      </header>
      {ownedCards.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {ownedCards.map((card) => (
            <div key={card.id}>
              <TCGCard card={card} />
            </div>
          ))}
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
