import type { Rarity } from './card-data';

export const RARITY_DROP_RATES: Record<Rarity, number> = {
  'Commun': 68,
  'Rare': 23,
  'Épique': 8.7,
  'Légendaire': 0.3,
};

export const FRAMED_CARD_CHANCE = 0.2;

export const rarityOrder: Rarity[] = ['Commun', 'Rare', 'Épique', 'Légendaire'];
