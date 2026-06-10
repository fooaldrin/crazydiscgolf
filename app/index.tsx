import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UI_TEXT } from '@/constants/ui-text';
import { useGamePersistence } from '@/hooks/use-game-persistence';
import { Slackey_400Regular, useFonts } from '@expo-google-fonts/slackey';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './index.styles';

export default function HomeScreen() {
  const [numPlayers, setNumPlayers] = useState(1);
  const [numHoles, setNumHoles] = useState(9);
  const [maxRerolls, setMaxRerolls] = useState(3);
  const [unlimitedRerolls, setUnlimitedRerolls] = useState(false);
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [showGameSetup, setShowGameSetup] = useState(false);
  const router = useRouter();
  const { loadGameState } = useGamePersistence();
  const insets = useSafeAreaInsets();
  
  const [fontsLoaded] = useFonts({
    Slackey_400Regular,
  });

  useEffect(() => {
    const checkSavedGame = async () => {
      const savedState = await loadGameState();
      setHasSavedGame(!!savedState && savedState.screen !== 'names');
    };
    checkSavedGame();
  }, [loadGameState]);

  if (!fontsLoaded) {
    return null;
  }

  const handleContinueSavedGame = () => {
    // Navigate to the saved game
    router.push('/game');
  };

  const handleStartNewGame = () => {
    setShowGameSetup(true);
  };

  const handleStartGame = () => {
    // Navigate to player name entry screen with params
    router.push({
      pathname: '/game/names',
      params: { 
        numPlayers: numPlayers.toString(), 
        numHoles: numHoles.toString(), 
        maxRerolls: unlimitedRerolls ? '-1' : maxRerolls.toString(),
      }
    });
  };

  // Show game setup screen
  if (showGameSetup) {
    return (
      <ThemedView style={styles.container}>
        <TouchableOpacity 
          style={[styles.settingsButton, { top: Math.max(16, insets.top + 16) }]}
          onPress={() => router.push('/settings')}
        >
          <ThemedText style={styles.settingsButtonText}>···</ThemedText>
        </TouchableOpacity>
        
        <View style={[styles.headerRow, { marginTop: Math.max(75, insets.top + 75) }]}>
          <ThemedText type="title" style={styles.title}>{UI_TEXT.APP_TITLE}</ThemedText>
        </View>

        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
          <ThemedView style={styles.selectorContainer}>
            <ThemedText type="subtitle" style={styles.label}>{UI_TEXT.SETUP_NUM_PLAYERS}</ThemedText>
            <View style={styles.pickerRow}>
              <TouchableOpacity 
                activeOpacity={0.7}
                style={[
                  styles.pickerButton,
                  numPlayers <= 1 && styles.disabledButton
                ]}
                onPress={() => setNumPlayers(Math.max(1, numPlayers - 1))}
                disabled={numPlayers <= 1}
              >
                <ThemedText style={styles.buttonText}>−</ThemedText>
              </TouchableOpacity>
              
              <ThemedView style={styles.valueContainer}>
                <ThemedText style={styles.valueText}>{numPlayers}</ThemedText>
              </ThemedView>
              
              <TouchableOpacity 
                activeOpacity={0.7}
                style={[
                  styles.pickerButton,
                  numPlayers >= 10 && styles.disabledButton
                ]}
                onPress={() => setNumPlayers(Math.min(10, numPlayers + 1))}
                disabled={numPlayers >= 10}
              >
                <ThemedText style={styles.buttonText}>+</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>

          <ThemedView style={styles.selectorContainer}>
            <ThemedText type="subtitle" style={styles.label}>{UI_TEXT.SETUP_NUM_HOLES}</ThemedText>
            <View style={styles.pickerRow}>
              <TouchableOpacity 
                activeOpacity={0.7}
                style={[
                  styles.pickerButton,
                  numHoles <= 1 && styles.disabledButton
                ]}
                onPress={() => setNumHoles(Math.max(1, numHoles - 1))}
                disabled={numHoles <= 1}
              >
                <ThemedText style={styles.buttonText}>-</ThemedText>
              </TouchableOpacity>
              
              <ThemedView style={styles.valueContainer}>
                <ThemedText style={styles.valueText}>{numHoles}</ThemedText>
              </ThemedView>
              
              <TouchableOpacity 
                activeOpacity={0.7}
                style={[
                  styles.pickerButton,
                  numHoles >= 36 && styles.disabledButton
                ]}
                onPress={() => setNumHoles(Math.min(36, numHoles + 1))}
                disabled={numHoles >= 36}
              >
                <ThemedText style={styles.buttonText}>+</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>

          <ThemedView style={styles.selectorContainer}>
            <ThemedText type="subtitle" style={styles.label}>{UI_TEXT.SETUP_REROLLS}</ThemedText>
            <View style={styles.pickerRow}>
              <TouchableOpacity 
                activeOpacity={0.7}
                style={[
                  styles.pickerButton,
                  (maxRerolls <= 0 || unlimitedRerolls) && styles.disabledButton
                ]}
                onPress={() => setMaxRerolls(Math.max(0, maxRerolls - 1))}
                disabled={maxRerolls <= 0 || unlimitedRerolls}
              >
                <ThemedText style={styles.buttonText}>-</ThemedText>
              </TouchableOpacity>
              
              <ThemedView style={[
                styles.valueContainer,
                unlimitedRerolls && styles.disabledValueContainer
              ]}>
                <ThemedText style={[
                  styles.valueText,
                  unlimitedRerolls && styles.disabledText
                ]}>{maxRerolls}</ThemedText>
              </ThemedView>
              
              <TouchableOpacity 
                activeOpacity={0.7}
                style={[
                  styles.pickerButton,
                  (maxRerolls >= 99 || unlimitedRerolls) && styles.disabledButton
                ]}
                onPress={() => setMaxRerolls(Math.min(99, maxRerolls + 1))}
                disabled={maxRerolls >= 99 || unlimitedRerolls}
              >
                <ThemedText style={styles.buttonText}>+</ThemedText>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.checkboxRow}
              onPress={() => setUnlimitedRerolls(!unlimitedRerolls)}
            >
              <View style={styles.checkbox}>
                {unlimitedRerolls && (
                  <ThemedText style={styles.checkmark}>✓</ThemedText>
                )}
              </View>
              <ThemedText style={styles.checkboxLabel}>{UI_TEXT.SETUP_UNLIMITED_REROLLS}</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleStartGame}
          >
            <ThemedText style={styles.continueButtonText}>{UI_TEXT.SETUP_START_GAME}</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  // Show intro screen with continue/new game options
  return (
    <ThemedView style={styles.container}>
      <View style={[styles.introContainer, { paddingTop: Math.max(20, insets.top) }]}>
        <ThemedText type="title" style={styles.introTitle}>{UI_TEXT.APP_TITLE}</ThemedText>
      </View>

      <View style={[styles.buttonArea, { paddingBottom: Math.max(40, insets.bottom + 40) }]}>
        {hasSavedGame && (
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinueSavedGame}
          >
            <ThemedText style={styles.continueButtonText}>{UI_TEXT.INTRO_CONTINUE_GAME}</ThemedText>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.continueButton, hasSavedGame && styles.newGameButton]}
          onPress={handleStartNewGame}
        >
          <ThemedText style={styles.continueButtonText}>
            {hasSavedGame ? UI_TEXT.INTRO_START_NEW_GAME : UI_TEXT.INTRO_LETS_PLAY}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

