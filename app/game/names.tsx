import { PrimaryButton } from '@/components/buttons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UI_TEXT } from '@/constants/ui-text';
import { useGamePersistence } from '@/hooks/use-game-persistence';
import { Player } from '@/types/game';
import { Slackey_400Regular, useFonts } from '@expo-google-fonts/slackey';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, TextInput } from 'react-native';
import { styles } from './names.styles';

export default function PlayerNamesScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { clearGameState } = useGamePersistence();
  
  const [fontsLoaded] = useFonts({
    Slackey_400Regular,
  });
  
  // Clear any saved game state when entering names screen (starting new game)
  useEffect(() => {
    clearGameState();
  }, [clearGameState]);
  
  const numPlayers = parseInt(params.numPlayers as string) || 1;
  const numHoles = parseInt(params.numHoles as string) || 9;
  const maxRerollsParam = params.maxRerolls as string;
  const maxRerolls = maxRerollsParam !== undefined && maxRerollsParam !== null 
    ? parseInt(maxRerollsParam) 
    : 3;
  
  const [players, setPlayers] = useState<Player[]>(
    Array(numPlayers).fill(null).map((_, i) => ({
      name: `Player ${i + 1}`,
      scores: Array(numHoles).fill(''),
      rerollsUsed: 0,
      throwsPerHole: Array(numHoles).fill(null).map(() => [])
    }))
  );

  const handlePlayerNameChange = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index].name = name;
    setPlayers(newPlayers);
  };

  const startGame = () => {
    // Navigate to game screen with all necessary data using relative path
    const params = {
      numPlayers: numPlayers.toString(),
      numHoles: numHoles.toString(),
      maxRerolls: maxRerolls.toString(),
      players: JSON.stringify(players),
    };
    
    // Use href string format for nested routes
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    router.push(`/game?${queryString}` as any);
  };

  // Wait for fonts
  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>{UI_TEXT.NAMES_TITLE}</ThemedText>
        
        {players.map((player, index) => (
          <ThemedView key={index} style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>{UI_TEXT.NAMES_PLAYER_LABEL(index + 1)}</ThemedText>
            <TextInput
              style={styles.input}
              value={player.name}
              onChangeText={(text) => handlePlayerNameChange(index, text)}
              placeholder={UI_TEXT.NAMES_PLAYER_LABEL(index + 1)}
              placeholderTextColor="#999"
            />
          </ThemedView>
        ))}

        <PrimaryButton 
          title={UI_TEXT.NAMES_CONTINUE}
          onPress={startGame}
          style={styles.continueButton}
        />
      </ThemedView>
    </ScrollView>
  );
}

