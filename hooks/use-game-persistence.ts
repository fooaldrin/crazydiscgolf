import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';

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
  numPlayers: number;
  numHoles: number;
  maxRerolls: number;
  players: Player[];
  currentPlayerIndex: number;
  currentHole: number;
  currentThrow: number;
  currentRoll: string;
  playersFinishedCurrentHole: number[];
}

const GAME_STATE_KEY = '@crazy_discgolf_game_state';

export function useGamePersistence() {
  const saveGameState = useCallback(async (gameState: GameState | null) => {
    try {
      if (gameState) {
        await AsyncStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
      } else {
        await AsyncStorage.removeItem(GAME_STATE_KEY);
      }
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }, []);

  const loadGameState = useCallback(async (): Promise<GameState | null> => {
    try {
      const saved = await AsyncStorage.getItem(GAME_STATE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return null;
    } catch (error) {
      console.error('Failed to load game state:', error);
      return null;
    }
  }, []);

  const clearGameState = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(GAME_STATE_KEY);
    } catch (error) {
      console.error('Failed to clear game state:', error);
    }
  }, []);

  return {
    saveGameState,
    loadGameState,
    clearGameState,
  };
}
