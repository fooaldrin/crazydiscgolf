export interface RandomStringOption {
  id: string;
  name: string;
  description: string;
  minPlayers?: number; // Minimum number of players required for this option to be available
  isCustom?: boolean; // Flag to distinguish custom options from default ones
}

export const RANDOM_STRINGS: RandomStringOption[] = [
  {
    id: 'free-disc-choice',
    name: 'Your choice!',
    description: 'Choose any disc from your bag for this throw'
  },
  {
    id: 'driver',
    name: 'Driver',
    description: 'Must use a driver disc for this throw'
  },
  {
    id: 'mid-range',
    name: 'Mid-range',
    description: 'Must use a mid-range disc for this throw'
  },
  {
    id: 'putter',
    name: 'Putter',
    description: 'Must use a putter disc for this throw'
  },
  {
    id: 'roller',
    name: 'Roller',
    description: 'Throw must be a roller shot along the ground'
  },
  {
    id: 'opponents-choice',
    name: 'Opponent\'s Choice',
    description: 'Your opponent chooses which disc you must use',
    minPlayers: 2
  },
  {
    id: 'non-dominant-hand',
    name: 'Non-dominant Hand',
    description: 'Must throw with your non-dominant hand'
  },
  {
    id: 'mulligan',
    name: 'Mulligan',
    description: 'Take your throw over if you\'re not happy with it'
  }
];
