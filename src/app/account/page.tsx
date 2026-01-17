'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useAuth,
  useUser,
  useFirestore,
  useDoc,
  useCollection,
  useMemoFirebase,
} from '@/firebase';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { updateProfile } from 'firebase/auth';
import { doc, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cards } from '@/app/lib/card-data';

const formSchema = z.object({
  displayName: z
    .string()
    .min(1, { message: "Le nom d'affichage ne peut pas être vide." }),
  photoURL: z.string().url({ message: 'URL de photo invalide.' }).or(z.literal('')),
  favoriteCardId: z.string().optional(),
});

type UserProfile = {
  displayName: string;
  photoURL?: string;
  favoriteCardId?: string;
};

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isLoadingProfile } = useDoc<UserProfile>(userDocRef);

  const userCardsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'cardCollection');
  }, [firestore, user]);

  const { data: userCardDocs, isLoading: isLoadingCollection } =
    useCollection<{ cardId: string }>(userCardsCollectionRef);

  const ownedCards = useMemo(() => {
    if (!userCardDocs) return [];
    const ownedCardIds = userCardDocs.map((c) => c.cardId);
    return cards.filter((card) => ownedCardIds.includes(card.id));
  }, [userCardDocs]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: '',
      photoURL: '',
      favoriteCardId: '',
    },
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (userProfile) {
      form.reset({
        displayName: userProfile.displayName || '',
        photoURL: userProfile.photoURL || '',
        favoriteCardId: userProfile.favoriteCardId || '',
      });
    }
  }, [userProfile, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !auth.currentUser) return;

    try {
      await updateProfile(auth.currentUser, {
        displayName: values.displayName,
        photoURL: values.photoURL,
      });

      const userRef = doc(firestore, 'users', user.uid);
      updateDocumentNonBlocking(userRef, {
        displayName: values.displayName,
        photoURL: values.photoURL,
        favoriteCardId: values.favoriteCardId,
      });

      toast({
        title: 'Profil mis à jour',
        description: 'Vos informations ont été enregistrées avec succès.',
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description:
          error.message || 'Impossible de mettre à jour votre profil.',
      });
    }
  }

  const isLoading = isUserLoading || isLoadingProfile || isLoadingCollection;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Chargement...</p>
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
          Mon Compte
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          Personnalisez vos informations.
        </p>
      </header>
      <div className="mx-auto max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom d'affichage</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photoURL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de la photo de profil</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/photo.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="favoriteCardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carte préférée</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre carte préférée" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ownedCards.length > 0 ? (
                        ownedCards.map((card) => (
                          <SelectItem key={card.id} value={card.id}>
                            {card.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="-" disabled>
                          Aucune carte dans la collection
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Sauvegarder les changements</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
