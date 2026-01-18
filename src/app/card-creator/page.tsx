'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useFirebaseApp } from '@/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Card } from '@/app/lib/card-data';
import { TCGCard } from '@/components/tcg-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Card as UICard,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const defaultCard = {
  name: 'Nom de la carte',
  cost: 1,
  attack: 1,
  defense: 1,
  type: 'Creature' as 'Creature' | 'Spell' | 'Artifact',
  description: 'Description de la carte.',
  imageId: 'placeholder',
  imageUrl: '',
};

export default function CardCreatorPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const firebaseApp = useFirebaseApp();

  const [cardData, setCardData] = useState(defaultCard);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isUserLoading) {
      if (!user || user.email !== 'test@edoxia.com') {
        toast({
          variant: 'destructive',
          title: 'Accès non autorisé',
          description:
            'Vous devez être un administrateur pour accéder à cette page.',
        });
        router.push('/');
      }
    }
  }, [user, isUserLoading, router, toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCardData((prev) => ({
      ...prev,
      [name]:
        name === 'cost' || name === 'attack' || name === 'defense'
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file); // Save the file object for upload
      const reader = new FileReader();
      reader.onloadend = () => {
        // For live preview
        setCardData((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTypeChange = (value: 'Creature' | 'Spell' | 'Artifact') => {
    setCardData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleSave = async () => {
    if (!firestore || !firebaseApp || isSaving) return;

    if (!imageFile) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez sélectionner une illustration pour la carte.',
      });
      return;
    }

    setIsSaving(true);

    try {
      // 1. Get a new card ID
      const newCardRef = doc(collection(firestore, 'cards'));
      const newId = newCardRef.id;

      // 2. Upload image to Firebase Storage
      const storage = getStorage(firebaseApp);
      const imageRef = ref(storage, `card-images/${newId}`);
      await uploadBytes(imageRef, imageFile);
      const downloadURL = await getDownloadURL(imageRef);

      // 3. Prepare card data for Firestore
      const cardToSave: Card = {
        id: newId,
        name: cardData.name,
        cost: cardData.cost,
        type: cardData.type,
        description: cardData.description,
        imageId: newId, // Use the unique card ID for the imageId
        imageUrl: downloadURL,
        ...(cardData.type === 'Creature' && {
          attack: cardData.attack,
          defense: cardData.defense,
        }),
      };

      // 4. Save card data to Firestore
      await setDoc(newCardRef, cardToSave);

      toast({
        title: 'Carte sauvegardée !',
        description: `${cardToSave.name} a été ajoutée à la base de données.`,
      });

      // 5. Reset form
      setCardData(defaultCard);
      setImageFile(null);

      // Also clear the file input
      const fileInput = document.getElementById('imageUrl') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error: any) {
      console.error('Error saving card:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description:
          error.message ||
          'Impossible de sauvegarder la carte. Vérifiez la console pour plus de détails.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isUserLoading || !user || user.email !== 'test@edoxia.com') {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Vérification de l'autorisation...</p>
      </div>
    );
  }

  const previewCard: Card = {
    ...cardData,
    id: 'preview',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-5xl font-bold tracking-tighter text-primary md:text-6xl lg:text-7xl">
          Créateur de carte
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          Créez de nouvelles cartes pour Edoxia-TCG.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Form Section */}
        <UICard>
          <CardHeader>
            <CardTitle>Éditeur de carte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Illustration</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                name="name"
                value={cardData.name}
                onChange={handleInputChange}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={handleTypeChange} value={cardData.type} disabled={isSaving}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Creature">Créature</SelectItem>
                  <SelectItem value="Spell">Sort</SelectItem>
                  <SelectItem value="Artifact">Artefact</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Coût</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                value={cardData.cost}
                onChange={handleInputChange}
                disabled={isSaving}
              />
            </div>

            {cardData.type === 'Creature' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="attack">Attaque</Label>
                  <Input
                    id="attack"
                    name="attack"
                    type="number"
                    value={cardData.attack}
                    onChange={handleInputChange}
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defense">Défense</Label>
                  <Input
                    id="defense"
                    name="defense"
                    type="number"
                    value={cardData.defense}
                    onChange={handleInputChange}
                    disabled={isSaving}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={cardData.description}
                onChange={handleInputChange}
                disabled={isSaving}
              />
            </div>

            <Button onClick={handleSave} className="w-full" disabled={isSaving}>
              {isSaving ? 'Sauvegarde en cours...' : 'Sauvegarder la carte'}
            </Button>
          </CardContent>
        </UICard>

        {/* Preview Section */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 font-headline">Aperçu</h2>
          <div className="w-full max-w-sm">
            <TCGCard
              card={previewCard}
              imageUrl={cardData.imageUrl || undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
