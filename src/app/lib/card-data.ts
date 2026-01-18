export type Rarity =
  | 'Commun'
  | 'Rare'
  | 'Super-Rare'
  | 'Ultra-Rare'
  | 'Légendaire';

export type Card = {
  id: string;
  name: string;
  cost: number;
  attack?: number;
  defense?: number;
  type: 'Creature' | 'Spell' | 'Artifact';
  rarity: Rarity;
  description: string;
  imageId: string;
  imageUrl?: string;
};
