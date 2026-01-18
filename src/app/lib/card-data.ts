export type CardType =
  | 'Objet'
  | 'Animal'
  | 'Sport'
  | 'Métier'
  | 'Matière'
  | 'Moment de vie'
  | 'Fantastique';

export type Rarity =
  | 'Commun'
  | 'Rare'
  | 'Super-Rare'
  | 'Ultra-Rare'
  | 'Légendaire';

export type Card = {
  id: string;
  name: string;
  type: CardType;
  rarity: Rarity;
  description: string;
  imageId: string;
  imageUrl?: string;
};
