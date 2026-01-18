'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
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

const defaultCard: Omit<Card, 'id'> = {
  name: 'Nom de la carte',
  cost: 1,
  attack: 1,
  defense: 1,
  type: 'Creature',
  description: 'Description de la carte.',
  imageId: 'placeholder', // Not really used for preview
};

export default function CardCreatorPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();

  const [cardData, setCardData] = useState<Omit<Card, 'id'>>(defaultCard);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleTypeChange = (value: 'Creature' | 'Spell' | 'Artifact') => {
    setCardData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!firestore) return;

    try {
      const newCardRef = doc(collection(firestore, 'cards'));
      const newId = newCardRef.id;

      const cardToSave: Card = {
        ...cardData,
        id: newId,
        imageUrl: imagePreview || undefined,
      };

      if (cardToSave.type !== 'Creature') {
        delete cardToSave.attack;
        delete cardToSave.defense;
      }

      await setDoc(newCardRef, cardToSave);

      toast({
        title: 'Carte sauvegardée !',
        description: `${cardToSave.name} a été ajoutée à la base de données.`,
      });
      // Reset form
      setCardData(defaultCard);
      setImagePreview(null);
    } catch (error: any) {
      console.error('Error saving card:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de sauvegarder la carte. Vérifiez la console pour plus de détails.',
      });
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
              <Label htmlFor="image">Illustration de la carte</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                name="name"
                value={cardData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={handleTypeChange} value={cardData.type}>
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
              />
            </div>

            <Button onClick={handleSave} className="w-full">
              Sauvegarder la carte
            </Button>
          </CardContent>
        </UICard>

        {/* Preview Section */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 font-headline">Aperçu</h2>
          <div className="w-full max-w-sm">
            <TCGCard card={previewCard} imageUrl={imagePreview || undefined} />
          </div>
        </div>
      </div>
    </div>
  );
}
