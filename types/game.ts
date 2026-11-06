export interface ThrowResult {
  throwNumber: number;
  result: string;
}

export interface Player {
  name: string;
  scores: string[];
  rerollsUsed: number;
  throwsPerHole: ThrowResult[][];
}

export interface GameState {
  screen: string;
  players: Player[];
  currentPlayerIndex: number;
  currentHole: number;
  currentThrow: number;
  currentRoll: string;
  playersFinishedCurrentHole: number[];
}
