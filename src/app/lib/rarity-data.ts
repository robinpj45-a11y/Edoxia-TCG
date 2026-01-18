import type { Rarity } from './card-data';

export const RARITY_DROP_RATES: Record<Rarity, number> = {
  'Commun': 68,
  'Rare': 23,
  'Super-Rare': 7,
  'Ultra-Rare': 1.7,
  'Légendaire': 0.3,
};

export const rarityOrder: Rarity[] = ['Commun', 'Rare', 'Super-Rare', 'Ultra-Rare', 'Légendaire'];
