export type Card = {
  id: string;
  name: string;
  cost: number;
  attack?: number;
  defense?: number;
  type: 'Creature' | 'Spell' | 'Artifact';
  description: string;
  imageId: string;
};

export const cards: Card[] = [
  {
    id: '1',
    name: 'Forest Guardian',
    cost: 4,
    attack: 3,
    defense: 5,
    type: 'Creature',
    description: 'A protector of the ancient woods. It draws strength from the earth.',
    imageId: 'card-image-1',
  },
  {
    id: '2',
    name: 'Arcane Blast',
    cost: 2,
    type: 'Spell',
    description: 'Unleashes a torrent of raw magical energy at a single target.',
    imageId: 'card-image-2',
  },
  {
    id: '3',
    name: 'Time-worn Scroll',
    cost: 1,
    type: 'Artifact',
    description: 'An ancient scroll that allows you to draw an extra card.',
    imageId: 'card-image-3',
  },
  {
    id: '4',
    name: 'Mountain Drake',
    cost: 6,
    attack: 5,
    defense: 4,
    type: 'Creature',
    description: 'A fiery beast that soars over mountain peaks, raining down fire.',
    imageId: 'card-image-4',
  },
  {
    id: '5',
    name: 'Chronomancer',
    cost: 3,
    attack: 2,
    defense: 2,
    type: 'Creature',
    description: 'This skilled mage can manipulate time, briefly stunning enemies.',
    imageId: 'card-image-5',
  },
  {
    id: '6',
    name: 'Shielding Rune',
    cost: 2,
    type: 'Spell',
    description: 'Creates a magical barrier, increasing a creature\'s defense.',
    imageId: 'card-image-2',
  },
  {
    id: '7',
    name: 'Golem Sentinel',
    cost: 7,
    attack: 6,
    defense: 8,
    type: 'Creature',
    description: 'A massive golem that is slow but incredibly resilient to damage.',
    imageId: 'card-image-1',
  },
  {
    id: '8',
    name: 'Power Amulet',
    cost: 3,
    type: 'Artifact',
    description: 'An amulet that hums with power, increasing a creature\'s attack.',
    imageId: 'card-image-3',
  },
];
