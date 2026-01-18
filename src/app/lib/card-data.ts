export type Card = {
  id: string;
  name: string;
  cost: number;
  attack?: number;
  defense?: number;
  type: 'Creature' | 'Spell' | 'Artifact';
  description: string;
  imageId: string;
  imageUrl?: string;
};
