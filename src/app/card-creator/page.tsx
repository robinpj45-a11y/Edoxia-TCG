'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
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
import { Switch } from '@/components/ui/switch';

const defaultCard = {
  name: 'Nom de la carte',
  type: 'Objet' as CardType,
  rarity: 'Commun' as Rarity,
  description: 'Description de la carte.',
  imageId: 'placeholder',
  imageUrl: '',
  isFramed: false,
};

export default function CardCreatorPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();

  const [cardData, setCardData] = useState(defaultCard);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      [name]: value,
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

        // Get the data URL with JPEG compression to reduce size
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        // Check if the size is under Firestore's limit (1MB) before setting
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
          description: 'Veuillez sélectionner une illustration pour la carte.',
        });
      }
      return;
    }

    setIsSaving(true);

    try {
      const newCardRef = doc(collection(firestore, 'cards'));
      const newId = newCardRef.id;

      const cardToSave: Card = {
        id: newId,
        name: cardData.name,
        type: cardData.type,
        rarity: cardData.rarity,
        description: cardData.description,
        imageId: 'custom-' + newId,
        imageUrl: cardData.imageUrl,
        isFramed: cardData.isFramed,
      };

      await setDoc(newCardRef, cardToSave);

      toast({
        title: 'Carte sauvegardée !',
        description: `${cardData.name} a été ajoutée à la base de données.`,
      });

      setCardData(defaultCard);
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
                  <SelectItem value="Fleur">Fleur</SelectItem>
                  <SelectItem value="Plante">Plante</SelectItem>
                  <SelectItem value="Véhicule">Véhicule</SelectItem>
                  <SelectItem value="Monument">Monument</SelectItem>
                  <SelectItem value="Emotion">Emotion</SelectItem>
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
                  <SelectItem value="Épique">Épique</SelectItem>
                  <SelectItem value="Légendaire">Légendaire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label htmlFor="isFramed">Cadre spécial</Label>
                <p className="text-[0.8rem] text-muted-foreground">
                  Carte avec cadre, rend la carte plus rare
                </p>
              </div>
              <Switch
                id="isFramed"
                checked={cardData.isFramed}
                onCheckedChange={(checked) =>
                  setCardData((prev) => ({ ...prev, isFramed: checked }))
                }
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
