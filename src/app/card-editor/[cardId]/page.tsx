'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { Card, Rarity, CardType } from '@/app/lib/card-data';
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

const defaultCard: Card = {
  id: '',
  name: 'Chargement...',
  cost: 0,
  type: 'Objet',
  rarity: 'Commun',
  description: '',
  imageId: 'placeholder',
  imageUrl: '',
};

export default function CardEditorPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const firestore = useFirestore();

  const cardId = params.cardId as string;

  const [cardData, setCardData] = useState<Card>(defaultCard);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cardDocRef = useMemoFirebase(() => {
    if (!firestore || !cardId) return null;
    return doc(firestore, 'cards', cardId);
  }, [firestore, cardId]);

  const { data: fetchedCard, isLoading: isCardLoading } =
    useDoc<Card>(cardDocRef);

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

  useEffect(() => {
    if (fetchedCard) {
      setCardData({
        ...defaultCard,
        ...fetchedCard,
      });
    }
  }, [fetchedCard]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCardData((prev) => ({
      ...prev,
      [name]: name === 'cost' ? parseInt(value) || 0 : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 800;
        const canvas = document.createElement('canvas');

        const ratio = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * ratio;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        if (dataUrl.length > 1048487) {
          toast({
            variant: 'destructive',
            title: 'Image trop lourde',
            description:
              "Même après optimisation, l'image est trop volumineuse. Essayez une autre image.",
          });
          return;
        }

        setCardData((prev) => ({ ...prev, imageUrl: dataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleTypeChange = (value: CardType) => {
    setCardData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleRarityChange = (value: Rarity) => {
    setCardData((prev) => ({
      ...prev,
      rarity: value,
    }));
  };

  const handleSave = async () => {
    if (!firestore || !cardData.imageUrl || isSaving) {
      if (!cardData.imageUrl) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'La carte doit avoir une illustration.',
        });
      }
      return;
    }

    setIsSaving(true);

    try {
      const cardRef = doc(firestore, 'cards', cardId);

      const cardToSave: Card = {
        id: cardId,
        name: cardData.name,
        cost: cardData.cost,
        type: cardData.type,
        rarity: cardData.rarity,
        description: cardData.description,
        imageId: cardData.imageId || 'custom-' + cardId,
        imageUrl: cardData.imageUrl,
      };

      await setDoc(cardRef, cardToSave, { merge: true });

      toast({
        title: 'Carte sauvegardée !',
        description: `${cardData.name} a été mise à jour.`,
      });

      router.push('/library');
    } catch (error: any) {
      console.error('Error saving card:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur lors de la sauvegarde',
        description:
          error.message ||
          'Impossible de sauvegarder la carte. Vérifiez la console pour plus de détails.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = isUserLoading || isCardLoading;

  if (isLoading || !user || user.email !== 'test@edoxia.com') {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Vérification de l'autorisation et chargement de la carte...</p>
      </div>
    );
  }

  const previewCard: Card = {
    ...cardData,
    id: cardId,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-5xl font-bold tracking-tighter text-primary md:text-6xl lg:text-7xl">
          Éditeur de carte
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          Modifiez les détails de la carte.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Form Section */}
        <UICard>
          <CardHeader>
            <CardTitle>Propriétés de la carte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="imageFile">Illustration</Label>
              <Input
                id="imageFile"
                name="imageFile"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSaving}
                ref={fileInputRef}
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
              <Select
                onValueChange={handleTypeChange}
                value={cardData.type}
                disabled={isSaving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Objet">Objet</SelectItem>
                  <SelectItem value="Animal">Animal</SelectItem>
                  <SelectItem value="Sport">Sport</SelectItem>
                  <SelectItem value="Métier">Métier</SelectItem>
                  <SelectItem value="Matière">Matière</SelectItem>
                  <SelectItem value="Moment de vie">Moment de vie</SelectItem>
                  <SelectItem value="Fantastique">Fantastique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rarity">Rareté</Label>
              <Select
                onValueChange={handleRarityChange}
                value={cardData.rarity}
                disabled={isSaving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une rareté" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Commun">Commun</SelectItem>
                  <SelectItem value="Rare">Rare</SelectItem>
                  <SelectItem value="Super-Rare">Super-Rare</SelectItem>
                  <SelectItem value="Ultra-Rare">Ultra-Rare</SelectItem>
                  <SelectItem value="Légendaire">Légendaire</SelectItem>
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

            <Button
              onClick={handleSave}
              className="w-full"
              disabled={isSaving}
            >
              {isSaving
                ? 'Sauvegarde en cours...'
                : 'Sauvegarder les modifications'}
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
